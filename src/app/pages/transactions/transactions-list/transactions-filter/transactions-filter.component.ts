import { Component, input, OnChanges, output, signal, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';
import { SelectAccountComponent } from "../../../../components/select-account/select-account.component";
import { AccountService } from '../../../account/account.service';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TransactionsListService } from '../transactions-list.service';
import { getLast30DaysRange } from '../../../../../utils/getLast30DaysRange';

import { transactionTypes } from '../../../../models';
import { SelectModule } from 'primeng/select';
import { SelectSpenderComponent } from "../../../../components/select-spender/select-spender.component";
import { CheckboxModule } from 'primeng/checkbox';
import { SelectCategoryComponent } from "../../../../components/select-category/select-category.component";
@Component({
  selector: 'app-transactions-filter',
  imports: [ButtonModule, DrawerModule, DialogModule, FormsModule, DatePickerModule, InputNumberModule, SliderModule, TooltipModule, SelectAccountComponent, IconFieldModule, InputIconModule, SelectModule, SelectSpenderComponent, CheckboxModule, SelectCategoryComponent],
  templateUrl: './transactions-filter.component.html',
  styleUrl: './transactions-filter.component.css'
})
export class TransactionsFilterComponent  {
  accountService = inject(AccountService);
  service = inject(TransactionsListService);

  transactionTypes = [
    {
      label: 'Despesa',
      value: 'expense'
    },
    {
      label: 'Receita',
      value: 'income'
    },
    {
      label: 'Transferência',
      value: 'transfer'
    },
    {
      label: 'Ajuste de saldo',
      value: 'adjustment'
    }
  ];

  onClearFilters() {
    this.service.category.set(null)
    this.service.maxAmount.set(null)
    this.service.minAmount.set(null)
    this.service.rangeDate.set(getLast30DaysRange())
    this.service.account.set(null)
    this.service.user.set(null);
    this.service.type.set(null);
  }

  onCompleteSelectFilters(){
    this.service.filtersVisible.set(false);
  }


}
