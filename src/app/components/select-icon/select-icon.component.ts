import { Component, input, output, inject } from '@angular/core';
import { CategoriesService } from '../../pages/categories/categories.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
@Component({
  selector: 'app-select-icon',
  imports: [ScrollPanelModule],
  templateUrl: './select-icon.component.html',

})
export class SelectIconComponent {
  service = inject(CategoriesService);
  selected = input<number | null>(91);
  selectedChange = output<number>();
  color = input.required<number>()
}
