import { inject, Injectable, signal, computed, OnInit, effect } from '@angular/core';
import { TransactionsService } from '../../../pages/transactions/transactions.service';
import { SortOptions, Transaction, TransactionsFilters, TransactionType } from '../../../models';
import { CategoriesService } from '../../categories/categories.service'
import { DatesOptions } from '../../../models';
import { getLast30DaysRange } from '../../../../utils/getLast30DaysRange';
type Criterion = {
  creterion: SortOptions,
  mode: 'asc' | 'desc'
}

@Injectable({
  providedIn: 'root'
})

export class TransactionsListService {
  private transactionService = inject(TransactionsService);
  private categoriesService = inject(CategoriesService);

  // Controle das transações selecionadas
  selectedTransactions = signal<Transaction[]>([])

  // Controle de UI
  filtersVisible = signal(false);
  sortVisible = signal(false);

  // Filtros
  inputSearch = signal<string>('');

  rangeDate = signal<Date[]>(getLast30DaysRange());
  category = signal<number | null>(null);
  maxAmount = signal<number | null>(null);
  minAmount = signal<number | null>(null);
  account = signal<number | null>(null);
  user = signal<number | null>(null);
  type = signal<TransactionType | null>(null);
  workRelated = signal<boolean | null>(null);
  

  // Ordenação
  selectedCriterion = signal<Criterion | null>(null);


  constructor(){
   
  }


  // Operações com os dados
  searchTransactions = computed(() => {
    const search = this.inputSearch().trim().toLowerCase();
    const results = this.transactionService.getTransactions();

    if (!search) {
      return results;
    }

    return results.filter(t =>
      t.title?.toLowerCase().includes(search)
    );
  });

  filteredTransactions = computed(() => {
    let results = this.searchTransactions();

    // 1. FILTRA POR CATEGORIAS
    if (this.category() != null) {
      results = results.filter(t => {
        if (t.category) {
          return this.category() == t.category
        }
        return false;
      }
      );
    }

    // 2. FILTRA POR VALOR MÍNIMO
    if (this.minAmount() !== null && this.minAmount() !== undefined) {
      results = results.filter(t => t.amount >= this.minAmount()!);
    }

    // 3. FILTRA POR VALOR MÁXIMO
    if (this.maxAmount() !== null && this.maxAmount() !== undefined) {
      results = results.filter(t => t.amount <= this.maxAmount()!);
    }

    // 4. FILTRA POR INTERVALO DE DATAS
    if (this.rangeDate() && (this.rangeDate()[0] || this.rangeDate()[1])) {
      const [startDateRaw, endDateRaw] = this.rangeDate();

      const startDate = startDateRaw
        ? new Date(startDateRaw)
        : null;

      const endDate = endDateRaw
        ? new Date(endDateRaw)
        : null;

      results = results.filter(t => {
        const transactionDate = new Date(t.date + 'T00:00:00');

        if (startDate && transactionDate < startDate) return false;
        if (endDate && transactionDate > endDate) return false;

        return true;
      });
        
    }
    

    // 5. FILTRAR POR CONTA
    if (this.account()) {
      results = results.filter(item => item.account == this.account());
    }

    // 6 FILTRAR POR USUÁRIO QUE GASTOU
    if (this.user()) {
      
      results = results = results.filter(item => item.spender === this.user());
    }

    // 7 FILTRAR PELO TIPO DE TRANSAÇÃO - transferência | receita | despesa | adjustment
    if(this.type()){
      console.log(this.type())
      results = results.filter(item => item.type == this.type());
    }

    // 8 EXIBE APENAS DESPESAS COM O TRABALHO
    if(this.workRelated()){
      results = results.filter(item => item.work === true);
    }

    return results;
  });

  orderedTransactions = computed(() => {
    const results = this.filteredTransactions();
    const criterion = this.selectedCriterion();

    if (criterion !== null) {
      if (criterion.creterion == 'amount') {
        if (criterion.mode == 'asc') {
          results.sort((a: Transaction, b: Transaction) => a.amount - b.amount)
        } else {
          results.sort((a: Transaction, b: Transaction) => b.amount - a.amount)
        }
      } else if (criterion.creterion == 'category') {
        if (criterion.mode == 'asc') {
          results.sort((a: Transaction, b: Transaction) => this.categoriesService.getNameCategorie(a.category).localeCompare(this.categoriesService.getNameCategorie(b.category)))
        } else {
          results.sort((a: Transaction, b: Transaction) => this.categoriesService.getNameCategorie(b.category).localeCompare(this.categoriesService.getNameCategorie(a.category)))
        }
      } else if (criterion.creterion == 'date') {
        if (criterion.mode == 'asc') {
          results.sort((a: Transaction, b: Transaction) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else {
          results.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }
      } else if (criterion.creterion == 'title') {
        if (criterion.mode == 'asc') {
          results.sort((a: Transaction, b: Transaction) => a.title.localeCompare(b.title))
        } else {
          results.sort((a: Transaction, b: Transaction) => b.title.localeCompare(a.title))
        }
      } else if (criterion.creterion == 'id') {
        if (criterion.mode == 'asc') {
          results.sort((a: Transaction, b: Transaction) => a.id - b.id)
        } else {
          results.sort((a: Transaction, b: Transaction) => b.id - a.id)
        }
      }

    }

    return results;

  })
}
