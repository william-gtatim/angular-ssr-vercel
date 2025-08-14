import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-landing-steps',
  imports: [StepperModule, ButtonModule ],
  templateUrl: './landing-steps.component.html',
  styleUrl: './landing-steps.component.css'
})
export class LandingStepsComponent {

}
