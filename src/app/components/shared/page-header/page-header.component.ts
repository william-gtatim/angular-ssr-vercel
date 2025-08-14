import { AfterViewInit, Component, input, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent implements AfterViewInit {
  title = input('');
  backLink = input('/home');

  headerHeight = signal('');

  ngAfterViewInit(): void {
    const header = document.getElementById('header-page') as HTMLElement
    const height = header?.offsetHeight;

    this.headerHeight.set(height + 'px');
  }

}
