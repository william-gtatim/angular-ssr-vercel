import { Component, inject, input, OnInit } from '@angular/core';
import { CardComponent } from "../../../components/card/card.component";
import { Account } from '../../../models';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AccountEditService } from '../account-edit/account-edit.service';
import { AccountDeleteService } from '../account-delete/account-delete.service';
import { CurrencyPipe } from '@angular/common';
import { AccountAjustamentService } from '../account-ajustament/account-ajustament.service';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-account-item',
  imports: [CardComponent, MenuModule, ButtonModule, CurrencyPipe],
  templateUrl: './account-item.component.html',
  styleUrl: './account-item.component.css'
})

export class AccountItemComponent implements OnInit {
  accountService = inject(AccountService);
  ajustamentService = inject(AccountAjustamentService);
  editService = inject(AccountEditService);
  deleteService = inject(AccountDeleteService);
  account = input.required<Account>();
  balance = input(0)
  items: MenuItem[] | undefined;

  ngOnInit() {
    if(this.account().default){
      this.items = [
        {
          label: 'Editar',
          command: () => { this.onEdit() }
        },
        {
          label: 'Ajustar saldo',
          command: () => {this.onAjustament()}
        }
      ]
    }else{
      this.items = [
        {
          label: 'Editar',
          command: () => { this.onEdit() }
        },
        {
          label: 'Excluir',
          command: () => { this.onDelete() }
        },
        {
          label: 'Ajustar saldo',
          command: () => { this.onAjustament() }
        }
      ]
    }
    
  }

  onEdit(){
    this.editService.account.set(this.account());
    this.editService.visible.set(true);
  }

  getBankUrl(bankId: number){
    return this.accountService.getBankUrl(bankId);
  }

  onDelete(){
    this.deleteService.account.set(this.account());
    this.deleteService.visible.set(true);
  }

  onAjustament(){
    this.ajustamentService.account.set(this.account());
    this.ajustamentService.balance.set(this.balance());
    this.ajustamentService.visible.set(true);
  }

}
