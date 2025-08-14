import { Component, input } from '@angular/core';

@Component({
  selector: 'app-forms-error-message',
  imports: [],
  templateUrl: './forms-error-message.component.html',
  styleUrl: './forms-error-message.component.css'
})
export class FormsErrorMessageComponent {
  hasError = input.required<boolean>();
  message = input.required<string>();
}
