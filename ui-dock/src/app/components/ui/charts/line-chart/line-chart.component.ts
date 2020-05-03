/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { PositionType, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() title: string = "";
  @Input() isTitleShow: boolean = true;
  @Input() isLegendShow: boolean = true;
  @Input() legendPosition: PositionType = this.enumLoaderService.positionTypes.BOTTOM;
  @Input() animationDurationInSec: number = 1.5;
  @Input() labels: Label[] = [];
  @Input() data: ChartDataSets[] = [];
  @Input() gridLineColor: string = "rgba(171,171,171,0.3)";
  @Input() gridLineWidth: number = 0.5;
  @Input() gridLineMax: number = 0;
  @Input() gridLineMin: number = 0;
  @Input() gridLineStep: number;
  @Input() colors: string[]|any = [];
  @Input() size: string = this.enumLoaderService.chartSizes.SMALL;

  constructor(private enumLoaderService: EnumLoaderService) { }

  public lineChartColors = [];
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginDataLabels];

  ngOnInit() {
    this.setLineColors()
  }

  private setLineColors(){
    this.lineChartColors = [];
    for(var index=0; index<this.colors.length; index++){
      if(typeof this.colors[index] === "string"){
        this.lineChartColors.push({backgroundColor: this.colors[index]});
      } else {
        var colorObj: any = {};
        if(this.colors[index].backgroundColor){
          colorObj.backgroundColor = this.colors[index].backgroundColor;
        }
        if(this.colors[index].borderColor){
          colorObj.borderColor = this.colors[index].borderColor;
        }
        if(this.colors[index].pointBackgroundColor){
          colorObj.pointBackgroundColor = this.colors[index].pointBackgroundColor;
        }
        if(this.colors[index].pointBorderColor){
          colorObj.pointBorderColor = this.colors[index].pointBorderColor;
        }
        this.lineChartColors.push(colorObj);
      }
    }
  }

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: this.legendPosition,
    },
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
        beginAtZero: (this.gridLineMin === 0),
        suggestedMin: this.gridLineMin,
        stepSize: this.gridLineStep,
        fontColor: 'red'
      },
      gridLines: {
        color: this.gridLineColor
      }
    }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        offset: -7
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

  isCorrectSize(sz: string): boolean {
    return (this.enumLoaderService.chartSizes[sz] === this.size);
  }
}
