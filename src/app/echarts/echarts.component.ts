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


  private initIceCharts(value: any) {
    if (!value) {
      return;
    }
    const barChart = echarts.init(document.querySelector('div#echart-bar'));

    const labels = (<any[]>value.results).map(({ name }) => name);
    const amounts = (<any[]>value.results).map(({ value }) => value);
    const previousAmounts = amounts.map(a => { return Math.abs(a + this.helper.getRandomNumber(-5, 5)) });

    const barOptions: EChartOption = {
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

    const pieChart = echarts.init(document.querySelector('div#echart-pie'));
    let pieOptions: EChartOption = {
      title: {
        text: value.name,
        subtext: '2018',
        padding: 120, // fix for missing property x
        // x: 'center' // not yet in @types/echarts
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
          mark: {
            show: true,
            title: {
              mark: 'Linie zeichnen',
              markUndo: 'Letzte Linie entfernen',
              markClear: 'Alle Linien löschen'
            }
          },
          dataView: {
            show: true,
            readOnly: false,
            // title: 'Datenansicht', // configured in app component
            lang: [
              'Datenansicht',
              'Schließen',
              'Neu laden'
            ]
          },
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            title: {
              pie: 'Kuchendiagram',
              funnel: 'Trichteransicht'
            },
            option: {
              funnel: {
                x: '25%',
                width: '50%',
                funnelAlign: 'left',
                max: amounts.reduce((a, b) => a + b, 0)
              }
            }
          },
          restore: { show: true, title: 'Neu laden' },
          saveAsImage: {
            show: true,
            title: 'Als Bild speichern',
            lang: ['Speichern']
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

  }

}
