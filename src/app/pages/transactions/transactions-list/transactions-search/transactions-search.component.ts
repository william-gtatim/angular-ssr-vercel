import { Component, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TransactionsListService } from '../transactions-list.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-transactions-search',
  imports: [InputText, FormsModule, InputIconModule, IconFieldModule],
  templateUrl: './transactions-search.component.html',
  styleUrl: './transactions-search.component.css'
})
export class TransactionsSearchComponent {
  service = inject(TransactionsListService);
  
}
