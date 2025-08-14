import { Component, inject, input, computed } from '@angular/core';
import { CategoriesService } from '../../pages/categories/categories.service';

@Component({
  selector: 'app-category-icon',
  imports: [],
  templateUrl: './category-icon.component.html',
  styleUrl: './category-icon.component.css'
})
export class CategoryIconComponent {
  service = inject(CategoriesService);

  categoryId = input.required<number>();
  size = input<'small' | 'large' | 'normal' | 'extraLarge'>('normal');



  sizes = computed(() => {
    if (this.size() === 'small') {
      return { iconSize: { fontSize: '16px' }, circleSize: { width: '30px', height: '30px' } }
    }
    if (this.size() == 'large') {
      return { iconSize: { fontSize: '26px' }, circleSize: { width: '50px', height: '50px' } }
    }

    if(this.size() === 'extraLarge'){
      return {iconSize: {fontSize: '100px'}, circleSize: {width: '150px', height: '150px'}}
    }

    return { iconSize: { fontSize: '24px' }, circleSize: { width: '40px', height: '40px' } };
  })
}
