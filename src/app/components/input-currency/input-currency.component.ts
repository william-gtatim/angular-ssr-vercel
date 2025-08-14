import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
@Component({
  selector: 'app-input-currency',
  imports: [InputText, FormsModule, NgxMaskDirective],
  templateUrl: './input-currency.component.html',
  styleUrl: './input-currency.component.css'
})
export class InputCurrencyComponent implements OnChanges {
  value = input.required<number | null>();
  valueChange = output<number>();
  class = input<string>();
  inputValue = signal<string | number>('R$ 0,00');
  hasBeenFocused = signal(false);
  placeholder = input<string>();

  ngOnChanges(changes: SimpleChanges): void {
      if(this.value() != null){
        this.inputValue.set(this.value()!)
      }else{
        this.inputValue.set('R$ 0,00');
      }
  }

  onFocus(){
    if(this.value()) return;
    if(this.value() == null && this.hasBeenFocused() == false) {
      this.inputValue.set('');
      this.hasBeenFocused.set(true);
    }
    this.inputValue.set('');
  }

  onChange(event: number){
    this.valueChange.emit(event);
  }
}
