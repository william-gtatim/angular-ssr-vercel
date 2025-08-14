import { Component, computed, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CategoryIconComponent } from "../../../components/category-icon/category-icon.component";
import { CategoryExpense } from '../../../models';
import { Tooltip } from 'primeng/tooltip';
@Component({
  selector: 'app-budget-item',
  imports: [CurrencyPipe,  CategoryIconComponent, Tooltip],
  templateUrl: './budget-item.component.html',
  styleUrl: './budget-item.component.css'
})
export class BudgetItemComponent {
  onSelecteCategory = output<number>();
  categoryExpense = input.required<CategoryExpense>();
  budget = input.required<number | null>();

  icon = computed(() => {
    if (!this.categoryExpense().totalExpense || !this.budget()) return '';
    if (this.categoryExpense().totalExpense! > this.budget()!) {
      return 'pi pi-arrow-down'
    } else if (this.categoryExpense().totalExpense! < this.budget()!) {
      return 'pi pi-arrow-up';
    } else {
      return '';
    }
  })

    

}
