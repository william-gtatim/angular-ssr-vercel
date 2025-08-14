import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../categories/categories.service';
import { CategoryBudget, Transaction, TransactionCategory } from '../../../models';
import { PageTemplateComponent } from "../../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../../components/header-back/header-back.component";
import { IconItemComponent } from "../../../components/icon-item/icon-item.component";
import { ProgressBar } from 'primeng/progressbar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionsService } from '../../transactions/transactions.service';
import { filterTransactionsByDate } from '../../../../utils/filterTransactionsByDate';
import { getNextMonth } from '../../../../utils/getNextMonth';
import { CardComponent } from "../../../components/card/card.component";
import { NgClass } from '@angular/common';
import { TransactionFormComponent } from "../../transactions/transaction-form/transaction-form.component";
import { TransactionAddService } from '../../transactions/transaction-add-button/transaction-add.service';
@Component({
  selector: 'app-category-expense-item-details',
  imports: [PageTemplateComponent, HeaderBackComponent, IconItemComponent, ProgressBar, CurrencyPipe, CardComponent, NgClass, DatePipe, TransactionFormComponent],
  templateUrl: './category-expense-item-details.component.html',
  styleUrl: './category-expense-item-details.component.css'
})
export class CategoryExpenseItemDetailsComponent {
  transactionAddService = inject(TransactionAddService);
  transactionService = inject(TransactionsService);
  service = inject(CategoriesService);
  router = inject(Router);
  route =  inject(ActivatedRoute);
  id = signal<number | null>(null);
  budgetItem = signal<CategoryBudget | null>(null);
  category = signal<TransactionCategory | null>(null);
  expense = signal(0);
  transactions = signal<Transaction[]>([])




  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(!id) this.goBack();

    this.id.set(id);

    const budget = this.service.categoriesBudget().find(item => item.id == this.id());
    
    if(!budget) this.goBack();

    this.budgetItem.set(budget!);

    const category = this.service.categories().find(item => item.id == budget?.category);

    if(!category) this.goBack();

    this.category.set(category!);

    // calcular os gastos nessa categoria no mês do budget item. Filtrar por data e categoria

    const date = getNextMonth(this.budgetItem()?.date!);
    const transactions = filterTransactionsByDate(this.transactionService.transactions(), new Date(date + 'T12:00:00')).filter(item => item.category == category?.id);


    const total = transactions.map(item => item.amount).reduce((sun, item) => sun + item, 0);

    if(transactions){
      this.transactions.set(transactions);
      this.expense.set(Math.abs(total))
    }


  }

  getPercentage(){
    return Math.round((this.expense() / this.budgetItem()?.amount!) * 100);
  }

  getRemaining(){
    return this.budgetItem()?.amount! - this.expense();
  }


  goBack(){
    this.router.navigate(['/category-expense']);
  }

  onEdit(id: number){
    this.transactionAddService.transactionId.set(id);
    this.transactionAddService.visible.set(true);
  }


}
