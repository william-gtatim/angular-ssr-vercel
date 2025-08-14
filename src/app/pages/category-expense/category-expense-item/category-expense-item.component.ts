import { Component, computed, inject, input, signal } from '@angular/core';
import { CategoryBudget } from '../../../models';
import { CategoriesService } from '../../categories/categories.service';
import { IconItemComponent } from "../../../components/icon-item/icon-item.component";
import { CardComponent } from '../../../components/card/card.component';
import { CurrencyPipe } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category-expense-item',
  imports: [IconItemComponent, CardComponent, CurrencyPipe, ProgressBar, NgClass],
  templateUrl: './category-expense-item.component.html',
  styleUrl: './category-expense-item.component.css'
})
export class CategoryExpenseItemComponent {
  router = inject(Router)
  service = inject(CategoriesService);
  item = input<CategoryBudget>();
  categorySpending = input.required<number>();
  category = computed(() => {
    const id = this.item()?.category;
    if(id){
      return this.service.getCategory(id);
    }
    return null;
  })


  getRemaing(){
    if(!this.item()) return 0;
    return this.item()?.amount! - this.categorySpending();
  }

  getPercentage(){
    if (!this.item()) return 0;
    return Math.round((this.categorySpending() / this.item()?.amount!) * 100);
  }
}
