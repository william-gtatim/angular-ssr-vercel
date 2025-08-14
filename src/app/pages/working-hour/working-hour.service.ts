import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { TransactionsService } from '../transactions/transactions.service';
import { isSameMonth } from '../../../utils/isSameMonth';
import { NotificationService } from '../../notification.service';
import { WorkingTime } from '../../models';

type Categories = {
  category: number,
  type: string,
}



@Injectable({
  providedIn: 'root'
})

export class WorkingHourService {
  private messageService = inject(NotificationService)
  private transactionsService = inject(TransactionsService);
  private authService = inject(AuthService);
  private monthlyWorkCategories = signal<Categories[]>([]);
  usersWorkingTime = signal<WorkingTime[]>([])
  monthlyWorkTime = computed(() => {
    return this.usersWorkingTime().map(item => item.time).reduce((sun, item) => sun + item, 0);
  })
  loadingData = signal(false);

  constructor() {
    this.loadTime()
  }

  public getHourlyIncomeByUser(spnderId: number, date: string){
    const transactions = this.transactionsService.transactions().filter(item => item.spender == spnderId && item.work  && isSameMonth(item.date, date));

    const totalExpense = transactions
      .filter(item => item.amount < 0)
      .map(item => item.amount)
      .reduce((sum, item) => sum + item, 0);


    const totalIncome = transactions
      .filter(item => item.amount > 0)
      .map(item => item.amount)
      .reduce((sum, item) => sum + item, 0);


    const workingTime = this.usersWorkingTime().find(item => item.family_member == spnderId)?.time;
    if(workingTime){
      const balance = totalIncome - Math.abs(totalExpense);
      return Math.floor(balance / workingTime!);
    }

    return 0;
  }

  public getWorkingHour(date: string){
    if(this.monthlyWorkTime() == 0) return 0;
    const transactions = this.transactionsService.getTransactions().filter(item => item.work && isSameMonth(item.date, date));

    const totalExpense = transactions
      .filter(item => item.amount < 0)
      .map(item => item.amount)
      .reduce((sum, item) => sum + item, 0);


    const totalIncome = transactions
      .filter(item => item.amount > 0)
      .map(item => item.amount)
      .reduce((sum, item) => sum + item, 0);
    

  

    const balance = totalIncome - Math.abs(totalExpense);

    if(balance <= 0) return 0;

    return Math.floor(balance / this.monthlyWorkTime());

  }


  private async loadTime() {
    this.loadingData.set(true);
    const { data, error } = await this.authService.supabase
      .from('monthly_work_time')
      .select('time, family_member, id')
      .eq('user_id', this.authService.userId())

    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return;
    }
  
    this.usersWorkingTime.set(data);
    
    this.loadingData.set(false);
    console.log(this.monthlyWorkTime())
  }

  


  public async saveTime(time: number, user: number) {
    const { data, error } = await this.authService.supabase
      .from('monthly_work_time')
      .insert({ user_id: this.authService.userId(), time: time, family_member: user })
      .select()
      .single()

    if (error) {
      console.log(error);
      if (error.message == 'duplicate key value violates unique constraint "unique_user_family_member_new"'){
        this.messageService.showError({summary: 'Ocorreu um erro ao salvar', detail: 'Você não pode inserir dois tempos de trabalho para o mesmo usuário'});
        return;
      }
      this.messageService.showDatabaseError(error, 'salvar');
    }

    this.usersWorkingTime.update(current => [...current, data])
    console.log(this.usersWorkingTime())
  }

  public async deleteTime(id: number){
    const {error} = await this.authService.supabase
    .from('monthly_work_time')
    .delete()
    .eq('id', id)

    if(error){
      this.messageService.showDatabaseError(error, 'deletar');
      return;
    }

    this.usersWorkingTime.update(current => {
      return current.filter(item => item.id !== id);
    })
  }



  public async updateTime(time: number, id: number, family_member: number) {
    const {data, error} = await this.authService.supabase
    .from('monthly_work_time')
    .update({time: time})
    .eq('id', id)
    .select()

    if (error) {
      console.log(error);
      this.messageService.showDatabaseError(error, 'atualizar');
      return;
    }

    console.log(data);

    this.usersWorkingTime.update(current => {
      const updated = current.filter(item => item.id !== id);
      return [...updated, {id: id, time: time, family_member: family_member} ]
    })
  }
}
