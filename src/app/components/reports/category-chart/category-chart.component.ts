import { Component, computed, inject, input, signal, SimpleChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Transaction } from '../../../models';
import { ChartModule } from 'primeng/chart';
import { CategoriesService } from '../../../pages/categories/categories.service';
import { NgClass } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { IconItemComponent } from "../../icon-item/icon-item.component";
type Data = {
  ammount: number,
  id: number,
  name: string,
  color: number | null,
  icon: number | null
}
@Component({
  selector: 'app-category-chart',
  imports: [ChartModule, NgClass, CurrencyPipe, IconItemComponent],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.css'
})
export class CategoryChartComponent {
  categoryService = inject(CategoriesService);
  transactions = input.required<Transaction[]>();
  data = signal<Data[]>([]);

  chartData = signal<any>(null);
  options = signal<any>(null);
  cdr = inject(ChangeDetectorRef);
  total = signal(0);


  ngOnChanges(changes: SimpleChanges): void {
    const transactions = this.transactions();
    if (!transactions || transactions.length === 0) return;
    this.data.set(this.getSpendingByCategory(transactions));
    console.log(this.data())

    this.initChart()


    this.cdr.detectChanges();

    console.log(this.chartData())


  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.chartData.set({
      labels: this.data().map(item => item.name),
      datasets: [
        {
          data: this.data().map(item => item.ammount),
          backgroundColor: this.data().map(item => this.getColor(item.color))
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

  getColor(colorId: number | null){
    if(colorId){
      return this.categoryService.getColorCode(colorId);
    }
    return '#bbbcc0'
  }

  getPercentage(value: number){
    return Math.round((value / this.total()) * 100);
  }



  getSpendingByCategory(transactions: Transaction[]): Data[] {
  // 1. Agrupar gastos por categoria (ignorando nulos e income)
  const categoryMap = new Map<number, number>();

  transactions.forEach(transaction => {
    if (transaction.type === 'expense' && transaction.category !== null) {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + Math.abs(transaction.amount));
    }
  });


  // 2. Converter para array e ordenar por valor (decrescente)
  const sortedCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]);


  // 3. Preparar o resultado final
  const result: [number, number][] = [];
  let otherAmount = 0;

  sortedCategories.forEach(([categoryId, amount], index) => {
    if (index < 9) {
      result.push([categoryId, amount]);
    } else {
      otherAmount += amount;
    }
    this.total.update(current => current + amount);
  });


  if (otherAmount > 0) {
    result.push([0, otherAmount]);

  }

  return result.map(item => {
    let category = this.categoryService.getCategory(item[0])
    
    return {
      id: item[0], 
      ammount: item[1], 
      name: category?.name ?? 'Outras',
      color: category?.colorId ?? null,
      icon: category?.iconId ?? 0
    }
  });
  }


}
