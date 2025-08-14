import { Component, computed, inject, signal } from '@angular/core';
import { QuestionsService } from './questions.service';
import { QuestionsItemComponent } from './questions-item/questions-item.component';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { CardComponent } from '../../components/card/card.component';
import { Button } from 'primeng/button';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-questions',
  imports: [QuestionsItemComponent, PageTemplateComponent, HeaderBackComponent, CardComponent, Button, LoadingSpinnerComponent],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  router = inject(Router);
  service = inject(QuestionsService);
  saving = signal(false);
  responses = signal<{ questionId: number, response: number }[]>([]);
  isValid = signal(true);
  showTanks = signal(false);

  async onSave() {
    if(this.responses().length < 17){
      this.isValid.set(false);
      return;
    }
    this.saving.set(true);
    await this.service.saveResponse(this.responses());

    this.saving.set(false);
    this.showTanks.set(true);

    this.router.navigate(['/home']);
  }


  onSelectResponse(questionId: number, response: number) {
    this.isValid.set(true);
    let responses = this.responses().filter(item => item.questionId !== questionId);
    responses.push({questionId, response});
    this.responses.set(responses);

  }

  showQuestions = computed(() => {
    if(this.service.responseTime() >= 2) return false;
    if(this.service.responseTime() == 1 && !this.service.monthsPassed()) return false;

    return true;
  })


}
