import { Component, input, signal, inject, output, computed } from '@angular/core';
import { TransactionImport, TransactionType } from '../../../models';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { SelectAccountComponent } from "../../../components/select-account/select-account.component";
import { AccountService } from '../../account/account.service';
import { SelectSpenderComponent } from "../../../components/select-spender/select-spender.component";
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-show-and-save',
  imports: [TableModule, Button, CheckboxModule, CurrencyPipe, DatePipe, FormsModule, SelectAccountComponent, SelectSpenderComponent, TooltipModule],
  templateUrl: './show-and-save.component.html',
  styleUrl: './show-and-save.component.css'
})
export class ShowAndSaveComponent {
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  transactions = input<TransactionImport[]>([]);
  transactionsChange = output<[]>()
  selectedTransactions = signal<TransactionImport[]>([]);
  ignoreDuplicates = signal(true);
  savingTransactions = signal(false);
  accountService = inject(AccountService);
  selectedAccount = signal<number>(0);
  selectedSpender = signal<number>(0);
  disableButton = computed(() => {
    if(this.selectedTransactions().length == 0) return true
    if(!this.selectedSpender()) return true
    if(!this.selectedAccount()) return true
    return false
  })

  async onSaveSelectedTransactions() {
    this.savingTransactions.set(true);

    for (const item of this.selectedTransactions()) {
      let type: TransactionType = 'expense';
      if(item.amount > 0){
        type = 'income'
      }
      const transaction = {
        date: item.date,
        amount: item.amount,
        title: item.title,
        category: null,
        spender: this.selectedSpender(),
        account: this.selectedAccount(),
        transfer_account: null,
        type: type,
        work: false

      };

      if (this.ignoreDuplicates()) {
        const exists = this.transactionService.getTransactions().some(item =>
          item.date.trim() == transaction.date.trim() && item.amount == transaction.amount

        );


        if (exists) continue;
      }


      await this.transactionService.saveTransaction(transaction);
    }

    this.savingTransactions.set(false);
    this.transactionsChange.emit([]);
    this.selectedTransactions.set([]);
  }
}
