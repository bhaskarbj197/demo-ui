/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { AdhocJournalModel } from 'src/app/models/adhocJournal.model';
import { TemplateMasterModel, TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { DataService } from 'src/app/services/data.service';
import { RuleSetModel } from 'src/app/models/validationRules.model';
import { RolePartialModel } from 'src/app/models/role.model';
import { UserPartialModel } from 'src/app/models/user.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-adhoc',
  templateUrl: './adhoc.component.html',
  styleUrls: ['./adhoc.component.scss']
})
export class AdhocComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private enumLoaderService: EnumLoaderService,
    private dataService: DataService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  newAdhocJournal: AdhocJournalModel = new AdhocJournalModel();
  isSubmit: boolean = false;
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  businessRuleList: Array<RuleSetModel> = new Array<RuleSetModel>();
  isLoading: boolean = false;
  isBusinessDropdownEnabled: boolean = false;
  reviewerList: Array<UserPartialModel> = new Array<UserPartialModel>();
  approverList: Array<UserPartialModel> = new Array<UserPartialModel>();
  superUserList: Array<UserPartialModel> = new Array<UserPartialModel>();
  roleList: Array<RolePartialModel> = [];
  dataEntryTypeList: Array<string> = new Array<string>();
  manualDataColumns: Array<{col:string, typ: string}> = new Array<{col:string, typ: string}>();
  newManualData: string[] = [];
  manualData: Array<string[]> = new Array<string[]>();
  uploadErrMsg: string = "";

  ngOnInit() {     
    this.loadDataEntryTypes();
    this.loadTemplateList();
    this.loadRolesAnsUserList();
  }

  private loadDataEntryTypes(){
    this.dataEntryTypeList = new Array<string>();
    for(let type in this.enumLoaderService.adhocDataEntryTypes){
      this.dataEntryTypeList.push(this.enumLoaderService.adhocDataEntryTypes[type]);
    }
  }

  private loadTemplateList(){
    this.templateList = [];
    if(this.dataService.templateMasterList && this.dataService.templateMasterList.length > 0) {
      this.populateTemplateDropDown();
    } else {
      this.isLoading = true;
      this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
        this.isLoading = false;
        this.dataService.templateMasterList = [];
        if(res.body && res.body.length > 0) {
          this.dataService.templateMasterList = res.body.map(template => new TemplateMasterModel().deserialize(template));
          this.populateTemplateDropDown();
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  private loadRolesAnsUserList() {
    this.isLoading = true;
    this.roleList = [];
    this.businessLoaderService.roleBusinessService.getRoleListAsync().subscribe(res => {
      this.isLoading = false;
      if(res.body){
        this.roleList = this.businessLoaderService.roleBusinessService.getRoleList(res.body);
        if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE){
          this.loadUserListForKeycloak(this.constantLoaderService.userTypesService.USER_REVIEWER);
          this.loadUserListForKeycloak(this.constantLoaderService.userTypesService.USER_ADMIN);
        } else {
          this.loadUserListByRole(this.constantLoaderService.userTypesService.USER_REVIEWER);
          this.loadUserListByRole(this.constantLoaderService.userTypesService.USER_ADMIN);
        }
      }
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
              for(var index=0; index<resp.body.users[code].length; index++){
                var user: UserPartialModel = new UserPartialModel();
                user.id = resp.body.users[code][index].id;
                user.nameEmail = (resp.body.users[code][index].firstName ? resp.body.users[code][index].firstName : "") + " " + 
                  (resp.body.users[code][index].lastName ? resp.body.users[code][index].lastName : "") +
                  (resp.body.users[code][index].email ? (" (" + resp.body.users[code][index].email  + ")") : "");
                if(roleName === this.constantLoaderService.userTypesService.USER_REVIEWER){
                  this.reviewerList.push(user);
                } else {
                  this.superUserList.push(user);
                }
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

  private loadUserListByRole(role: string){  
    this.isLoading = true;  
    var roleId: number = 0;
    roleId = this.roleList.find(r => r.name.trim().toLowerCase() === role.trim().toLowerCase()).id;
    this.businessLoaderService.userBusinessService.getUserListByRoleIdAsync(roleId).subscribe(resp => {
      this.isLoading = false;
      if(resp.body){
        for(var index=0; index<resp.body.length; index++){
          var user: UserPartialModel = new UserPartialModel();
          user.id = resp.body[index].userId;
          user.nameEmail = resp.body[index].firstName + " " + resp.body[index].lastName + " (" + resp.body[index].email + ")";
          if(role === this.constantLoaderService.userTypesService.USER_REVIEWER){
            this.reviewerList.push(user);
          } else if(role === this.constantLoaderService.userTypesService.USER_ADMIN){
            this.superUserList.push(user);
          }
        }
      }
    }, error => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(error);
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

  private populateTemplateDropDown() {
    for(var index = 0; index < this.dataService.templateMasterList.length; index++) {
      this.templateList.push(new TemplateMasterPartialModel(this.dataService.templateMasterList[index].id, this.dataService.templateMasterList[index].name));
    }    
  }

  private isValidForm(): boolean {
    let isValid: boolean = true;
    if(!this.newAdhocJournal.name || !this.newAdhocJournal.superUser || !this.newAdhocJournal.reviewer
      || !this.newAdhocJournal.template || this.newAdhocJournal.template.id === 0
      || this.newAdhocJournal.template.id === undefined || !this.newAdhocJournal.superUser.id ||
      !this.newAdhocJournal.reviewer.id) {
        isValid = false;
    }
    if(this.newAdhocJournal.requesterEmail.trim().length > 0){
      if(!this.generalUtility.isRegexValid(this.constantLoaderService.regexPatternService.EMAIL, this.newAdhocJournal.requesterEmail)){
        isValid = false;
      }
    }
    return isValid;
  }

  private resetForm() {
    this.isSubmit = false;
    this.newAdhocJournal = new  AdhocJournalModel();
    this.manualDataColumns = new Array<{col:string, typ: string}>();
    this.newManualData = [];
    this.manualData = new Array<string[]>();
    this.uploadErrMsg = "";
  }

  private loadManualDataEntry(templateId: number){
    this.manualDataColumns = [];
    this.newManualData = [];
    if(templateId){
      let template: TemplateMasterModel = this.dataService.templateMasterList.find(t => t.id === templateId);
      if(template){
        if(template.crReq){ 
          for(var index=0; index<template.crReq.length; index++){
            this.manualDataColumns.push({col: template.crReq[index], typ: this.enumLoaderService.outputReqColTypes.CR});
            this.newManualData.push("");
          }
        }
        if(template.drReq){
          for(var index=0; index<template.drReq.length; index++){
            if(this.manualDataColumns.findIndex(c => c.col === template.drReq[index]) < 0){
              this.manualDataColumns.push({col: template.drReq[index], typ: this.enumLoaderService.outputReqColTypes.DR});
              this.newManualData.push("");
            }else{
              this.manualDataColumns.find(c => c.col === template.drReq[index]).typ = this.enumLoaderService.outputReqColTypes.CR_DR;
            }
          }
        }
      }
    }
  }

  getColumnWidth(): string{
    var result: string = "100%";
    if(this.manualDataColumns){
      result = (Math.floor(90/this.manualDataColumns.length)).toString() + "%";
    }
    return result;
  }

  onAddManualDataClick(){
    if(!this.newAdhocJournal.template.id){
      this.handlerLoaderService.notificationHandlerService.showWarning("Select template first!");
      return;
    }
    if(this.manualDataColumns.length != this.newManualData.length){
      this.handlerLoaderService.notificationHandlerService.showError("An unexpected error!");
      return;
    }
    var crValues: string = "";
    var drValues: string = "";
    for(var index=0; index<this.manualDataColumns.length; index++){
      if(this.manualDataColumns[index].typ === "cr/dr" && this.newManualData[index].trim().length === 0){
        this.handlerLoaderService.notificationHandlerService.showWarning("Mandatory field is missing!");
        return;
      } else{
        if(this.manualDataColumns[index].typ === this.enumLoaderService.outputReqColTypes.CR){
          crValues += (crValues.length>0) ? "|#|" : "";
          crValues += this.newManualData[index].trim();
        } else if(this.manualDataColumns[index].typ === this.enumLoaderService.outputReqColTypes.DR){
          drValues += (drValues.length>0) ? "|#|" : "";
          drValues += this.newManualData[index].trim();
        }
      }
    }
    if((crValues.length === 0 && drValues.length === 0) || (crValues.length > 0 && crValues.indexOf("|#||#|")>=0) || 
      (drValues.length > 0 && drValues.indexOf("|#||#|")>=0)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Mandatory field is missing!");
      return;
    }
    
    this.manualData.push(JSON.parse(JSON.stringify(this.newManualData)));
    for(let index=0; index<this.newManualData.length; index++){
      this.newManualData[index] = "";
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onUserChangedByRole(event: any, role: string) {
    if(event && event.item) {
      if(role === "superUser") {
        this.newAdhocJournal.superUser.id = event.item.id;
      }
      if(role.toLowerCase() === this.constantLoaderService.userTypesService.USER_REVIEWER.toLowerCase()) {
        this.newAdhocJournal.reviewer.id = event.item.id;
      }
    }
  }

  onTemplateChange(event: any) {
    if(event && event.item) {
      this.isBusinessDropdownEnabled = true;
      this.newAdhocJournal.template.id = event.item.id;
      if(this.dataService.templateMasterList.findIndex(tmp => tmp.id === event.item.id)>=0) {
        this.newAdhocJournal.template.name = this.dataService.templateMasterList.find(tmp => tmp.id === event.item.id).name;   
        this.loadBusinesRules(event.item.id);
      }
      this.loadManualDataEntry(event.item.id);
    }
  }

  onBusinessRuleChanged(event: any){
    if(event && event.item){
      this.newAdhocJournal.businessRule.id = event.item.id;
      this.newAdhocJournal.businessRule.name = event.item.name;
    }
  }

  onSubmitClick(){
    this.isSubmit = true;
    this.isLoading = true;
    var journalInfo: any = {
      name: this.newAdhocJournal.name, 
      description: this.newAdhocJournal.description,
      frequency: this.newAdhocJournal.frequency,
      template: this.newAdhocJournal.template,
      superuser: this.newAdhocJournal.superUser.id,
      reviewer: this.newAdhocJournal.reviewer.id,
      businessRule: { 
        value: this.newAdhocJournal.businessRule.name,
        id: this.newAdhocJournal.businessRule.id
      },
      // approver: this.newAdhocJournal.approver.id,
      preparer: (this.dataService.isUserLoggedIn) ? this.dataService.user.id : 0,
      requesterEmail: this.newAdhocJournal.requesterEmail
    };
    if(this.newAdhocJournal.dataEntryType === this.enumLoaderService.adhocDataEntryTypes.FILE_UPLOAD){
      if(!this.newAdhocJournal.fileInfo){
        this.uploadErrMsg = "Please upload file!";
        this.isSubmit = false;
        this.isLoading = false;
        return;
      }
      let formData = new FormData();
      formData.append('file', this.newAdhocJournal.fileInfo, this.newAdhocJournal.fileInfo.name);
      formData.append('journal', JSON.stringify(journalInfo));
      this.businessLoaderService.adhocJournalBusinessService.createAdhocJournalAsync(formData).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.isLoading = false;
          if(res.body.journalId){
            this.handlerLoaderService.notificationHandlerService.showSuccess(
              "Adhoc journal is created with Journal Id: " + res.body.journalId.toString());
          }
          this.resetForm();
        }
      }, err=> {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else if(this.newAdhocJournal.dataEntryType === this.enumLoaderService.adhocDataEntryTypes.MANUAL_ENTRY){
      if(!this.isValidForm()){
        this.isLoading = false;
        return;
      }
      journalInfo["templateColumns"] = this.manualDataColumns;
      journalInfo["adhocJournaldata"] = this.manualData;
      this.businessLoaderService.adhocJournalBusinessService.createAdhocJournalManualAsync(journalInfo).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.isLoading = false;
          if(res.body.journalId){
            this.handlerLoaderService.notificationHandlerService.showSuccess(
              "Adhoc journal is created with Journal Id: " + res.body.journalId.toString());
          }
          this.resetForm();
        }
        
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      this.isLoading = false;
    }
  }

  onUploadFile(obj: any){
    this.isSubmit = true;
    if(!this.isValidForm()){
      return;
    }
    if(obj){
      this.newAdhocJournal.fileInfo = obj.file;
    }
  }

  onDataEntryTypeChanged(obj: any){
    if(obj){
      this.newAdhocJournal.dataEntryType = obj.item.value;
    }
  }

  onDeleteManualDataRow(index: number){
    if(index === undefined){
      return;
    }
    this.manualData.splice(index, 1);
  }
}