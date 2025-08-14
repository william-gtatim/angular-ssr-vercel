import { Component, computed, input } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';
@Component({
  selector: 'app-card',
  imports: [NgStyle, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  title = input<string | null>();
  class = input<string>();
  hover = input<boolean>(false);
  padding = input<'small' | 'normal' | 'large'>('normal');


  paddingClass = computed(() => {
    if(this.padding() == 'small'){
      return 'p-4 md:p-5';
    }

    if(this.padding() == 'large'){
      return 'p-5 md:p-10';
    }
    return 'p-4 md:p-6';
  })
}
