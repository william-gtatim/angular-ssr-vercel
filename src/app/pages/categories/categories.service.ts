import { Injectable, signal, computed, inject, Signal } from '@angular/core';
import { TransactionCategory, CategoryIcon, TransactionType, QuestionType, CategoryAssessment, CategoryBudget } from '../../models';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../auth.service';
import { comparaYearMonth } from '../../../utils/compareYearMonthDate';
import { NotificationService } from '../../notification.service';

type Color = {
  id: number,
  value: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private messageService = inject(NotificationService)
  private sanitizer = inject(DomSanitizer);

  private authService = inject(AuthService);

  private colors = signal<Color[]>([])

  private icons = signal<CategoryIcon[]>([])

  categories = signal<TransactionCategory[]>([]);

  categoriesBudget = signal<CategoryBudget[]>([]);

  private categoriesAssessments = signal<CategoryAssessment[]>([]);

  public visibleAddCategories = signal(false);

  public transactionType = signal<TransactionType>('expense');
  

  constructor() {
    if(this.authService.userId() === null) return;
    this.loadData()
  }

  async loadData(){
    this.loadIcons();
    this.loadColors();
    await this.loadCategories(this.authService.userId()!);
    this.loadCategoriesBudget();

  }

  private async loadIcons() {

    // const categoriesStorage = localStorage.getItem('categories');
    // if (categoriesStorage) {
    //   this.categories.set(JSON.parse(categoriesStorage));
    //   return;
    // }

    const { data, error } = await this.authService.supabase
      .from('category_icons')
      .select('*')

    if (error) {
      console.log(error);
    }

    if (data && data.length > 0) {
      this.icons.set(data);

      localStorage.setItem('categories', JSON.stringify(data))
    }

  }

  private async loadColors(){
    // const colors = localStorage.getItem('category_clors');
    // if(colors){
    //   this.colors.set(JSON.parse(colors));
    //   return;
    // }


    const {data, error} = await this.authService.supabase
      .from('category_colors')
      .select('id, value, name')

      if(error){
        console.log(error);
      }

      if(data){
        this.colors.set(data)
        localStorage.setItem('category_colors', JSON.stringify(data))
      }
  }

  private async loadCategories(userId: string){
    const {data, error} = await this.authService.supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')

      if(error){
        console.log(error);
        return;
      }

    this.categories.set(this.mapCategories(data));
    

  }

  private mapCategories(data: any): TransactionCategory[]{
    return data.map((item: any) => ({
      id: item.id,
      type: item.transaction_type,
      name: item.name,
      iconId: item.icon_id,
      colorId: item.color_id
    }))

  }

  private async loadCategoriesBudget(){
    const {data, error} = await this.authService.supabase
      .from('budget')
      .select('id, date, amount, category')
      .eq('user_id', this.authService.userId())

      if(error){
        console.log(error)
      }

      if(data){
        this.categoriesBudget.set(data);
      }
  }


  public getAllCategories = (type: TransactionType | 'all' = 'all'): Signal<TransactionCategory[]> =>
    computed(() =>
      this.categories()
        .filter((category: TransactionCategory) => {
          if (type == 'all') {
            return true;
          }
          return category.type == type || category.type == '';
        })
        .map((category) => {
          const icon = this.icons().find((icon) => icon.id === category.iconId)?.name ?? 'category';
          const categoryColor = this.colors().find((color) => color.id == category.colorId)?.value ?? '#a8a29e';

          return {
            ...category,
            icon: icon,
            color: categoryColor,
          };
        })
    );
  
  public getCategoryBudget(categoryId: number, date: string){
    return computed(() => {
      const amount = this.categoriesBudget().find(item => item.category == categoryId && comparaYearMonth(item.date, date))?.amount;
      if(amount) return amount;
      return null;
    })
  }

  public getIcons() {
    return this.icons();
  }


  public getColors() {
    return this.colors();
  }

  public getIcon(categorieId: number | null) {
    if(categorieId){
      const iconId = this.categories().find(item => item.id === categorieId)?.iconId;
      if(iconId){
        return this.icons().find(item => item.id === iconId)?.name ?? 'category';
      }
      
    }

    return 'category';
  }

  public getIconName(iconId: number){
    return this.icons().find(item => item.id == iconId)?.name ?? 'category';
  }

  /**
 * Busca e retorna uma categoria pelo seu ID.
 * @param categoryId O ID numérico da categoria.
 * @returns Um objeto `Category` se encontrado; `null` caso contrário.
 */
  public getCategory(categoryId: number): TransactionCategory | null{
    return this.categories().find(item => item.id == categoryId) ?? null;
  }


  public getColor(categorieId: number | null) {
    if(categorieId){
      return this.colors().find(item => item.id == this.categories().find(item => item.id == categorieId)?.colorId)?.value ?? '#a8a29e';
    }

    return '#a8a29e';
  }

  public getColorCode(colorId: number){
    return this.colors().find(item => item.id == colorId)?.value;
  }

  public getName(categoriesId: number | null): string {
    if(categoriesId){
      return this.categories().find(category => category.id == categoriesId)?.name ?? '';
    }

   return '';
  }

  public getNameCategorie(id: number | null){
    if(id == null) return '';
    return this.categories().find(item => item.id == id)?.name ?? '';
  }

  public getCategoryAssesment(categoryId: number, date: string, questionType: QuestionType): number | null{

    const categoryAssessment =  this.categoriesAssessments().find((item: CategoryAssessment) => item.categoryId === categoryId && this.checkIfIsTheSameYearMonth(item.date, date) && item.questionType === questionType);

    if(categoryAssessment){
      return categoryAssessment.assessment;
    }

    return null;
  }

  public getCategoryAssessmentId(categoryId: number, date: string, questionType: QuestionType): number | null {
    const categoryAssessment = this.categoriesAssessments().find((item: CategoryAssessment) => item.categoryId === categoryId && this.checkIfIsTheSameYearMonth(item.date, date) && item.questionType === questionType);

    if (categoryAssessment) {
      return categoryAssessment.id;
    }

    return null;
  }

  public checkIfIsTheSameYearMonth(date1: string, date2: string){
    return date1.slice(0, 4) == date2.slice(0, 4) && date1.slice(5, 7) == date2.slice(5, 7)
  }

  public async saveCategory(categorie: Omit<TransactionCategory, 'id'>) {
    const {data, error} = await this.authService.supabase
      .from('categories')
      .insert({
        transaction_type: categorie.type,
        name: categorie.name,
        icon_id: categorie.iconId,
        color_id: categorie.colorId,
        user_id: this.authService.userId()
      })
      .select()

      if(error){
        console.log(error)
      }

    if (data) {
      const newCategory = this.mapCategories(data)[0];
      this.categories.update(current => [newCategory, ...current]);
      }

    
  }

  public async updateCategory(categorie: TransactionCategory){
    const{data, error} = await this.authService.supabase
      .from('categories')
      .update({
        id:categorie.id,
        name: categorie.name,
        transaction_type: categorie.type,
        color_id: categorie.colorId,
        icon_id: categorie.iconId
      })
      .eq('id', categorie.id)

      if(error){
        console.log(error);
        return;
      }

    this.categories.update((current) => [
      ...current.filter(item => item.id !== categorie.id),
      categorie
    ]);

  }

  public async deleteCategory(id: number){
    const {data, error} = await this.authService.supabase
      .from('categories')
      .delete()
      .eq('id', id)

      if(error){
        console.log(error);
        return;
      }

      this.messageService.showInfo({summary: 'Categoria excluída com sucesso!'})


      this.categories.update((current) => current.filter(item => item.id !== id))

      return true;
  }

  public async saveCategoryMonthlyAssessment(categoryId: number, date: string, assessment: number, questionType: QuestionType){
    const {data, error} = await this.authService.supabase
      .from('monthly_assessment')
      .insert({category_id: categoryId, date: date, assessment: assessment, user_id: this.authService.userId(), question_type: questionType})
      .select()


      if(error){
        console.log(error);
      }

      if(data){
        this.categoriesAssessments.update(current => [...current, {
          id: data[0].id,
          categoryId: data[0].category_id,
          questionType: data[0].question_type,
          date: data[0].date,
          assessment: data[0].assessment
        }])
      }
  }

  public async updateCategoyMonthlyAssessment(id: number, categoryId: number, date: string, assessment: number, questionType: QuestionType){
    const {data, error} = await this.authService.supabase
      .from('monthly_assessment')
      .update({ category_id: categoryId, date: date, assessment: assessment, user_id: this.authService.userId(), question_type: questionType })
      .eq('id', id);


      if(error){
        console.log(error);
        return;
      }


    this.categoriesAssessments.update((current) =>
      current.map(item =>
        item.id === id
          ? { ...item, category_id: categoryId, date, assessment, user_id: this.authService.userId(), question_type: questionType }
          : item
      )
    );


  }

  public updateCategoryBudget(budget: CategoryBudget){
    this.categoriesBudget.update((oldData) => {
      const old = oldData.filter(item => item.id !== budget.id);
      return [...old, budget];
    })
  }



}
