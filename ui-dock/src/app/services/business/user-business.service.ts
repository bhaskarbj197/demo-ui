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
import { UserDataService } from '../data/user-data.service';
import { RoleModel, RolePartialModel } from '../../models/role.model';
import { UserModel, UserPartialModel } from '../../models/user.model';
import { CompanyModel } from 'src/app/models/company.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { DataService } from '../data.service';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { Router } from '@angular/router';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { userIdType, companyIdType } from '../types';
import { RoleBusinessService } from './role-business.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { UiJsonBusinessService } from './ui-json-business.service';

@Injectable({
  providedIn: 'root'
})
export class UserBusinessService {

  constructor(private userData: UserDataService,
    private generalUtility: GeneralUtility,
    private dataService: DataService,
    private broadcaster: Broadcaster,
    private router: Router,
    private constantLoaderService: ConstantLoaderService,
    private roleBusinessService: RoleBusinessService,
    private handlerLoaderService: HandlerLoaderService,
    private uiJsonBusinessService: UiJsonBusinessService) { }

  /**
   *  This method @returns boolean . Returns true, if user role is "business_account_admin"
   **/  
  isBusinessAdmin(): boolean {
    return this.dataService.user && this.dataService.user.role && this.dataService.user.role.isBusinessAdmin;
  }

  /**
   *  This method @returns boolean . Returns true, if user role is "Administrator"
   **/  
  isPlatformAdmin(): boolean {
    return this.dataService.user && this.dataService.user.role && this.dataService.user.role.isPlatformAdmin;
  }

  getUserLoginAsync(userName: string, password: string): Observable<HttpResponse<any>> {
    var request = {
      email: userName,
      password: password
    };
    return this.userData.getUserLoginAsync(request);
  }

  getRoleActionForUserByRoleName(roleName: string): RoleModel{
    let roles: Array<RoleModel> = this.roleBusinessService.getRoleActionList();
    return roles.find(r => r.roleName.toLowerCase().trim() === roleName.toLowerCase().trim());
  }

  getRoleActionForUserByRoleId(id: number): RoleModel{
    let roles: Array<RoleModel> = this.roleBusinessService.getRoleActionList();
    return roles.find(r => r.id === id);
  }

  getUserListAsync(tableConfig: TableConfigModel): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    if(this.isBusinessAdmin()) {
      request.isComNeeded = true;
    }
    return this.userData.getUserListAsync(request);
  }

  getUserList(response: any, roleList: Array<RolePartialModel>, companyList: Array<CompanyModel>): Array<UserModel> {
    var result: Array<UserModel> = new Array<UserModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var user = new UserModel();
        user.id = response[index].userId;
        user.userName = response[index].email;
        user.email = response[index].email;
        user.fName = response[index].firstName;
        user.lName = response[index].lastName;
        user.isActive = response[index].isActive;
        user.role = new RoleModel();
        user.role.id = response[index].roleId;
        if(roleList.findIndex(r => r.id === user.role.id) >= 0){
          user.role.roleName = roleList.find(r => r.id === user.role.id).name;
        }
        user.company = new CompanyModel();
        user.company.id = response[index].companyId;
        if(companyList.findIndex(c => c.id === user.company.id) >= 0){
          user.company.name = companyList.find(c => c.id === user.company.id).name;
        }
        result.push(user);
      }
    }
    return result;
  }

  getUserShortList(response: any, isRoleIncluded: boolean = true): Array<UserPartialModel> {
    var result: Array<UserPartialModel> = new Array<UserPartialModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var user: UserPartialModel = new UserPartialModel();
        if(response[index].id){
          user.id = response[index].id;
        } else if(response[index].userId){
          user.id = response[index].userId;
        }
        user.nameEmail = response[index].firstName + " " + response[index].lastName + " (" + response[index].email + ")";
        if(isRoleIncluded){
          user.nameEmail += " (" + response[index].roleName + ")";
        }
        result.push(user);
      }
    }
    return result;
  }

  getKeycloakUserShortList(response: any, isRoleIncluded: boolean = true): Array<UserPartialModel> {
    var result: Array<UserPartialModel> = new Array<UserPartialModel>();
    if(response){
      
      for(var index=0; index<response.length; index++){
        var user: UserPartialModel = new UserPartialModel();
        user.id = response[index].id;
        user.nameEmail = (response[index].firstName ? response[index].firstName : "") + " " + 
          (response[index].lastName ? response[index].lastName : "") + " " + 
          (response[index].email ? ("(" + response[index].email + ")") : "");
        if(isRoleIncluded){
          if(response[index].realmRoles){
            let roles: Array<RoleModel> = this.roleBusinessService.getRoleActionList();
            let businessAdminCode: string = "";
            if(roles.findIndex(r => r.isBusinessAdmin) >= 0){
              businessAdminCode = roles.find(r => r.isBusinessAdmin).keycloakRoleCode;
            }
            if((businessAdminCode.length > 0) && (response[index].realmRoles.findIndex(r => r === businessAdminCode) >= 0)){
              user.nameEmail += " (" + roles.find(r => r.isBusinessAdmin).roleName + ")";
            }else{
              for(var cnt=0; cnt<response[index].realmRoles.length; cnt++){
                if(roles.findIndex(r => r.keycloakRoleCode === response[index].realmRoles[cnt]) >= 0){
                  user.nameEmail += " (" + roles.find(r => r.keycloakRoleCode === response[index].realmRoles[cnt]).roleName + ")";
                }
              }
            }
          }
        }
        result.push(user);
      }
    }
    return result;
  }

  addUser(user: UserModel): Observable<HttpResponse<any>> {
    var request: any = {};
    request.email = user.email;
    request.password = this.handlerLoaderService.encryptionHandlerService.set(user.password);
    request.firstName = user.fName;
    request.lastName = user.lName;
    request.isActive = user.isActive;
    request.roleId = user.role.id;
    request.companyId = user.company.id;
    return this.userData.addUser(request);
  }

  updateUserActivityByIdAsync(userId: userIdType, isActive: boolean): Observable<HttpResponse<any>> {
    var request: any = {
      userid: userId,
      isActive: isActive
    };
    return this.userData.updateUserById(request);
  }

  updateUserAsync(user: UserModel): Observable<HttpResponse<any>> {
    var request: any = {
      userid: user.id,
      firstName: user.fName,
      lastName: user.lName,
      isActive: user.isActive,
      roleId: user.role.id,
      companyId: user.company.id
    };
    return this.userData.updateUserById(request);
  }

  getUserListByRoleIdAsync(roleId: number): Observable<HttpResponse<any>> {
    var companyId: companyIdType = !this.isPlatformAdmin() ? this.dataService.user.company.id as any : "";
    return this.userData.getUserListByRoleIdAsync(roleId, companyId);
  }

  getUserDetailsAsync(userId: userIdType): Observable<HttpResponse<any>> {
    return this.userData.getUserDetailsAsync(userId);
  }

  getUserDetails(response: any): UserModel{
    var result: UserModel = new UserModel();
    if(response){
      if(response.userInfo){
        result.id = response.userInfo.userId;
        result.fName = response.userInfo.firstName;
        result.lName = response.userInfo.lastName;
        result.email = response.userInfo.email;
        result.isActive = response.userInfo.isActive;
        result.company = new CompanyModel(response.userInfo.companyId, response.userInfo.companyName);
        result.role = new RoleModel();
        result.role.id = response.userInfo.roleId;
        result.role.roleName = response.userInfo.roleName;
        result.createdOn = response.userInfo.createdDateTime;
        result.updatedOn = response.userInfo.updatedDateTime;
      }
      if(response.jidListAsApprover){
        result.journalIdsAsApprover = response.jidListAsApprover;
      }
      if(response.jidListAsPrepare){
        result.journalIdsAsPreparer = response.jidListAsPrepare;
      }
      if(response.jidListAsReviewer){
        result.journalIdsAsReviewer = response.jidListAsReviewer;
      }
    }
    return result;
  }

  changePasswordAsync(currentPass: string, newPass: string): Observable<HttpResponse<any>> {
    var request: any = {
      userid: this.dataService.user.id,
      oldPassword: currentPass,
      newPassword: newPass
    };
    return this.userData.changePasswordAsync(request);
  }

  logoutUser(){
    this.dataService.user = new UserModel();
    this.dataService.isUserLoggedIn = false;
    this.broadcaster.send(this.constantLoaderService.broadcastNamesService.LOGIN_HEADER_MENU_SHOW);
    this.broadcaster.send(this.constantLoaderService.broadcastNamesService.USER_ROLE_SHOW);
    this.uiJsonBusinessService.selectDefaultHeaderMenuItem();
    this.router.navigate([""]);
  }

  getUserListByRoleNameFromKeycloakAsync(roleName: string): Observable<HttpResponse<any>> {
    var request: any = {
      accName: this.constantLoaderService.configValuesService.KEYCLOAK_ACC_NAME,
      role: roleName
    };
    return this.userData.getUserListByRoleNameFromKeycloakAsync(request);
  }

  getUserListByCompanyFromKeycloakAsync(): Observable<HttpResponse<any>> {
    var request: any = {
      accName: this.constantLoaderService.configValuesService.KEYCLOAK_ACC_NAME
    };
    return this.userData.getUserListByCompanyFromKeycloakAsync(request);
  }

  getUserListByCompanyFromKeycloak(response: any, roleList: Array<RolePartialModel>): Array<UserModel> {
    var result: Array<UserModel> = new Array<UserModel>();
    if(response){
      let businessAdminCode: string = "";
      if(roleList.findIndex(r => r.isBusinessAdmin) >= 0){
        businessAdminCode = roleList.find(r => r.isBusinessAdmin).keycloakRoleCode;
      }
      for(var index=0; index<response.length; index++){
        var user = new UserModel();
        user.id = response[index].id;
        user.userName = response[index].userName;
        user.email = response[index].email ? response[index].email : "";
        user.fName = response[index].firstName ? response[index].firstName : "";
        user.lName = response[index].lastName ? response[index].lastName : "";
        user.isActive = true;
        user.role = new RoleModel();
        if(response[index].realmRoles){
          if((businessAdminCode.length > 0) && (response[index].realmRoles.findIndex(r => r === businessAdminCode) >= 0)){
            user.role.id = roleList.find(r => r.keycloakRoleCode === businessAdminCode).id;
            user.role.roleName = roleList.find(r => r.keycloakRoleCode === businessAdminCode).name;
            user.role.isBusinessAdmin = true;
          } else {
            for(var cnt=0; cnt<response[index].realmRoles.length; cnt++){
              if(roleList.findIndex(r => r.keycloakRoleCode === response[index].realmRoles[cnt]) >= 0){
                user.role.id = roleList.find(r => r.keycloakRoleCode === response[index].realmRoles[cnt]).id;
                user.role.roleName = roleList.find(r => r.keycloakRoleCode === response[index].realmRoles[cnt]).name;
                user.role.isBusinessAdmin = false;
              }
            }
          }
        }
        result.push(user);
      }
    }
    return result;
  }
}
