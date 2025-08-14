import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar-item',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItemComponent {
  router = inject(Router);
  icon = input.required<string>();
  title = input.required<string>();
  route = input.required<string>();
  materialIcon = input<string>();
  
  isActive = computed(() => {
    return this.router.url === this.route();
  });

  activeClass = computed(() =>{
    let textColor = '';
    if(this.isActive()){
      textColor = 'text-color';
    }

    return { icon: `pi ${this.icon()} ${textColor}`, title: textColor }
  })

}
