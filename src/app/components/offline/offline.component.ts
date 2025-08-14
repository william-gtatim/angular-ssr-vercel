import { Component, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [CommonModule, Dialog],
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.css'
})
export class OfflineComponent implements OnDestroy {
  isOffline = signal(!navigator.onLine);

  constructor() {
    // Verifica o status inicial
    this.checkOnlineStatus();

    // Adiciona listeners para os eventos de online/offline
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    // Opcional: verificar periodicamente (útil para detectar mudanças que os eventos podem perder)
    this.setupPeriodicCheck();
  }

  private updateOnlineStatus = () => {
    this.isOffline.set(!navigator.onLine);
  };

  private checkOnlineStatus() {
    // Verificação mais robusta pode ser adicionada aqui se necessário
    this.isOffline.set(!navigator.onLine);
  }

  private intervalId: any;
  private setupPeriodicCheck() {
    // Verifica a cada 30 segundos (ajuste conforme necessário)
    this.intervalId = setInterval(() => {
      this.checkOnlineStatus();
    }, 30000);
  }

  ngOnDestroy() {
    // Limpa os listeners e o intervalo quando o componente é destruído
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}