import { Component, signal, inject, input, output, computed, OnChanges, SimpleChanges } from '@angular/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectSpenderComponent } from "../../../components/select-spender/select-spender.component";
import { WorkingHourService } from '../working-hour.service';
import { FormsModule } from '@angular/forms';
import { FormsErrorMessageComponent } from "../../../components/forms-error-message/forms-error-message.component";
import { WorkingTime } from '../../../models';
@Component({
  selector: 'app-working-hour-edit',
  imports: [DialogComponent, ButtonModule, InputNumber, SelectSpenderComponent, FormsModule, FormsErrorMessageComponent],
  templateUrl: './working-hour-edit.component.html',
  styleUrl: './working-hour-edit.component.css'
})
export class WorkingHourEditComponent implements OnChanges {
  workingTimeItemToEdit = input<WorkingTime | null>(null);
  saving = signal(false);
  service = inject(WorkingHourService);
  monthlyWork = signal<null | number>(null);
  user = signal<number | null>(null);
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  updateFinished = output<boolean>();
  
  buttonDisabled = computed(() => {
    if(!this.user()) return true;
    if(!this.monthlyWork()) return true;
    if(this.userAlreadyDefined() && this.workingTimeItemToEdit() == null) return true;
    return false;
  })

  userAlreadyDefined = computed(() => {
    if(this.user()){
      const userExists = this.service.usersWorkingTime().some(u => u.family_member === this.user());
      if(userExists) return true;
    }
    return false;
  })

  ngOnChanges(changes: SimpleChanges): void {
      if(this.workingTimeItemToEdit()){
        this.user.set(this.workingTimeItemToEdit()?.family_member!);
        this.monthlyWork.set(this.workingTimeItemToEdit()?.time!);
      }else{
        this.user.set(null);
        this.monthlyWork.set(null);
      }
  }

  async onSaveData() {
    if(this.workingTimeItemToEdit()){
      this.update();
    }

    this.save();
  }

  async save(){
    if (!this.monthlyWork()) return;
    if (!this.user()) return;
    if (this.userAlreadyDefined()) return;


    this.saving.set(true);

    await this.service.saveTime(this.monthlyWork()!, this.user()!)
    this.monthlyWork.set(null);
    this.user.set(null);

    this.saving.set(false);

    this.visibleChange.emit(false);
  }

  async update(){
   
    if (!this.monthlyWork()) return;
    if (!this.user()) return;


    this.saving.set(true);
    
    this.service.updateTime(this.monthlyWork()!, this.workingTimeItemToEdit()?.id!, this.user()!);
    
    this.updateFinished.emit(true);
    
    this.saving.set(false);
  }


}
