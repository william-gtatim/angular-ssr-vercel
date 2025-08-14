import { Component, computed, inject, input, effect, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CategoriesService } from '../../../pages/categories/categories.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TransactionCategory, transactionTypes } from '../../../models';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { SelectTransactionTypeComponent } from "../../../components/select-transaction-type/select-transaction-type.component";
import { SelectIconComponent } from "../../../components/select-icon/select-icon.component";
import { SelectColorComponent } from "../../../components/select-color/select-color.component";



@Component({
  selector: 'app-categories-add',
  imports: [Dialog, ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule, SelectButtonModule, DialogComponent, SelectTransactionTypeComponent, SelectIconComponent, SelectColorComponent],
  templateUrl: './categories-add.component.html',
  styleUrl: './categories-add.component.css'
})
export class CategoriesAddComponent {
  service = inject(CategoriesService);
  nameError = signal(false);
  savingCategory = signal(false);

  category = input<TransactionCategory | null>(null);
  

  transactionTypes = transactionTypes;
  
  name = '';
  iconName = signal<string>('category');
  iconId = signal<number | null>(91);
  colorId = signal<number>(41);
  


  constructor() {
    effect(() => {
      
      if (this.category()) {
        this.service.transactionType.set(this.category()!.type);
        this.name = this.category()!.name;
        this.iconName.set(this.service.getIcon(this.category()!.id));
        this.iconId.set(this.category()?.iconId ?? null);
        this.colorId.set(this.category()!.colorId);
      }else{
        this.name = '';
        this.iconName.set('category');
        this.colorId.set(41);
        this.iconId.set(91);
        
      }
    });
  }

  selectedColor = computed(() => this.service
    .getColors()
    .find(item => item.id === this.colorId())?.value
  )

  selectedIcon = computed(() => this.service
    .getIcons()
    .find(item => item.name === this.iconName())?.name
  );


  setColor(colorId: number) {
    this.colorId.update(() => colorId)
  }

  setIcon(iconId: number) {
    this.iconId.set(iconId);
    this.iconName.set(this.service.getIcons().find(item => item.id === iconId)?.name ?? 'category');
  }
  
  changeNameStatus(){
    if(this.name !== ''){
      this.nameError.update(() => false);
    }
  }



  async onSubmit() {
    if (this.iconId() == null || this.colorId() == null || this.service.transactionType == null || this.name === ''){
      this.nameError.update(() => true);
      return;
    }

    const category = { name: this.name, type: this.service.transactionType(), colorId: this.colorId(), iconId: this.iconId()! }
    
    this.savingCategory.set(true);

    if(this.category()){
      await this.service.updateCategory({...category, id: this.category()!.id});
      
    }else{
      await this.service.saveCategory(category)
      this.name = '';
      this.colorId.set(41);
      this.iconName.set('category');
    }

    this.savingCategory.set(false);
    this.service.visibleAddCategories.set(false);


    


  }


}
