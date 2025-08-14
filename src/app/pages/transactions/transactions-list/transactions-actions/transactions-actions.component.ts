import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Transaction, TransactionType } from '../../../../models';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import {ProgressBarModule} from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TransactionsService } from '../../transactions.service';
import { DialogModule } from 'primeng/dialog';
import { SelectSpenderComponent } from '../../../../components/select-spender/select-spender.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TransactionsListService } from '../transactions-list.service';
import { ButtonComponent } from "../../../../components/button/button.component";

type Action = 'add-categories' | 'edit-title' | 'delete'| 'delete-categories' | 'update-spender' | null;

@Component({
  selector: 'app-transactions-actions',
  imports: [DialogModule, MenuModule, ButtonModule, SelectSpenderComponent, ProgressBarModule, InputTextModule, FormsModule, ButtonComponent],
  templateUrl: './transactions-actions.component.html',
  styleUrl: './transactions-actions.component.css'
})
export class TransactionsActionsComponent implements OnInit {
  service = inject(TransactionsListService);
  transacionService = inject(TransactionsService);
  items: MenuItem[] | undefined;
  actionType = signal<Action>(null)
  dialogVisible = signal(false);
  dialogTitle = signal('');
  transactionType = signal<TransactionType>('expense');
  actionFinished = output<boolean>();
  progress = signal(0);

  numberTransactionTypes = computed(() => {
    let expense = 0;
    let income = 0;
    this.service.selectedTransactions().forEach(item => {
      if(item.amount > 0){
        income ++;
      }else{
        expense ++;
      }
    })

    if(expense > 0 && income > 0){
      return 2;
    }
    return 1;
  })

  //add-categories
  selectedCategory = signal<number>(0);
  savingCategories = signal(false);

  deletingTransactions = signal(false);
  deletingCategories = signal(false);

  updatingSpender = signal(false);
  spenderId = signal<number | null>(null);

  transactionTitle = signal('');
  updatingTransactionTitle = signal(false);

  ngOnInit() {
    this.items = [
      {
        label: 'Adicionar Categorias',
        icon: 'pi pi-tag',
        command: () => this.addCategories()
      },
      {
        label: 'Editar Descrição',
        icon: 'pi pi-pencil',
        command: () => this.editTitle()
      },
      {
        label: 'Atualizar responsável',
        icon: 'pi pi-user',
        command: () => this.updateSpender()
      },
      {
        label: 'Excluir Categorias',
        icon: 'pi pi-trash',
        command: () => this.deleteCategories()
      },
      {
        label: 'Excluir Transações',
        icon: 'pi pi-trash',
        command: () => this.deleteTransactions()
        
      }
    ];
  }

  deleteTransactions(){
    this.actionType.set('delete');
    this.dialogTitle.set('Deletar Transações');
    this.dialogVisible.set(true);
  }

  deleteCategories(){
    this.actionType.set('delete-categories');
    this.dialogVisible.set(true);
    this.dialogTitle.set('Excluir categorias');
  }

  updateSpender(){
    this.actionType.set('update-spender');
    this.dialogVisible.set(true);
    this.dialogTitle.set('Atualizar responsável pela transação')
  }

  editTitle(){
    this.actionType.set('edit-title');
    this.dialogVisible.set(true);
    this.dialogTitle.set('Editar descrição')
  }


  addCategories(){
    this.actionType.set('add-categories');
    if(this.service.selectedTransactions()[0].amount >= 0){
      this.transactionType.set('income');
    }else{
      this.transactionType.set('expense');
    }
    this.dialogVisible.set(true);
    this.dialogTitle.set('Adicionar categorias');
  }

  async onSaveCategories(){
    this.savingCategories.set(true);

    await this.transacionService.addCategoriesToTransactions(this.selectedCategory(), this.service.selectedTransactions())

    this.savingCategories.set(false);
    this.selectedCategory.set(0);
    this.dialogVisible.set(false);
    
  }

  async onDeleteTransactions(){
    this.deletingTransactions.set(true);
    
    await this.transacionService.deleteTransations(this.service.selectedTransactions().map(item => item.id));

    this.deletingTransactions.set(false);
    this.dialogVisible.set(false);
    this.actionFinished.emit(true);
  }




  async onUpdateSpender(spenderId: number) {
    this.updatingSpender.set(true);
    await this.transacionService.updateSpender(this.service.selectedTransactions(), spenderId);
    this.spenderId.set(null);
    this.updatingSpender.set(false);
    this.dialogVisible.set(false);
    
  }

  async onEditTitle(){
    this.updatingTransactionTitle.set(true);
    await this.transacionService.updateTransactionTitle(this.service.selectedTransactions(), this.transactionTitle())
    this.transactionTitle.set('');
    this.updatingTransactionTitle.set(false);
    this.dialogVisible.set(false);
  }

}
