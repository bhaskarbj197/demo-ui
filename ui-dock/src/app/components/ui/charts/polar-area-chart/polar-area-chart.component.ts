/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions, PositionType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';

@Component({
  selector: 'app-polar-area-chart',
  templateUrl: './polar-area-chart.component.html',
  styleUrls: ['./polar-area-chart.component.scss']
})
export class PolarAreaComponent implements OnInit {

  @Input() title: string = "";
  @Input() isTitleShow: boolean = true;
  @Input() isLegendShow: boolean = true;
  @Input() legendPosition: PositionType = this.enumLoaderService.positionTypes.BOTTOM;
  @Input() animationDurationInSec: number = 1.5;
  @Input() labels: Label[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = [];

  constructor(private enumLoaderService: EnumLoaderService) { }

  polarChartOptions: ChartOptions = {};
  polarChartColors = [];

  ngOnInit() {
    this.polarChartOptions = {
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

    this.setColors();
  }

  private setColors(){
    this.polarChartColors = [{
      backgroundColor: this.colors
    }];
  }

  public polarChartType: ChartType = 'polarArea';
  public polarChartPlugins = [pluginDataLabels];
}
