/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { JournalAutoApproverRuleModel, JournalAutoApproverRuleCondition, 
  JournalAutoApproverRuleActionType } from 'src/app/models/journalAutoApproverRule.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { ColumnListModel } from 'src/app/models/validationRules.model';
import { OperatorModel } from 'src/app/models/operator.model';
import { RolePartialModel } from 'src/app/models/role.model';
import { UserPartialModel } from 'src/app/models/user.model';
import { GroupMasterModel } from 'src/app/models/groupMaster.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-auto-approver',
  templateUrl: './journal-auto-approver.component.html',
  styleUrls: ['./journal-auto-approver.component.scss']
})
export class JournalAutoApproverComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.JOURNAL_AUTO_APPROVER_0, 
    this.constantLoaderService.tabListTextsService.JOURNAL_AUTO_APPROVER_1];
  activeTab: string = this.tabList[0];
  journalTypeCatList: Array<object> = this.constantLoaderService.defaultValuesService.JOURNAL_TYPE_CAT_LIST;
  ruleModel: JournalAutoApproverRuleModel = new JournalAutoApproverRuleModel();
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  columnList: Array<ColumnListModel> = [];
  operatorList: Array<OperatorModel> = new Array<OperatorModel>();
  andOrList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_ANDOR_LIST;
  workdayList: Array<string> = new Array<string>();
  reviewerList: Array<UserPartialModel> = new Array<UserPartialModel>();
  conditionTypeList: Array<string> = [];
  actionList: Array<JournalAutoApproverRuleActionType> = new Array<JournalAutoApproverRuleActionType>();
  groupList: Array<GroupMasterModel> = new Array<GroupMasterModel>();
  ruleList: Array<JournalAutoApproverRuleModel> = new Array<JournalAutoApproverRuleModel>();
  deletingRuleId: number = 0;

  ngOnInit() {
    this.loadRuleList();
    this.reset();
  }

  private loadRuleList(){
    this.isLoading = true;
    this.businessLoaderService.journalAutoApproverBusinessService.getRuleListAsync().subscribe(res => {
      if(res.body && res.body.data && res.body.data.ruleDet){
        this.ruleList = this.businessLoaderService.journalAutoApproverBusinessService.getRuleList(res.body.data.ruleDet);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private reset(){
    this.loadOperatorList();
    this.loadWorkdayList();
    this.loadReviewerList();
    this.loadTemplateList();
    this.loadActionList();
    this.loadGroups();
    this.loadConditionTypeList();
    this.ruleModel = new JournalAutoApproverRuleModel();
    this.setExceptionActionValue();
  }

  private loadConditionTypeList(){
    this.conditionTypeList = [];
    for(var index = 0; index < Object.keys(this.enumLoaderService.journalAutoApproverConditionTypes).length; index++){
      this.conditionTypeList.push(Object.values(this.enumLoaderService.journalAutoApproverConditionTypes)[index]);
    }
  }

  private loadActionList(){
    this.actionList = this.businessLoaderService.uiJsonBusinessService.getJournalAutoApproverRuleActions();
  }

  private setExceptionActionValue(){
    if(this.actionList.findIndex(a => a.isShowInExceptionArea) >= 0){
      this.ruleModel.exception.action.code = this.actionList.find(a => a.isShowInExceptionArea).code;
    }
  }

  private loadOperatorList(){
    this.operatorList = this.businessLoaderService.operatorJsonBusinessService.getOperatorListForAutoApproverRule();
  }

  private loadWorkdayList(){
    this.workdayList = [];
    var minWorkday: number = this.constantLoaderService.defaultValuesService.WORKDAY_START;
    var maxWorkday: number = this.constantLoaderService.defaultValuesService.WORKDAY_END;
    var workdayText: string = this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH;
    for(var index=minWorkday; index<=maxWorkday; index++){
      this.workdayList.push(workdayText + index.toString());
    }
  }

  private loadGroups(){
    this.groupList = new Array<GroupMasterModel>();
    this.businessLoaderService.groupMasterBusinessService.getAllMasterGroupsAsync().subscribe(res => {
      if(res.body && res.body.length > 0){
        this.groupList = res.body.map( group => new GroupMasterModel().deserialize(group));
        this.groupList = this.groupList.filter(grp => grp.isActive);
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadReviewerList(){
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      if(res.body){
        var roleList: Array<RolePartialModel> = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
        var roleId: number = 0;
        roleId = roleList.find(r => r.name.trim().toLowerCase() === this.constantLoaderService.userTypesService.USER_REVIEWER.trim().toLowerCase()).id;
        this.businessLoaderService.userBusinessService.getUserListByRoleIdAsync(roleId).subscribe(resp => {
          if(resp.body){
            for(var index=0; index<resp.body.length; index++){
              var user: UserPartialModel = new UserPartialModel();
              user.id = resp.body[index].userId;
              user.nameEmail = resp.body[index].firstName + " " + resp.body[index].lastName + " (" + resp.body[index].email + ")";
              this.reviewerList.push(user);
            }
          }
        }, error => {
          this.handlerLoaderService.errorHandlerService.handleError(error);
        });
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadTemplateList(){
    this.isLoading = true;
    this.templateList = [];
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body && res.body.length > 0) {
        var templates = res.body.filter(data => data.isActive);
        for(var index=0; index<templates.length; index++){
          this.templateList.push(new TemplateMasterPartialModel(templates[index].templateId, templates[index].templateName));
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadColumnList(){
    this.isLoading = true;
    this.columnList = [];
    this.businessLoaderService.templateMasterBusinessService.getAllTemplateColumnsAsync([this.ruleModel.template.id]).subscribe(res => {
      if(res.body){
        for(var index=0; index<res.body.length; index++){
          if(res.body[index].columnName){
            for(var cnt=0; cnt<res.body[index].columnName.length; cnt++){
              if(this.columnList.findIndex(c => c.code === res.body[index].columnName[cnt]) < 0){
                var col = new ColumnListModel();
                col.code = res.body[index].columnName[cnt];
                col.name = res.body[index].columnName[cnt];
                this.columnList.push(col);
              }
            }
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      if(this.activeTab === this.tabList[0]){
        this.loadRuleList();
        this.ruleModel = new JournalAutoApproverRuleModel();
        this.setExceptionActionValue();
      }
    }
  }

  onSubmitRule(){
    if(this.ruleModel.template === null || this.ruleModel.template === undefined || this.ruleModel.template.id === 0 ||
      this.ruleModel.template.name === null || this.ruleModel.template.name === undefined){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select template!");
      return;
    }
    if(this.ruleModel.action === null || this.ruleModel.action === undefined || this.ruleModel.action.code === null ||
      this.ruleModel.action.code === "" || this.ruleModel.action.code === undefined){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select action!");
      return;
    }
    this.isLoading = true;
    this.businessLoaderService.journalAutoApproverBusinessService.saveRuleAsync(this.ruleModel).subscribe(res => {
      if(res.body && res.body.isSuccess){
        this.handlerLoaderService.notificationHandlerService.showSuccess("Rule saved successfully.");
      }
      this.reset();
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onResetRule(){
    this.reset();
  }

  onJournalTypeCatChanged(obj: any){
    if(obj){
      this.ruleModel.category = obj.item.key;
    }
  }

  onActionChanged(obj: any){
    if(obj){
      this.ruleModel.action.code = obj.item.code;
      this.ruleModel.action.value = obj.item.value;
      this.ruleModel.action.isReview2ListShow = this.actionList.find(a => a.code===obj.item.code).isReview2ListShow;
    }
  }

  onTemplateChanged(obj: any){
    if(obj){
      this.ruleModel.template.id = obj.item.id;
      this.ruleModel.template.name = obj.item.name;
      this.loadColumnList();
      if(this.ruleModel.conditions.length === 0){
        this.ruleModel.conditions.push(new JournalAutoApproverRuleCondition());
      }
    }
  }

  onAddNewRuleConditionClick(){
    this.ruleModel.conditions.push(new JournalAutoApproverRuleCondition());
  }

  onDeleteRuleConditionClick(index: number){
    if(index>=0){
      this.ruleModel.conditions.splice(index, 1);
    }
  }

  onConditionTypeChanged(obj: any, index: number){
    if(obj && this.ruleModel.conditions[index]){
      this.ruleModel.conditions[index].typ = obj.item.key;
      this.ruleModel.conditions[index].columnName = "";
    }
  }

  onGroup1Changed(obj: any){
    if(obj){
      if(this.groupList.length>0){
        this.ruleModel.exception.group1.element = obj.item.name;
        this.ruleModel.exception.group1.groupName = this.groupList[0].name;
      }
    }
  }

  onGroup2Changed(obj: any){
    if(obj){
      if(this.groupList.length>1){
        this.ruleModel.exception.group2.element = obj.item.name;
        this.ruleModel.exception.group2.groupName = this.groupList[1].name;
      }
    }
  }

  onSetExceptionClick(){
    this.ruleModel.isException = !this.ruleModel.isException;
  }

  getLockIcon(rule: JournalAutoApproverRuleModel){
    if(rule.isBlocked){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onUpdateRuleStatus(rule: JournalAutoApproverRuleModel){
    this.isLoading = true;
    this.businessLoaderService.journalAutoApproverBusinessService.saveRuleStatusAsync(rule.id, rule.isBlocked).subscribe(res => {
      if(res.body && res.body.isSuccess){
        rule.isBlocked = !rule.isBlocked;
        this.isLoading = false;
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onEditRule(rule: JournalAutoApproverRuleModel){
    if(rule){
      this.ruleModel = JSON.parse(JSON.stringify(rule));
      this.loadColumnList();
      if(this.ruleModel.category === "standard"){
        this.ruleModel.category = "";
      }
      this.activeTab = this.tabList[1];
    }
  }

  onDeleteRule(ruleId: number, isConfirm: boolean = undefined){
    if(isConfirm === undefined){
      this.deletingRuleId = ruleId;
      return;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.journalAutoApproverBusinessService.deleteRuleAsync(ruleId).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.deletingRuleId = 0;
          this.loadRuleList();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Rule is deleted successfully");
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else{
      this.deletingRuleId = 0;
    }
  }

  getExceptionPresentIcon(rule: JournalAutoApproverRuleModel): string{
    if(rule && rule.isException){
      return "fa-check-square-o";
    }
    return "fa-square-o";
  }
}
