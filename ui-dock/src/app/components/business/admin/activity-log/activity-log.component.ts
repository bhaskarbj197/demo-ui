/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ActivityLogModel } from 'src/app/models/activityLog.model';
import { UserPartialModel } from 'src/app/models/user.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { userIdType, journalIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  activityLogList: Array<ActivityLogModel> = new Array<ActivityLogModel>();
  searchJournalId: journalIdType = 0;
  searchUserId: userIdType = null;
  userList: Array<UserPartialModel> = new Array<UserPartialModel>();
  totalCount: number = 0;
  tableConfigModel: TableConfigModel = new TableConfigModel();
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ACTIVITY_LOG_LIST);

  ngOnInit() {
    this.initPageConfig();
    if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
      this.getKeycloakUserList();
    } else {
      this.getUserList();
    }
  }

  private initPageConfig() {    
    this.activityLogList = new Array<ActivityLogModel>();
    this.totalCount = 0;
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
      this.getActivityLogList();
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getActivityLogList(){
    this.isLoading = true;
    this.businessLoaderService.activityLogBusinessService.getActivityLogListAsync(this.tableConfigModel, this.searchJournalId, this.searchUserId).subscribe(res => {
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

  onSearchUserChanged(obj: any){
    if(obj){
      this.searchUserId = obj.item.id;
    }
  }

  onSearchClick(){
    this.initPageConfig();
    this.getActivityLogList();
  }

  onResetClick(){
    this.searchUserId = null;
    this.searchJournalId = 0;
    this.initPageConfig();
    this.getActivityLogList();
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
