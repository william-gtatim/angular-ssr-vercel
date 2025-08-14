import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router, RouterLink } from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models';
import { LogoComponent } from "../../components/ilustrations/logo/logo.component";

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, InputTextModule, ButtonModule, LogoComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  loadingGoogle = signal(false);
  loadingEmailSenha = signal(false);
  loginError = signal('');

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),

    password: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required]
    }),


  })



  onLoginGoogle(){
    this.loadingGoogle.set(true);
    this.authService.sigInWithGoogle().subscribe({
      next: (response) => {
        //this.loading.set(false);
      }
    })
  }


  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this.loadingEmailSenha.set(true);
      this.authService.sigInWithEmailPassword(email!, password!).subscribe({
        next: (response) => {
          if (response.data.user?.email) {
            const user: User = {
              username: response.data.user?.user_metadata['display_name'],
              email: response.data.user?.email,
              lastName: response.data.user?.user_metadata['lastName']
            }

            this.authService.setCurrentuser(user);
            this.router.navigate(['home']);

          }

          if (response.error) {
            if (response.error.code == "invalid_credentials") {
              this.loginError.set('O email ou a senha estão incorretos');
            } else {
              this.loginError.set(response.error.message);
            }
          }

          this.loadingEmailSenha.set(false);

        }
      });


    }

  }

}
