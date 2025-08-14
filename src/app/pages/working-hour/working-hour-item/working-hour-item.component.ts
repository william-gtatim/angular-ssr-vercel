import { Component, inject, input, output, signal } from '@angular/core';
import { CardComponent } from "../../../components/card/card.component";
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { WorkingTime } from '../../../models';
import { AuthService } from '../../../auth.service';
import { WorkingHourService } from '../working-hour.service';
import { convertDateToString } from '../../../../utils/convertDateToString';
@Component({
  selector: 'app-working-hour-item',
  imports: [CardComponent, MenuModule, ButtonModule],
  templateUrl: './working-hour-item.component.html',
  styleUrl: './working-hour-item.component.css'
})
export class WorkingHourItemComponent {
  authService = inject(AuthService);
  service = inject(WorkingHourService);
  workingTime = input.required<WorkingTime>();

  items: MenuItem[] | undefined;

  onEdit = output<number>();

  hourlyIncome = signal(0);



  ngOnInit() {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => { this.onEdit.emit(this.workingTime().id) }
      },
      {
        label: 'Deletar',
        icon: 'pi pi-trash',
        command: () => {this.onDelete()}
      }
    ]


    const date = new Date();
    const dateString = convertDateToString(date);
    this.hourlyIncome.set(this.service.getHourlyIncomeByUser(this.workingTime().family_member, dateString))

  }


  onDelete(){
    this.service.deleteTime(this.workingTime().id)
  }
}
