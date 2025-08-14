import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ilustration-goals',
  imports: [],
  templateUrl: './ilustration-goals.component.html',
})
export class IlustrationGoalsComponent {
  class = input<string>();
}
