import { Component, inject } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { AccountService } from '../../account/account.service';
import { CurrencyPipe } from '@angular/common';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-account-balance',
  imports: [CardComponent, CurrencyPipe, NgClass],
  templateUrl: './account-balance.component.html',
  styleUrl: './account-balance.component.css'
})
export class AccountBalanceComponent {
  service = inject(AccountService);
}
