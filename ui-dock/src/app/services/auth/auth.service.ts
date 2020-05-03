/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */
import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { RoleModel } from 'src/app/models/role.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private dataService: DataService,
    private constantLoaderService: ConstantLoaderService, 
    private dataAccessService: DataAccessService,
    private generalUtility: GeneralUtility,
    private businessLoaderService: BusinessLoaderService) { }

    
  setUser(userInfo: any) {
    this.dataService.user.id = userInfo.sub;
    this.dataService.user.fName = userInfo.given_name ? userInfo.given_name : "";
    this.dataService.user.lName = userInfo.family_name;
    this.dataService.user.email = userInfo.email;
    this.dataService.user.userName = userInfo.preferred_username;
    this.dataService.user.company.id = userInfo;
    this.dataService.user.company.name = userInfo.azp;
    var isAuthorizationValid: boolean = false;
    if(userInfo.realm_access.roles && userInfo.realm_access.roles.length > 0){
      this.dataService.user.role = this.getRoleActionForUserByRoleName(userInfo.realm_access.roles);
      if(this.dataService.user.role && !this.generalUtility.isEmptyOrUndefined(this.dataService.user.role.roleName)){
        isAuthorizationValid = true;
      }
    }
    if(isAuthorizationValid){
      this.dataService.isUserLoggedIn = true;
    }
  }

  getRoleActionForUserByRoleName(userRoles: Array<string>): RoleModel {
    let roleList: Array<RoleModel> = this.businessLoaderService.roleBusinessService.getRoleActionList();
    if(roleList.findIndex(r => r.isBusinessAdmin) >= 0){
      let businessAdminCode: string = roleList.find(r => r.isBusinessAdmin).keycloakRoleCode;
      if(businessAdminCode && (userRoles.findIndex(ur => ur === businessAdminCode) >= 0)){
        return roleList.find(r => r.keycloakRoleCode === businessAdminCode);
      }
    }
    for(var index=0; index<userRoles.length; index++){
      if(roleList.findIndex(r => r.keycloakRoleCode === userRoles[index]) >= 0){
        return roleList.find(r => r.keycloakRoleCode === userRoles[index]);
      }
    }
    return null;
  }

  getConfigFromServer(): Observable<HttpResponse<any>> {
    return this.dataAccessService.getInitInfoAsync(this.constantLoaderService.relativeUrlsService.GET_CONFIG);
  }
}
