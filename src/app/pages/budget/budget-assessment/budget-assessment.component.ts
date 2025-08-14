import { Component, input, signal, output, computed, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TransactionsService } from '../../transactions/transactions.service';
import { CategoriesService } from '../../categories/categories.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { AuthService } from '../../../auth.service';
import { WorkingHourService } from '../../../pages/working-hour/working-hour.service';
import { TransactionAddService } from '../../transactions/transaction-add-button/transaction-add.service';
import { convertDayToYearMonth } from '../../../../utils/convertDayToYearMonth';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { InputCurrencyComponent } from "../../../components/input-currency/input-currency.component";
import { IconItemComponent } from "../../../components/icon-item/icon-item.component";
import { AccountService } from '../../account/account.service';
import { filterTransactionsByDate } from '../../../../utils/filterTransactionsByDate';
@Component({
  selector: 'app-budget-assessment',
  imports: [FormsModule, DialogModule, CurrencyPipe, DatePipe, ButtonModule, SliderModule, SelectButtonModule, DialogComponent, InputCurrencyComponent, IconItemComponent],
  templateUrl: './budget-assessment.component.html',
  styleUrl: './budget-assessment.component.css'
})
export class BudgetAssessmentComponent implements OnChanges {
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  workingHourService = inject(WorkingHourService);
  categoriesService = inject(CategoriesService);
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  transactionAddService = inject(TransactionAddService);
  accountsService = inject(AccountService);
  
  valueBudget = signal(0.0);

  selectedCategory = input.required<number>();
  category = computed(() => {
    return this.categoriesService.getCategory(this.selectedCategory());
  })
  selectedDate = input.required<Date>();
  selectedDateString = computed(() => convertDayToYearMonth(this.selectedDate()));

  selectedAssessmentMode = signal<null| string>(null);
  categoryTitle = computed(() => {
    return this.categoriesService.getName(this.selectedCategory());
  })

  totalSpend = computed(() => {
    return this.categoryTransactions().reduce((sum, iten) => sum + iten.amount, 0);
  })

  
  transactionsMonth = computed(() => {

    return filterTransactionsByDate(this.transactionService.transactions(), this.selectedDate(), this.accountsService.accounts());
    const selectedMonth = String(this.selectedDate().getMonth() + 1).padStart(2, '0');
    const selectedYear = this.selectedDate().getFullYear().toString();

    return this.transactionService.transactions().filter(item => {
      return item.date.slice(0, 4) == selectedYear && item.date.slice(5, 7) == selectedMonth;
    });
  })

  timeExpended = computed( () => {
    const workingHour = this.workingHourService.getWorkingHour(this.selectedDateString())
    if(workingHour){
      return Math.round(this.totalSpend() / workingHour);
    }

    return 0;
  })

  categoryTransactions = computed(() => {
    return this.transactionsMonth().filter(transaction => transaction.category == this.selectedCategory())
      .map(transacion => ({ ...transacion, amount: Math.abs(transacion.amount) }));
  });

  maxValueBudget = signal(0);

  showSlider = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    const budget = this.categoriesService.getCategoryBudget(this.selectedCategory(), convertDayToYearMonth(this.selectedDate()))
    if(budget()){
      this.valueBudget.set(budget()!);
      if(this.totalSpend() == budget()){
        this.selectedAssessmentMode.set('O mesmo valor');
        this.showSlider.set(false);
      }else{
        this.showSlider.set(true);
        this.selectedAssessmentMode.set('Alterar o valor');
      }
    }else{
      this.showSlider.set(false);
      this.selectedAssessmentMode.set(null);
      this.valueBudget.set(this.totalSpend());
    }

    if(this.totalSpend() < 500){
      this.maxValueBudget.set(500);
    }else{
      this.maxValueBudget.set(this.totalSpend() * 3);
    }
    
  }

  private saveTimeout: any;

  onChangeSlider(){
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.onSaveData(), 1000);
  }

  async onSaveData(){
    console.log(convertDayToYearMonth(this.selectedDate()));
    const {data, error } = await this.authService.supabase
    .from('budget')
    .upsert({
      category: this.selectedCategory(), 
      user_id: this.authService.userId(), 
      amount: this.valueBudget(), 
      date: convertDayToYearMonth(this.selectedDate()) 
    }, { onConflict: 'date, user_id, category' })
    .select('date, id, amount, category')
    .single()


    if(error){
      console.log(error);
    }

    if(data){
      this.categoriesService.updateCategoryBudget(data);
    }
  }

  onEditInput(value: number){
    if(this.maxValueBudget() < this.valueBudget()){
      this.maxValueBudget.set(value);
    } 
    this.onChangeSlider();
  }

  onSelectAssesmentMode(event: string){
    if(event == 'O mesmo valor'){
      this.valueBudget.set(this.totalSpend());
      this.showSlider.set(false);
      this.onSaveData();
    }else{
      this.showSlider.set(true);
    }
  }


  onEditTransaction(id: number) {
    this.transactionAddService.transactionId.set(id);
    this.transactionAddService.visible.set(true);
  }



}
