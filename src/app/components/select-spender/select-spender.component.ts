import { Component, inject, input, output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-spender',
  imports: [SelectModule, FormsModule],
  templateUrl: './select-spender.component.html',
  styleUrl: './select-spender.component.css'
})
export class SelectSpenderComponent {
  authService = inject(AuthService);
  selectedSpenderId = input<number | null>(null);
  selectedSpenderIdChange = output<number>();
  showLabel = input<boolean>(false);
  dirt = input<boolean>(false)
  disabled = input<boolean>(false);
  placeholder = input<string>()
}
