import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js'
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private echarts = window['echarts'];

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    //// global chart.js settings
    Chart.defaults.global.legend.position = 'right'
    Chart.defaults.global.defaultFontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    Chart.defaults.global.defaultFontSize = 13;

    //// global echart settings
    // init toolbox first
    const dummyChart = this.echarts.init(document.getElementById('dummy'));
    let options = {
      toolbox: {
      }
    };
    dummyChart.setOption(options);

    this.echarts.config.toolbox.feature.dataView.title = 'Datenansicht';
    this.echarts.config.calculable = true; // enable Drag-Recalculate

    // request data before DOM is ready
    this.httpService.getIceCreamValues()
      .subscribe(() => { });

    this.httpService.getDeveloperValues()
      .subscribe(() => { });
  }
}
