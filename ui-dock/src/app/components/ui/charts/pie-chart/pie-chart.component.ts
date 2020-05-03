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
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() title: string = "";
  @Input() isTitleShow: boolean = true;
  @Input() isLegendShow: boolean = true;
  @Input() legendPosition: PositionType = this.enumLoaderService.positionTypes.BOTTOM;
  @Input() animationDurationInSec: number = 1.5;
  @Input() labels: Label[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = [];
  @Input() size: string = this.enumLoaderService.chartSizes.SMALL;
  @Input() isDataLabelsShow: boolean = true;

  @Output() chartClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private enumLoaderService: EnumLoaderService) { }

  pieChartOptions: ChartOptions = {};
  pieChartColors = [];

  ngOnInit() {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: this.legendPosition
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
          display: this.isDataLabelsShow
        },
      },
      title: {
        display: this.isTitleShow,
        text: ""
      },
      animation: {
        duration: this.animationDurationInSec * 1000
      }
    };

    this.pieChartColors = [{
      backgroundColor: this.colors
    }];
  }

  isCorrectSize(sz: string): boolean {
    return (this.enumLoaderService.chartSizes[sz] === this.size);
  }

  onChartClicked(obj: any){
    this.chartClick.emit({
      object: obj
    });
  }

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [pluginDataLabels];
  
}
