import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageTemplateComponent } from "../../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../../components/header-back/header-back.component";
import { GoalsService } from '../goals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from '../../../models';
import { CardComponent } from "../../../components/card/card.component";
import { IconItemComponent } from "../../../components/icon-item/icon-item.component";
import { DatePipe, CurrencyPipe } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { calculateMonthsUntil } from '../../../../utils/calculateMonthsUntil';
import { InputCurrencyComponent } from "../../../components/input-currency/input-currency.component";

@Component({
  selector: 'app-goals-item-details',
  imports: [PageTemplateComponent, HeaderBackComponent, CardComponent, IconItemComponent, DatePipe, KnobModule, FormsModule, ButtonModule, CurrencyPipe, DialogComponent, InputCurrencyComponent],
  templateUrl: './goals-item-details.component.html',
  styleUrl: './goals-item-details.component.css'
})
export class GoalsItemDetailsComponent implements OnInit {
  service = inject(GoalsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  goal = computed<Goal | null>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;

    return this.service.goals().find(item => item.id === parseInt(id)) ?? null;
  });

  monthsRemaining = computed(() => {
    const g = this.goal();
    return g ? calculateMonthsUntil(g.term) : 0;
  });
  
  visible = signal(false);
  loading = signal(false);
  saving = signal(false);
  ammountToSave = signal<number | null>(null);


  hasTransactions = computed(() =>
    !!this.goal() && this.goal()!.transactions.length > 0
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.goal()) {
      this.router.navigate(['/goals']);
    }
  }

  savingRequired = computed(() => {
    return this.service.calculateMonthlySavingsRequired(this.goal()?.id!) ?? 0
  })

  onFinishGoal(){
    this.loading.set(true);

    this.service.finishGoal(this.goal()?.id!);
    this.loading.set(false);
  }

  async onSave(){
    if(!this.ammountToSave()) return;
    this.saving.set(true);
    const result = await this.service.saveGoalTransaction(this.goal()?.id!, this.ammountToSave()!);
    if(result){
      this.visible.set(false);
      this.ammountToSave.set(null);
    }
    
    this.saving.set(false);
  }



}
