import { Component, inject } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { LogoComponent } from "../../components/ilustrations/logo/logo.component";



@Component({
    selector: 'app-landing-page',
    imports: [ButtonModule, LogoComponent,RouterLink],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
    router = inject(Router)
}
