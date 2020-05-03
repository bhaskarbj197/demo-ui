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
import { BulkUploadDataService } from '../data/bulk-upload-data.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { BulkJournalModel } from 'src/app/models/journalInfo.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { BulkCalendarMasterModel } from 'src/app/models/calendar.model';
import { BulkFinancialMonthMasterModel } from 'src/app/models/financialMonth.model';
import { bulkInputFilesModel } from 'src/app/models/inputSource.model';

@Injectable({
  providedIn: 'root'
})
export class BulkUploadBusinessService {

  constructor(private bulkUploadData: BulkUploadDataService,
    private enumLoaderService: EnumLoaderService) { }

  getBulkJournalList(response: any) {
    var journalRecords: Array<BulkJournalModel> = [];
    if(response) {
      journalRecords = response.map(record => new BulkJournalModel().deserialize(record));
    }
    return journalRecords;
  }

  getBulkCalendarMasterData(response: any) {
    var caledarMasterRecords: Array<BulkCalendarMasterModel> = [];
    if(response) {
      caledarMasterRecords = response.map(record => new BulkCalendarMasterModel().deserialize(record));
    }
    return caledarMasterRecords;
  }

  getBulkFinMonthMasterData(response: any) {
    var finMonthMasterRecords: Array<BulkFinancialMonthMasterModel> = [];
    if(response) {
      finMonthMasterRecords = response.map(record => new BulkFinancialMonthMasterModel().deserialize(record));
    }
    return finMonthMasterRecords;
  }

  downloadBulkTemplateFile(bulkTemplateType: string): Observable<HttpResponse<any>> {
    var request: any = {};
    request.templateType = this.enumLoaderService.bulkTemplateTypes[bulkTemplateType];
    
    return this.bulkUploadData.downloadBulkTemplateFile(request);
  }

  uploadBulkTemplateFile(request: any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.uploadBulkTemplateFile(request);
  }

  validateBulkJournalTemplateFile(request: any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.validateBulkJournalTemplateFile(request);
  }

  processBulkJournalTemplateFile(request: any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.processBulkJournalTemplateFile(request);
  }

  validateBulkFinanceMonthTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.validateBulkFinanceMonthTemplateFile(request);
  }

  processBulkFinanceMonthTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.processBulkFinanceMonthTemplateFile(request);
  }

  validateBulkCalendarMasterTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.validateBulkCalendarMasterTemplateFile(request);
  }

  processBulkCalendarMasterTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.processBulkCalendarMasterTemplateFile(request);
  }

  uploadBulkInputZipAsync(formData: any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.uploadBulkInputZipAsync(formData);
  }

  validateBulkInputZipAsync(request:any): Observable<HttpResponse<any>> {
    return this.bulkUploadData.validateBulkInputZipAsync(request);
  }

  validateBulkInputZip(response: any): Array<bulkInputFilesModel> {
    var result: Array<bulkInputFilesModel> = new Array<bulkInputFilesModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var fil: bulkInputFilesModel = new bulkInputFilesModel();
        fil.fileName = response[index].file;
        fil.fileSize = response[index].size;
        fil.isValid = response[index].valid;
        fil.journalId = response[index].jid;
        fil.failedReasons = response[index].comment;
        result.push(fil);
      }
    }
    return result;
  }
}
