import { Component, inject, signal } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { WorkingHourService } from './working-hour.service';
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { CardComponent } from "../../components/card/card.component";
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { WorkingHourEditComponent } from "./working-hour-edit/working-hour-edit.component";
import { WorkingHourItemComponent } from "./working-hour-item/working-hour-item.component";
import { WorkingTime } from '../../models';
import { IlustrationWorkComponent } from "../../components/ilustrations/ilustration-work/ilustration-work.component";

@Component({
  selector: 'app-working-hour',
  imports: [ LoadingSpinnerComponent, InputNumberModule, FormsModule, ButtonModule, HeaderBackComponent, PageTemplateComponent, CardComponent,  WorkingHourEditComponent, WorkingHourItemComponent, IlustrationWorkComponent],
  templateUrl: './working-hour.component.html',
  styleUrl: './working-hour.component.css'
})
export class WorkingHourComponent {
  authService = inject(AuthService);
  saving = signal(false);
  service = inject(WorkingHourService);
  selectedCategoryIncome = signal<number>(0);
  selectedCategoryExpense = signal<number>(0);
  monthlyWork = signal<null | number>(null);
  user = signal<number | null>(null);
  visible = signal(false);
  workingTimeItemToEdit = signal<WorkingTime | null>(null);

  async onSaveData(){
    if(!this.monthlyWork()) return;
    if(!this.user()) return;
    

    this.saving.set(true);

    await this.service.saveTime(this.monthlyWork()!, this.user()!)
    


    this.saving.set(false);
  }
}
