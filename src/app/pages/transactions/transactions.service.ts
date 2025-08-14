import { Injectable, signal, effect, inject } from '@angular/core';
import type { Transaction, TransactionCategory, CategoryIcon } from '../../models';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../notification.service';
import { filterTransactionsByDate } from '../../../utils/filterTransactionsByDate';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  authService = inject(AuthService);

  messageService = inject(NotificationService);

  transactionsLoaded = signal(false);

  transactions = signal<Transaction[]>([]);
  loading = signal(false);

  constructor() {
    if (this.authService.userId() !== null) {
      this.loadTransactions(this.authService.userId()!);
    }

  }


  public getTransactions() {
    return this.transactions().sort((a: Transaction, b: Transaction) => b.id - a.id).filter(item => item.type !== 'adjustment');
  }

  public getTransactionById(id: number) {
    return this.transactions().find(item => item.id == id);
  }

  public getSpenderName(spenderId: number | null) {
    if(!spenderId) return ''
    return this.authService.familyMembers().find(item => item.id === spenderId)?.name ?? '';
  }

  

  public async loadTransactions(userId: string) {
    this.loading.set(true);
    let query = this.authService.supabase
      .from('transactions')
      .select('id, date, title, amount, user_id, category, spender, account, transfer_account, type, work')
      .eq('user_id', userId);

    const { data, error } = await query;



    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      this.loading.set(false);
      return false;
    }

    this.transactions.set(this.formatTransaction(data));

    this.loading.set(false);

    return true;
  }

  async updateType(transaction: Transaction){
    let type = 'income';
    if(transaction.amount <= 0){
      type == 'expense';
    }
    const {data, error} = await this.authService.supabase
    .from('transactions')
    .update({type: type})
    .eq('id', transaction.id)
    if(error){
      console.log(error);
    }

   
  }

  async updateAccount(transaction: Transaction) {
    const { data, error } = await this.authService.supabase
      .from('transactions')
      .update({ account: 3 })
      .eq('id', transaction.id)
    if (error) {
      console.log(error);
    }

    console.log(transaction)
  }


  public async loadTransactionById(transaction_id: number) {

    const { data, error } = await this.authService.supabase
      .from('transactions')
      .select('id, date, title, amount, user_id, spender, category, type, account, transfer_account, work')
      .eq('id', transaction_id)

    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return false;
    }

    const transactions = this.formatTransaction(data);

    const alreadyExistis = this.transactions().filter(item => item.id === transaction_id);

    if (alreadyExistis) {
      this.transactions.update((current) => [
        ...current.filter(item => item.id !== transaction_id),
        transactions[0]
      ])
    } else {
      this.transactions.update((current) => [
        ...current,
        transactions[0]
      ])
    }

    return true;

  }


  public async saveTransaction(transaction: Omit<Transaction, 'id'>, message: boolean = true) {

    const { data, error } = await this.authService.supabase
      .from('transactions')
      .insert({
        user_id: this.authService.userId(),
        date: transaction.date,
        title: transaction.title,
        amount: transaction.amount,
        spender: transaction.spender,
        category: transaction.category,
        account: transaction.account,
        type: transaction.type,
        transfer_account: transaction.transfer_account,
        work: transaction.work
      })
      .select()
      .single()

    if (error) {
      this.messageService.showDatabaseError(error, 'salvar');
      return false;
    }

    this.transactions.update((current) => [
      ...current.filter(item => item.id != data.id),
      data
    ])

    if (message) this.messageService.showInfo({ summary: 'Transação adicionada!', detail: transaction.title })

    return true;

  }

  public async deleteTransations(ids: number[]) {
    const { error } = await this.authService.supabase
      .from('transactions')
      .delete()
      .in('id', ids)

    if (error) {
      this.messageService.showDatabaseError(error, 'deletar');
      return false;
    }

    for (const id of ids) {
      this.transactions.update((current) => current.filter(item => item.id !== id));
    }

    return true;
  }


  public async updateTransacionCategory(transaction: Transaction) {
    const { error: errorUpdate } = await this.authService.supabase
      .from('transactions')
      .update({ date: transaction.date, title: transaction.title, amount: transaction.amount, spender: transaction.spender, category: transaction.category, work: transaction.work })
      .eq('id', transaction.id)

    if (errorUpdate) {
      this.messageService.showDatabaseError(errorUpdate, 'atualizar');
      return false;
    }

    return true;
  }


  public async updateTransaction(transaction: Transaction) {

    const { error } = await this.authService.supabase
      .from('transactions')
      .update({ date: transaction.date, title: transaction.title, amount: transaction.amount, spender: transaction.spender, category: transaction.category, type: transaction.type, transfer_account: transaction.transfer_account, work: transaction.work, account: transaction.account })
      .eq('id', transaction.id)

    if (error) {
      this.messageService.showDatabaseError(error, 'atualizar');
      return false;
    }

    this.loadTransactionById(transaction.id);

    return true;
  }

  public async addCategoriesToTransactions(category: number, transactions: Transaction[]) {

    const { data, error } = await this.authService.supabase
      .from('transactions')
      .update({ category: category })
      .in('id', transactions.map(item => item.id))

    if (error) {
      this.messageService.showDatabaseError(error, 'salvar');
    }

    for (const transaction of transactions) {
      this.loadTransactionById(transaction.id);
    }
  }



  public async updateSpender(transactions: Transaction[], spenderId: number) {
    const { data, error } = await this.authService.supabase
      .from('transactions')
      .update({ spender: spenderId })
      .in('id', transactions.map(item => item.id))

    if (error) {
      this.messageService.showDatabaseError(error, 'salvar');
    }

    for (const transaction of transactions) {
      await this.loadTransactionById(transaction.id);
    }
  }

  public async updateTransactionTitle(transactions: Transaction[], title: string) {
    const { data, error } = await this.authService.supabase
      .from('transactions')
      .update({ title: title })
      .in('id', transactions.map(item => item.id))

    if (error) {
      this.messageService.showDatabaseError(error, 'atualizar');
      return;
    }

    for (const transaction of transactions) {
      await this.loadTransactionById(transaction.id);
    }

  }


  private formatTransaction(data: any): Transaction[] {

    const result: Transaction[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      amount: item.amount,
      category: item.category,
      spender: item.spender,
      account: item.account,
      transfer_account: item.transfer_account,
      type: item.type,
      work: item.work
    }))


    return result;
  }



}
