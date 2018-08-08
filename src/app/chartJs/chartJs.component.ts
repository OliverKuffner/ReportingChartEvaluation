import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js'
import { HttpService } from '../http.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-chartJs',
  templateUrl: './chartJs.component.html',
  styleUrls: ['./chartJs.component.css']
})
export class ChartJsComponent implements AfterViewInit, OnInit {

  private pieChart: Chart;
  private barChart: Chart;

  constructor(private httpService: HttpService, private helper: HelperService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // fill charts with data when DOM is ready
    this.httpService.iceValues.subscribe(value => {
      this.initIceCharts(value);
    });

    this.httpService.developerValues.subscribe(value => {
      this.initDevCharts(value);
    });
  }

  addToCharts(name: string, amount: number) {
    if (!name || !amount) {
      return;
    }
    this.pieChart.data.labels.push(name);
    (<number[]>this.pieChart.data.datasets[0].data).push(amount);
    const color = this.helper.getRandomColor();
    (<string[]>this.pieChart.data.datasets[0].backgroundColor)
      .push(this.helper.getTransparentColor(color, 0.85));
    (<string[]>this.pieChart.data.datasets[0].hoverBackgroundColor)
      .push(color);

    // add value to line chart
    (<number[]>this.barChart.data.datasets[2].data).push(amount);

    this.pieChart.update();
    this.barChart.update(); // gets updated too because data arrays are the same
  }
  
  private initIceCharts(value) {
    if (!value) {
      return;
    }
    const labels = (<any[]>value.results).map(({ name }) => name);
    const colors = (<any[]>value.results).map(({ color }) => color);
    const transparentColors = this.helper.getTransparentColors(colors);
    const amounts = (<any[]>value.results).map(({ value }) => value);

    const pieCtx = this.helper.getCanvasContext('pie-canvas');

    this.pieChart = new Chart(pieCtx, {
      type: 'pie', // doughnut
      data: {
        labels: labels,
        datasets: [{
          data: amounts,
          backgroundColor: transparentColors,
          hoverBackgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        title: { text: value.name, display: true },
        animation: {
          easing: 'easeOutBounce',
          duration: 1200
        }
      }
    });

    const previousAmounts = amounts.map(a => { return Math.abs(a + this.helper.getRandomNumber(-5, 5)) });

    const barCtx = this.helper.getCanvasContext('bar-canvas');
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '2017',
          data: previousAmounts,
          backgroundColor: transparentColors,
          hoverBackgroundColor: colors,
          borderWidth: 1
        },
        {
          label: '2018',
          data: amounts,
          backgroundColor: transparentColors,
          hoverBackgroundColor: colors,
          borderWidth: 1,
          borderColor: '#3a3a3a'
        },
        {
          label: 'Durchschnitt',
          data: this.helper.createProcessData(previousAmounts, amounts),
          type: 'line',
          fill: false,
          borderColor: '#aea2eb',
          pointRadius: 4,
          pointBackgroundColor: '#afcfeb'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true
            }
          }]
        },
        title: { text: value.name, display: true },
        legend: { position: 'top' }
      }
    });
  }

  private initDevCharts(value: any) {
    if (!value) {
      return;
    }
    let datasets = [];
    let i = 0;
    value.values.forEach(data => {
      datasets.push({
        data: data,
        backgroundColor: this.helper.getTransparentColor(this.helper.getRandomColor(), 0.5),
        label: value.names[i++]
      });

    });

    const radarCtx = this.helper.getCanvasContext('radar-canvas');
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: value.attributes,
        datasets: datasets
      },
      options: {
        title: { text: 'Programs looked at', display: true }
      }
    });
  }

}
