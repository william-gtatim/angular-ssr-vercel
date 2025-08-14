import { Component, inject, signal } from '@angular/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { AccountAjustamentService } from './account-ajustament.service';
import { Button } from 'primeng/button';
import { InputCurrencyComponent } from '../../../components/input-currency/input-currency.component';


@Component({
  selector: 'app-account-ajustament',
  imports: [DialogComponent, Button, InputCurrencyComponent],
  templateUrl: './account-ajustament.component.html',
  styleUrl: './account-ajustament.component.css'
})
export class AccountAjustamentComponent {
  service = inject(AccountAjustamentService);
  



}
