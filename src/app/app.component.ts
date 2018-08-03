import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Chart from 'chart.js'
import { HttpService } from './http.service';
import { Observable, BehaviorSubject } from '../../node_modules/rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  private pieValues = new BehaviorSubject(null);
  private pieChart: Chart;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    Chart.defaults.global.legend.position = 'right'
    Chart.defaults.global.defaultFontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    Chart.defaults.global.defaultFontSize = 13;

    this.httpService.getPieValues()
      .subscribe(value => this.pieValues.next(value));
  }

  ngAfterViewInit() {
    this.pieValues.subscribe(value => {
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
            backgroundColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          title: { text: value.name, display: true }
        }
      });
    });

    // const barCtx = this.getCanvasContext('bar-canvas');
    // var barChart = new Chart(barCtx, {
    //   type: 'bar',
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true,
    //           display: true
    //         }
    //       }]
    //     }
    //   }
    // });

  }

  addToPieChart(name: string, amount: number) {
    if (!name || !amount) {
      return;
    }
    this.pieChart.data.labels.push(name);
    (<number[]>this.pieChart.data.datasets[0].data).push(amount);
    (<string[]>this.pieChart.data.datasets[0].backgroundColor).push(this.getRandomColor());

    this.pieChart.update();
  }

  getCanvasContext(name: string) {
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
    return Math.floor(Math.random() * 256);
  }
}
