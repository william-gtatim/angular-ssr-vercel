import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import type { Transaction, TransactionType } from '../../../models';
import { CategoriesService } from '../../categories/categories.service';
import { TransactionsService } from '../transactions.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { transactionTypes } from '../../../models';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../auth.service';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { convertDateToString } from '../../../../utils/convertDateToString';
import { getIsSmallScreen } from '../../../../utils/getIsSmallScreen';
import { TransactionAddService } from '../transaction-add-button/transaction-add.service';
import { SelectAccountComponent } from "../../../components/select-account/select-account.component";
import { AccountService } from '../../account/account.service';
import { InputCurrencyComponent } from "../../../components/input-currency/input-currency.component";
import { SelectTransactionTypeComponent } from "../../../components/select-transaction-type/select-transaction-type.component";
import { NgClass } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectCategoryComponent } from "../../../components/select-category/select-category.component";
@Component({
  selector: 'app-transaction-form',
  imports: [DialogModule, ButtonModule, InputTextModule, ToggleSwitchModule, ReactiveFormsModule, DatePickerModule, InputNumberModule, TextareaModule, SelectModule, SelectButtonModule, FormsModule, SelectAccountComponent, InputCurrencyComponent, SelectTransactionTypeComponent, NgClass, IconFieldModule, InputIconModule, CheckboxModule, SelectCategoryComponent],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent{
  transactionAddService = inject(TransactionAddService);
  categoriesService = inject(CategoriesService);
  transactionsService = inject(TransactionsService);
  accountService = inject(AccountService)
  authService = inject(AuthService);
  transactionTypes = signal(transactionTypes);
  isSmallScreen = signal(false);

  finishTransactionEdit = output<boolean>();


  saving = signal(false);
  deleting = signal(false);



  id = computed(() => this.transactionAddService.transactionId());
  type = signal<TransactionType>('expense');
  date = signal<Date>(new Date());
  amount = signal<number | null>(null);
  title = signal<string>('');
  category = signal<number | null>(null);
  spender = signal<number | null>(null);
  account = signal<number>(0);
  account_transafer = signal<number | null>(0);
  work = signal<boolean>(false);

  accountOptions = computed(() => {
    return this.accountService.accounts().filter(item => item.id !== this.account_transafer())
  })
  accountTransferOptions = computed(() => {
    return this.accountService.accounts().filter(item => item.id !== this.account())
  })

  isValidForm = computed(() => {
    if (!this.date() || !this.amount() || !this.title() || !this.account() ||  !this.spender() || !this.account()) return false;

    if (this.type() === 'expense' || this.type() === 'income') {
      if(!this.category()) return false;
    }

    if (this.type() === 'transfer') {
      if (!this.account_transafer()) return false;
    }

    if(this.account() == this.account_transafer()){
      return false;
    }

    return true;
  })

  titleWork = computed(() => {
    if(this.type() == 'expense'){
      return 'Despesa com o trabalho';
    }else if(this.type() == 'income') {
      return 'Renda do trabalho';
    }
    return '';
  })

  constructor(){
    
    this.isSmallScreen.set(getIsSmallScreen())

    effect(() => {

      this.account.set(this.accountService.defoultAccountId());
      this.spender.set(this.authService.familyMemberDefault());
      
      if (this.id() && this.id() !== null) {
        const transaction = this.transactionsService.getTransactionById(this.id() as number);

        if (!transaction) return;
        this.type.set(transaction.type);
        this.date.set(new Date(transaction.date + 'T00:00:00'));
        this.amount.set(Math.abs(transaction.amount));
        this.title.set(transaction.title);
        this.category.set(transaction.category);
        this.spender.set(transaction.spender);
        this.type.set(transaction.type);
        this.account.set(transaction.account);
        this.account_transafer.set(transaction.transfer_account);
        this.work.set(transaction.work)
      } else {
        this.resetData()
      }
    });
  }


  resetData(){
    this.type.set('expense');
    this.date.set(new Date());
    this.amount.set(null);
    this.title.set('');
    this.category.set(null);
    this.spender.set(this.authService.familyMemberDefault())
    this.account.set(this.accountService.defoultAccountId());
    this.account_transafer.set(null);
    this.work.set(false)
  }


  async onSubmit() {
    this.saving.set(true)
    if (this.isValidForm()) {
      let amount = this.amount();
      if (this.type() === 'expense' || this.type() === 'transfer') {
        amount = -Math.abs(this.amount()!)
      }

      const transaction: Omit<Transaction, 'id'> = {
        amount: amount!,
        title: this.title(),
        category: this.category(),
        date: convertDateToString(this.date()),
        spender: this.spender()!,
        transfer_account: this.account_transafer(),
        account: this.account()!,
        type: this.type(),
        work: this.work()
      }
      if (this.id()) {

        await this.transactionsService.updateTransaction({...transaction, id: this.id()!});
        this.transactionAddService.visible.set(false)

      } else {

        await this.transactionsService.saveTransaction(transaction);
        this.amount.set(null);
        this.title.set('');
        this.category.set(null);
      }


    } else {
      console.error('Formulário inválido');
    }
    this.saving.set(false);
  }



  async onDeleteTransaction() {
    this.deleting.set(true);
    await this.transactionsService.deleteTransations([this.id()!]);
    this.deleting.set(false);
    this.transactionAddService.visible.set(false);
  }

  onChangetype() {
    this.category.set(null);
  }

  onAddCategory() {
    this.categoriesService.transactionType.set(this.type());
    this.categoriesService.visibleAddCategories.set(true);
  }

}
