/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GroupMasterModel } from 'src/app/models/groupMaster.model';
import { AboutModel } from 'src/app/models/about.model';
import { FrequencyModel } from 'src/app/models/frequency.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { UserPartialModel } from 'src/app/models/user.model';
import { TimeZoneModel } from 'src/app/models/timeZone.model';
import { RuleSetModel } from 'src/app/models/validationRules.model';
import { RolePartialModel } from 'src/app/models/role.model';
import { CalendarPartialModel } from 'src/app/models/calendar.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { TreeNodeModel } from 'src/app/models/treeNode.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataService } from 'src/app/services/data.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  @Input() nodes: Array<TreeNodeModel> = [];
  @Input() aboutDetails: AboutModel = new AboutModel();
  @Output() saveHeaderActionClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  isFormSubmitted: boolean = false;
  isViewOnly: boolean = (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW);
  pointerColors: Array<string> = [];
  groupList: Array<GroupMasterModel> = new Array<GroupMasterModel>();

  frequencyList: Array<FrequencyModel> = new Array<FrequencyModel>();
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  superUserList: Array<UserPartialModel> = new Array<UserPartialModel>();
  reviewerList: Array<UserPartialModel> = new Array<UserPartialModel>();
  approverList: Array<UserPartialModel> = new Array<UserPartialModel>();
  workdayList: Array<string> = new Array<string>();
  timeZoneList: Array<TimeZoneModel> = new Array<TimeZoneModel>();
  businessRuleList: Array<RuleSetModel> = new Array<RuleSetModel>();
  calendarList: Array<CalendarPartialModel> = new Array<CalendarPartialModel>();
  tiemList: Array<object> = this.generalUtility.getHourlyBasedTimeListIn12HoursFormat();

  ngOnInit() {
    this.isFormSubmitted = false;
    this.loadFrequenceList();
    this.loadUserLists();
    this.loadTemplateList();
    this.loadGroups();
    this.loadWorkdayList();
    this.loadTimeZoneList();
    this.loadCalendarList();
  }

  private loadTimeZoneList(){
    this.timeZoneList = this.businessLoaderService.timeZoneBusinessService.getTimeZoneList();
  }

  private loadUserLists(){
    if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
      this.loadUserListForKeycloak(this.constantLoaderService.userTypesService.USER_REVIEWER);
      this.loadUserListForKeycloak(this.constantLoaderService.userTypesService.USER_APPROVER);
      this.loadUserListForKeycloak(this.constantLoaderService.userTypesService.USER_ADMIN);
    }else{
      this.loadUserList(this.constantLoaderService.userTypesService.USER_REVIEWER);
      this.loadUserList(this.constantLoaderService.userTypesService.USER_APPROVER);
      this.loadUserList(this.constantLoaderService.userTypesService.USER_ADMIN);
    }
  }

  private loadCalendarList(){
    this.calendarList = new Array<CalendarPartialModel>();
    this.isLoading = true;
    this.businessLoaderService.calendarMasterBusinessService.getCalendarListAsync().subscribe(res => {
      if(res.body){
        this.calendarList = this.businessLoaderService.calendarMasterBusinessService.getCalendarList(res.body);
        this.calendarList = this.calendarList.filter(c => c.isActive);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadWorkdayList(){
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

  private loadBusinesRules(templateId: number){
    this.businessRuleList = new Array<RuleSetModel>();
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplateAsync(templateId).subscribe(res => {
      if(res.body){
        this.businessRuleList = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplate(res.body);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadUserListForKeycloak(roleName: string){
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      if(res.body){
        var roleList: Array<RolePartialModel> = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
        var code: string = roleList.find(r => r.name.trim().toLowerCase() === roleName.trim().toLowerCase()).keycloakRoleCode;
        this.businessLoaderService.userBusinessService.getUserListByRoleNameFromKeycloakAsync(code).subscribe(resp => {
          if(resp.body && resp.body.users){
            if(resp.body.users[code]){
              var userList: Array<UserPartialModel> = new Array<UserPartialModel>();
              for(var index=0; index<resp.body.users[code].length; index++){
                var user: UserPartialModel = new UserPartialModel();
                user.id = resp.body.users[code][index].id;
                user.nameEmail = (resp.body.users[code][index].firstName ? resp.body.users[code][index].firstName : "") + " " + 
                  (resp.body.users[code][index].lastName ? resp.body.users[code][index].lastName : "") +
                  (resp.body.users[code][index].email ? (" (" + resp.body.users[code][index].email  + ")") : "");
                userList.push(user);
              }
              if(roleName === this.constantLoaderService.userTypesService.USER_REVIEWER){
                this.reviewerList = this.generalUtility.getSortedArray(userList, "nameEmail");
              } else if(roleName === this.constantLoaderService.userTypesService.USER_APPROVER) {
                this.approverList = this.generalUtility.getSortedArray(userList, "nameEmail");
              } else {
                this.superUserList = this.generalUtility.getSortedArray(userList, "nameEmail");
              }
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

  private loadUserList(role: string){
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      if(res.body){
        var roleList: Array<RolePartialModel> = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
        var roleId: number = 0;
        roleId = roleList.find(r => r.name.trim().toLowerCase() === role.trim().toLowerCase()).id;
        this.businessLoaderService.userBusinessService.getUserListByRoleIdAsync(roleId).subscribe(resp => {
          if(resp.body){
            var userList: Array<UserPartialModel> = new Array<UserPartialModel>();
            for(var index=0; index<resp.body.length; index++){
              var user: UserPartialModel = new UserPartialModel();
              user.id = resp.body[index].userId;
              user.nameEmail = resp.body[index].firstName + " " + resp.body[index].lastName + " (" + resp.body[index].email + ")";
              userList.push(user);
            }
            if(role === this.constantLoaderService.userTypesService.USER_REVIEWER){
              this.reviewerList = this.generalUtility.getSortedArray(userList, "nameEmail");
            } else if(role === this.constantLoaderService.userTypesService.USER_APPROVER) {
              this.approverList = this.generalUtility.getSortedArray(userList, "nameEmail");
            } else {
              this.superUserList = this.generalUtility.getSortedArray(userList, "nameEmail");
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

  private loadFrequenceList(){
    this.businessLoaderService.frequencyBusinessService.getFrequencyListAsync().subscribe(res => {
      if(res.body){
        this.frequencyList = this.businessLoaderService.frequencyBusinessService.getFrequencyList(res.body);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadTemplateList(){
    this.isLoading = true;
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body && res.body.length > 0) {
        var templates = res.body.filter(data => data.isActive);
        for(var index=0; index<templates.length; index++){
          this.templateList.push(new TemplateMasterPartialModel(templates[index].templateId, templates[index].templateName));
        }
      }
      this.isLoading = false;
      if(this.aboutDetails.journalInfo.template.id > 0){
        this.loadBusinesRules(this.aboutDetails.journalInfo.template.id);
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private isValidForm(): boolean {
    var msg: string = "Some of the mandatory fields are missing. Review Journal Info, Workflow and Risk management areas.";
    if(!this.aboutDetails){
      this.handlerLoaderService.notificationHandlerService.showWarning(msg);
      return false;
    }
    if(this.aboutDetails.journalInfo.name === "" || this.aboutDetails.journalInfo.frequency.id === 0 ||
      this.aboutDetails.journalInfo.template.id === 0){
        this.handlerLoaderService.notificationHandlerService.showWarning(msg);
      return false;
    }
    if(this.aboutDetails.workflow.superuser === null || this.aboutDetails.workflow.reviewer === null){
      this.handlerLoaderService.notificationHandlerService.showWarning(msg);
      return false;
    }
    if( this.generalUtility.isEmptyOrUndefined(this.aboutDetails.riskManagement.sourceSLA) || 
      this.generalUtility.isEmptyOrUndefined(this.aboutDetails.riskManagement.postDate) ||
      this.aboutDetails.riskManagement.sourceContact === "" || this.aboutDetails.riskManagement.timezone.id === 0 ||
      this.aboutDetails.riskManagement.postContact === "" || this.aboutDetails.riskManagement.businessRules.id === 0){
        this.handlerLoaderService.notificationHandlerService.showWarning(msg);
      return false;
    }
    return true;
  }

  onHeaderActionSaveClick(){
    this.isFormSubmitted = true;
    if(this.isValidForm()) {
      this.saveHeaderActionClick.emit();
    }
  }

  onFrequencyChanged(obj: any){
    if(obj){
      this.aboutDetails.journalInfo.frequency.id = obj.item.id;
      this.aboutDetails.journalInfo.frequency.name = obj.item.name;
    }
  }

  onTemplateChanged(obj: any){
    if(obj){
      this.aboutDetails.journalInfo.template.id = obj.item.id;
      this.aboutDetails.journalInfo.template.name = obj.item.name;
      this.loadBusinesRules(obj.item.id);
    }
  }

  onTimeZoneChanged(obj: any){
    if(obj){
      this.aboutDetails.riskManagement.timezone.id = obj.item.id;
      this.aboutDetails.riskManagement.timezone.name = obj.item.name;
    }
  }

  onBusinessRuleChanged(obj: any){
    if(obj){
      this.aboutDetails.riskManagement.businessRules.id = obj.item.id;
      this.aboutDetails.riskManagement.businessRules.name = obj.item.name;
    }
  }

  onCalendarChanged(obj: any){
    if(obj){
      this.aboutDetails.riskManagement.calendar.id = obj.item.id;
      this.aboutDetails.riskManagement.calendar.name = obj.item.name;
    }
  }

  onGroup1Changed(obj: any){
    if(obj){
      if(this.groupList.length>0){
        this.aboutDetails.riskManagement.group1.element = obj.item.name;
        this.aboutDetails.riskManagement.group1.groupName = this.groupList[0].name;
      }
    }
  }

  onGroup2Changed(obj: any){
    if(obj){
      if(this.groupList.length>1){
        this.aboutDetails.riskManagement.group2.element = obj.item.name;
        this.aboutDetails.riskManagement.group2.groupName = this.groupList[1].name;
      }
    }
  }

  onReversalChanged(){
    this.aboutDetails.journalInfo.isReversal = !this.aboutDetails.journalInfo.isReversal;
  }

  isJournalNameEditable(): boolean{
    if(this.dataService.isJournalCopy){
      return false;
    }
    return (this.isViewOnly || this.aboutDetails.journalInfo.id !== 0);
  }
}
