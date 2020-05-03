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
export class ReportDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getJournalSummaryReportAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.RPRT_JOURNAL_POSTING_SMRY, request);
  }

  downloadReportAsync(request: any, responseType: any) {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.POST_DOWNLOAD_REPORT, request, responseType);
  }
}
