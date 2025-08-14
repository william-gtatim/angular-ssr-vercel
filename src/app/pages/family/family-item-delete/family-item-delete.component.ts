import { Component, signal, input, output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { FamilyMember } from '../../../models';
import { ButtonModule } from 'primeng/button';
import { NotificationService } from '../../../notification.service';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-family-item-delete',
  imports: [DialogComponent, ButtonModule],
  templateUrl: './family-item-delete.component.html',
  styleUrl: './family-item-delete.component.css'
})
export class FamilyItemDeleteComponent {
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  member = input<FamilyMember>();
  messageService = inject(NotificationService);
  authService = inject(AuthService);
  
  deleting = signal(false);

  async onDelete(){
    this.deleting.set(true);
    const {data, error} = await this.authService.supabase
      .from('family_members')
      .delete()
      .eq('id', this.member()?.id)

    if(error){
      this.messageService.showDatabaseError(error, 'deletar');
      this.deleting.set(false);
      return;
    }

    this.authService.familyMembers.update(current => current.filter(item => item.id != this.member()?.id));
    this.visibleChange.emit(false);
    this.deleting.set(false);
  }

  onCancel(){
    this.visibleChange.emit(false);
  }
}
