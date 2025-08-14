import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TransactionsListService } from './transactions-list.service';
import { ScrollerModule } from 'primeng/scroller';
import { TransactionAddService } from '../transaction-add-button/transaction-add.service';
import { Transaction, TransactionsFilters } from '../../../models';

import { CardComponent } from "../../../components/card/card.component";
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { IlustrationReceiptComponent } from "../../../components/ilustrations/ilustration-receipt/ilustration-receipt.component";
import { IlustrationNotFoundComponent } from "../../../components/ilustrations/ilustration-not-found/ilustration-not-found.component";
import { SelectDateComponent } from './select-date/select-date.component';
@Component({
  selector: 'app-transactions-list',
  imports: [CommonModule, TransactionItemComponent, CheckboxModule, FormsModule, ScrollerModule, SelectDateComponent, CardComponent, LoadingSpinnerComponent, IlustrationReceiptComponent, IlustrationNotFoundComponent],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.css'
})
export class TransactionsListComponent implements OnInit {
  service = inject(TransactionsListService);
  transactionService = inject(TransactionsService);
  transactionAddService = inject(TransactionAddService)
  height = signal('');

  selectedTransactions = signal<Transaction[]>([])


  ngOnInit(): void {
    setTimeout(() => {
      const page = document.querySelector('.header') as HTMLElement;
      const pageHeight = page?.offsetHeight || 0;
      const availableHeight = window.innerHeight - pageHeight - 1;
      
      this.height.set(`${availableHeight}px`);
    });
  }

  onSelectTransaction(transaction: Transaction, status: boolean){
    if(status == true){
      this.selectedTransactions.update((oldValue) => [...oldValue, transaction]);
      
    }else {
      this.selectedTransactions.update((oldvalue) => {
        return oldvalue.filter(item => item.id != transaction.id)
      })
    }
  }

  onEditTransaction(id: number){
    this.transactionAddService.transactionId.set(id);
    this.transactionAddService.visible.set(true);
  }

  isTransactionSelected(id: number): boolean {
    return this.selectedTransactions().some(t => t.id === id);
  }


}
