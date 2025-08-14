import { Component, inject, signal } from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import {Menu} from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';


@Component({
  selector: 'app-header',
  imports: [AvatarModule, Menu, ButtonModule, DrawerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{

  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  sidebarVisible = signal(false);
  pageTitle = signal<string>('');

  avatar = signal<string | undefined>(this.authService.currentUser()?.avatar);

  menuItems: MenuItem[] | undefined;

  constructor(){
    //this.pageTitle.set(this.activatedRoute.snapshot.children[0].data['title']);
 
    this.router.events.subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const subscription = route.data.subscribe({
        next: (data) => {
          this.pageTitle.set(data['title']);
        }
      })
    });

    this.menuItems = [
      {
        label: 'Meu perfil',
        icon: 'pi pi-user',
        command: () => {this.onNavigateMyProfyle()}
      },
      {
        label: 'Minha família',
        icon: 'pi pi-users',
        command: () => {this.onNavigateMyFamily()}
      },
      {
        label: 'Minhas categorias',
        icon: 'pi pi-tag',
        command: () => {this.router.navigate(['/user/my-categories'])}
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {this.onSignOut()}
      }
    ];
  }

  onSignOut(){
    this.authService.signOut()
  }
  onNavigateMyProfyle(){
    this.router.navigate(['/user/me'])
  }
  onNavigateMyFamily(){
    this.router.navigate(['/user/family'])
  }
}
