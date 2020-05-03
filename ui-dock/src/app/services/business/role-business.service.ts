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
import { RoleDataService } from '../data/role-data.service';
import { RolePartialModel, RoleModel } from 'src/app/models/role.model';
import { UiJsonDataService } from '../data/ui-json-data.service';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class RoleBusinessService {

  constructor(private roleData: RoleDataService,
    private uiJsonData: UiJsonDataService,
    private dataService: DataService) { }

  getRoleActionList(): Array<RoleModel>{
    return this.uiJsonData.getRoleActions();
  }

  getRoleListAsync(): Observable<HttpResponse<any>> {
    return this.roleData.getRoleListAsync();
  }

  getRoleList(response: any): Array<RolePartialModel> {
    var roleConfig: Array<RoleModel> = this.getRoleActionList();
    var result: Array<RolePartialModel> = new Array<RolePartialModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var role = new RolePartialModel();
        role.id = response[index].roleId;
        role.name = response[index].roleName;
        role.keycloakRoleCode = roleConfig.find(r => r.id === role.id).keycloakRoleCode;
        role.isBusinessAdmin = roleConfig.find(r => r.id === role.id).isBusinessAdmin ? 
          roleConfig.find(r => r.id === role.id).isBusinessAdmin : false;
        role.isPlatformAdmin = roleConfig.find(r => r.id === role.id).isPlatformAdmin ? 
          roleConfig.find(r => r.id === role.id).isPlatformAdmin : false;
        result.push(role);
      }
    }
    if(!this.dataService.user.role.isPlatformAdmin){
      return result.filter(r => !r.isPlatformAdmin);
    }
    return result;
  }
}
