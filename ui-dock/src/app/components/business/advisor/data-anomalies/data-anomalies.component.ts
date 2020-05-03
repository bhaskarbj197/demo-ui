/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { GraphDataModel } from '../../../../models/graphData.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { DataAnomalyPartialModel } from '../../../../models/data-anomaly.model';
import { GeneralUtility } from '../../../../utility/general-utility';
import { DataService } from 'src/app/services/data.service';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { Router } from '@angular/router';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-data-anomalies',
  templateUrl: './data-anomalies.component.html',
  styleUrls: ['./data-anomalies.component.scss']
})
export class DataAnomaliesComponent implements OnInit, OnChanges {

  @Input() anomalyTypeSelected: string = "";

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private generalUtility: GeneralUtility,
    private dataService: DataService,
    private dateConverterPipe: DateConverterPipe,
    private router: Router,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_DATA_ANOMALY_0, 
    this.constantLoaderService.tabListTextsService.ADVR_DATA_ANOMALY_1];
  activeTab: string = this.tabList[0];
  isLoading: boolean = false;
  anomalyTypeList: Array<string> = ["Input", "Output"];
  dataAnomalies: Array<DataAnomalyPartialModel> = new Array<DataAnomalyPartialModel>();
  graphData: GraphDataModel = new GraphDataModel();

  ngOnInit() {
    if(this.dataService.selectedItemOfMainWindowForAdvisorGraph) {
      this.anomalyTypeSelected = this.dataService.selectedItemOfMainWindowForAdvisorGraph;
    }
    this.loadDataAnomalies();
  }

  ngOnChanges(changes: SimpleChanges){
    const anomalyTypeSelected: SimpleChange = changes.anomalyTypeSelected;
    if(anomalyTypeSelected.currentValue !== anomalyTypeSelected.previousValue){
      this.loadDataAnomalies();
    }
  }

  private loadDataAnomalies(){
    this.isLoading = true;
    if(this.anomalyTypeSelected === ""){
      this.isLoading = false;
      return;
    }
    this.dataAnomalies = new Array<DataAnomalyPartialModel>();
    this.businessLoaderService.advisorDetailGraphBusinessService.getDataAnomalyByTypeAsync(this.anomalyTypeSelected).subscribe(res => {
      if(res.body){
        this.dataAnomalies = this.businessLoaderService.advisorDetailGraphBusinessService.getDataAnomalyByType(res.body);
        this.loadGraphData();
        this.isLoading = false;
      }
    }, err =>{
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadGraphData(){
    this.graphData = new GraphDataModel();
    for(var index = 0; index < Object.keys(this.enumLoaderService.journalAnomalyStatuses).length; index++){
      this.graphData.labels.push(Object.values(this.enumLoaderService.journalAnomalyStatuses)[index]);
      this.graphData.data.push(this.dataAnomalies.filter(d => 
        d.anomalyStatus.toLowerCase().trim() === this.graphData.labels[index].toLowerCase().trim()).length);
    }
    this.graphData.colors.push(this.enumLoaderService.chartColors.PIE_GREEN);
    this.graphData.colors.push(this.enumLoaderService.chartColors.PIE_RED);
    if(this.graphData.labels.length > 2){
      for(var cnt=2; cnt<this.graphData.labels.length; cnt++){
        this.graphData.colors.push(this.generalUtility.getRandomColorCodeInRgb());
      }
    }
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
  }

  onAnnamalyTypeChanged(obj: any){
    if(obj && obj.item){
      this.anomalyTypeSelected = obj.item.key;
      this.loadDataAnomalies();
      this.loadGraphData();
    }
  }

  onDataAnomalyItemClick(selectedItem: DataAnomalyPartialModel, segment: string) {
    this.dataService.journalId = selectedItem.journalId;
    this.dataService.advisorSegment = segment;
    this.dataService.journalRunDate = this.dateConverterPipe.transform(selectedItem.runDate, false, true);
    this.router.navigate(["advisor"]);
  }
}
