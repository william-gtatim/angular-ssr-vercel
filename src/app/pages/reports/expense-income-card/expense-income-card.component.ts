import { Component, computed, input} from '@angular/core';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-expense-income-card',
  imports: [CurrencyPipe],
  templateUrl: './expense-income-card.component.html',
  styleUrl: './expense-income-card.component.css'
})


export class ExpenseIncomeCardComponent {
  balance = input.required<number>();
  expense = input.required<number>();
  income = input.required<number>();

  absExpense = computed(() =>{
    return Math.abs(this.expense());
  })
}
