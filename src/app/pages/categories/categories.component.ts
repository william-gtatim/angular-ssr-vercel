import { Component, computed, inject, signal } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { ButtonComponent } from "../../components/button/button.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { CategoriesService } from './categories.service';
import { CategoryItemComponent } from "./category-item/category-item.component";
import { SelectTransactionTypeComponent } from "../../components/select-transaction-type/select-transaction-type.component";
import { CategoriesAddComponent } from "./categories-add/categories-add.component";
import { CategoryDeleteComponent } from "./category-delete/category-delete.component";
import { TransactionType, TransactionCategory } from '../../models';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-categories',
  imports: [PageTemplateComponent, ButtonComponent, HeaderBackComponent, CategoryItemComponent, SelectTransactionTypeComponent, CategoriesAddComponent, CategoryDeleteComponent, ButtonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categoriesService = inject(CategoriesService);
  selectedTransactionType = signal<TransactionType>('expense');
  selectedCategories = computed(() => (this.categoriesService.getAllCategories()().filter(item => item.type === this.selectedTransactionType())))

  deletingItem = signal<number>(0);
  visibleDelete = signal(false);
  editingItem = signal<TransactionCategory | null>(null);

  onAddNew() {
    this.editingItem.set(null);
    this.categoriesService.visibleAddCategories.set(true)
  }



  onEdit(categorie: TransactionCategory) {
    this.editingItem.set(categorie);
    this.categoriesService.visibleAddCategories.set(true);
  }

  onDelete() {

  }
}
