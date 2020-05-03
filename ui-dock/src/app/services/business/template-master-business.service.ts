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
import { TemplateMasterDataService } from '../data/template-master-data.service';
import { DataService } from '../data.service';
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TemplateMasterBusinessService {

  constructor(private templateMasterData: TemplateMasterDataService,
    private dataService: DataService) { }

  addTemplateMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.templateMasterData.addTemplateMasterAsync(request);
  }

  updateTemplateWithCrDrColumnsAsync(request: any): Observable<HttpResponse<any>> {
    return  this.templateMasterData.updateTemplateWithCrDrColumnsAsync(request);
  }

  activateDeactivateTemplateAsync(templateId: number, isActive: boolean): Observable<HttpResponse<any>> {
    var request: any = {
      tempId: templateId,
      isActive: isActive
    };
    return  this.templateMasterData.activateDeactivateTemplateAsync(request);
  }

  getAllTemplatesAsync(): Observable<HttpResponse<any>> {
    var companyId: companyIdType = this.dataService.user.role.isPlatformAdmin ? null : (this.dataService.user.company.id as any);
    return this.templateMasterData.getAllTemplatesAsync(companyId);
  }

  getAllTemplateColumnsAsync(ids: Array<number>): Observable<HttpResponse<any>> {
    var request = { tempId: ids };
    return this.templateMasterData.getAllTemplateColumnsAsync(request);
  }

  deleteTemplateAsync(request: any): Observable<HttpResponse<any>> {
    return this.templateMasterData.deleteTemplateAsync(request);
  }

}
