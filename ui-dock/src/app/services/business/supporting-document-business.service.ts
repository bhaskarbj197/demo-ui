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
import { SupportingDocumentDataService } from '../data/supporting-document-data.service';
import { SupportingDocModel } from '../../models/supportingDoc.model';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SupportingDocumentBusinessService {

  constructor(private supportingDocumentData: SupportingDocumentDataService) { }

  getSupportingDocumentListByJournalIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.supportingDocumentData.getSupportingDocumentListByJournalIdAsync(journalId);
  }

  getSupportingDocumentList(response: any): Array<SupportingDocModel>{
    var result: Array<SupportingDocModel> = new Array<SupportingDocModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var suppDoc: SupportingDocModel = new SupportingDocModel();
        suppDoc.journalId = response[index].jid;
        suppDoc.fileName = response[index].fileName;
        suppDoc.type = response[index].docType;
        suppDoc.fileType = response[index].fileType;
        suppDoc.isActive = response[index].active;
        suppDoc.createdDate = response[index].createdDateTime;
        result.push(suppDoc);
      }
    }
    return result;
  }

  uploadSupportingDocumentAsync(formData: any): Observable<HttpResponse<any>>{
    return this.supportingDocumentData.uploadSupportingDocumentAsync(formData);
  }

  deleteSupportingDocAsync(request: any): Observable<HttpResponse<any>> {
    return this.supportingDocumentData.deleteSupportingDocAsync(request);
  }

  downloadSupportingDocAsync(request: any, responseType: any): Observable<HttpResponse<any>> {
    return this.supportingDocumentData.downloadSupportingDocAsync(request, responseType);
  }

  updateSupportingDocActivityAsync(suppDoc: SupportingDocModel): Observable<HttpResponse<any>> {
    var request = {
      jid: suppDoc.journalId,
      fileName: suppDoc.fileName,
      fileType: suppDoc.fileType,
      active: !suppDoc.isActive
    };
    return this.supportingDocumentData.updateSupportingDocActivityAsync(request);
  }
}
