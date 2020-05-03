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
export class LogDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  saveLogAsync(data: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.SAVE_LOG, data);
  }

  getSavedLogWithoutDateAsync(journalId: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_SAVED_LOG_WITHOUT_DATE + journalId);
  }

  getSavedLogWithDateAsync(journalId: string, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_SAVED_LOG_WITH_DATE.replace("{journalId}", journalId.toString()) + runDate);
  }

  getProcessStepLogWithoutDateAsync(journalId: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_PROCESS_STEP_LOG_WITHOUT_DATE + journalId);
  }

  getProcessStepLogByDateAsync(journalId: string, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_PROCESS_STEP_LOG_BY_DATE.replace("{journalId}", journalId.toString()) + runDate);
  }
}
