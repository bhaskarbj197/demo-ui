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
export class FinancialImpactDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getFinancialImpactAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.ADVR_GET_FINANCIAL_IMPACT
      .replace("{journalId}", journalId.toString())
      .replace("{runDate}", runDate));
  }
}
