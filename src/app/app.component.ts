import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Chart from 'chart.js'
import { HttpService } from './http.service';
import { BehaviorSubject } from '../../node_modules/rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  private iceValues = new BehaviorSubject(null);
  private developerValues = new BehaviorSubject(null);
  private pieChart: Chart;

  private echarts = window['echarts'];

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    Chart.defaults.global.legend.position = 'right'
    Chart.defaults.global.defaultFontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    Chart.defaults.global.defaultFontSize = 13;

    this.httpService.getIceCreamValues()
      .subscribe(value => this.iceValues.next(value));

    this.httpService.getDeveloperValues()
      .subscribe(value => this.developerValues.next(value));
  }

  ngAfterViewInit() {
    this.iceValues.subscribe(value => {
      this.initCharJsIceCharts(value);
      this.initEChartsIceCharts(value);
    });

    this.developerValues.subscribe(value => {
      this.initChartJsDevCharts(value);
    });
  }

  private initCharJsIceCharts(value) {
    if (!value) {
      return;
    }
    const labels = (<any[]>value.results).map(({ label }) => label);
    const colors = (<any[]>value.results).map(({ color }) => color);
    const amounts = (<any[]>value.results).map(({ value }) => value);

    const pieCtx = this.getCanvasContext('pie-canvas');

    this.pieChart = new Chart(pieCtx, {
      type: 'pie', // doughnut
      data: {
        labels: labels,
        datasets: [{
          data: amounts,
          backgroundColor: this.getTransparentColors(colors),
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

    const previousAmounts = amounts.map(a => { return Math.abs(a + this.getRandomNumber(-5, 5)) });

    const barCtx = this.getCanvasContext('bar-canvas');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '2017',
          data: previousAmounts,
          backgroundColor: this.getTransparentColors(colors),
          hoverBackgroundColor: colors,
          borderWidth: 1
        },
        {
          label: '2018',
          data: amounts,
          backgroundColor: this.getTransparentColors(colors),
          hoverBackgroundColor: colors,
          borderWidth: 1,
          borderColor: '#3a3a3a'
        },
        {
          label: 'Durchschnitt',
          data: this.createProcessData(previousAmounts, amounts),
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

  private initChartJsDevCharts(value: any) {
    if (!value) {
      return;
    }
    let datasets = [];
    let i = 0;
    value.values.forEach(data => {
      datasets.push({
        data: data,
        backgroundColor: this.getTransparentColor(this.getRandomColor(), 0.5),
        label: value.labels[i++]
      });

    });

    const radarCtx = this.getCanvasContext('radar-canvas');
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: value.attributes,
        datasets: datasets
      }
    });
  }

  private initEChartsIceCharts(value: any) {
    if (!value) {
      return;
    }
    const barChart = this.echarts.init(document.getElementById('echart-bar'));
    const labels = (<any[]>value.results).map(({ label }) => label);
    const amounts = (<any[]>value.results).map(({ value }) => value);
    const colors = (<any[]>value.results).map(({ color }) => color);

    const option = {
      tooltip: {
        show: true
      },
      legend: {
        data: [value.name]
      },
      xAxis: [
        {
          type: 'category',
          data: labels
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          "name": value.name,
          "type": "bar",
          "data": amounts
        },
        {
          "name": value.name,
          "type": "bar",
          "data": amounts
        }
      ],
      color: [ 
        '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', 
        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', 
        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', 
        '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0' 
    ]
    };

    barChart.setOption(option);
  }

  addToPieChart(name: string, amount: number) {
    if (!name || !amount) {
      return;
    }
    this.pieChart.data.labels.push(name);
    (<number[]>this.pieChart.data.datasets[0].data).push(amount);
    const color = this.getRandomColor();
    (<string[]>this.pieChart.data.datasets[0].backgroundColor)
      .push(this.getTransparentColor(color, 0.85));
    (<string[]>this.pieChart.data.datasets[0].hoverBackgroundColor)
      .push(color);

    this.pieChart.update();
  }

  private createProcessData(values1: number[], values2: number[]): number[] {
    const combined = [];
    for (let i = 0; i < values1.length; i++) {
      const average = (values1[i] + values2[i]) / 2;
      combined.push(average);
    }
    return combined;
  }

  private getCanvasContext(name: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(name);
    return canvas.getContext('2d');
  }

  private getRandomColor(): string {
    const r = this.getRGBValue();
    const g = this.getRGBValue();
    const b = this.getRGBValue();
    return 'rgb(' + r + ',' + g + ',' + b + ') ';
  }

  private getRGBValue(): number {
    return this.getRandomNumber(0, 255);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getTransparentColors(colors: string[]): string[] {
    return colors.map(c => {
      return this.getTransparentColor(c, 0.85);
    });
  }

  private getTransparentColor(color: string, alpha: number): string {
    return color.replace('rgb', 'rgba')
      .replace(')', ',' + alpha + ')');
  }
}
