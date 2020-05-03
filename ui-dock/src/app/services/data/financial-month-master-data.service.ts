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
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialMonthMasterDataService {

  constructor(private constantLoaderService: ConstantLoaderService,
    private dataAccessService: DataAccessService) { }

  getFinancialMonthssMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(this.constantLoaderService.relativeUrlsService.GET_FINANCIAL_MONTHS, request);
  }

  saveFinancialMonthssMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(
      this.constantLoaderService.relativeUrlsService.ADD_EDIT_FINANCIAL_MONTH, request);
  }
}
