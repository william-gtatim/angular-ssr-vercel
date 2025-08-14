import { Injectable, signal, input, inject, effect } from '@angular/core';
import { AccountService } from '../account.service';
import { Account } from '../../../models';
@Injectable({
  providedIn: 'root'
})
export class AccountEditService {
  visible = signal<boolean>(false);
  accountService = inject(AccountService)
  account = signal<Account | null>(null);
  title = signal<string>('');
  type = signal<'debt' | 'credit'>('debt');
  bank_logo = signal<number>(1);
  saving = signal(false);
  closing_day = signal<number | null>(null);

  
  constructor() {
    effect(() => {
      const currentAccount = this.account();
      if(currentAccount){
        this.title.set(currentAccount.title);
        this.type.set(currentAccount.type);
        this.bank_logo.set(currentAccount.bank_logo);
        this.closing_day.set(currentAccount.closing_day);
      }else{
        this.resetData()
      }
    })
   }

   resetData(){
    this.title.set('');
    this.type.set('debt');
    this.bank_logo.set(1);
    this.closing_day.set(null);
   }

  async onUpdate() {
    if(this.account() == null) return;
    this.saving.set(true);
    await this.accountService.updateAccount({ title: this.title(), type: this.type()!, id: this.account()!.id, default: this.account()!.default, bank_logo: this.bank_logo(), closing_day: this.closing_day() });

    this.saving.set(false);
    this.visible.set(false);
  }

  async onSave(){
    this.saving.set(true);
    console.log(this.bank_logo());
    await this.accountService.saveAccount({title: this.title(), type: this.type()!, bank_logo: this.bank_logo(), closing_day: this.closing_day()});

    this.saving.set(false);
    this.visible.set(false);
  }

  async onDelete() {
    if (this.account() == null) return;
    this.saving.set(true);
    await this.accountService.deleteAccount(this.account()!.id);

    this.saving.set(false);
  }


}
