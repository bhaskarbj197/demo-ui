/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { Router } from '@angular/router';
import { GraphDataModel } from '../../../../models/graphData.model';
import { DataService } from '../../../../services/data.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-master-graphs',
  templateUrl: './journal-master-graphs.component.html',
  styleUrls: ['./journal-master-graphs.component.scss']
})
export class JournalMasterGraphsComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private router: Router,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }
  
  validationStatusGraph: GraphDataModel = new GraphDataModel();
  journalStatusByWdGraph: GraphDataModel = new GraphDataModel();
  dataAnomaliesGraph: GraphDataModel = new GraphDataModel();
  inputFileAvailableGraph: GraphDataModel = new GraphDataModel();
  financialImpactGraph: GraphDataModel = new GraphDataModel();
  
  isWorkDayWiseJournalStatusGraphLoading: boolean = false;
  isJournalValidationStatusGraphLoading: boolean = false;
  isDataAnomaliesGraphLoading: boolean = false;
  isInputFileAvailabilityGraphLoading: boolean = false;

  isWorkDayWiseJournalStatusGraphAvailable: boolean = true;
  isJournalValidationStatusGraphAvailable: boolean = true;
  isDataAnomaliesGraphAvailable: boolean = true;
  isInputFileAvailabilityGraphAvailable: boolean = true;

  ngOnInit() {
    this.loadGraphsData();
  }

  private loadGraphsData(){
    this.isWorkDayWiseJournalStatusGraphLoading = true;
    this.isJournalValidationStatusGraphLoading = true;
    this.isDataAnomaliesGraphLoading = true;
    this.isInputFileAvailabilityGraphLoading = true;
    this.businessLoaderService.advisorHomeBusinessService.getJournalGraphDataAsync().subscribe(res => {
      if(res && res.body){
        var response = res.body;
        this.setFinancialImpacatDataTemp();
        if(response.journalValidationStatus && response.journalValidationStatus.length > 0){
          this.validationStatusGraph = this.businessLoaderService.advisorHomeBusinessService.getJournalValidationStatusGraphData(response);
        }else{
          this.isJournalValidationStatusGraphAvailable = false;
        }
        this.isJournalValidationStatusGraphLoading = false;

        if(response.workDayWiseJournalStatus && response.workDayWiseJournalStatus.length > 0){
          this.journalStatusByWdGraph = this.businessLoaderService.advisorHomeBusinessService.getJournalStatusByWdGraphData(response);
        } else {
          this.isWorkDayWiseJournalStatusGraphAvailable = false;
        }
        this.isWorkDayWiseJournalStatusGraphLoading = false;

        if(response.dataAnomalies && response.dataAnomalies.length > 0){
          this.dataAnomaliesGraph = this.businessLoaderService.advisorHomeBusinessService.getDataAnomalyGraphData(response);
        } else {
          this.isDataAnomaliesGraphAvailable = false;
        }
        this.isDataAnomaliesGraphLoading = false;

        if(response.fileAvailableCountInParcent){
          this.inputFileAvailableGraph = this.businessLoaderService.advisorHomeBusinessService.getInputFileAvailableGraphData(response);
        } else {
          this.isInputFileAvailabilityGraphAvailable = false;
        }
        this.isInputFileAvailabilityGraphLoading = false;
      }
    }, err => {
      this.isWorkDayWiseJournalStatusGraphLoading = false;
      this.isJournalValidationStatusGraphLoading = false;
      this.isDataAnomaliesGraphLoading = false;
      this.isInputFileAvailabilityGraphLoading = false;
      this.isWorkDayWiseJournalStatusGraphAvailable = false;
      this.isJournalValidationStatusGraphAvailable = false;
      this.isDataAnomaliesGraphAvailable = false;
      this.isInputFileAvailabilityGraphAvailable = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private setFinancialImpacatDataTemp() {
    let financialImpactData = [{
      "count": 37,
      "value": "Budgeted"
    }, {
      "count": 63,
      "value": "GP% Increase"
    }]
    for(var index=0; index<financialImpactData.length; index++){
      this.financialImpactGraph.data.push(financialImpactData[index].count)
      this.financialImpactGraph.labels.push(financialImpactData[index].value)
    }
    this.financialImpactGraph.colors = [
      this.enumLoaderService.chartColors.PIE_RED,
      this.enumLoaderService.chartColors.LINE_GREEN_LIGHT
    ]
  }

  onValidationStatusChartClick() {
    this.dataService.mainWindowForAdvisorGraph = this.enumLoaderService.detailGraphs.JOURNAL_VALIDATION_STATUS;
    this.dataService.selectedItemOfMainWindowForAdvisorGraph = "";
    this.router.navigate(["advisor-graph"]);
  }

  onJournalStatusByWdGraphClick(eventData) {
    if(eventData && eventData.object && eventData.object.active.length > 0){
      if(eventData.object.active[0]._model && eventData.object.active[0]._model.label){
        this.dataService.selectedItemOfMainWindowForAdvisorGraph = eventData.object.active[0]._model.label;
        this.dataService.mainWindowForAdvisorGraph = this.enumLoaderService.detailGraphs.WD_WISE_JOURNAL_STATUS;
      }
    }
    this.router.navigate(["advisor-graph"]);
  }

  onDataAnomalyChartClick(eventData) {
    if(eventData && eventData.object && eventData.object.active.length > 0){
      if(eventData.object.active[0]._model && eventData.object.active[0]._model.label){
        this.dataService.selectedItemOfMainWindowForAdvisorGraph = eventData.object.active[0]._model.label;
        this.dataService.mainWindowForAdvisorGraph = this.enumLoaderService.detailGraphs.DATA_ANOMALY;
      }
    }
    this.router.navigate(["advisor-graph"]);
  }

  onInputAvailabilityChartClick() {
    this.dataService.mainWindowForAdvisorGraph = this.enumLoaderService.detailGraphs.INPUT_FILE_AVAILIBILITY;
    this.dataService.selectedItemOfMainWindowForAdvisorGraph = "";
    this.router.navigate(["advisor-graph"]);
  }
}