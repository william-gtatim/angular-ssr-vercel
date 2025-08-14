import { Component, inject } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { PageHeaderComponent } from "../../components/shared/page-header/page-header.component";
import { CardComponent } from "../../components/card/card.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  imports: [PageTemplateComponent, PageHeaderComponent, CardComponent, HeaderBackComponent],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {
  router = inject(Router)
}
