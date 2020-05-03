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
export class TemplateMasterDataService {

  constructor(private constantLoaderService: ConstantLoaderService,
    private dataAccessService: DataAccessService) { }

  addTemplateMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postFormAsync(this.constantLoaderService.relativeUrlsService.ADD_TEMPLATE_MASTER, request);
  }

  getAllTemplatesAsync(companyId: companyIdType = null): Observable<HttpResponse<any>> {
    return this.dataAccessService.getAsync(this.constantLoaderService.relativeUrlsService.GET_TEMPLATE_MASTER_INFO +
      (companyId ? ("/" + companyId.toString()) : ""));
  }

  updateTemplateWithCrDrColumnsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(this.constantLoaderService.relativeUrlsService.UPDATE_TEMPLATE_CR_DR_COL, request);
  }

  getAllTemplateColumnsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(this.constantLoaderService.relativeUrlsService.GET_ALL_TEMPLATE_COLUMNS, request);
  }

  deleteTemplateAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(this.constantLoaderService.relativeUrlsService.DELETE_TEMPLATE, request);
  }

  activateDeactivateTemplateAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(this.constantLoaderService.relativeUrlsService.ACTIVATE_DEACTIVATE_TEMPLATE_MASTER, request);
  }
}
