import { Component, input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
@Component({
  selector: 'app-info',
  imports: [Tooltip],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  text = input.required<string>();
  position = input<string>('top')
}
