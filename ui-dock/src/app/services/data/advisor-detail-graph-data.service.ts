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
export class AdvisorDetailGraphDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getValidationStatusAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_VALIDATION_STATUS);
  }

  getJournalStatusByWorkdayAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_WORKDAY_JOURNAL_STATUS);
  }

  getDataAnomalyByTypeAsync(typ: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_DATA_ANOMALY_BY_TYPE + typ);
  }

  getInputFileAvailibilityAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_INPUT_FILE_AVAILIBILITY);
  }
}
