import { Component, inject, input, output, signal } from '@angular/core';
import { CategoriesService } from '../../pages/categories/categories.service';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
  selector: 'app-select-color',
  imports: [ScrollPanel],
  templateUrl: './select-color.component.html',
  styleUrl: './select-color.component.css'
})
export class SelectColorComponent {
  service = inject(CategoriesService);
  selected = input<number>(41);
  selectedChange = output<number>();
}
