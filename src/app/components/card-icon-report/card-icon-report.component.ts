import { Component, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CardComponent } from "../card/card.component";
import { NgStyle} from '@angular/common';
import { InfoComponent } from '../info/info.component';
@Component({
  selector: 'app-card-icon-report',
  imports: [CurrencyPipe, CardComponent, NgStyle, InfoComponent],
  templateUrl: './card-icon-report.component.html',
  styleUrl: './card-icon-report.component.css'
})
export class CardIconReportComponent {
  title = input.required<string>();
  amount = input.required<number>();
  backgroundColor = input('#E7F8F2');
  explanation = input<null | string>();

}
