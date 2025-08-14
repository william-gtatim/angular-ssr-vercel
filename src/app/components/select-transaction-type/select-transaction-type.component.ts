import { Component, input, OnInit, output, signal } from '@angular/core';
import { TransactionType, transactionTypes } from '../../models';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-transaction-type',
  imports: [SelectButtonModule, FormsModule],
  templateUrl: './select-transaction-type.component.html',
  styleUrl: './select-transaction-type.component.css'
})
export class SelectTransactionTypeComponent implements OnInit {
  transactionTypes = signal([
    {
      label: 'Despesa',
      value: 'expense'
    },
    {
      label: 'Receita',
      value: 'income'
    }
  ]);
  selectedType = input.required<TransactionType>();
  selectedTypeChange = output<TransactionType>();
  showLabel = input(false);
  withTransfer = input<boolean>(false);
  class = input('');
  ngOnInit(): void {
      if(this.withTransfer()){
        this.transactionTypes.set(transactionTypes)
      }
  }
}
