/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ActivityLogModel } from 'src/app/models/activityLog.model';
import { DataService } from 'src/app/services/data.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { UserPartialModel } from 'src/app/models/user.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-audit-trial',
  templateUrl: './audit-trial.component.html',
  styleUrls: ['./audit-trial.component.scss']
})
export class AuditTrialComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  activityLogList: Array<ActivityLogModel> = new Array<ActivityLogModel>();
  userList: Array<UserPartialModel> = new Array<UserPartialModel>();
  tableConfigModel: TableConfigModel = new TableConfigModel();
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ACTIVITY_LOG_LIST);
    totalCount: number = 0;

  ngOnInit() {
    this.initPageConfig();
    if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
      this.getKeycloakUserList();
    } else {
      this.getUserList();
    }
    this.getActivityLogList();
  }

  private initPageConfig() {
    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.VALIDATION_RULE_LIST);
    this.tableConfigModel.pageIndex = 0;
  }

  private getKeycloakUserList(){
    this.isLoading = true;
    this.userList = new Array<UserPartialModel>();
    this.businessLoaderService.userBusinessService.getUserListByCompanyFromKeycloakAsync().subscribe(res => {
      if(res.body){
        if(res.body.detailsDTO){
          this.userList = this.businessLoaderService.userBusinessService.getKeycloakUserShortList(res.body.detailsDTO);
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getUserList(){
    this.isLoading = true;
    this.userList = new Array<UserPartialModel>();
    this.businessLoaderService.userBusinessService.getUserListAsync(new TableConfigModel()).subscribe( res => {
      this.isLoading = false;
      if(res.body){
        this.userList = this.businessLoaderService.userBusinessService.getUserShortList(res.body.data);
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getActivityLogList(){
    this.isLoading = true;
    this.businessLoaderService.activityLogBusinessService.getActivityLogListAsync(this.tableConfigModel, this.dataService.journalId).subscribe(res => {
      if(res.body.data){
        this.activityLogList = this.businessLoaderService.activityLogBusinessService.getActivityLogList(res.body.data);
        this.isLoading = false;
      }
      if(res.body.totalCount){
        this.totalCount = res.body.totalCount;
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  getLogParamKey(log: ActivityLogModel): string {
    if(log){
      return (log.paramKey + ": " + log.newValue);
    }
    return "";
  }

  getUser(log: ActivityLogModel): string {
    if(log && log.user){
      if(this.userList.findIndex(u => u.id === log.user.id) >= 0){
        return this.userList.find(u => u.id === log.user.id).nameEmail;
      }
    }
    return "";
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.getActivityLogList();
    }
  }

  onPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.getActivityLogList();
    }
  }
}
