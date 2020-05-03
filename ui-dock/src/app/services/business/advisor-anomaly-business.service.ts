/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AdvisorAnomalyDataService } from '../data/advisor-anomaly-data.service';
import { UiJsonDataService } from './../data/ui-json-data.service';
import { AnomalyInputLogsModel, AnomalyInputLogsDataModel } from '../../models/anomalyInputLogs.model';
import { AnomalyProcessLogsModel, AnomalyProcessLogsDataModel } from '../../models/anomalyProcessLogs.model';
import { journalIdType } from '../types';
import { GeneralUtility } from 'src/app/utility/general-utility';

@Injectable({
  providedIn: 'root'
})
export class AdvisorAnomalyBusinessService {

  constructor(private advisorAnomalyDataService: AdvisorAnomalyDataService,
    private uiJsonDataService: UiJsonDataService,
    private generalUtility: GeneralUtility) { }

  getJournalInputLogDataAnomalyAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>>{
    var request = {
      jid: journalId,
      date: runDate,
      modelType: "SD"
    };
    return this.advisorAnomalyDataService.getJournalInputLogDataAnomalyAsync(request);
  }

  getJournalInputLogDataAnomaly(response: any): AnomalyInputLogsModel {
    var anomalyInputLogs: AnomalyInputLogsModel = new AnomalyInputLogsModel();
    if(response){
      anomalyInputLogs.totalInputFile = response.totalInputFile;
      anomalyInputLogs.anomaliCountFile = response.anomaliCountFile;
      anomalyInputLogs.records = [];
      if(response.anomalyData){
        for(var index=0; index<response.anomalyData.length; index++){
          var anomalyInputLogsData = new AnomalyInputLogsDataModel();
          anomalyInputLogsData.columnCount = response.anomalyData[index].columnCount;
          anomalyInputLogsData.comment = response.anomalyData[index].comment;
          anomalyInputLogsData.fileName = response.anomalyData[index].fileName;
          anomalyInputLogsData.fileType = response.anomalyData[index].fileType;
          anomalyInputLogsData.inputNo = response.anomalyData[index].inputNo;
          anomalyInputLogsData.isAnomaly = (response.anomalyData[index].isAnomaly === "Yes"
                                          || response.anomalyData[index].isAnomaly === "yes") ? true :  false;
          anomalyInputLogsData.journalId = response.anomalyData[index].jid;
          anomalyInputLogsData.location = response.anomalyData[index].location;
          anomalyInputLogsData.rowCount = response.anomalyData[index].rowCount;
          anomalyInputLogsData.runDate = response.anomalyData[index].runDate;
          anomalyInputLogsData.source = response.anomalyData[index].source;
          anomalyInputLogs.records.splice(0, 0, anomalyInputLogsData);
        }
        anomalyInputLogs.records = this.generalUtility.getSortedArray(anomalyInputLogs.records, "inputNo");
      }
    }
    return anomalyInputLogs;
  }

  getJournalProcessedLogDataAnomalyAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>>{
    var request = {
      jid: journalId,
      date: runDate,
      modelType: "SD"
    };
    return this.advisorAnomalyDataService.getJournalProcessedLogDataAnomalyAsync(request);
  }

  getJournalProcessLogDataAnomaly(response: any): AnomalyProcessLogsModel {
    var anomalyProcessLogs: AnomalyProcessLogsModel = new AnomalyProcessLogsModel();
    if(response){
      anomalyProcessLogs.totalNoFilterStep = response.totalNoFilterStep;
      anomalyProcessLogs.anomalyStepCount = response.anomalyStepCount;
      anomalyProcessLogs.records = [];
      if(response.anomalyData){
        for(var index=0; index<response.anomalyData.length; index++){
          var anomalyProcessLogsData = new AnomalyProcessLogsDataModel();
          anomalyProcessLogsData.comment = response.anomalyData[index].comment;
          anomalyProcessLogsData.inFileName = response.anomalyData[index].inFileName;
          anomalyProcessLogsData.inRowCount = response.anomalyData[index].inRowCount;
          anomalyProcessLogsData.isAnomaly = (response.anomalyData[index].isAnomaly === "Yes"
                                          || response.anomalyData[index].isAnomaly === "yes") ? true :  false;;
          anomalyProcessLogsData.journalId = response.anomalyData[index].jid;
          anomalyProcessLogsData.operation = response.anomalyData[index].operation;
          anomalyProcessLogsData.operationName = 
            this.uiJsonDataService.getFunctionsUiJson().find(func => func.code === response.anomalyData[index].operation).name;
          anomalyProcessLogsData.outFileName = response.anomalyData[index].outFileName;
          anomalyProcessLogsData.outRowCount = response.anomalyData[index].outRowCount;
          anomalyProcessLogsData.removeCount = response.anomalyData[index].removeCount;
          anomalyProcessLogsData.runDate = response.anomalyData[index].runDate;
          anomalyProcessLogsData.stepNo = response.anomalyData[index].stepNo;
          anomalyProcessLogs.records.splice(0, 0, anomalyProcessLogsData);
        }
        anomalyProcessLogs.records = this.generalUtility.getSortedArray(anomalyProcessLogs.records, "inputNo");
      }
    }
    return anomalyProcessLogs;
  }

  getJournalInputLogHistoryAsync(request: any): Observable<HttpResponse<any>> {
    return this.advisorAnomalyDataService.getJournalInputLogHistoryAsync(request);
  }

  getJournalProcessedLogHistoryAsync(request: any): Observable<HttpResponse<any>> {
    return this.advisorAnomalyDataService.getJournalProcessedLogHistoryAsync(request);
  }

  getAdvisoryConfigListAsync(journalId: journalIdType, rundate: string): Observable<HttpResponse<any>> {
    return this.advisorAnomalyDataService.getAdvisoryConfigListAsync(journalId, rundate);
  }

  getInputFileAnomalyDataAsync(journalId: journalIdType, runDate:string, inputFileName: string): Observable<HttpResponse<any>> {
    return this.advisorAnomalyDataService.getInputFileAnomalyDataAsync(journalId, runDate, inputFileName);
  }

  getAnomalyStatCountAsync(journalId: journalIdType, rundate: string): Observable<HttpResponse<any>> {
    return this.advisorAnomalyDataService.getAnomalyStatCountAsync(journalId, rundate);
  }
}
