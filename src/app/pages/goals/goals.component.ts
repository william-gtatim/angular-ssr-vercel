import { Component, inject, signal, computed } from '@angular/core';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { ButtonModule } from 'primeng/button';

import { GoalsEmptyComponent } from "./goals-empty/goals-empty.component";
import { GoalsAddComponent } from "./goals-add/goals-add.component";
import { GoalsService } from './goals.service';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { GoalsItemComponent } from "./goals-item/goals-item.component";
import { Goal, GoalStatus } from '../../models';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-goals',
  imports: [PageTemplateComponent, HeaderBackComponent, ButtonModule, FormsModule, GoalsEmptyComponent, GoalsAddComponent, LoadingSpinnerComponent, GoalsItemComponent, SelectButtonModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent {
  service = inject(GoalsService);
  visibleAddGoal = signal(false);
  itemToEdit = signal<Goal | null> (null);
  tabItems = signal([
    {label: 'Ativo', value: 'active'},
    {label: 'Pausado', value: 'stopped'},
    {label: 'Concluído', value: 'completed'}
  ]);

  selectedStatus = signal<GoalStatus>('active');

  onEdit(item: Goal){
    this.itemToEdit.set(item);
    this.visibleAddGoal.set(true);
  }

  filteredGoals = computed(() =>
    this.service.goals().filter(goal => goal.status === this.selectedStatus())
  );

  getStatusName(status: string){
    return this.tabItems().find(item => item.value == status)?.label;
  }

}
