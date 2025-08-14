import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Account } from '../../../models';
import { TransactionsService } from '../../transactions/transactions.service';
import { AccountService } from '../account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountDeleteService {
  visible = signal(false);
  account = signal<Account | null>(null);
  loading = signal(false);
  transactionsService = inject(TransactionsService);
  accountService = inject(AccountService);
  numberTransactions = signal<number>(0);
  numberTransfers = signal<number>(0);



  constructor(){
    effect(() => {
      console.log(this.account())
      if(this.account() == null) return;
      const currentAccount = this.account();
     
      const transactions = this.transactionsService.getTransactions().filter(item => item.account == currentAccount!.id).length;
      const transfers = this.transactionsService.getTransactions().filter(item => item.transfer_account == currentAccount!.id).length;
      this.numberTransactions.set(transactions);
      this.numberTransfers.set(transfers);
      
    })
  }

  async onDelete(){
    if(this.account()?.id){
      this.loading.set(true);
      await this.accountService.deleteAccount(this.account()?.id!);
      this.loading.set(false);
      this.visible.set(false);
    }
    
  }

  
  
}
