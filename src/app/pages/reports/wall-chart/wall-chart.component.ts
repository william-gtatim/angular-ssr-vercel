import { Component, computed, inject, OnInit } from '@angular/core';
import { TransactionsService } from '../../transactions/transactions.service';
import { BarChartTransactionData, Transaction} from '../../../models';
import { ChartModule } from 'primeng/chart';
import { ChartBarComponent } from "../chart-bar/chart-bar.component";



@Component({
  selector: 'app-wall-chart',
  imports: [ChartModule, ChartBarComponent],
  templateUrl: './wall-chart.component.html',
  styleUrl: './wall-chart.component.css'
})
export class WallChartComponent  {
  transacitonsService = inject(TransactionsService);
  data = computed(() => {
    return this.calculateMonthlyTransactions(this.transacitonsService.transactions());
  })





  calculateMonthlyTransactions(transactions: Transaction[]): BarChartTransactionData[] {
    const monthlyTotals: Record<string, { expense: number; income: number }> = {};

    transactions.forEach((transaction: Transaction) => {
      const [year, month] = transaction.date.split('-');
      const key = `${year}-${month}`;

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = { income: 0, expense: 0 };
      }

      if (transaction.amount > 0) {
        monthlyTotals[key].income += transaction.amount;
      }

      if (transaction.amount < 0) {
        monthlyTotals[key].expense += Math.abs(transaction.amount);
      }
    });


    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    return Object.entries(monthlyTotals)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, { expense, income }]) => {
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month, 10) - 1; 

        return {
          month: `${monthNames[monthIndex]} ${year}`,
          expense,
          income
        };
      });
  }


  
}
