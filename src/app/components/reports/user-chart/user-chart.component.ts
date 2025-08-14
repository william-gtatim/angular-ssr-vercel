import { Component, computed, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Transaction } from '../../../models';
import { AuthService } from '../../../auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CategoriesService } from '../../../pages/categories/categories.service';
import { NgClass } from '@angular/common';
type ChartData = {
  name: string,
  value: number, 
  color: string
}
@Component({
  selector: 'app-user-chart',
  imports: [CurrencyPipe, ChartModule, NgClass],
  templateUrl: './user-chart.component.html',
  styleUrl: './user-chart.component.css'
})
export class UserChartComponent implements OnChanges{
  categoriesSerive = inject(CategoriesService);
  authService = inject(AuthService);
  transactions = input.required<Transaction[]>();
  data = signal<ChartData[]>([])

  total = computed(() => {
    return this.data().map(item => item.value).reduce((sun, item) => item + sun, 0);
  })
  chartData = signal<any>(null);


  options = signal<any>(null);

  cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    const transactions = this.transactions();
    if (!transactions || transactions.length === 0) return;

    const processed = this.getSpendingPerUser();
    if (processed.length === 0) return;

    this.data.set(processed);
    console.log('teste')
    this.initChart();
    console.log(this.chartData());
    this.cdr.detectChanges();

    
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.chartData.set({
      labels: this.data().map(item => item.name),
      datasets: [
        {
          data: this.data().map(item => item.value),
          backgroundColor: this.data().map(item => item.color)
        }
      ]
    });

    this.options.set({
      maintainAspectRatio: true,
      responsive: true,
      cutout: '65%',
      spacing: 3,
      borderRadius: 10,
      borderJoinStyle: 'round',
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            color: textColor
          }
        }
      },
    });

  }

  getPercentage(value: number){
    return Math.round((value / this.total()) * 100);
  }

  getSpendingPerUser(): ChartData[] {
    const transactions = this.transactions();

    const totalsMap = new Map<number, number>();

    for (const t of transactions) {
      if (t.spender != null) {
        const current = totalsMap.get(t.spender) ?? 0;
        totalsMap.set(t.spender, current + t.amount);
      }
    }

    const result: ChartData[] = [];
    let count = 0;
    for (const [userId, value] of totalsMap.entries()) {
      result.push({ name: this.authService.getFamilyMemberName(userId), value: Math.abs(Math.round(value)), color: this.categoriesSerive.getColors()[count].value });
      count ++;
    }

    return result;
  }
  
}
