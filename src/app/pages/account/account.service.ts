import { inject, Injectable, OnInit, signal, computed } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../notification.service';
import { Account } from '../../models';
import { TransactionsService } from '../transactions/transactions.service';
type AccountBalanceMap = Map<number, number>;

@Injectable({
  providedIn: 'root'
})
export class AccountService  {
  private transactionsService = inject(TransactionsService);
  private authService = inject(AuthService);
  private messageService = inject(NotificationService);
  accounts = signal<Account[]>([]);
  defoultAccountId = signal(0);
  bankLogos = signal<{url: string, name: string, id: number}[]>([]);


  // algumas transações pode ter um transfer_account não null. Nesse caso, terá o id da conta para onde o dinheiro foi transferido. Nesse caso, preciso um passo adicionar que é adicionar o valor de amount como positivo na conta para onde foi transferido
  accountsBalance = computed<AccountBalanceMap>(() => {
    return this.transactionsService.transactions().reduce((map, item) => {
      // 1) Atualiza saldo da conta de origem
      const fromBalance = map.get(item.account) ?? 0;
      map.set(item.account, fromBalance + item.amount);

      // 2) Se houver transferência, credita o mesmo valor na conta de destino
      if (item.transfer_account != null) {
        const toBalance = map.get(item.transfer_account) ?? 0;
        map.set(item.transfer_account, toBalance + Math.abs(item.amount));
      }

      return map;
    }, new Map<number, number>());
  });

  accountBalance = computed(() =>
    Array.from(this.accountsBalance().values()).reduce((acc, val) => acc + val, 0)
  );
  
  

  constructor(){
    this.loadData();
  }

  private async loadData(){
    this.loadBanckLogos();
    const data = await this.getAccounts();
    if(Array.isArray(data)){
      if(data.length > 0){
        this.accounts.set(data);
      } else{
        const firstAccount = await this.createFirstAccount();
        if(Array.isArray(firstAccount)){
          this.accounts.set(firstAccount)
        }
      }
    }

    if(this.accounts().length > 0){
      this.defoultAccountId.set(this.accounts()[0].id);
    }

    //console.log(this.accountsBalance())
  }

  private async loadBanckLogos(){
    const {data, error} = await this.authService.supabase
    .from('bank_logos')
    .select('url, name, id')
    .order('id', {ascending: true})
    
    if(error){
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return false;
    }

    this.bankLogos.set(data);
    console.log(this.bankLogos());
    return true;
  }

  private async getAccounts(): Promise<Account[] | boolean>{
    const {data, error} = await this.authService.supabase
    .from('accounts')
    .select('id, title, type, default, bank_logo, closing_day')
    .eq('user_id', this.authService.userId())
    .order('id', {ascending: true})
    
    if(error){
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return false;
    }

    return data;
  }
  public getBankUrl(bankId: number){
    const bankUrl = this.bankLogos().find(item => item.id == bankId)?.url;
    if(bankUrl){
      return '/assets/banks/' + bankUrl + '.svg';
    }
    return '';
  }

  private async createFirstAccount(): Promise<Account[] | boolean>{
    const {data, error} = await this.authService.supabase
    .from('accounts')
    .insert({user_id: this.authService.userId(), default: true, title: 'Conta Inicial'})
    .select()

    if(error){
      this.messageService.showDatabaseError(error, 'salvar');
      return false;
    }

    return data;
  }

  public async saveAccount(account: Omit<Account, 'id' | 'default'>): Promise<boolean>{
    console.log(account);
    const {data, error} = await this.authService.supabase
    .from('accounts')
    .insert({title: account.title, type: account.type, user_id: this.authService.userId(), default: false, bank_logo: account.bank_logo, closing_day: account.closing_day})
    .select('id, title, type, default, bank_logo')

    if(error){
      this.messageService.showDatabaseError(error, 'salvar');
      return false;
    }


    if(data.length > 0){
      this.accounts.update(current => [...current, data[0] as Account])
    }

    return true;
  }

  public async updateAccount(account: Account): Promise<boolean>{
    const { data, error } = await this.authService.supabase
      .from('accounts')
      .update({ title: account.title, type: account.type, user_id: this.authService.userId(), default: false, bank_logo: account.bank_logo, closing_day: account.closing_day })
      .eq('id', account.id)
      .eq('user_id', this.authService.userId())
      
      if(error){
        this.messageService.showDatabaseError(error, 'atualizar');
        return false;
      }

      this.accounts.update(current => {
        const old = current.filter(item => item.id != account.id);
        return [...old, account];
      })

      return true;
  }

  public async deleteAccount(id: number): Promise<boolean>{
    const { error } = await this.authService.supabase
      .from('accounts')
      .delete()
      .eq('id', id)

      if(error){
        this.messageService.showDatabaseError(error, 'deletar')
        return false;
      }

    this.accounts.update(current => current.filter(item => item.id != id))
    
    return true;
  }

  
}
