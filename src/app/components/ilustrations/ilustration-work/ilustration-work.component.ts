import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ilustration-work',
  imports: [],
  templateUrl: './ilustration-work.component.html',
})
export class IlustrationWorkComponent {
  class = input<string>();
}
