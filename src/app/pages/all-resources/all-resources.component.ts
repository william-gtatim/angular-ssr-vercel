import { Component } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { ResourceItemComponent } from "./resource-item/resource-item.component";

@Component({
  selector: 'app-all-resources',
  imports: [PageTemplateComponent, ResourceItemComponent],
  templateUrl: './all-resources.component.html',
  styleUrl: './all-resources.component.css'
})
export class AllResourcesComponent {

}
