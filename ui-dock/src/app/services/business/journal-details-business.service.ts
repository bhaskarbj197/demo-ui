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
import { JournalDetailsDataService } from '../data/journal-details-data.service';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { AboutModel } from 'src/app/models/about.model';
import { DataService } from '../data.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class JournalDetailsBusinessService {

  constructor(private journalDetailsData: JournalDetailsDataService,
    private constantLoaderService: ConstantLoaderService,
    private dataService: DataService) { }

  getJournalDetailsByIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getJournalDetailsByIdAsync(journalId);
  }

  getJournalFilesColumnsInfoByIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getJournalFilesColumnsInfoByIdAsync(journalId);
  }

  getJournalInputSourcesInfoAsync(journalId: journalIdType, runDate?: string): Observable<HttpResponse<any>> {
    var request: any = {};
    request.jid = journalId;
    if(runDate !== undefined){
      request.runDate = runDate;
    }
    return this.journalDetailsData.getJournalInputSourcesInfoAsync(request);
  }

  getResultDataByTblNameAsync(tblName: string, journalId: journalIdType, folderType: string, runDate: string): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getResultDataByTblNameAsync(tblName, journalId, folderType, runDate);
  }

  postUploadInputFileAsync(body: any) {
    return this.journalDetailsData.postUploadInputFileAsync(body);
  }

  getStepDataAsync(journalId: journalIdType, stepId: number): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getStepDataAsync(journalId, stepId);
  }

  createAboutJson(aboutDetails: AboutModel, isCreateJournal: boolean = false): any {
    var reqJson = {};
    reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG] = {};
    if(aboutDetails){
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo = {};
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.name = {
        value: aboutDetails.journalInfo.name
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.id = {
        value: aboutDetails.journalInfo.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.description = {
        value: aboutDetails.journalInfo.description
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.frequency = {
        value: aboutDetails.journalInfo.frequency.name,
        id: aboutDetails.journalInfo.frequency.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.template = {
        value: aboutDetails.journalInfo.template.name,
        id: aboutDetails.journalInfo.template.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].journalInfo.isReversal = {
        value: (aboutDetails.journalInfo.isReversal ? "Yes" : "No")
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].workflow = {};
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].workflow.superuser = {
        value: aboutDetails.workflow.superuser
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].workflow.reviewer = {
        value: aboutDetails.workflow.reviewer
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].workflow.approver = {
        value: aboutDetails.workflow.approver
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].workflow.preparer = {
        value: (isCreateJournal ? this.dataService.user.id : (aboutDetails.workflow.preparer ? aboutDetails.workflow.preparer : 0))
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement = {};
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.sourceSLA = {
        value: aboutDetails.riskManagement.sourceSLA
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.sourceSLATime = {
        value: aboutDetails.riskManagement.sourceSLATime
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.sourceContact = {
        value: aboutDetails.riskManagement.sourceContact
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.postDate = {
        value: aboutDetails.riskManagement.postDate
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.postDateTime = {
        value: aboutDetails.riskManagement.postDateTime
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.timezone = {
        value: aboutDetails.riskManagement.timezone.name,
        id: aboutDetails.riskManagement.timezone.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.postContact = {
        value: aboutDetails.riskManagement.postContact
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.businessRules = {
        value: aboutDetails.riskManagement.businessRules.name,
        id: aboutDetails.riskManagement.businessRules.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.calendar = {
        value: aboutDetails.riskManagement.calendar.name,
        id: aboutDetails.riskManagement.calendar.id
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.group1 = {
        value: aboutDetails.riskManagement.group1.element,
        name: aboutDetails.riskManagement.group1.groupName
      };
      reqJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG].riskManagement.group2 = {
        value: aboutDetails.riskManagement.group2.element,
        name: aboutDetails.riskManagement.group2.groupName
      };
    }
    return reqJson;
  }

  createJournalAsync(aboutDetails: AboutModel): Observable<HttpResponse<any>> {
    var reqJson = {};
    reqJson = this.createAboutJson(aboutDetails, true);
    reqJson["input"] = [];
    reqJson["processSteps"] = [];
    reqJson["outputTemplate"] = [];
    reqJson["outputMapping"] = {};
    reqJson["runHistory"] = [];
    return this.journalDetailsData.createJournalAsync(reqJson);
  }

  saveJournalAsync(request: any): Observable<HttpResponse<any>> {
    return this.journalDetailsData.saveJournalAsync(request);
  }

  getTemplateColumnsAsync(templateName: string): Observable<HttpResponse<any>> {
    var request: any = {
      templateName: templateName
    };
    return this.journalDetailsData.getTemplateColumnsAsync(request);
  }

  getProcessedDataTableColumnsAsync(journalId: journalIdType, tabName: string): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getProcessedDataTableColumnsAsync(journalId, tabName);
  }

  downloadFileAsync(data: any): Observable<any> {
    return this.journalDetailsData.downloadFileAsync(data);
  }

  deleteInputFileAsync(request: any): Observable<any> {
    return this.journalDetailsData.deleteInputFileAsync(request);
  }

  extractInputFileAsync(request: any): Observable<any> {
    return this.journalDetailsData.extractInputFileAsync(request);
  }

  clearInputFileContent(request: any): Observable<any> {
    return this.journalDetailsData.clearInputFileContent(request);
  }

  getFileExtractionStatusAsync(journalId: journalIdType, sourceName: string, runDate: string): Observable<any> {
    return this.journalDetailsData.getFileExtractionStatusAsync(journalId, sourceName, runDate);
  }

  getTemplateNameByJournalIdAsync(journalId: journalIdType): Observable<any> {
    return this.journalDetailsData.getTemplateNameByJournalIdAsync(journalId);
  }

  loadAboutObject(response: any): AboutModel {
    var result: AboutModel = new AboutModel();
    if(response){
      if(response.journalInfo){
        if(response.journalInfo.name){
          result.journalInfo.name = response.journalInfo.name.value;
        }
        if(response.journalInfo.id){
          result.journalInfo.id = response.journalInfo.id.value;
        }
        if(response.journalInfo.description){
          result.journalInfo.description = response.journalInfo.description.value;
        }
        if(response.journalInfo.frequency){
          result.journalInfo.frequency.name = response.journalInfo.frequency.value;
          if(response.journalInfo.frequency.id){
            result.journalInfo.frequency.id = response.journalInfo.frequency.id;
          }else{
            result.journalInfo.frequency.id = 0;
          }
          result.journalInfo.frequency.isActive = true;
        }
        if(response.journalInfo.template){
          result.journalInfo.template.name = response.journalInfo.template.value;
          if(response.journalInfo.template.id){
            result.journalInfo.template.id = response.journalInfo.template.id;
          }else{
            result.journalInfo.template.id = 0;
          }
        }
        if(response.journalInfo.isReversal){
          result.journalInfo.isReversal = (response.journalInfo.isReversal.value.toLowerCase().trim() === "yes");
        }
      }
      if(response.workflow){
        if(response.workflow.superuser){
          result.workflow.superuser = response.workflow.superuser.value;
        }
        if(response.workflow.reviewer){
          result.workflow.reviewer = response.workflow.reviewer.value;
        }
        if(response.workflow.preparer){
          result.workflow.preparer = response.workflow.preparer.value;
        }
        if(response.workflow.approver){
          result.workflow.approver = response.workflow.approver.value;
        }
      }
      if(response.riskManagement){
        if(response.riskManagement.sourceSLA){
          result.riskManagement.sourceSLA = response.riskManagement.sourceSLA.value;
        }
        if(response.riskManagement.sourceSLATime){
          result.riskManagement.sourceSLATime = response.riskManagement.sourceSLATime.value;
        }
        if(response.riskManagement.sourceContact){
          result.riskManagement.sourceContact = response.riskManagement.sourceContact.value;
        }
        if(response.riskManagement.postDate){
          result.riskManagement.postDate = response.riskManagement.postDate.value;
        }
        if(response.riskManagement.postDateTime){
          result.riskManagement.postDateTime = response.riskManagement.postDateTime.value;
        }
        if(response.riskManagement.timezone){
          result.riskManagement.timezone.name = response.riskManagement.timezone.value;
          if(response.riskManagement.timezone.id){
            result.riskManagement.timezone.id = response.riskManagement.timezone.id;
          } else {
            result.riskManagement.timezone.id = 0;
          }
          result.riskManagement.timezone.isActive = true;
        }
        if(response.riskManagement.postContact){
          result.riskManagement.postContact = response.riskManagement.postContact.value;
        }
        if(response.riskManagement.businessRules){
          result.riskManagement.businessRules.name = response.riskManagement.businessRules.value;
          if(response.riskManagement.businessRules.id){
            result.riskManagement.businessRules.id = response.riskManagement.businessRules.id;
          } else {
            result.riskManagement.businessRules.id = 0;
          }
        }
        if(response.riskManagement.calendar){
          result.riskManagement.calendar.name = response.riskManagement.calendar.value;
          if(response.riskManagement.calendar.id){
            result.riskManagement.calendar.id = response.riskManagement.calendar.id;
          } else {
            result.riskManagement.calendar.id = 0;
          }
        }
        if(response.riskManagement.group1){
          result.riskManagement.group1.element = response.riskManagement.group1.value;
          if(response.riskManagement.group1.name){
            result.riskManagement.group1.groupName = response.riskManagement.group1.name;
          } else {
            result.riskManagement.group1.groupName = "";
          }
        }
        if(response.riskManagement.group2){
          result.riskManagement.group2.element = response.riskManagement.group2.value;
          if(response.riskManagement.group2.name){
            result.riskManagement.group2.groupName = response.riskManagement.group2.name;
          } else {
            result.riskManagement.group2.groupName = "";
          }
        }
      }
    }
    return result;
  }
}