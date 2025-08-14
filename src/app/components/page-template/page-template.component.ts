import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProgressBar } from 'primeng/progressbar';
@Component({
  selector: 'app-page-template',
  imports: [NgClass, SidebarComponent, ProgressBar],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.css'
})
export class PageTemplateComponent {
  headerFixed = input<boolean>(false);
  showSidebar = input<boolean>(true);
  pageTitle = input<string>();
  showHeader = input(true);
}
