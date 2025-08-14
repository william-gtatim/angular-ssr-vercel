import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-me',
  imports: [ButtonModule, InputText, FormsModule],
  templateUrl: './me.component.html',
  styleUrl: './me.component.css'
})
export class MeComponent {
  authService = inject(AuthService);
  userName = signal(this.authService.userName() ?? '');
  avatar = signal(this.authService.userAvatar() ?? '');
  savingName = signal(false);



  async onUpdateUserInfo() {

    this.savingName.set(true);
    const userId = this.authService.userId();
    await this.authService.updateUserInfo(this.userName());
    this.savingName.set(false);
  }
}
