import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { AccountEditService } from './account-edit.service';
import { InputCurrencyComponent } from "../../../components/input-currency/input-currency.component";
import { ButtonModule } from 'primeng/button';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { SelectButton } from 'primeng/selectbutton';
import { SelectBanckLogoComponent } from "../../../components/select-banck-logo/select-banck-logo.component";
import { Select } from 'primeng/select';

@Component({
  selector: 'app-account-edit',
  imports: [FormsModule, ButtonModule, InputText, DialogComponent, SelectButton, SelectBanckLogoComponent, Select],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css'
})

export class AccountEditComponent {
  service = inject(AccountEditService);
  options = [
    {value: 'debt', label: 'Débito'},
    {value: 'credit', label: 'Crédito'}
  ]

  days = signal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])


  onSave() {
    if (this.service.account()) {
      this.service.onUpdate();
    } else {
      this.service.onSave();
    }
  }
}
