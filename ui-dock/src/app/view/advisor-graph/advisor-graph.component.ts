/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../loaders/business-loader.service';
import { GraphDataModel } from '../../models/graphData.model';
import { EnumLoaderService } from '../../loaders/enum-loader.service';
import { DataService } from '../../services/data.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-advisor-graph',
  templateUrl: './advisor-graph.component.html',
  styleUrls: ['./advisor-graph.component.scss']
})
export class AdvisorGraphComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }

  validationStatusGraph: GraphDataModel = new GraphDataModel();
  journalStatusByWdGraph: GraphDataModel = new GraphDataModel();
  dataAnomaliesGraph: GraphDataModel = new GraphDataModel();
  inputFileAvailableGraph: GraphDataModel = new GraphDataModel();
  isLeftMenuGraphLoading: boolean = false;
  mainWindow: string = this.enumLoaderService.detailGraphs.NONE;
  selectedWdForJournalStatusGraph: string = "";
  selectedForDataAnomalyGraph: string = "";

  ngOnInit() {
    if(this.dataService.mainWindowForAdvisorGraph !== this.enumLoaderService.detailGraphs.NONE){
      this.mainWindow = JSON.parse(JSON.stringify(this.dataService.mainWindowForAdvisorGraph));
      this.dataService.mainWindowForAdvisorGraph = this.enumLoaderService.detailGraphs.NONE;
    }
    this.setupLeftMenuGraph();
  }

  private setupLeftMenuGraph(){
    this.isLeftMenuGraphLoading = true;

    this.businessLoaderService.advisorHomeBusinessService.getJournalGraphDataAsync().subscribe(res => {
      if(res && res.body){
        var response = res.body;

        if(response.journalValidationStatus && response.journalValidationStatus.length > 0){
          this.validationStatusGraph = this.businessLoaderService.advisorHomeBusinessService.getJournalValidationStatusGraphData(response);
        }

        if(response.workDayWiseJournalStatus && response.workDayWiseJournalStatus.length > 0){
          this.journalStatusByWdGraph = this.businessLoaderService.advisorHomeBusinessService.getJournalStatusByWdGraphData(response);
        }

        if(response.dataAnomalies && response.dataAnomalies.length > 0){
          this.dataAnomaliesGraph = this.businessLoaderService.advisorHomeBusinessService.getDataAnomalyGraphData(response);
        }

        if(response.fileAvailableCountInParcent){
          this.inputFileAvailableGraph = this.businessLoaderService.advisorHomeBusinessService.getInputFileAvailableGraphData(response);
        }

        this.isLeftMenuGraphLoading = false;
      }
    }, err => {
      this.isLeftMenuGraphLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onJournalValidationStatusGraphClick(){
    this.mainWindow = this.enumLoaderService.detailGraphs.JOURNAL_VALIDATION_STATUS;
  }

  onJournalStatusByWdGraphClick(obj: any){
    if(obj && obj.object && obj.object.active.length > 0){
      if(obj.object.active[0]._model && obj.object.active[0]._model.label){
        this.selectedWdForJournalStatusGraph = obj.object.active[0]._model.label;
        this.mainWindow = this.enumLoaderService.detailGraphs.WD_WISE_JOURNAL_STATUS;
      }
    }
  }

  onDataAnomalyByTypeClick(obj: any){
    if(obj && obj.object && obj.object.active.length > 0){
      if(obj.object.active[0]._model && obj.object.active[0]._model.label){
        this.selectedForDataAnomalyGraph = obj.object.active[0]._model.label;
        this.mainWindow = this.enumLoaderService.detailGraphs.DATA_ANOMALY;
      }
    }
  }

  onInputFileAvailibilityGraphClick(){
    this.mainWindow = this.enumLoaderService.detailGraphs.INPUT_FILE_AVAILIBILITY;
  }
}
