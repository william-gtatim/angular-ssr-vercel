import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Question } from '../../models';
import { NotificationService } from '../../notification.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  messageService = inject(NotificationService);
  authService = inject(AuthService);
  questions = signal<Question[]>([]);
  loading = signal(false);
  saving = signal(false);
  responseTime = signal(0);
  monthsPassed = signal(false);
  
  constructor() { 
    this.init();
  }

  async init(){
    this.loading.set(true);
    await this.loadQuestions();
    await this.loadUserResponse();
    this.loading.set(false);
  }

  async loadUserResponse() {
    const { data, error } = await this.authService.supabase
      .from('questions_response')
      .select('question, response, time, created_at')
      .eq('user_id', this.authService.userId())
      .order('id', { ascending: true });

    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return;
    }

    const lastResponse = data[data.length - 1];

    this.responseTime.set(lastResponse?.time || 0);

    if (lastResponse?.created_at) {
      const lastDate = new Date(lastResponse.created_at);
      const now = new Date();

      // Calcula diferença em meses
      const monthsDiff =
        now.getMonth() -
        lastDate.getMonth() +
        12 * (now.getFullYear() - lastDate.getFullYear());

      if (monthsDiff >= 2) {
        //console.log('Já se passaram 2 meses desde a última resposta.');
        this.monthsPassed.set(true);
      } else {
        //console.log('Ainda não se passaram 2 meses.');
      }
    } else {
      //console.log('Nenhuma resposta anterior encontrada.');
    }
  }
  


  async loadQuestions(){
    const {data, error} = await this.authService.supabase
      .from('questions')
      .select('id, question, type')

    if(error){
      this.messageService.showDatabaseError(error, 'carregar os dados');
      return;
    }

    this.questions.set(data);
   
  }


  async saveResponse(responses: { questionId: number, response: number }[]){

    const questions = responses.map(item => ({question: item.questionId, response: item.response, time: this.responseTime() + 1, user_id: this.authService.userId()}));

    console.log(questions)
    const { error } = await this.authService.supabase
    .from('questions_response')
    .insert(questions)

    console.log(error);
    if(error){
      this.messageService.showDatabaseError(error, 'salvar');
      return;
    }

    this.responseTime.set(this.responseTime() + 1);
    this.messageService.showInfo({summary: 'Respostas salvas com sucesso!', detail: "Muito obrigado por ter participado", life: 8000});
  }

}
