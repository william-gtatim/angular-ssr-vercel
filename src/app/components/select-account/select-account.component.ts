import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Account } from '../../models';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AccountService } from '../../pages/account/account.service';
@Component({
  selector: 'app-select-account',
  imports: [SelectModule, FormsModule, ButtonModule],
  templateUrl: './select-account.component.html',
  styleUrl: './select-account.component.css'
})
export class SelectAccountComponent {
  service = inject(AccountService)
  options = input.required<Account[]>();
  selected = input.required<number | null>();
  selectedChange = output<number>();
  label = input<boolean>(false);
  labelText = input<string>('Conta');
  placeholder = input<string>('Selecione uma conta');

}
