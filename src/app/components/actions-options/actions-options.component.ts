import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-actions-options',
  imports: [CommonModule, RouterLink],
  templateUrl: './actions-options.component.html',
  styleUrl: './actions-options.component.css'
})
export class ActionsOptionsComponent {
  buttons = signal([
    { title: 'Transações', icon: 'pi pi-receipt', route: '/transactions' },
    { title: 'Avaliação', icon: 'pi pi-compass', route: '/budget' },
    { title: 'Relatórios', icon: 'pi pi-chart-line', route: '/reports' },
    { title: 'Categorias', icon: 'pi pi-tag', route: '/categories' },
    { title: 'Família', icon: 'pi pi-users', route: '/family' },
    { title: 'Hora de trabalho', icon: 'pi pi-briefcase', route: '/working-hour' },
    { title: 'Aprender', icon: 'pi pi-graduation-cap', route: '/knowledge'},
    
  ])
}
