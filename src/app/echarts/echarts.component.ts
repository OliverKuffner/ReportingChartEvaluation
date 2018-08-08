import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../http.service';
import { HelperService } from '../helper.service';
import { ECharts, EChartOption } from 'echarts'

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.css']
})
export class EchartsComponent implements AfterViewInit, OnInit {

  private radarChart: ECharts;
  private isCircleRadar = false;

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

  toggleRadarChartMode(){
    const options: EChartOption = {
      polar: [
        {
          type: this.isCircleRadar ? 'polygon' : 'circle',
          splitNumber: this.isCircleRadar ? 5 : 9
        }
      ],
    };
    this.isCircleRadar = !this.isCircleRadar;
    this.radarChart.setOption(options);
  }

  private initIceCharts(value: any) {
    if (!value) {
      return;
    }
    const barChart = echarts.init(document.querySelector('div#echart-bar'));

    const labels = (<any[]>value.results).map(({ name }) => name);
    const colors = (<any[]>value.results).map(({ color }) => color);
    const amounts = (<any[]>value.results).map(({ value }) => value);
    const previousAmounts = amounts.map(a => { return Math.abs(a + this.helper.getRandomNumber(-5, 5)) });

    const barOptions: EChartOption = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      legend: {
        data: [value.name + ' 2017',
        value.name + ' 2018', 'Durchschnitt']
      },
      xAxis: [
        {
          type: 'category',
          data: labels
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Anzahl Personen'
        }
      ],
      series: [
        {
          name: value.name + ' 2017',
          type: "bar",
          data: previousAmounts,
        },
        {
          name: value.name + ' 2018',
          type: "bar",
          data: amounts
        },
        {
          name: 'Durchschnitt',
          type: 'line',
          data: this.helper.createProcessData(previousAmounts, amounts),
          // yAxisIndex: 0
        }
      ],
      color: ['#fecea0', '#b0a1e0', 'gray']
    };
    barChart.setOption(barOptions);
    

    const pieChart = echarts.init(document.querySelector('div#echart-pie'));
    let pieOptions: EChartOption = {
      title: {
        text: value.name,
        subtext: '2018',
        padding: 120, // fix for missing property x
        // x: 'center' // not yet in @types/echarts
      },
      color: colors,
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
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            option: {
              funnel: {
                x: '25%',
                width: '50%',
                funnelAlign: 'left',
                max: amounts.reduce((a, b) => a + b, 0)
              }
            }
          },
          restore: { show: true },
          saveAsImage: {
            show: true
          }
        }
      },
      // calculable: true, // not yet in @types/echarts
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

  private initDevCharts(value: any) {
    if (!value) {
      return;
    }

    this.radarChart = echarts.init(document.querySelector('div#echart-radar'));
    const radarOptions: EChartOption = {
      title: {
        text: 'Programs looked at',
        subtext: 'in %'
      },
      color: [this.helper.getRandomColor(), this.helper.getRandomColor()],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 'center',
        data: value.names
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: true },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      polar: [
        {
          indicator: value.attributes.map(a => {
            return { text: a };
          }),
          radius: 140 // px
        }
      ],
      series: [
        {
          name: 'Programs looked at',
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: [
            {
              value: value.values[0],
              name: value.names[0]
            },
            {
              value: value.values[1],
              name: value.names[1]
            }
          ]
        }
      ]
    };
    this.radarChart.setOption(radarOptions);
  }

}
