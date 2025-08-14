import { Component, computed, inject, input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoriesService } from '../../categories/categories.service';
import { CurrencyPipe } from '@angular/common';
import { TransactionsService } from '../../transactions/transactions.service';
import { getLastMonths } from '../../../../utils/getLastMonths';
import { Transaction } from '../../../models';
import { InfoComponent } from "../../../components/info/info.component";
import { NgClass } from '@angular/common';
import { GoalsService } from '../../goals/goals.service';
import { Router } from '@angular/router';
import { ComputedDataService } from '../../computed-data.service';
import { getNextMonth } from '../../../../utils/getNextMonth';

@Component({
  selector: 'app-budget-summary',
  imports: [CurrencyPipe, InfoComponent, NgClass],
  templateUrl: './budget-summary.component.html',
  styleUrl: './budget-summary.component.css'
})
export class BudgetSummaryComponent implements OnChanges {
  dataService = inject(ComputedDataService)
  router = inject(Router);
  goalsService =  inject(GoalsService);
  service = inject(CategoriesService);
  transactionService = inject(TransactionsService);
  selectedDate = input.required<string>();

  averageLastMonths = computed(() => {
    const [year, month] = this.selectedDate().split('-');
    const lastMonths = getLastMonths(this.selectedDate(), 1);
    const transactions = this.transactionService.getTransactions().filter(transaction => {
      return lastMonths.some(month => transaction.date.startsWith(month) && transaction.amount > 0);
    })
    
    return transactions.reduce((sun: number, transaction: Transaction) => sun + transaction.amount, 0);

  })


  save = computed(() => {
    return this.averageLastMonths() - this.dataService.budget();
  })


  percentage = computed(() => {
    console.log(this.averageLastMonths())
    console.log(this.dataService.budget())
    if(this.averageLastMonths() == 0) return 0;
    return Math.round((this.save() / this.averageLastMonths()) * 100)
  })


  ngOnChanges(changes: SimpleChanges): void {
    const date = getNextMonth(this.selectedDate())
      this.dataService.setDate(new Date(date + 'T12:00:00'))
  }


  getMissingValue(){
    return Math.round(this.goalsService.calculateMonthlySavingRequiredAllActiveGoals() - this.save())
  }

}
