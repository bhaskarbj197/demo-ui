/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SupportingDocumentDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getSupportingDocumentListByJournalIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_SUPP_DOC_LIST + journalId.toString());
  }

  uploadSupportingDocumentAsync(body: any) {
    return this.dataService.postFormAsync(
      this.constantLoaderService.relativeUrlsService.UPLOAD_SUPP_DOC, body);
  }

  deleteSupportingDocAsync(request: any) {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_SUPP_DOC, request);
  }

  downloadSupportingDocAsync(request: any, responseType: any) {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.DOWNLOAD_SUPP_DOC, request, responseType);
  }

  updateSupportingDocActivityAsync(request: any) {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.UPDATE_SUPP_DOC_ACTIVITY, request);
  }
}
