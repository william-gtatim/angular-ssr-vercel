import { Component,  signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouteConfigLoadStart } from '@angular/router';
import { RouteConfigLoadEnd } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoading = signal(false);
  constructor(private router: Router, private primengConfig: PrimeNG) {
    this.setLocale(this.primengConfig);
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading.set(true); // Início do loadComponent
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading.set(false); // Fim do loadComponent
      }
    });
  }


  setLocale(config: PrimeNG): void {
    this.primengConfig.setTranslation({
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ],
      monthNamesShort: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ],
      today: "Hoje",
      clear: "Limpar",
      dateFormat: "dd/mm/yyyy",
      weekHeader: "Sm",
      firstDayOfWeek: 0
    });

  }
}
