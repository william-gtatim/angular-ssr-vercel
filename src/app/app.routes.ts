import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Início',
        loadComponent: () => import('./app.component').then(c => c.AppComponent)
    },

    {
        path: 'pagina-2',
        title: 'Página 2',
        loadComponent: () => import('./pages/pagina-2/pagina-2.component').then(c => c.Pagina2Component)
    }
];
