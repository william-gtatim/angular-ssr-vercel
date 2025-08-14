import { Component, inject } from '@angular/core';
import { AccountService } from './account.service';
import { PageTemplateComponent } from '../../components/page-template/page-template.component';
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { AccountItemComponent } from './account-item/account-item.component';
import { AccountEditComponent } from "./account-edit/account-edit.component";
import { AccountEditService } from './account-edit/account-edit.service';
import { Account } from '../../models';
import { AccountDeleteComponent } from "./account-delete/account-delete.component";
import { ButtonComponent } from "../../components/button/button.component";
import { ButtonModule } from 'primeng/button';
import { AccountAjustamentService } from './account-ajustament/account-ajustament.service';
import { AccountAjustamentComponent } from "./account-ajustament/account-ajustament.component";
@Component({
  selector: 'app-account',
  imports: [PageTemplateComponent, HeaderBackComponent, AccountItemComponent, AccountEditComponent, AccountDeleteComponent, ButtonComponent, ButtonModule, AccountAjustamentComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  providers: [AccountAjustamentService]
})
export class AccountComponent {
  accountService = inject(AccountService);
  accountEditService = inject(AccountEditService);
  ajustamentService = inject(AccountAjustamentService);

  onEdit(account: Account){
   this.accountEditService.visible.set(true);
   this.accountEditService.account.set(account)
  }

  onAdd(){
    this.accountEditService.account.set(null);
    this.accountEditService.resetData();
    this.accountEditService.visible.set(true);
  }
}
