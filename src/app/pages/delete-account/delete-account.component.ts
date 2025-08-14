import { Component } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { CardComponent } from '../../components/card/card.component';
@Component({
  selector: 'app-delete-account',
  imports: [PageTemplateComponent, HeaderBackComponent, CardComponent],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {

}
