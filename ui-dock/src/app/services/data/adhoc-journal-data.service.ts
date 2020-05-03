/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AdhocJournalDataService {

  constructor(private dataAccess: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  createAdhocJournalAsync(postData: any) : Observable<HttpResponse<any>> {
    return this.dataAccess.postFormAsync(this.constantLoaderService.relativeUrlsService.SAVE_ADHOC_JOURNAL, postData);
  }

  getAllAdhocJournalsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.putAsync(this.constantLoaderService.relativeUrlsService.GET_ADHOC_JOURNAL_LIST, request);
  }

  createAdhocJournalManualAsync(request: any) : Observable<HttpResponse<any>> {
    return this.dataAccess.postAsync(this.constantLoaderService.relativeUrlsService.SAVE_ADHOC_MANUAL, request);
  }

  getAdhocJournalDetailsAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataAccess.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_ADHOC_DETAILS.replace("{journalId}", journalId.toString()));
  }

  getAdvisoryAdhocJournalsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.putAsync(this.constantLoaderService.relativeUrlsService.GET_ADVISORY_ADHOC_LIST, request);
  }
}
