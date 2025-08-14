import { Component, computed, inject, input } from '@angular/core';
import { CardComponent } from "../../../components/card/card.component";
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-resource-item',
  imports: [CardComponent, NgClass],
  templateUrl: './resource-item.component.html',
  styleUrl: './resource-item.component.css'
})
export class ResourceItemComponent {
  router = inject(Router)
  title = input.required<string>();
  description = input.required<string>();
  route = input.required<string>();
  icon = input.required<string>();

  classIcon = computed(() => {
    return 'pi text-primary text-lg mb-2 ' + this.icon();
  })
}
