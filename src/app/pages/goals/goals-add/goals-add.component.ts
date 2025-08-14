import { Component, computed, inject, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { InputText } from 'primeng/inputtext';
import { InputCurrencyComponent } from '../../../components/input-currency/input-currency.component';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { SelectColorComponent } from "../../../components/select-color/select-color.component";
import { SelectIconComponent } from "../../../components/select-icon/select-icon.component";
import { GoalsService } from '../goals.service';
import { convertDateToString } from '../../../../utils/convertDateToString';
import { Goal } from '../../../models';
import { convertStringToDate } from '../../../../utils/convertStringToDate';
import { getIsSmallScreen } from '../../../../utils/getIsSmallScreen';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-goals-add',
  imports: [DialogComponent, InputText, InputCurrencyComponent, DatePicker, FormsModule, IconField, InputIcon, ButtonModule, SelectColorComponent, SelectIconComponent, NgClass],
  templateUrl: './goals-add.component.html',
  styleUrl: './goals-add.component.css'
})
export class GoalsAddComponent implements OnChanges {
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  saving = signal(false);
  service = inject(GoalsService);
  goal = input<Goal | null>(null);
  today = new Date();
  isSmallScreen = signal(false);

  // goal properties
  name = signal<string | null>(null);
  cost = signal<number | null>(null);
  term = signal<Date | null >(null);
  image = signal<number | null>(null);


  formInvalid = computed(() => {
    if(!this.name()) return true;
    if (!this.cost()) return true;
    if (!this.term()) return true;
    if (!this.image()) return true;
    return false;
  })

  constructor(){
    this.isSmallScreen.set(getIsSmallScreen())
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(this.goal()){
        this.name.set(this.goal()?.name!);
        this.cost.set(this.goal()?.cost!);
        this.term.set(new Date(this.goal()?.term + 'T00:00:00'));
        this.image.set(this.goal()?.image!);

      }else{
        this.resetFormData()
      }
  }

  resetFormData(): void {
    this.name.set(null);
    this.cost.set(null);
    this.term.set(null);
    this.image.set(null);
  }

  async onSave(){
    if(this.formInvalid()) return;
    this.saving.set(true);
    if(this.goal()){
      await this.update()
    }else{
      await this.save();
    }
    this.saving.set(false);
    this.visibleChange.emit(false);
    this.resetFormData();
  }

 async save(){
   await this.service.saveGoal(this.name()!, this.cost()!, convertDateToString(this.term()!), this.image()!);
 }

 async update(){
   await this.service.updateGoal({ id: this.goal()?.id!, name: this.name()!, cost: this.cost()!, image: this.image()!, term: convertDateToString(this.term()!), status: this.goal()?.status!})
 }
}
