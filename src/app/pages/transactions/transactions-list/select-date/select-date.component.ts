import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { DatesOptions } from '../../../../models';
import { ScrollPanel } from 'primeng/scrollpanel';
import { NgClass } from '@angular/common';
type Option = {
  label: string,
  value: DatesOptions
}
@Component({
  selector: 'app-select-date',
  imports: [ScrollPanel, NgClass],
  templateUrl: './select-date.component.html',
  styleUrl: './select-date.component.css'
})

export class SelectDateComponent implements OnChanges {
  selected = input<Date[]>([]);
  selectedChange = output<Date[]>();
  selectPersonalized = output<boolean>();

  options = signal<Option[]>([
    { label: '30 dias', value: 'last-30-days' },
    { label: 'Mês', value: 'month' },
    { label: 'Dia', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Personalizado', value: 'personalized' }
  ]);

  selectedDate = signal<DatesOptions>('last-30-days');

  ngOnChanges(changes: SimpleChanges): void {
    const [start, end] = this.selected();


    const now = new Date();


    const isThisMonthRange =
      start.getDate() === 1 &&
      start.getMonth() === now.getMonth() &&
      start.getFullYear() === now.getFullYear() &&
      end.getDate() === now.getDate() &&
      end.getMonth() === now.getMonth() &&
      end.getFullYear() === now.getFullYear();

    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      this.selectedDate.set('day');
    } else if (diffDays === 6) {
      this.selectedDate.set('week');
    } else if (isThisMonthRange) {
      this.selectedDate.set('month');
    } else if (diffDays === 29) {
      this.selectedDate.set('last-30-days');
    } else {
      this.selectedDate.set('personalized');
    }
  }

  onSelect(value: DatesOptions) {
    this.selectedDate.set(value);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start: Date;
    let end: Date;

    switch (value) {
      case 'day':
        start = new Date(today);
        end = new Date(today);
        break;

      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = new Date(today);
        break;

      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;

      case 'last-30-days':
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = new Date(today);
        break;

      case 'personalized':
        this.selectPersonalized.emit(true);
        return;
    }

    this.selectedChange.emit([start, end]);
  }









  
}