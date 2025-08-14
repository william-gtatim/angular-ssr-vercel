import { Component, inject, signal, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccountDeleteService } from './account-delete.service';
import { MessageModule } from 'primeng/message';
import { DialogComponent } from "../../../components/dialog/dialog.component";

@Component({
  selector: 'app-account-delete',
  imports: [ButtonModule, MessageModule, DialogComponent],
  templateUrl: './account-delete.component.html',
  styleUrl: './account-delete.component.css'
})

export class AccountDeleteComponent {
  service = inject(AccountDeleteService);

  canDelete = computed(() => {
    if (this.service.numberTransactions() > 0) return false;

    if (this.service.numberTransfers() > 0) return false;

    return true;
  })
}
