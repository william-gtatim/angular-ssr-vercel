import { Component, inject } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { AuthService } from '../../../auth.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-avatar',
  imports: [Avatar, MenuModule],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Meu perfil',
        icon: 'pi pi-user',
        command: () => { 
          this.router.navigate(['/user'])
         }
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => { 
          this.authService.signOut()
         }
      }
    ]

  }


  

}
