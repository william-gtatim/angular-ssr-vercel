import { Component, OnInit, ChangeDetectorRef, input, OnChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { BarChartTransactionData } from '../../../models';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.css'
})

export class ChartBarComponent implements OnChanges {
  transactionsData = input.required<BarChartTransactionData[]>()
  
  data: any;
  options: any;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges() {
    this.initChart();
 
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data = {
      labels: this.transactionsData().map(item => item.month),
      datasets: [
        {
          label: 'Despesa',
          backgroundColor: documentStyle.getPropertyValue('--p-purple-500'),
          borderColor: documentStyle.getPropertyValue('--p-purple-500'),
          data: this.transactionsData().map(item => item.expense),
          borderRadius: 5,
          fill: true,
          tension: 0.4,
          
        },
        {
          label: 'Receita',
          backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
          borderColor: documentStyle.getPropertyValue('--p-blue-500'),
          data: this.transactionsData().map(item => item.income),
          borderRadius: 5,
          tension: 0.4
        }
        
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: true
          }
        }
      }
    };

    this.cd.markForCheck();
  }
}
