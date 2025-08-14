import { Component, input, output } from '@angular/core';
import { CategoryIconComponent } from '../../../components/category-icon/category-icon.component';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CardComponent } from "../../../components/card/card.component";
import { TransactionCategory } from '../../../models';
@Component({
  selector: 'app-category-item',
  imports: [CategoryIconComponent, CardComponent, MenuModule, ButtonModule],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent {
  category = input.required<TransactionCategory>();
  items: MenuItem[] | undefined;
  edit = output<TransactionCategory>();
  delete = output<TransactionCategory>();

  ngOnInit() {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => { this.edit.emit(this.category()) }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => { this.delete.emit(this.category()) }
      }
    ]

  }


}
