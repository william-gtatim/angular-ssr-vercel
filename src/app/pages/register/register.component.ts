import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Button } from 'primeng/button';
import {  RouterLink } from '@angular/router';
import { LogoComponent } from "../../components/ilustrations/logo/logo.component";

@Component({
  selector: 'app-register',
  imports: [Button, RouterLink, LogoComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  loadingGoogle = signal(false);

  onLoginGoogle() {
    this.loadingGoogle.set(true);
    this.authService.sigInWithGoogle().subscribe({
      next: (response) => {
        //this.loading.set(false);
      }
    })
  }

}
