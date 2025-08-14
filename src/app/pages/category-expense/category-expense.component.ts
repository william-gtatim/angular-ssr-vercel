import { Component, computed, effect, inject, signal } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ComputedDataService } from '../computed-data.service';
import { CategoriesService } from '../categories/categories.service';
import { CategoryExpenseItemComponent } from './category-expense-item/category-expense-item.component';
import { aggregateTransactionsByCategory } from '../../../utils/aggregateTransactionsByCategory';
import { MonthPlanningComponent } from "../home/month-planning/month-planning.component";
import { IlustrationPlaningComponent } from '../../components/ilustrations/ilustration-planing/ilustration-planing.component';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category-expense',
  imports: [PageTemplateComponent, HeaderBackComponent, DatePicker, FormsModule, CategoryExpenseItemComponent, MonthPlanningComponent, IlustrationPlaningComponent, Button],
  templateUrl: './category-expense.component.html',
  styleUrl: './category-expense.component.css',
  providers: [ComputedDataService]
})
export class CategoryExpenseComponent {
  router = inject(Router)
  service = inject(ComputedDataService)
  selectedDate = signal<Date>(new Date());
  categoriesService = signal(CategoriesService);
  categorySpending = computed(() => {
    return aggregateTransactionsByCategory(this.service.transactions())
  })


  constructor(){
    effect(() => {
      this.service.setDate(this.selectedDate())
    })
  }


}
