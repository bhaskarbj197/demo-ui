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
import { AdvisorDetailGraphDataService } from '../data/advisor-detail-graph-data.service';
import { ValidationStatusModel } from '../../models/validationStatus.model';
import { WorkdayJournalStatusModel } from '../../models/workdayJournalStatus.model';
import { DataAnomalyPartialModel } from '../../models/data-anomaly.model';
import { InputFileAvailableModel } from '../../models/inputFileAvailable.model';

@Injectable({
  providedIn: 'root'
})
export class AdvisorDetailGraphBusinessService {

  constructor(private advisorDetailGraphDataService: AdvisorDetailGraphDataService) { }

  getValidationStatusAsync(): Observable<HttpResponse<any>>{
    return this.advisorDetailGraphDataService.getValidationStatusAsync();
  }

  getValidationStatusList(response: any): Array<ValidationStatusModel> {
    var result: Array<ValidationStatusModel> = new Array<ValidationStatusModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var validationStatus: ValidationStatusModel = new ValidationStatusModel();
        validationStatus.journalId = response[index].id;
        validationStatus.journalName = response[index].name;
        validationStatus.runDate = response[index].runDate;
        validationStatus.totalCount = response[index].totalCount;
        validationStatus.validationPassCount = response[index].validationPassCount;
        validationStatus.validationFailCount = response[index].validationFailCount;
        validationStatus.validationStatus = response[index].validationStatus;
        result.push(validationStatus);
      }
    }
    return result;
  }

  getJournalStatusByWorkdayAsync(): Observable<HttpResponse<any>>{
    return this.advisorDetailGraphDataService.getJournalStatusByWorkdayAsync();
  }

  getJournalStatusByWorkday(response: any): Array<WorkdayJournalStatusModel> {
    var result: Array<WorkdayJournalStatusModel> = new Array<WorkdayJournalStatusModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var workdayJournalStatus: WorkdayJournalStatusModel = new WorkdayJournalStatusModel();
        workdayJournalStatus.journalId = response[index].id;
        workdayJournalStatus.journalName = response[index].name;
        workdayJournalStatus.runDate = response[index].runDate;
        workdayJournalStatus.status = response[index].status;
        workdayJournalStatus.workday = response[index].wd;
        result.push(workdayJournalStatus);
      }
    }
    return result;
  }

  getDataAnomalyByTypeAsync(typ: string): Observable<HttpResponse<any>>{
    return this.advisorDetailGraphDataService.getDataAnomalyByTypeAsync(typ);
  }

  getDataAnomalyByType(response: any): Array<DataAnomalyPartialModel> {
    var result: Array<DataAnomalyPartialModel> = new Array<DataAnomalyPartialModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var dataAnomalyPartialModel: DataAnomalyPartialModel = new DataAnomalyPartialModel();
        dataAnomalyPartialModel.anomalyStatus = response[index].anomaly;
        dataAnomalyPartialModel.journalId = response[index].id;
        dataAnomalyPartialModel.journalName = response[index].name;
        dataAnomalyPartialModel.runDate = response[index].runDate;
        dataAnomalyPartialModel.typ = response[index].stages;
        result.push(dataAnomalyPartialModel);
      }
    }
    return result;
  }

  getInputFileAvailibilityAsync(): Observable<HttpResponse<any>>{
    return this.advisorDetailGraphDataService.getInputFileAvailibilityAsync();
  }

  getInputFileAvailibility(response: any): Array<InputFileAvailableModel> {
    var result: Array<InputFileAvailableModel> = new Array<InputFileAvailableModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var inputFileAvailable: InputFileAvailableModel = new InputFileAvailableModel();
        inputFileAvailable.errorType = response[index].errorType;
        inputFileAvailable.journalId = response[index].id;
        inputFileAvailable.journalName = response[index].name;
        inputFileAvailable.runDate = response[index].runDate;
        inputFileAvailable.status = response[index].status;
        inputFileAvailable.message = response[index].message;
        result.push(inputFileAvailable);
      }
    }
    return result;
  }
}
