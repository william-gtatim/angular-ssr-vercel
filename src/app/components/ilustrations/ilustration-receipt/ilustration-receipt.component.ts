import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ilustration-receipt',
  imports: [],
  templateUrl: './ilustration-receipt.component.html',
})
export class IlustrationReceiptComponent {
  class = input<string>();
}
