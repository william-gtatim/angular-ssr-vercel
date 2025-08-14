import { computed, inject, Injectable, signal } from '@angular/core';
import { calculateExpenseIncome } from '../../utils/calculateExpenseIncome';
import { TransactionsService } from './transactions/transactions.service';
import { filterTransactionsByDate } from '../../utils/filterTransactionsByDate';
import { CategoriesService } from './categories/categories.service';
import { isSameMonth } from '../../utils/isSameMonth';
import { convertDateToString } from '../../utils/convertDateToString';
import { getPreviousMonth } from '../../utils/getPreviusMonth';
import { AccountService } from './account/account.service';


@Injectable()


export class ComputedDataService {
  private transactionService = inject(TransactionsService);
  private categoriesService = inject(CategoriesService);
  private accountService = inject(AccountService);

  private date = signal<Date>(new Date());

  public setDate(newDate: Date) {
    this.date.set(newDate);
  }

  public transactions = computed(() => {
    const filteredTransactions = filterTransactionsByDate(this.transactionService.transactions(), this.date(), this.accountService.accounts()).filter(item => item.type !== 'adjustment');
    return filteredTransactions;
  })

  private readonly monthlySummary = computed(() => {
    return calculateExpenseIncome(this.transactions())
  });

  public readonly expense = computed(() => {
    const { expense } = this.monthlySummary();
    return Math.abs(expense);
  });

  public readonly income = computed(() => {
    const { income } = this.monthlySummary();
    return Math.abs(income);
  });

  public readonly balance = computed(() => {
    const { income, expense } = this.monthlySummary();
    return income + expense;
  });

  // Essa função retorna os orçamentos do mês atual por categoria. Busca os dados do mês passado porque o planejamento é feito com base na revisão dos gastos do mês anterior
  public monthCategoryAllocations = computed(() => {
    const date = convertDateToString(this.date());
    return this.categoriesService.categoriesBudget().filter(item => isSameMonth(item.date, getPreviousMonth(date)) && item.amount > 0) .sort((a, b) => b.amount - a.amount)
  })


  // soma do orçamento planejado para esse mês
  public budget = computed(() => {
    return Math.round(this.monthCategoryAllocations().reduce((sun, item) => sun + item.amount, 0))
  })




  // ainda resta do planejamento
}
