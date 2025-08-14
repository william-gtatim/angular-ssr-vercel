import { Component, inject, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TransactionsService } from '../../transactions/transactions.service';
import { TransactionItemComponent } from '../../transactions/transaction-item/transaction-item.component';
import { Transaction } from '../../../models';
import { TransactionAddService } from '../../transactions/transaction-add-button/transaction-add.service';
import { CardComponent } from '../../../components/card/card.component';
import { ButtonComponent } from "../../../components/button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-last-transactions',
  imports: [TransactionItemComponent, ButtonModule, CardComponent, ButtonComponent],
  templateUrl: './last-transactions.component.html',
  styleUrl: './last-transactions.component.css'
})
export class LastTransactionsComponent {
  transactionsService = inject(TransactionsService);
  transactionAddService = inject(TransactionAddService);
  router = inject(Router)
  transactions = computed(() => {
    return this.transactionsService.getTransactions().slice(0, 20).sort((a: Transaction, b: Transaction) => b.id - a.id).slice(0, 5);
  });
  onEditTransaction(id: number){
    this.transactionAddService.transactionId.set(id);
    this.transactionAddService.visible.set(true);
  }

  
}
