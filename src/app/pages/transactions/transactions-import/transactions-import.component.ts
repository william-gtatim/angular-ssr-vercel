import { Component, inject, signal } from '@angular/core';
import { ImportOfxComponent } from "./import-ofx/import-ofx.component";
import { FormsModule } from '@angular/forms';
import  {CheckboxModule} from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { ImportTextComponent } from "./import-text/import-text.component";
import { AccordionModule } from 'primeng/accordion';
import { ImportImageComponent } from "./import-image/import-image.component";
import { TableModule } from 'primeng/table';
import { TransactionImport } from '../../../models';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { TransactionsService } from '../transactions.service';
@Component({
  selector: 'app-transactions-import',
  imports: [ImportOfxComponent, CheckboxModule, FormsModule, FieldsetModule, ImportTextComponent, AccordionModule, ImportImageComponent, TableModule, ButtonModule, TooltipModule, DatePipe, CurrencyPipe],
  templateUrl: './transactions-import.component.html',
  styleUrl: './transactions-import.component.css'
})
export class TransactionsImportComponent {
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  ignoreDuplicates = signal(true);
  transactions = signal<TransactionImport[]>([]);
  selectedTransactions = signal<TransactionImport[]>([]);
  savingTransactions = signal(false);
  onParseData(transactions: TransactionImport[]){
    this.transactions.set(transactions);
  }

  async onSaveSelectedTransactions(){
    this.savingTransactions.set(true);

    for (const item of this.selectedTransactions()) {

      const transaction = {
        date: item.date,
        amount: item.amount,
        title: item.title,
        categories: [],
        comment: item.title,
        spender: this.authService.familyMembers().find(item => item.name === 'Eu')!.id
      };

      if (this.ignoreDuplicates()) {
        const exists = this.transactionService.getTransactions().some(item =>
          item.date.trim() == transaction.date.trim() && item.amount == transaction.amount

        );


        if (exists) continue;
      }


      // await this.transactionService.saveTransaction(transaction);
    }

    this.savingTransactions.set(false);
    this.transactions.set([]);
    this.selectedTransactions.set([]);
  }

 
}
