import { Component, computed, inject, input, output, signal } from '@angular/core';
import { TransactionType } from '../../models';
import { CategoriesService } from '../../pages/categories/categories.service';
import { IconItemComponent } from "../icon-item/icon-item.component";
import { DialogComponent } from "../dialog/dialog.component";
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Button } from 'primeng/button';
import { CategoriesAddComponent } from "../../pages/categories/categories-add/categories-add.component";
@Component({
  selector: 'app-select-category',
  imports: [IconItemComponent, DialogComponent, NgClass, IconField, InputIcon, InputText, FormsModule, Button, CategoriesAddComponent],
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.css'
})
export class SelectCategoryComponent {
  service = inject(CategoriesService);
  transactionType = input<TransactionType | 'all'>('all');

  select = input.required<number | null>();
  selectChange = output<number>();
  showAddCategory = input<boolean>(true);
  placeholder = input<string>();

  visible = signal(false);
  search = signal('');

  onAddCategory() {
    this.service.visibleAddCategories.set(true);
  }

  selectedCategory = computed(() => {
    if(!this.select()) return null;
    return this.service.categories().find(item => item.id === this.select())
  })
  

  normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  filteredCategories = computed(() => {
    let categories = this.service.categories();

    const searchTerm = this.normalize(this.search() ?? '');

    if (searchTerm) {
      categories = categories.filter(item =>
        this.normalize(item.name ?? '').includes(searchTerm)
      );
    }

    const type = this.transactionType();
    if (type !== 'all') {
      categories = categories.filter(item => item.type === type);
    }

    return categories;
  });
}
