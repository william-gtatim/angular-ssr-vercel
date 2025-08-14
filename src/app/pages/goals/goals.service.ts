import { inject, Injectable, signal, computed } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../notification.service';
import { Goal } from '../../models';
import { calculateMonthsUntil } from '../../../utils/calculateMonthsUntil';
@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private authService = inject(AuthService);
  private messageService = inject(NotificationService);
  loading = signal(false);
  goals = signal<Goal[]>([]);
  images = signal<{ id: number, image: string }[]>([]);

  constructor() {
    this.selectGoals();
    this.loadImages();
  }

  private async loadImages() {
    this.loading.set(true);
    const { data, error } = await this.authService.supabase
      .from('goal_images')
      .select('id, image')

    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      this.loading.set(false);
      return;
    }

    this.images.set(data || []);
    this.loading.set(false);
  }

  private async selectGoals() {
    this.loading.set(true);
    const { data, error } = await this.authService.supabase
      .from('goals')
      .select('*, goal_transactions(*)')
      .eq('user_id', this.authService.userId());

    if (error) {
      this.messageService.showDatabaseError(error, 'carregar os dados');
      this.loading.set(false);
      return;
    }

    const formattedGoals: Goal[] = (data || []).map(item => ({
      ...item,
      id: item.id,
      transactions: item.goal_transactions || []
    }));

    this.goals.set(formattedGoals);
    console.log(this.goals())
    this.loading.set(false);
   
  }


  public async saveGoal(name: string, cost: number, term: string, image: number) {
    const { data, error } = await this.authService.supabase
      .from('goals')
      .insert({ name: name, cost: cost, term: term, user_id: this.authService.userId()!, image:image, status: 'active' })
      .select('*')

    if (error) {
      this.messageService.showDatabaseError(error, 'salvar');
      return;
    }

    const created = data?.[0];

    if (created) {
      const formattedGoal: Goal = {
        id: created.id,
        name: created.name,
        cost: created.cost,
        term: created.term,
        image: created.image,
        status: created.status,
        transactions: []
      };

      this.goals.set([...this.goals(), formattedGoal]);
    }
  }


  public async updateGoal(updatedGoal: Omit<Goal, 'transactions' | 'created_at' >) {
    const { id, ...rest } = updatedGoal;

    const { data, error } = await this.authService.supabase
      .from('goals')
      .update(rest)
      .eq('id', id)

    if (error) {
      this.messageService.showDatabaseError(error, 'atualizar');
      return;
    }

    console.log(data);



    this.goals.update(goals =>
      goals.map(goal => {
        if(goal.id == id){
          return {
            ...updatedGoal,
            transactions: goal.transactions
          }
        }
        return goal;
      })
    );
  }

  public async changeGoalStatus(status: 'active' | 'stopped' | 'completed', id: number) {
    const { error } = await this.authService.supabase
      .from('goals')
      .update({ status: status })
      .eq('id', id)

    if (error) {
      this.messageService.showDatabaseError(error, 'atualizar');
      return false;
    }

    this.goals.update(current => {
      return current.map(item => {
        if (item.id === id) {
          return { ...item, status };
        }
        return item;
      });
    });

    return true;
  }

  public async deleteGoal(goalId: number) {
    const { error } = await this.authService.supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      this.messageService.showDatabaseError(error, 'deletar');
      return;
    }

    this.goals.update(goals => goals.filter(goal => goal.id !== goalId));
  }

  public async saveGoalTransaction(goalId: number, ammount: number) {
    const { data, error } = await this.authService.supabase
      .from('goal_transactions')
      .insert({ amount: Math.floor(ammount), goal_id: goalId, user_id: this.authService.userId() })
      .select()
      .single()


    if (error) {
      console.log(error)
      this.messageService.showDatabaseError(error, 'salvar');
      return false;
    }

    this.goals.update(current => current.map(goal => {
      if (goal.id == goalId) {
        return {
          ...goal, transactions: [...goal.transactions, data]
        }
      }

      return goal;
    }))

    return true;
  }

  public calculateSavedAmount(goalId: number) {
    const goal = this.goals().find(item => item.id == goalId);
    if (goal) {
      return Math.floor(goal.transactions.map(item => item.amount).reduce((sun, item) => sun + item, 0))
    }

    return 0;
  }

  public getSavedPercentage(goalId: number) {
    const goal = this.goals().find(item => item.id == goalId);
    if (goal) {
      return Math.floor((this.calculateSavedAmount(goal.id) / goal.cost) * 100)
    }
    return 0;

  }

  public async finishGoal(goalId: number) {
    const remaining = this.calculateRemainingAmount(goalId);
    const result = this.saveGoalTransaction(goalId, remaining);
    if(!result) return;

    const ok = await this.changeGoalStatus('completed', goalId);
    if(ok){
      this.messageService.showInfo({summary: 'Parabéns!', detail: 'Objetivo concluído com sucesso'});
    }

  }

  /**
   * Calcula o valor restante necessário para alcançar a meta.
   */
  calculateRemainingAmount(goalId: number) {
    const goalCost = this.goals().find(item => item.id == goalId)?.cost ?? 0;
    return goalCost - this.calculateSavedAmount(goalId);

  }
  calculateMonthlySavingsRequired(goalId: number){
    const goal = this.goals().find(item => item.id == goalId);
    if(!goal?.term) return goal?.cost;
    const monthsUntil = calculateMonthsUntil(goal.term);
    if (monthsUntil <= 0) return goal?.cost - this.calculateSavedAmount(goalId);

    return Math.round(this.calculateRemainingAmount(goalId) / monthsUntil);
  }

  calculateMonthlySavingRequiredAllActiveGoals = computed(() => {
    const activeGoals = this.goals().filter(item => item.status === 'active');

    return activeGoals
      .map(item => this.calculateMonthlySavingsRequired(item.id) ?? 0)
      .reduce((sum, item) => sum + item, 0);
  });
  
  getImage(id: number | null): string | undefined {
    return this.images().find(item => item.id == id)?.image;
  }

}
