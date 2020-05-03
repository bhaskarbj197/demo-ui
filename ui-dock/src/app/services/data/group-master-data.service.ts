/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GroupMasterDataService {

  constructor(private dataAccessService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  addNewGroupMasterAsync(requestBody): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(this.constantLoaderService.relativeUrlsService.ADD_GROUP_MASTER, requestBody);
  }

  updateGroupMasterAsync(requestBody): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(this.constantLoaderService.relativeUrlsService.UPDATE_GROUP_MASTER, requestBody);
  }

  getAllMasterGroupsAsync(companyId?: companyIdType): Observable<HttpResponse<any>> {
    return this.dataAccessService.getAsync(this.constantLoaderService.relativeUrlsService.GET_GROUP_MASTER_INFO
      + (companyId ? ("/" + companyId.toString()) : ""));
  }

  deleteGroupMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(this.constantLoaderService.relativeUrlsService.DELETE_GROUP_MASTER, request);
  }
}
