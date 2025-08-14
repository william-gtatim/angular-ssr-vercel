import { Component, inject, input, computed, output } from '@angular/core';
import { Goal } from '../../../models';
import { CardComponent } from "../../../components/card/card.component";
import { CategoriesService } from '../../categories/categories.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { GoalsService } from '../goals.service';
import { Router } from '@angular/router';
import { IconItemComponent } from "../../../components/icon-item/icon-item.component";
@Component({
  selector: 'app-goals-item',
  imports: [CardComponent, CurrencyPipe, DatePipe, MenuModule, ButtonModule, IconItemComponent, ProgressBarModule],
  templateUrl: './goals-item.component.html',
  styleUrl: './goals-item.component.css'
})
export class GoalsItemComponent {
  categoriesService = inject(CategoriesService);
  service = inject(GoalsService);
  goal = input.required<Goal>();
  router = inject(Router);
  edit = output<number>();

items = computed<MenuItem[]>(() => {
  const goal = this.goal();
  if (!goal) return [];

  const baseItems: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => this.edit.emit(goal.id),
    },
    {
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => this.service.deleteGoal(goal.id),
    },
    
  ];

  if (goal.status === 'active') {
    baseItems.push({
      label: 'Pausar',
      icon: 'pi pi-pause-circle',
      command: () => this.service.changeGoalStatus('stopped', goal.id),
    });
  } else if (goal.status === 'stopped') {
    baseItems.push({
      label: 'Retomar',
      icon: 'pi pi-play-circle',
      command: () => this.service.changeGoalStatus('active', goal.id),
    });
  }

  if(goal.status !== 'completed'){
    baseItems.push({
      label: 'Depósito',
      icon: 'pi pi-plus-circle',
      command: () => this.router.navigate(['/goals', goal.id]),
    })
  }

  return baseItems;
});


}
