import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TransactionsListService } from '../transactions-list.service';
import { SortOptions } from '../../../../models';
import { ButtonComponent } from "../../../../components/button/button.component";
import { Tooltip } from 'primeng/tooltip';

type MenuItens = {
  name: string,
  value: SortOptions
}

@Component({
  selector: 'app-transactions-sort',
  imports: [Button, SelectModule, FormsModule, DialogModule, Tooltip],
  templateUrl: './transactions-sort.component.html',
  styleUrl: './transactions-sort.component.css'
})
export class TransactionsSortComponent {
  service = inject(TransactionsListService);
  selectedCriterion = signal<SortOptions | null>(null);
  selectedDirection = signal<'asc' | 'desc'>('desc');
  visibleDialog = signal(false);

  items: MenuItens[] = [
    {
      name: 'Categoria',
      value: 'category'
    },
    {
      name: 'Conta ou cartão',
      value: 'account'
    },
    {
      name: 'Data da transação',
      value: 'date'
    },
    {
      name: 'Data de registro',
      value: 'id'
    },
    {
      name: 'Descrição',
      value: 'title'
    },
    {
      name: 'Tipo de transação',
      value: 'type'
    },
    {
      name: 'Usuário',
      value: 'spender'
    },
    {
      name: 'Valor',
      value: 'amount',
    },
    
    
    
  ];

  directions = [
    {name: 'Ascendente', value: 'asc'},
    {name: 'Descendente', value: 'desc'}
  ]

  onSort(){
    this.service.selectedCriterion.set({creterion: this.selectedCriterion()!, mode: this.selectedDirection()})
    this.visibleDialog.set(false)
  }

}
