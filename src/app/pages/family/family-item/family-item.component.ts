import { Component, input, output } from '@angular/core';
import { FamilyMember } from '../../../models';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CardComponent } from "../../../components/card/card.component";
@Component({
  selector: 'app-family-item',
  imports: [NgClass, ButtonModule, MenuModule, CardComponent],
  templateUrl: './family-item.component.html',
  styleUrl: './family-item.component.css'
})
export class FamilyItemComponent {
  member = input.required<FamilyMember>();
  onEdit = output();
  onDelete = output();
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          this.onEdit.emit();
        }
      },
    ];

    if(!this.member().default){
      this.items.push({
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => {
          this.onDelete.emit();
        }
      })
    }
  }


  getIcon(){
    const style = "pi text-color-secondary ";
    if(this.member().name == 'Família'){
      return style + ' pi-users';
    }else{
      return style + " pi-user";
    }
  }


}
