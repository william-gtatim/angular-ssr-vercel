import { Component } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { CardComponent } from "../../components/card/card.component";

@Component({
  selector: 'app-contact',
  imports: [PageTemplateComponent, HeaderBackComponent, CardComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
