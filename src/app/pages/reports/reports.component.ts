import { Component } from '@angular/core';
import { WallChartComponent } from "./wall-chart/wall-chart.component";
import { PageTemplateComponent } from "../../components/page-template/page-template.component";
import { CardComponent } from "../../components/card/card.component";

@Component({
  selector: 'app-reports',
  imports: [WallChartComponent, PageTemplateComponent, CardComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

}
