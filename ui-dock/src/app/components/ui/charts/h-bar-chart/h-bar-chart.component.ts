/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions, PositionType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';

@Component({
  selector: 'app-h-bar-chart',
  templateUrl: './h-bar-chart.component.html',
  styleUrls: ['./h-bar-chart.component.scss']
})
export class HBarChartComponent implements OnInit {

  @Input() title: string = "";
  @Input() titlePosition: PositionType = this.enumLoaderService.positionTypes.TOP;
  @Input() isTitleShow: boolean = true;
  @Input() isLegendShow: boolean = true;
  @Input() legendPosition: PositionType = this.enumLoaderService.positionTypes.BOTTOM;
  @Input() animationDurationInSec: number = 1.5;
  @Input() labels: Label[] = [];
  @Input() data: ChartDataSets[] = [];
  @Input() gridLineColor: string = "rgba(171,171,171,0.3)";
  @Input() gridLineWidth: number = 0.5;
  @Input() gridLineMin: number = 0;
  @Input() gridLineStep: number = 3;
  @Input() colors: string[] = [];

  constructor(private enumLoaderService: EnumLoaderService) { }

  barChartColors = [];

  ngOnInit() {
    this.setBarColors();
  }

  private setBarColors(){
    this.barChartColors = [];
    for(var index=0; index<this.colors.length; index++){
      this.barChartColors.push({backgroundColor: this.colors[index]});
    }
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: this.legendPosition,
    },
    scales: { xAxes: [{
      ticks: {
        beginAtZero: (this.gridLineMin === 0),
        suggestedMin: this.gridLineMin,
        stepSize: this.gridLineStep
      },
      gridLines: {
        color: this.gridLineColor,
        lineWidth: this.gridLineWidth
      }
    }], yAxes: [{
      ticks: {
        beginAtZero: (this.gridLineMin === 0),
        suggestedMin: this.gridLineMin,
        stepSize: this.gridLineStep
      },
      gridLines: {
        color: this.gridLineColor,
        lineWidth: this.gridLineWidth
      }
    }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    title: {
      display: this.isTitleShow,
      text: ""
    },
    animation: {
      duration: this.animationDurationInSec * 1000
    }
  };
  public barChartType: ChartType = 'horizontalBar';
  public barChartPlugins = [pluginDataLabels];
}
