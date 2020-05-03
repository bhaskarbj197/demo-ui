/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { TemplateMasterModel, TemplateMasterReqResModel } from '../../../../models/templateMaster.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { DataService } from 'src/app/services/data.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-template-master',
  templateUrl: './template-master.component.html',
  styleUrls: ['./template-master.component.scss']
})
export class TemplateMasterComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private generalUtility: GeneralUtility,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADMIN_TEMPLATE_1,
    this.constantLoaderService.tabListTextsService.ADMIN_TEMPLATE_0];
  activeTab: string = this.tabList[0];
  newTemplate: TemplateMasterModel = new TemplateMasterModel();
  backupTemplate: TemplateMasterModel = new TemplateMasterModel();
  templateMaster: TemplateMasterModel = new TemplateMasterModel();
  templateMasterList: Array<TemplateMasterModel> = [];
  isLoading: boolean = false;
  updateCrDR: boolean = false;
  isFormSubmitted: boolean = false;
  isFormSubmitEnabled: boolean = false;
  columnList: Array<string> = [];
  crColName: string = "";
  drColName: string = "";
  isCrValid: boolean = true;
  crAddSubmit: boolean = false;
  drAddSubmit: boolean = false;
  isDrValid: boolean = true;
  templateDeleteIndex: number = -1;
  isNewMode: boolean = true;
  isViewMode: boolean = false;
  isEditMode: boolean = false;

  ngOnInit() {
    this.loadTemplateMasterList();
    this.newTemplate.companyId = this.dataService.user.company.id;
  }

  private resetForm() {
    this.newTemplate = new TemplateMasterModel();
    this.newTemplate.companyId = this.dataService.user.company.id;
    this.isLoading = false;
    this.updateCrDR = false;
    this.isFormSubmitted = false;
    this.isFormSubmitEnabled = false;
  }

  private loadTemplateMasterList() {
    this.isLoading = true;
    let templateList: Array<TemplateMasterReqResModel> = [];
    this.templateMasterList = [];
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      templateList = res.body;
      if(templateList && templateList.length > 0) {
        this.templateMasterList = templateList.map(template => new TemplateMasterModel().deserialize(template))
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  private getColumnListForTemplate(templateIds: Array<number>) {
    this.businessLoaderService.templateMasterBusinessService.getAllTemplateColumnsAsync(templateIds).subscribe(res => {
      if(res.body && res.body && res.body.length > 0 && res.body[0].columnName.length > 0) {
        this.isLoading = false;
        this.updateCrDR = true;
        this.columnList = res.body[0].columnName;
        this.activeTab = this.tabList[1];
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getTemplateDetail(template: TemplateMasterModel) {
    this.newTemplate = new TemplateMasterModel();
    if(template){
      this.newTemplate = JSON.parse(JSON.stringify(template));
      this.getColumnListForTemplate([this.newTemplate.id]);
    }
    this.backupTemplate = JSON.parse(JSON.stringify(this.newTemplate));
  }

  private removeFromList(columnList: Array<string>, columnName: string): Array<string> {
    let delIndex = columnList.findIndex(col => col === columnName);
    if(delIndex >= 0) {
      columnList.splice(delIndex, 1);
    }
    return columnList;
  }

  private generateMandColList(mandColList: Array<string>) : Array<Object> {
    let postDataList = [];
    let tempObj = {};
    for(var cIndex = 0; cIndex < this.columnList.length; cIndex++) {
      tempObj = {};
      tempObj["columnName"] = this.columnList[cIndex];
      tempObj["isMand"] = mandColList.findIndex(col => col === this.columnList[cIndex])>= 0 ? true : false;
      postDataList.push(tempObj);
    }
    return postDataList;
  }

  discardChanges() {
    this.newTemplate = JSON.parse(JSON.stringify(this.backupTemplate));
    this.activeTab = this.tabList[0];
  }

  onUploadTemplate(fileInfo : any) {
    this.isFormSubmitted = true;
    if(this.isLoading) {
      return;
    }
    if(this.newTemplate.name === null || this.newTemplate.name === undefined || 
      this.newTemplate.name.trim().length === 0){
      this.resetForm();
      this.handlerLoaderService.notificationHandlerService.showWarning("Template name is required!");
      return;
    }
    this.businessLoaderService.logBusinessService.addLog("File upload processing...");
    let originalFileName = fileInfo.file.name;
    this.isLoading = true;
    var extn = originalFileName.substr(originalFileName.lastIndexOf(".") + 1);
    var tempInfo = {
      "tempName": this.newTemplate.name, 
      "isActive": this.newTemplate.isActive,
      "companyId": this.newTemplate.companyId
    }
    let formData = new FormData();
    formData.append('file', fileInfo.file, fileInfo.file.name);
    formData.append('fileType', extn);
    formData.append('templateInfo', JSON.stringify(tempInfo));
    this.businessLoaderService.templateMasterBusinessService.addTemplateMasterAsync(formData).subscribe(res => {
      this.loadTemplateMasterList();
      if(res.body && res.body.columnList && res.body.columnList.length > 0) {
        this.columnList = res.body.columnList;
      }      
      this.newTemplate.id = res.body.tempId;
      this.isFormSubmitted = false;
      this.isFormSubmitEnabled = true;
      this.updateCrDR = true;
      this.isEditMode = true;
      this.handlerLoaderService.notificationHandlerService.showSuccess(tempInfo.tempName + " is created successfully.");
    }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  addMandateColumn(fileType: string) {    
    if(fileType === "cr") {
      this.crAddSubmit = true;
      if(this.crColName === undefined || this.crColName === "") {
        this.isCrValid = false;
        return;
      } 
      this.crAddSubmit = false;
      this.isCrValid = true;
      if(this.generalUtility.checkIfAlreadyExists(this.newTemplate.crReq, this.crColName)) {
        this.handlerLoaderService.notificationHandlerService.showWarning("Element '"+ this.crColName + "' already exist!");
        return;    
      }
      this.newTemplate.crReq.push(this.crColName);
      this.crColName = "";
    } else if(fileType === "dr") {
      this.drAddSubmit = true;
      if(this.drColName === undefined || this.drColName === "") {
        this.isDrValid = false;
        return;
      }
      this.drAddSubmit = false;
      this.isDrValid = true;
      if(this.generalUtility.checkIfAlreadyExists(this.newTemplate.drReq, this.drColName)) {
        this.handlerLoaderService.notificationHandlerService.showWarning("Element '"+ this.drColName + "' already exist.");
        return;    
      }
      this.newTemplate.drReq.push(this.drColName);
      this.drColName = "";
    }
  }

  onSubmitTemplateClick() {
    if(this.newTemplate.name === null || this.newTemplate.name === undefined || 
      this.newTemplate.name.trim().length === 0){
      return;
    }
    var postData = {"crList": [], "drList": []};
    postData.crList = this.generateMandColList(this.newTemplate.crReq);
    postData.drList = this.generateMandColList(this.newTemplate.drReq);
    postData["tempId"] = this.newTemplate.id;
    postData["isActive"] = this.newTemplate.isActive;
    this.isLoading = true;
    this.businessLoaderService.templateMasterBusinessService.updateTemplateWithCrDrColumnsAsync(postData).subscribe(res => {
      this.resetForm();
      this.loadTemplateMasterList();
      this.handlerLoaderService.notificationHandlerService.showSuccess("Template is updated successfully.");
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onViewTemplate(template: TemplateMasterModel) {
    this.isViewMode = true;
    this.isLoading = true;
    this.getTemplateDetail(template);
  }

  onEditTemplateClick(template: TemplateMasterModel) {
    this.isEditMode = true;
    this.isFormSubmitEnabled = true;
    this.isLoading = true;
    this.getTemplateDetail(template);
  }

  onDeleteTemplateClick(template: TemplateMasterModel, isConfirm: boolean) {
    let delIndex = this.templateMasterList.findIndex(temp => temp.id === template.id);
    if(this.templateDeleteIndex === -1 && delIndex >= 0) {
      this.templateDeleteIndex = delIndex;
    } else if(isConfirm) {
      var reqObj = {};
      reqObj["tempName"] = template.name;
      reqObj["tempId"] = template.id;
      reqObj["isDelete"] = true;
      this.isLoading = true;
      this.businessLoaderService.templateMasterBusinessService.deleteTemplateAsync(reqObj).subscribe(res => {
        this.templateDeleteIndex = -1;
        this.isLoading = false;
        if(res.body.isSuccess) {
          this.templateMasterList.splice(delIndex, 1);
        }else {
          if(res.body.jidList && res.body.jidList.length > 0) {
            this.handlerLoaderService.notificationHandlerService.showError("Cannot Delete! Template is used in one or more journal(s)!");
          }
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      this.templateDeleteIndex = -1;
    }
  }

  onSetActiveClick() {
    this.newTemplate.isActive = !this.newTemplate.isActive;
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      if(this.activeTab === this.tabList[1]) {
        this.resetForm();
        this.isNewMode = true;
        this.isViewMode = false;
        this.isEditMode = false;
      }
    }
  }

  addCrMandateColumn(type: string) {
    if(type === "cr") {
      if(this.generalUtility.checkIfAlreadyExists(this.newTemplate.crReq, this.crColName)) {
        this.handlerLoaderService.notificationHandlerService.showWarning("Element '"+ this.crColName + "' already exist!");
        return;
      }
      this.newTemplate.crReq.push(this.crColName);
    } else if(type === "dr") {
      if(this.generalUtility.checkIfAlreadyExists(this.newTemplate.drReq, this.drColName)) {
        this.handlerLoaderService.notificationHandlerService.showWarning("Element '"+ this.drColName + "' already exist!");
        return;
      }
      this.newTemplate.crReq.push(this.drColName);
    }
  }

  onRemoveFromList(columnName: string, type: string) {
    if(type === "cr") {
      this.newTemplate.crReq = this.removeFromList(this.newTemplate.crReq, columnName);
    } else if(type === "dr") {
      this.newTemplate.drReq = this.removeFromList(this.newTemplate.drReq, columnName);
    }
  }

  getLockIcon(template: TemplateMasterModel): string{
    if(template.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onActiveTemplateClick(template: TemplateMasterModel){
    if(template){
      this.isLoading = true;
      template.isActive = !template.isActive;
      this.businessLoaderService.templateMasterBusinessService.activateDeactivateTemplateAsync(template.id, template.isActive).subscribe(res => {
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }
}
