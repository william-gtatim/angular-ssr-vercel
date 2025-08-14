import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { Transaction } from '../../../models';
import { CategoriesService } from '../../categories/categories.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionsService } from '../../../pages/transactions/transactions.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-transaction-item',
  imports: [CurrencyPipe, DatePipe, NgClass],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.css'
})
export class TransactionItemComponent {
  categoriesService = inject(CategoriesService);
  transactionService = inject(TransactionsService)
  transaction = input.required<Transaction>();
  viewDetails = output<number>();

  valueClass = computed(() => {
    if(this.transaction().amount > 0){
      return 'value income';
    }else{
      return 'value expense';
    }
  })
 

  onSelect(){
    this.viewDetails.emit(this.transaction().id);
  }

  getAmount(){
    return Math.abs(this.transaction().amount);
  }
}
