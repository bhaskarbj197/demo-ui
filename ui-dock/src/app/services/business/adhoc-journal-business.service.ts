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
import { AdhocJournalDataService } from '../data/adhoc-journal-data.service';
import { AdhocJournalModel, AdhocJournalDetailModel, DataColumnModel, AdhocJournalForAdvisorModel } from 'src/app/models/adhocJournal.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { RuleSetModel } from 'src/app/models/validationRules.model';
import { UserPartialModel } from 'src/app/models/user.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AdhocJournalBusinessService {

  constructor(private adhocJournalData: AdhocJournalDataService,
    private enumLoaderService: EnumLoaderService,
    private generalUtility: GeneralUtility) { }

  private getUserNameEmail(userResponse: any = null): string {
    var result: string = "";
    if(userResponse){
      result = userResponse.firstName + " " + userResponse.lastName + " (" + userResponse.email + ")";
    }
    return result;
  }

  createAdhocJournalAsync(postData: any) : Observable<HttpResponse<any>> {
    return this.adhocJournalData.createAdhocJournalAsync(postData);
  }

  getAllAdhocJournalsAsync(tableConfig: TableConfigModel): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    return this.adhocJournalData.getAllAdhocJournalsAsync(request);
  }

  getAllAdhocJournal(response: any): Array<AdhocJournalModel> {
    var result: Array<AdhocJournalModel> = new Array<AdhocJournalModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var adhoc = new AdhocJournalModel();
        adhoc.id = response[index].id;
        adhoc.name = response[index].name;
        adhoc.description = response[index].description;
        adhoc.frequency = response[index].frequency;
        adhoc.template.id = response[index].templateId;
        adhoc.template.name = response[index].templateName;
        adhoc.businessRule.name = response[index].rulesTemplate;
        adhoc.superUser = response[index].superUser;
        adhoc.reviewer = response[index].reviewer;
        adhoc.status = response[index].runStatus;
        result.push(adhoc);
      }
    }
    return result;
  }

  createAdhocJournalManualAsync(request: any): Observable<HttpResponse<any>> {
    return this.adhocJournalData.createAdhocJournalManualAsync(request);
  }

  getAdhocJournalDetailsAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.adhocJournalData.getAdhocJournalDetailsAsync(journalId);
  }

  getAdhocJournalDetails(response: any, journalId: journalIdType): AdhocJournalDetailModel {
    var result: AdhocJournalDetailModel = new AdhocJournalDetailModel();
    if(response){
      result.id = journalId;
      result.name = response.jccName;
      result.description = response.jccDesc;
      result.template = new TemplateMasterPartialModel(response.tempId, response.tempName);
      result.frequency = response.runFreq;
      result.businessRule = new RuleSetModel(response.businessRule.id, response.businessRule.value);
      result.superUser = new UserPartialModel(response.superuser.userId, this.getUserNameEmail(response.superuser));
      result.reviewer = new UserPartialModel(response.reviewer.userId, this.getUserNameEmail(response.reviewer));
      result.preparer = new UserPartialModel(response.preparer.userId, this.getUserNameEmail(response.preparer));
      if(response.requesterEmail){
        result.requesterEmail = response.requesterEmail;
      }
      result.dataValues = response.tempValue;
      result.dataColumns = new Array<DataColumnModel>();
      if(response.tempColumn && response.tempColumn.length>0){
        for(var index=0; index<response.tempColumn.length; index++){
          var column: DataColumnModel = new DataColumnModel();
          column.col = response.tempColumn[index].col;
          if(response.tempColumn[index].isCrReq && response.tempColumn[index].isDrReq){
            column.typ = this.enumLoaderService.outputReqColTypes.CR_DR;
          } else if(response.tempColumn[index].isCrReq){
            column.typ = this.enumLoaderService.outputReqColTypes.CR;
          } else if(response.tempColumn[index].isDrReq){
            column.typ = this.enumLoaderService.outputReqColTypes.DR;
          }
          result.dataColumns.push(column);
        }
      }
    }
    return result;
  }

  getAdvisoryAdhocJournalsAsync(tableConfig: TableConfigModel = null): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.monthNo = 0;
    return this.adhocJournalData.getAdvisoryAdhocJournalsAsync(request);
  }

  getAdvisoryAdhocJournals(response: any): Array<AdhocJournalForAdvisorModel> {
    var result: Array<AdhocJournalForAdvisorModel> = new Array<AdhocJournalForAdvisorModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var jrnl: AdhocJournalForAdvisorModel = new AdhocJournalForAdvisorModel();
        jrnl.id = response[index].id;
        jrnl.name = response[index].name;
        jrnl.frequency = response[index].runType;
        jrnl.status = response[index].status;
        jrnl.runDate = response[index].runDate;
        jrnl.validationStatus = response[index].validationStatus;
        jrnl.financialImpact = response[index].financialImpact;
        result.push(jrnl);
      }
    }
    return result;
  }
}
