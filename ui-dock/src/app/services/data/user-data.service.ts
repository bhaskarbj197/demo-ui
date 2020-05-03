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
import { userIdType, companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getUserLoginAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.USER_LOGIN, request);
  }

  getUserListAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.GET_ALL_USERS, request);
  }

  updateUserById(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.UPDATE_USER_BY_ID, request);
  }

  addUser(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.ADD_USER, request);
  }

  getUserListByRoleIdAsync(roleId: number, companyId?: companyIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_USER_LIST_BY_ROLE.replace("{roleId}", roleId.toString())
      + (companyId ? ("/" + companyId.toString()) : ""));
  }

  getUserDetailsAsync(userId: userIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_USER_DETAILS.replace("{userId}", userId.toString()));
  }

  changePasswordAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.CHANGE_PASSWORD, request);
  }

  getUserListByRoleNameFromKeycloakAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.KEYCLOAK_GET_USERS_BY_ROLE, request);
  }

  getUserListByCompanyFromKeycloakAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.KEYCLOAK_GET_USER_LIST, request);
  }
}
