import { Component, inject, signal, effect } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { CardComponent } from "../../components/card/card.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  imports: [PageTemplateComponent, InputText, HeaderBackComponent, ButtonModule, FormsModule, CardComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  authService = inject(AuthService);
  userName = signal(this.authService.userName() ?? '');
  avatar = signal(this.authService.userAvatar() ?? '');
  savingName = signal(false);
  router = inject(Router);


  async onUpdateUserInfo() {

    this.savingName.set(true);
    await this.authService.updateUserInfo(this.userName());
    console.log(this.userName());
    this.savingName.set(false);
  }

}
