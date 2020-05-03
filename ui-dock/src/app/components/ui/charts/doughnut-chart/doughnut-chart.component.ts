/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartType, ChartOptions, PositionType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {

  @Input() title: string = "";
  @Input() titlePosition: PositionType = this.enumLoaderService.positionTypes.TOP;
  @Input() isTitleShow: boolean = true;
  @Input() isLegendShow: boolean = true;
  @Input() legendPosition: PositionType = this.enumLoaderService.positionTypes.BOTTOM;
  @Input() animationDurationInSec: number = 1.5;
  @Input() labels: Label[] = [];
  @Input() data: number[] = [];
  @Input() backColors: string[] = [];

  @Output() chartClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private enumLoaderService: EnumLoaderService) { }

  doughnutChartColors = [];
  
  ngOnInit() {
    this.doughnutChartColors = [{
      backgroundColor: this.backColors
    }];
  }

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: this.legendPosition,
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
    title: {
      display: this.isTitleShow,
      position: this.titlePosition,
      text: ""
    },
    animation: {
      duration: this.animationDurationInSec * 1000
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartPlugins = [pluginDataLabels];
  
  onChartClicked(obj: any){
    this.chartClick.emit({
      object: obj
    });
  }
}
