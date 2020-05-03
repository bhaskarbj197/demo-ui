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

@Injectable({
  providedIn: 'root'
})
export class JournalAutoApproverDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  saveRuleAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(
      this.constantLoaderService.relativeUrlsService.SAVE_JOURNAL_AUTO_APPROVER_RULE, request);
  }

  updateRuleAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.UPDATE_JOURNAL_AUTO_APPROVER_RULE, request);
  }

  getRuleListAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_JOURNAL_AUTO_APPROVER_RULE_LIST);
  }

  deleteRuleAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_JOURNAL_AUTO_APPROVER_RULE, request);
  }

  saveRuleStatusAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.SAVE_JOURNAL_AUTO_APPROVER_RULE_STATUS, request);
  }
}
