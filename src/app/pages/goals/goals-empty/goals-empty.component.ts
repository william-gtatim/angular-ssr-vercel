import { Component, output } from '@angular/core';
import { CardComponent } from "../../../components/card/card.component";
import { ButtonModule } from 'primeng/button';
import { IlustrationGoalsComponent } from '../../../components/ilustrations/ilustration-goals/ilustration-goals.component';
@Component({
  selector: 'app-goals-empty',
  imports: [CardComponent, ButtonModule, IlustrationGoalsComponent],
  templateUrl: './goals-empty.component.html',
})
export class GoalsEmptyComponent {
  addGoal = output<boolean>();
}
