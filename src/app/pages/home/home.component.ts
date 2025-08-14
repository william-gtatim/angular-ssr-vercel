import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { LastTransactionsComponent } from './last-transactions/last-transactions.component';
import { TransactionAddButtonComponent } from '../transactions/transaction-add-button/transaction-add-button.component';
import { TransactionFormComponent } from "../transactions/transaction-form/transaction-form.component";
import { PageTemplateComponent } from "../../components/page-template/page-template.component";

import { MonthPlanningComponent } from "./month-planning/month-planning.component";
import { ExpenseIncomeCardComponent } from "../reports/expense-income-card/expense-income-card.component";

import { ComputedDataService } from '../computed-data.service';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { UserAvatarComponent } from "./user-avatar/user-avatar.component";
import { QuestionsInvitationComponent } from "../questions/questions-invitation/questions-invitation.component";
import { SelectBanckLogoComponent } from "../../components/select-banck-logo/select-banck-logo.component";

@Component({
    selector: 'app-home',
    imports: [LastTransactionsComponent, TransactionAddButtonComponent, TransactionFormComponent, PageTemplateComponent, MonthPlanningComponent, ExpenseIncomeCardComponent, AccountBalanceComponent, UserAvatarComponent, QuestionsInvitationComponent, SelectBanckLogoComponent],
    providers: [ComputedDataService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  service = inject(ComputedDataService);
  authService = inject(AuthService);
  expenseTransactions = computed(() => {
    return this.service.transactions().filter(item => item.type === 'expense')
  })


  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

}
