import { Component, inject, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../notification.service';
import { AuthService } from '../../auth.service';
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../components/header-back/header-back.component";
import { CardComponent } from '../../components/card/card.component';
import { FamilyItemComponent } from "./family-item/family-item.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FamilyEditComponent } from "./family-edit/family-edit.component";
import { FamilyMember } from '../../models';
import { FamilyItemDeleteComponent } from "./family-item-delete/family-item-delete.component";

@Component({
  selector: 'app-family',
  imports: [ButtonModule, FormsModule, InputTextModule, PageTemplateComponent, HeaderBackComponent, CardComponent, FamilyItemComponent, DialogComponent, FamilyEditComponent, FamilyItemDeleteComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})
export class FamilyComponent  {
  messageService = inject(NotificationService);
  authService = inject(AuthService);
  isSaving = signal(false);
  name = signal('');


  visibleEdit = signal(false);
  visibleDelete = signal(false);

  memberToEdit = signal<FamilyMember | null>(null);


  async onAddFamilyMember(){
    this.isSaving.set(true);
    const {error} = await this.authService.supabase
      .from('family_members')
      .insert({name: this.name(), user_id: this.authService.userId(), default: false})

      if(error){
        this.messageService.showDatabaseError(error, 'salvar');
      }
    await this.authService.getFamilyMembers(this.authService.userId()!)
    this.name.set('');
    this.isSaving.set(false);
  }


}
