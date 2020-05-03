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
export class AdvisorAnomalyDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getJournalInputLogDataAnomalyAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.ADVR_INPUT_LOG_ANOMALY, request);
  }

  getJournalProcessedLogDataAnomalyAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.ADVR_PROCESSED_LOG_ANOMALY, request);
  }

  getJournalInputLogHistoryAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_INPUT_LOG_HOSTORY, request);
  }

  getJournalProcessedLogHistoryAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_PROCESS_LOG_HOSTORY, request);
  }

  getAdvisoryConfigListAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_CONFIG_LIST
        .replace("{journalId}", journalId.toString())
        .replace("{runDate}", runDate));
  }

  getInputFileAnomalyDataAsync(journalId: journalIdType, runDate: string, inputFileName: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_ANOMALY_DATA
      .replace("{journalId}", journalId.toString())
      .replace("{runDate}", runDate) + (inputFileName !== "" ? ("/"+ inputFileName) : ""));
  }

  getAnomalyStatCountAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_ANOMALY_STAT_COUNT
      .replace("{journalId}", journalId.toString())
      .replace("{runDate}", runDate));
  }
}
