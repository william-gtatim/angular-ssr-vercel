import { Component, inject } from '@angular/core';
import { TransactionAddService } from './transaction-add.service';
import { TransactionsService } from '../../../pages/transactions/transactions.service';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-transaction-add-button',
  imports: [Button],
  templateUrl: './transaction-add-button.component.html',
  styleUrl: './transaction-add-button.component.css'
})
export class TransactionAddButtonComponent {
  service = inject(TransactionAddService);
  transactionService = inject(TransactionsService);
}
