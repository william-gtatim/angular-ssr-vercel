import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Ilustration404NotFoundComponent } from "../../components/ilustrations/ilustration-404-not-found/ilustration-404-not-found.component";
@Component({
    selector: 'app-page-not-found',
    imports: [ButtonModule, Ilustration404NotFoundComponent],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
    router = inject(Router);
    onBackHome(){
        this.router.navigate(['/home']);
    }
}
