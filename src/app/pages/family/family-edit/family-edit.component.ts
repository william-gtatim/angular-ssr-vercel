import { Component, input, OnChanges, output, SimpleChanges, signal, inject } from '@angular/core';
import { FamilyMember } from '../../../models';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { NotificationService } from '../../../notification.service';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-family-edit',
  imports: [DialogComponent, InputText, FormsModule, Button],
  templateUrl: './family-edit.component.html',
  styleUrl: './family-edit.component.css'
})
export class FamilyEditComponent implements OnChanges {
  messageService = inject(NotificationService);
  authService = inject(AuthService);


  visibleEdit = signal(false);
  visibleDelete = signal(false);

  memberToEdit = signal<FamilyMember | null>(null);



  visible = input.required<boolean>();
  member = input.required<FamilyMember | null>();
  visibleChange = output<boolean>();
  editFinished = output();

  name = signal<string>('');
  saving = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.member());
    if (this.member() && this.member()?.name) {
      this.name.set(this.member()?.name!);
    } else {
      this.name.set('');
    }
  }

  onSave() {
    if (this.member()) {
      this.update();
    } else {
      this.save();
    }
  }

  async update() {
    this.saving.set(true);
    const { error, data } = await this.authService.supabase
      .from('family_members')
      .update({ name: this.name() })
      .eq('id', this.member()?.id)

    if (error) {
      this.onError(error);
      this.saving.set(false);
      return;
    }

    this.authService.familyMembers.update(current => {
      const updated = current.filter(member => member.id !== this.member()?.id!)

      return [...updated, {id: this.member()?.id!, name: this.name(), default: this.member()?.default!}]
    })

    this.saving.set(false);
    this.visibleChange.emit(false);

  }


  async save() {
    this.saving.set(true);
    const { error, data } = await this.authService.supabase
      .from('family_members')
      .insert({ name: this.name(), user_id: this.authService.userId() })
      .select('id, name, default')
      .single()

    if (error) {
      this.onError(error);
      this.saving.set(false);
      return;
    }

    this.authService.familyMembers.update(current => [...current, data])

    this.saving.set(false);
    this.visibleChange.emit(false);
  }

  onError(error: any) {
    if (error.message == 'duplicate key value violates unique constraint "unique_user_name_pair"') {
      this.messageService.showError({ summary: "Ocorreu um erro", detail: 'Já existe um membro da família com esse mesmo nome', life: 7000 });
    } else {
      this.messageService.showDatabaseError(error, 'salvar');
    }
  }

}
