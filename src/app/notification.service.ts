import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type Toast = {
  summary: string,
  detail: string,
  life: number,
  sticky: boolean,
  severity: string
}

type Message = {
  summary: string,
  detail?: string,
  life?: number,
  sticky?: boolean,
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  constructor(private messageService: MessageService) { }

  private showToast(data: Message, severity: string) {
    let message: Toast = {
      summary: data.summary,
      detail: data.detail ?? '',
      life: data.life ?? 2000,
      sticky: data.sticky ?? false,
      severity: severity
    }
    this.messageService.add(message);
  }

  public showInfo(data: Message) {
    this.showToast(data, 'info');
  }


  public showError(data: Message) {
    this.showToast(data, 'error');
  }

  public showDatabaseError(error: any, operation: 'salvar' | 'carregar os dados' | 'deletar' | 'atualizar'){
    this.showToast({summary: 'Ocorreu um error ao ' + operation + '. Experimente verificar a conexão com a internet ou recarregar a página', detail: error.message, sticky: true}, 'error');
  }

  
}
