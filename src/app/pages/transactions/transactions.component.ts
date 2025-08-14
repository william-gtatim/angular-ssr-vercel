import { Component, inject } from '@angular/core';
import { TransactionsListComponent } from "./transactions-list/transactions-list.component";
import { TransactionFormComponent } from "./transaction-form/transaction-form.component";
import { TransactionAddButtonComponent } from './transaction-add-button/transaction-add-button.component';

import { TransactionsListService } from './transactions-list/transactions-list.service';
import { TransactionsSortComponent } from "./transactions-list/transactions-sort/transactions-sort.component";
import { TransactionsSearchComponent } from "./transactions-list/transactions-search/transactions-search.component";
import { TransactionsActionsComponent } from "./transactions-list/transactions-actions/transactions-actions.component";

import { CategoriesAddComponent } from '../categories/categories-add/categories-add.component';
import { TransactionsFilterComponent } from './transactions-list/transactions-filter/transactions-filter.component';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { CardComponent } from "../../components/card/card.component";

import { SelectDateComponent } from './transactions-list/select-date/select-date.component';

@Component({
  selector: 'app-transactions',
  imports: [TransactionsListComponent, TransactionFormComponent, TransactionAddButtonComponent, TransactionsFilterComponent, TransactionsSortComponent, TransactionsSearchComponent, TransactionsActionsComponent, CategoriesAddComponent, PageTemplateComponent, CardComponent, SelectDateComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  service = inject(TransactionsListService);
}
