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
import { AdvisorHomeDataService } from '../data/advisor-home-data.service';
import { JournalForAdvisorModel } from '../../models/journalForAdvisor.model';
import { EnumLoaderService } from '../../loaders/enum-loader.service';
import { GraphDataModel } from '../../models/graphData.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AdvisorHomeBusinessService {

  constructor(private advisorHomeData: AdvisorHomeDataService,
    private enumLoaderService: EnumLoaderService,
    private generalUtility: GeneralUtility) { }

  private buildRequestObj(tableConfig: TableConfigModel) {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.monthNo = 0;
    return request;
  }

  getJournalDataListAsync(pageConfig: TableConfigModel = null): Observable<HttpResponse<any>> {
    var requestObj = this.buildRequestObj(pageConfig);
    return this.advisorHomeData.getJournalDataListAsync(requestObj);
  }

  getJournalGraphDataAsync(): Observable<HttpResponse<any>> {
    return this.advisorHomeData.getJournalGraphDataAsync();
  }

  getProcessedJournalDataList(responseList: any): Array<JournalForAdvisorModel>{
    let journalList: Array<JournalForAdvisorModel> = [];
    if(responseList){
      for(var index=0; index<responseList.length; index++){
        let journalInfo: JournalForAdvisorModel = new JournalForAdvisorModel();
        journalInfo.id = responseList[index].id;
        journalInfo.name = responseList[index].name;
        journalInfo.dataAnomalies = responseList[index].dataAnomalies;
        journalInfo.docEvidence = responseList[index].doccumentaryEvidence;
        journalInfo.financialImpact = responseList[index].financialImpact;
        journalInfo.runType = responseList[index].runType;
        journalInfo.runStatus = responseList[index].status;
        journalInfo.validationStatus = responseList[index].validationStatus;
        journalInfo.runDate = responseList[index].runDate;
        journalList.push(journalInfo);
      }
    }
    return journalList;
  }

  getAllRunDatesByJournalIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.advisorHomeData.getAllRunDatesByJournalIdAsync(journalId);
  }

  updateWorkflowStatusAsync(journalId: journalIdType, runDate: string, status: string): Observable<HttpResponse<any>> {
    var request = {
      jid: journalId,
      date: runDate,
      status: status
    };
    return this.advisorHomeData.updateWorkflowStatusAsync(request);
  }

  getJournalValidationStatusGraphData(response: any): GraphDataModel{
    var validationStatus: GraphDataModel = new GraphDataModel();
    for(var index=0; index<response.journalValidationStatus.length; index++){
      validationStatus.data.push(response.journalValidationStatus[index].count)
      validationStatus.labels.push(response.journalValidationStatus[index].value)
    }
    validationStatus.colors = [
      this.enumLoaderService.chartColors.PIE_GREEN, 
      this.enumLoaderService.chartColors.PIE_RED
    ];
    return validationStatus;
  }

  getJournalStatusByWdGraphData(response: any): GraphDataModel{
    var journalStatusByWdGraph: GraphDataModel = new GraphDataModel();
    var labels: Array<any> = [];
    for(var index=0; index<response.workDayWiseJournalStatus.length; index++){
      journalStatusByWdGraph.labels.push(response.workDayWiseJournalStatus[index].workDayValue);
      if(response.workDayWiseJournalStatus[index].workDayCount){
        if(index === 0){
          for(var cnt=0; cnt<response.workDayWiseJournalStatus[index].workDayCount.length; cnt++){
            labels.push({ label: response.workDayWiseJournalStatus[index].workDayCount[cnt].value, data: []});
          }
        }
        for(var cnt=0; cnt<response.workDayWiseJournalStatus[index].workDayCount.length; cnt++){
          labels.find(l => l.label === 
            response.workDayWiseJournalStatus[index].workDayCount[cnt].value).data.push(response.workDayWiseJournalStatus[index].workDayCount[cnt].count);
        }
      }
    }
    journalStatusByWdGraph.data = labels;
    journalStatusByWdGraph.colors = [
      this.enumLoaderService.chartColors.BAR_GREEN, 
      this.enumLoaderService.chartColors.BAR_RED, 
      this.enumLoaderService.chartColors.BAR_BLUE
    ];

    return journalStatusByWdGraph;
  }

  getDataAnomalyGraphData(response: any): GraphDataModel{
    var dataAnomalyGraph: GraphDataModel = new GraphDataModel();
    var labels: Array<any> = [];
    for(var index=0; index<response.dataAnomalies.length; index++){
      dataAnomalyGraph.labels.push(response.dataAnomalies[index].stage);
      if(response.dataAnomalies[index].anomalies){
        if(index === 0){
          for(var cnt=0; cnt<response.dataAnomalies[index].anomalies.length; cnt++){
            labels.push({ label: response.dataAnomalies[index].anomalies[cnt].value, data: []});
          }
        }
        for(var cnt=0; cnt<response.dataAnomalies[index].anomalies.length; cnt++){
          labels.find(l => l.label === 
            response.dataAnomalies[index].anomalies[cnt].value).data.push(response.dataAnomalies[index].anomalies[cnt].count);
        }
      }
    }
    dataAnomalyGraph.data = labels;
    dataAnomalyGraph.colors = [
      this.enumLoaderService.chartColors.BAR_RED_1, 
      this.enumLoaderService.chartColors.BAR_GREEN_1];

    return dataAnomalyGraph;
  }

  getInputFileAvailableGraphData(response: any): GraphDataModel{
    var inputFileAvailableGraph: GraphDataModel = new GraphDataModel();
    inputFileAvailableGraph.labels = ["Available", "Unavailable"];
    inputFileAvailableGraph.data.push(Math.round(response.fileAvailableCountInParcent));
    inputFileAvailableGraph.data.push(100 - Math.round(response.fileAvailableCountInParcent));
    inputFileAvailableGraph.colors = [
      this.enumLoaderService.chartColors.PIE_GREEN, 
      this.enumLoaderService.chartColors.PIE_RED
    ];
    return inputFileAvailableGraph;
  }
}