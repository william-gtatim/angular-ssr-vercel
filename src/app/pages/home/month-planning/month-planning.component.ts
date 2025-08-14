import { Component, computed, input, ViewChild, inject, effect } from "@angular/core";
import { CardComponent } from "../../../components/card/card.component";
import { Button } from 'primeng/button';


import { CurrencyPipe } from '@angular/common';
import { Router } from "@angular/router";
import { ComputedDataService } from "../../computed-data.service";


@Component({
  selector: 'app-month-planning',
  imports: [CardComponent, Button, CurrencyPipe],
  templateUrl: './month-planning.component.html',
  styleUrl: './month-planning.component.css'
})
export class MonthPlanningComponent {
  service = inject(ComputedDataService);
  showButton = input(true);
  router = inject(Router);




  percentageExpendedPlaned = computed(() => {
    if (this.service.budget() == 0) return 0;
    return Math.round(Math.abs(this.service.expense()) / this.service.budget() * 100)
  })


  bgColor = computed(() => {
    if (this.percentageExpendedPlaned() > 100) {
      return '#ef4444'
    } else if (this.percentageExpendedPlaned() > 90) {
      return '#f97316';

    } else {
      return '#22c55e'
    }
  });

  constructor() {

  }


}
