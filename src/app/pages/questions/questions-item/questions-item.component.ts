import { Component, effect, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { Question } from '../../../models';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-questions-item',
  imports: [RadioButton, FormsModule],
  templateUrl: './questions-item.component.html',
  styleUrl: './questions-item.component.css'
})
export class QuestionsItemComponent  {
  question = input<Question>();
  selected = signal<number | null>(null);
  selectedChange = output<number>();


  options: any[] = [
    { name: 'Discordo totalmente', key: 'D1', value: 1 },
    { name: 'Discordo', key: 'D2', value: 2 },
    { name: 'Nem concordo nem discordo', key: 'N', value: 3 },
    { name: 'Concordo', key: 'C1', value: 4 },
    { name: 'Concordo totalmente', key: 'C2', value: 5 }
  ];

  constructor(){
    
    effect(() => {
      if(this.selected()){
        this.onSelect();
      }
    })
  }


  onSelect(){
    this.selectedChange.emit(this.selected()!);
  }
}
