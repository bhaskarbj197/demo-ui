/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { GroupMasterDataService } from '../data/group-master-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { companyIdType } from '../types';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class GroupMasterBusinessService {

  constructor(private groupMasterData: GroupMasterDataService,
    private dataService: DataService) { }

  addNewGroupMasterAsync(requestBody): Observable<HttpResponse<any>> {
    return this.groupMasterData.addNewGroupMasterAsync(requestBody)
  }

  updateGroupMasterAsync(requestBody): Observable<HttpResponse<any>> {
    return this.groupMasterData.updateGroupMasterAsync(requestBody)
  }

  getAllMasterGroupsAsync(): Observable<HttpResponse<any>> {
    var companyId: companyIdType =  (this.dataService.user && this.dataService.user.role 
      &&  !this.dataService.user.role.isPlatformAdmin) ? this.dataService.user.company.id as any : null;
    return this.groupMasterData.getAllMasterGroupsAsync(companyId);
  }

  deleteGroupMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.groupMasterData.deleteGroupMasterAsync(request);
  }
}
