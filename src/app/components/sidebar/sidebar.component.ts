import { Component } from '@angular/core';
import { SidebarItemComponent } from "./sidebar-item/sidebar-item.component";
import { LogoComponent } from "../ilustrations/logo/logo.component";

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItemComponent, LogoComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  
}
