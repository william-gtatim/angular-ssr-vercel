import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { QuestionsService } from '../questions.service';
import { TransactionsService } from '../../transactions/transactions.service';
@Component({
  selector: 'app-questions-invitation',
  imports: [Button],
  templateUrl: './questions-invitation.component.html',
  styleUrl: './questions-invitation.component.css'
})
export class QuestionsInvitationComponent {
transactionsService = inject(TransactionsService);
router = inject(Router);
service = inject(QuestionsService);
showInvitation1 = computed(() => {
  if(this.service.responseTime() == 0) return true;
  return false;
})

showInvitation2 = computed(() => {
  if(this.service.responseTime() == 1 && this.service.monthsPassed()) return true;
  return false;
})
}
