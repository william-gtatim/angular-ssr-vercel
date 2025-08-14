import { Component, inject, input, output } from '@angular/core';
import { AccountService } from '../../pages/account/account.service';
import { ScrollPanel } from 'primeng/scrollpanel';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-select-banck-logo',
  imports: [ScrollPanel, NgClass],
  templateUrl: './select-banck-logo.component.html',
  styleUrl: './select-banck-logo.component.css'
})
export class SelectBanckLogoComponent {
  service = inject(AccountService);
  selected = input<number | null>(null);
  selectedChange = output<number>();
}
