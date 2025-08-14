import { Component, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-back',
  imports: [ButtonModule, ButtonModule],
  templateUrl: './header-back.component.html',
  styleUrl: './header-back.component.css'
})
export class HeaderBackComponent {
  router = inject(Router)
  path = input<string | null>(null);
  title = input<string>('Voltar');
  location = inject(Location);

  onNavigate(){
    if(this.path()){
      this.router.navigate([this.path()!])
    }else{
      this.location.back();
    }
  }
}
