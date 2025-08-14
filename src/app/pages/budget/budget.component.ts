import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { BudgetSummaryComponent } from "./budget-summary/budget-summary.component";
import { BudgetItemComponent } from './budget-item/budget-item.component';
import { BudgetAssessmentComponent } from './budget-assessment/budget-assessment.component';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CardComponent } from "../../components/card/card.component";
import { TransactionFormComponent } from "../transactions/transaction-form/transaction-form.component";
import { convertDayToYearMonth } from '../../../utils/convertDayToYearMonth';
import { CategoryExpense } from '../../models';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ComputedDataService } from '../computed-data.service';
import { getPreviousMonth } from '../../../utils/getPreviusMonth';
import { convertStringToDate } from '../../../utils/convertStringToDate';
import { getNextMonth } from '../../../utils/getNextMonth';
import { AccountService } from '../account/account.service';
import { filterTransactionsByDate } from '../../../utils/filterTransactionsByDate';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget',
  imports: [FormsModule, DatePickerModule, PageTemplateComponent, BudgetSummaryComponent, BudgetItemComponent, BudgetAssessmentComponent, CardComponent, TransactionFormComponent, InputGroupAddonModule, InputGroupModule, Button],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
  providers: [ComputedDataService]

})

export class BudgetComponent {
  data = inject(ComputedDataService);
  transactionService = inject(TransactionsService);
  categoriesService = inject(CategoriesService);
  accountService = inject(AccountService);
  router = inject(Router);
  selectedDate = signal<Date>(new Date());
  dateString = computed(() => {
    return convertDayToYearMonth(this.selectedDate())
  })


  selectedCategory = signal<number | null>(null);

  editSelectedCategoyVisible = signal<boolean>(false);

  categoriesBudget = computed(() => {

    const transactions = filterTransactionsByDate(this.transactionService.transactions(), this.selectedDate(), this.accountService.accounts());
    console.log(transactions);

    let result: CategoryExpense[] = [];

    this.categoriesService.getAllCategories('expense')().forEach(category => {
      const totalExpense = transactions
        .filter(transaction =>
          transaction.category === category.id && transaction.amount < 0
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      result.push({ categoryId: category.id, totalExpense: Math.abs(totalExpense), categoryTitle: category.name });
    });

    return result.sort((a, b) => b.totalExpense - a.totalExpense);
  });


  getCategoryBudget(id: number) {
    return this.categoriesService.getCategoryBudget(id, this.dateString())();
  }



  onEditSelectedCategory(categoryId: number) {
    this.selectedCategory.set(categoryId);
    this.editSelectedCategoyVisible.set(true);
  }

  constructor() {
    effect(()=> {
      this.data.setDate(this.selectedDate())
    })
  }

}
