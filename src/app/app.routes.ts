import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const isUserLoggedIn: CanMatchFn = async () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = await authService.getCurrentUser();

    if (user !== null) {
        return true;
    }

    return new RedirectCommand(router.parseUrl('/login'));
};


const redirectUserLoggedIn: CanMatchFn = async () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const user = await authService.getCurrentUser();
    if (user === null) {
        return true;
    }
    return new RedirectCommand(router.parseUrl('/home'));
}

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        data: {
            title: 'Lumia'
        },
        canMatch: [redirectUserLoggedIn],
        loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent)
    },
    {
        path: 'login',
        title: 'Login',
        canMatch: [redirectUserLoggedIn],
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        title: 'Register',
        canMatch: [redirectUserLoggedIn],
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'home',
        title: 'Home',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'transactions',
        title: 'Transações',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/transactions/transactions.component').then(c => c.TransactionsComponent)
    },
    {
        path: 'budget',
        title: "Avaliação dos gastos",
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/budget/budget.component').then(m => m.BudgetComponent)
    },
    {
        path: 'all-resources',
        title: 'Todos os recursos',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/all-resources/all-resources.component').then(m => m.AllResourcesComponent)
    },
    {
        path: 'reports',
        title: "Relatórios",
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: 'working-hour',
        title: 'Hora de trabalho',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/working-hour/working-hour.component').then(m => m.WorkingHourComponent)
    },
    {
        path: 'knowledge',
        title: 'Aprender',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/knowledge/knowledge.component').then(c => c.KnowledgeComponent)
    },
    {
        path: 'categories',
        title: 'Categorias',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/categories/categories.component').then(c => c.CategoriesComponent),
    },
    {
        path: 'family',
        title: 'Família',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/family/family.component').then(c => c.FamilyComponent)
    },
    {
        path: 'user',
        title: 'Meu perfil',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/user/user.component').then(c => c.UserComponent)
    },
    {
        path: 'accounts',
        title: 'Contas',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/account/account.component').then(c => c.AccountComponent)
    },
    {
        path: 'goals',
        title: 'Objetivos',
        canMatch: [isUserLoggedIn],
        loadComponent: () => import('./pages/goals/goals.component').then(c => c.GoalsComponent)
    },
    {
        path: 'goals/:id',
        title: 'Detalhes do objetivo',
        canDeactivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/goals/goals-item-details/goals-item-details.component').then(c => c.GoalsItemDetailsComponent)
    },
    {
        path: 'category-expense',
        title: 'Gastos por categoria',
        canActivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/category-expense/category-expense.component').then(c => c.CategoryExpenseComponent)
    },
    {
        path: 'import',
        title: 'Importar',
        canActivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/import/import.component').then(c => c.ImportComponent)
    },
    {
        path: 'import/import-ofx',
        title: 'Importar OFX',
        canActivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/import/import-ofx/import-ofx.component').then(c => c.ImportOfxComponent)
    },

    {
        path: 'category-expense/:id',
        title: 'Detalhes do objetivo',
        canDeactivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/category-expense/category-expense-item-details/category-expense-item-details.component').then(c => c.CategoryExpenseItemDetailsComponent),
    },
    {
        path: 'terms',
        title: 'Termos de uso',
        loadComponent: () => import('./pages/terms/terms.component').then(c => c.TermsComponent)
    },
    {
        path: 'privacy-policy',
        title: 'Termos de uso',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(c => c.PrivacyPolicyComponent)
    },
    {
        path: 'delete-account',
        title: 'Excluir conta',
        loadComponent: () => import('./pages/delete-account/delete-account.component').then(c => c.DeleteAccountComponent),
    },
    {
        path: 'contact',
        title: 'Contato',
        loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent)
    },
    {
        path: 'questions',
        title: 'Questionário sobre bem-estar financeiro',
        canActivate: [isUserLoggedIn],
        loadComponent: () => import('./pages/questions/questions.component').then(c => c.QuestionsComponent)
    },

    {
        path: '**',
        title: 'Página não encontrada',
        loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
    }
];

