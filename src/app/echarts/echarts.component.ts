import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../http.service';
import { HelperService } from '../helper.service';
// TODO install @types for echarts if they exist

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.css']
})
export class EchartsComponent implements AfterViewInit, OnInit {

  private echarts = window['echarts'];

  constructor(private httpService: HttpService, private helper: HelperService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // fill charts with data when DOM is ready
    this.httpService.iceValues.subscribe(value => {
      this.initIceCharts(value);
    });
  }


  private initIceCharts(value: any) {
    if (!value) {
      return;
    }
    const barChart = this.echarts.init(document.getElementById('echart-bar'));

    const labels = (<any[]>value.results).map(({ name }) => name);
    const amounts = (<any[]>value.results).map(({ value }) => value);
    const previousAmounts = amounts.map(a => { return Math.abs(a + this.helper.getRandomNumber(-5, 5)) });

    const barOptions = {
      tooltip: {
        show: true
      },
      legend: {
        data: [value.name + ' 2017',
        value.name + ' 2018']
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
          "name": value.name + ' 2017',
          "type": "bar",
          "data": previousAmounts,
        },
        {
          "name": value.name + ' 2018',
          "type": "bar",
          "data": amounts
        }
      ],
      color: ['#fecea0', '#b0a1e0']
    };

    barChart.setOption(barOptions);

    // TODO locale for toolbox
    const pieChart = this.echarts.init(document.getElementById('echart-pie'));
    let pieOptions = {
      title: {
        text: value.name,
        subtext: '2018',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: labels
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            option: {
              funnel: {
                x: '25%',
                width: '50%',
                funnelAlign: 'left',
                max: 1548
              }
            }
          },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      series: [
        {
          name: value.name,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: value.results
        }
      ]
    };

    pieChart.setOption(pieOptions);
  }

}
