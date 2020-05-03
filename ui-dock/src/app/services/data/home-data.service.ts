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
export class HomeDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getJournalListAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.GET_ALL_JOURNALS, request);
  }

  deleteJournalById(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.DELETE_JOURNAL,
      request);
  }

  copyToNewJournalAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.JCC_POST_COPY_JOURNAL, request)
  }

  getJournalStatusCountListAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(
      this.constantLoaderService.relativeUrlsService.GET_ALL_JOURNALS_STATUS_COUNT, request);
  }
}
