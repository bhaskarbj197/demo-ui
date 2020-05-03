/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { RolePartialModel, RoleModel } from 'src/app/models/role.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  roleList: Array<RolePartialModel> = new Array<RolePartialModel>();
  roleSelected: RolePartialModel = new RolePartialModel();
  roleDetails: RoleModel = null;

  ngOnInit() {
    this.loadRoleList();
  }

  private loadRoleList(){
    this.isLoading = true;
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      if(res.body){
        this.roleList = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onRoleChanged(obj: any){
    if(obj){
      this.roleSelected.id = obj.item.id;
      this.roleSelected.name = obj.item.name;
      this.roleDetails = this.businessLoaderService.userBusinessService.getRoleActionForUserByRoleId(this.roleSelected.id);
    }
  }

  getIcon(hasRole: boolean = false): string{
    if(!hasRole) {
      return "fa-square-o";
    }
    return "fa-check-square-o has-role";
  }
}
