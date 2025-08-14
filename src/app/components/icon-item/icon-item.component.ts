import { Component, computed, inject, input, signal } from '@angular/core';
import { CategoriesService } from '../../pages/categories/categories.service';

@Component({
  selector: 'app-icon-item',
  imports: [],
  templateUrl: './icon-item.component.html',
  styleUrl: './icon-item.component.css'
})
export class IconItemComponent {
  service = inject(CategoriesService);
  color_id = input.required<number | null>();
  icon_id = input.required<number | null>();

  size = input<'small' | 'large' | 'normal' | 'extraLarge'>('normal');

  getColor(){
    if(this.color_id()){
      return this.service.getColorCode(this.color_id()!)
    }
    return '#bbbcc0';
  }

  getIcon(){
    if(this.icon_id()){
      return this.service.getIconName(this.icon_id()!)
    }

    return 'category';
  }


  sizes = computed(() => {
    if (this.size() === 'small') {
      return { iconSize: { fontSize: '16px' }, circleSize: { width: '30px', height: '30px' } }
    }
    if (this.size() == 'large') {
      return { iconSize: { fontSize: '26px' }, circleSize: { width: '50px', height: '50px' } }
    }

    if (this.size() === 'extraLarge') {
      return { iconSize: { fontSize: '80px' }, circleSize: { width: '120px', height: '120px' } }
    }

    return { iconSize: { fontSize: '24px' }, circleSize: { width: '40px', height: '40px' } };
  })
}
