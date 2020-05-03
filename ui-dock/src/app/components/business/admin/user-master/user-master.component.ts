/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { UserModel } from 'src/app/models/user.model';
import { RolePartialModel, RoleModel } from 'src/app/models/role.model';
import { CompanyModel } from 'src/app/models/company.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { userIdType } from 'src/app/services/types';
import { DataService } from 'src/app/services/data.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.USER_MASTER_1, 
    this.constantLoaderService.tabListTextsService.USER_MASTER_0];
  activeTab: string = this.tabList[0];
  isSubmit: boolean = false;
  userInfo: UserModel = new UserModel();
  roleList: Array<RolePartialModel> = new Array<RolePartialModel>();
  companyList: Array<CompanyModel> = new Array<CompanyModel>();
  userList: Array<UserModel> = new Array<UserModel>();
  isEdit: boolean = false;
  minimumPassLength = this.constantLoaderService.defaultValuesService.USER_MIN_PASS_LENGTH;
  tableConfigModel: TableConfigModel = new TableConfigModel();
  totalUsersCount: number = 0;
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.USER_LIST);
  isCompanySelectable: boolean = true;
  isPassValid: boolean = false;
  confirmPass: string = "";

  ngOnInit() {
    if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
      this.tabList = [this.constantLoaderService.tabListTextsService.USER_MASTER_1];
      this.loadRoleList();
    } else{
      this.tableConfigModel.pageCount = 
        this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.USER_LIST);
      this.tableConfigModel.pageIndex = 0;
      this.onResetUser();
      this.loadRoleList();
    }
  }

  private loadUserListFromKeycloak(){
    this.isLoading = true;
    this.userList = new Array<UserModel>();
    this.businessLoaderService.userBusinessService.getUserListByCompanyFromKeycloakAsync().subscribe(res => {
      if(res.body){
        if(res.body.detailsDTO){
          this.userList = this.businessLoaderService.userBusinessService.getUserListByCompanyFromKeycloak(res.body.detailsDTO, this.roleList);
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadRoleList(){
    this.isLoading = true;
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      if(res.body){
        this.roleList = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
      }
      if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
        this.loadUserListFromKeycloak();
      }else{
        this.loadCompanyList();
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadCompanyList(){
    var companies: Array<CompanyModel> = [];
    this.businessLoaderService.companyBusinessService.getCompanyListAsync().subscribe(res => {
      if(res.body){
        companies = this.businessLoaderService.companyBusinessService.getCompanyList(res.body);
        this.companyList = companies.filter(cData => cData.isActive);
      }
      this.loadUserList();
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadUserList(){
    this.isLoading = true;
    this.userList = new Array<UserModel>();
    this.businessLoaderService.userBusinessService.getUserListAsync(this.tableConfigModel).subscribe(res => {
      if(res.body){
        if(res.body.data){
          this.userList = this.businessLoaderService.userBusinessService.getUserList(res.body.data, this.roleList, this.companyList);
        }
        if(res.body.totalCount){
          this.totalUsersCount = res.body.totalCount;
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadUserDetails(userId: userIdType){
    this.isLoading = true;
    this.onResetUser();
    this.businessLoaderService.userBusinessService.getUserDetailsAsync(userId).subscribe(res => {
      if(res.body){
        this.userInfo = this.businessLoaderService.userBusinessService.getUserDetails(res.body);
      }
      this.isLoading = false;
      this.activeTab = this.tabList[1];
      this.isEdit = true;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private validForm(): boolean{
    if(this.userInfo.fName.length === 0 || this.userInfo.lName.length === 0 ||
      this.userInfo.role.id === 0 || this.userInfo.company.id === null) {
      return;
    }
    if(!this.isEdit){
      if(this.userInfo.password === "" || this.confirmPass === ""){
        return false;
      }
      if(this.confirmPass !== this.userInfo.password){
        this.handlerLoaderService.notificationHandlerService.showWarning("New password and confirm password should be equal!");
        return false;
      }
      if(!this.isPassValid){
        this.handlerLoaderService.notificationHandlerService.showWarning("New password is not following the password rules!");
      }
      return this.isPassValid;
    }
    return true;
  }

  onSetActiveClick() {
    this.userInfo.isActive = !this.userInfo.isActive;
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      this.isEdit = false;
      this.onResetUser();
    }
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadUserList();
    }
  }

  onUserListPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadUserList();
    }
  }

  onSubmitUser(){
    this.isSubmit = true;
    if(!this.validForm()){
      this.isLoading = false;
      return;
    }
    if(this.isEdit){
      this.isLoading = true;
      this.businessLoaderService.userBusinessService.updateUserAsync(this.userInfo).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.onResetUser();
          this.isSubmit = false;
          this.loadUserList();
          this.activeTab = this.tabList[0];
          this.isEdit = false;
        } else{
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      })
    } else {
      if(this.userInfo.email.length === 0 || this.userInfo.password.length === 0){
        return;
      }
      if(this.userInfo.password.length < this.minimumPassLength){
        return;
      }
      this.isLoading = true;
      this.businessLoaderService.userBusinessService.addUser(this.userInfo).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess(res.body.message);
          this.onResetUser();
          this.isSubmit = false;
          this.loadUserList();
          this.activeTab = this.tabList[0];
          this.isEdit = false;
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onResetUser(){
    this.userInfo = new UserModel();
    this.userInfo.role = new RoleModel();
    this.userInfo.role.id = 0;
    this.userInfo.company = new CompanyModel();
    this.userInfo.company.id = null;
    this.isEdit = false;
    if(!this.dataService.user.role.isPlatformAdmin){
      this.userInfo.company = this.dataService.user.company;
      this.isCompanySelectable = false;
    }
  }

  getLockIcon(user: UserModel): string{
    if(user.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onUpdateActivity(user: UserModel){
    if(user){
      this.isLoading = true;
      this.businessLoaderService.userBusinessService.updateUserActivityByIdAsync(user.id, !user.isActive).subscribe(res => {
        if(res.body && res.body.isSuccess){
          user.isActive = !user.isActive;
          this.handlerLoaderService.notificationHandlerService.showSuccess("User is updated successfully");
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onEditUser(user: UserModel){
    if(user){
      this.loadUserDetails(user.id);
    }
  }

  getConcatSingleArray(list: Array<number>): string{
    if(list === null || list === undefined || list.length === 0){
      return "";
    }
    return list.join(", ");
  }

  onBoxSummaryUpdate(obj: any){
    if(obj){
      this.isPassValid = obj.isBoxValid
    }
  }
}
