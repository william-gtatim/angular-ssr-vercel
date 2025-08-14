import { Component, inject, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { TransactionsService } from '../../transactions/transactions.service';
import { ButtonModule } from 'primeng/button';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-delete',
  imports: [DialogComponent, ButtonModule],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export class CategoryDeleteComponent implements OnChanges {
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  categoryId = input.required<number>();
  transactionService = inject(TransactionsService);
  categoriesService = inject(CategoriesService)
  transactionNumber = signal(0);
  loading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    this.transactionNumber.set(this.transactionService.getTransactions().filter(item => item.category === this.categoryId()).length)
  }

  async onDelete(){
    this.loading.set(true);
    await this.categoriesService.deleteCategory(this.categoryId());
    this.loading.set(false);
    this.visibleChange.emit(false);
  }


}
