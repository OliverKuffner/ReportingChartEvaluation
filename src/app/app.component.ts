import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js'
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    // global chart.js settings
    Chart.defaults.global.legend.position = 'right'
    Chart.defaults.global.defaultFontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    Chart.defaults.global.defaultFontSize = 13;

    // request data before DOM is ready
    this.httpService.getIceCreamValues()
      .subscribe(() => { });

    this.httpService.getDeveloperValues()
      .subscribe(() => { });
  }
}
