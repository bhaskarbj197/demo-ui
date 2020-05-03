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
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CompanyDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getCompanyListAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.GET_ALL_COMPANIES);
  }

  getCompanyDetailListAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.GET_COMPANY_LIST);
  }

  addCompanyAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.ADD_COMPANY, request);
  }

  getCompanyDetailsByIdAsync(companyId: companyIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_COMPANY_DETAILS.replace("{companyId}", companyId.toString()));
  }

  updateCompanyAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.UPDATE_COMPANY, request);
  }

  deleteCompanyAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.DELETE_COMPANY, request);
  }
}
