/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { GroupMasterModel, GroupMasterReqResModel, GroupElementModel } from '../../../../models/groupMaster.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility'
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.scss']
})
export class GroupMasterComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [];
  activeTab: string = this.tabList[0];
  newGroup: GroupMasterModel = new GroupMasterModel();
  newElement: GroupElementModel;
  groupMasterList: Array<GroupMasterModel> = [];
  isFormSubmitted: boolean = false;
  newGroupAdded: boolean = false;
  submitLabel: string = "Submit";
  isLoading: boolean = false;
  maxActiveGroups: number = 2;
  gmDeleteIndex: number = -1;
  isEditMode: boolean = false;
  addElementList: Array<GroupElementModel> = [];
  removeElementList: Array<GroupElementModel> = [];
  activeGroups: number = 0;
  isToggleDisabled: boolean = false;

  ngOnInit() {
    this.newElement = new GroupElementModel();
    this.tabList = [this.constantLoaderService.tabListTextsService.GROUP_MASTER_1, this.constantLoaderService.tabListTextsService.GROUP_MASTER_0];
    this.activeTab = this.tabList[0];
    this.loadExistingGroups();
  }

  private isValidForm() {
    if(this.newGroup && (!this.newGroup.name || !this.addElementList || this.addElementList.length === 0)) {
      return false;
    }
    return true;
  }

  private resetInput() {
    this.isFormSubmitted = false;
    this.isLoading = false;
    this.isEditMode = false;
    this.submitLabel = "Submit";
    this.newElement = new GroupElementModel();
    this.newElement.name = "";
    this.addElementList = [];
    this.removeElementList = [];
    this.newGroup = new GroupMasterModel();
  }

  private getGroupMasterDetail(group: GroupMasterModel) {
    this.newGroup = group;
  }

  private createRequestBody() {
    var requestBody = {};
    requestBody["groupId"] = this.newGroup.id;
    requestBody["isActive"] = this.newGroup.isActive;
    requestBody["addElementList"] = this.addElementList.filter(ele => (!ele.id || ele.id === undefined)).map(el => el.name);
    requestBody["removeElementList"] = this.removeElementList;
    return requestBody;
  }

  private addNewGroup() {
    var requestBody = {};
    this.isLoading = true;
    requestBody["groupName"] = this.newGroup.name;
    requestBody["isActive"] = this.newGroup.isActive;
    requestBody["elements"] = this.addElementList.map(ele => ele.name);
    this.isFormSubmitted = false;
    this.businessLoaderService.groupMasterBusinessService.addNewGroupMasterAsync(requestBody).subscribe(res=> {
      if(res.body) {
        if(res.body.isSuccess) {
          this.resetInput();
          this.loadExistingGroups();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Group is created successfully.");
        } else if(res.body.message) {
          this.handlerLoaderService.notificationHandlerService.showWarning(res.body.message);
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private updateExistingGroup() {
    this.isLoading = true;
    var requestBody = this.createRequestBody();
    this.businessLoaderService.groupMasterBusinessService.updateGroupMasterAsync(requestBody).subscribe(res => {
      this.isLoading = false;
      if(res.body && res.body.isSuccess){
        this.loadExistingGroups();
        this.handlerLoaderService.notificationHandlerService.showSuccess("Group is updated successfully.");
      } else if(res.body.message) {
        this.handlerLoaderService.notificationHandlerService.showWarning(res.body.message);
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
    this.resetInput();
  }

  isToggleDisable(): boolean {
    var isDisabled: boolean = true;
    if(this.newGroup.id && this.newGroup.id !== undefined) {
      if(this.newGroup.isActive || (this.groupMasterList.filter(group => group.isActive).length < this.maxActiveGroups)) {
        isDisabled = false;
      } else if(this.groupMasterList.findIndex(grp => grp.id === this.newGroup.id)>=0){
        isDisabled = true;
      }
    } else {
      if(this.groupMasterList.filter(group => group.isActive).length < this.maxActiveGroups){
        isDisabled = false;
      }
    }
    return isDisabled;
  }

  loadExistingGroups() {
    this.isLoading = true;
    var groupList: Array<GroupMasterReqResModel> = [];
    this.groupMasterList = [];
    this.businessLoaderService.groupMasterBusinessService.getAllMasterGroupsAsync()
    .subscribe(res => {
      this.isLoading = false;
      groupList = res.body;
      if(groupList.length > 0) {
        this.groupMasterList = groupList.map( group => new GroupMasterModel().deserialize(group));
        this.activeGroups = this.groupMasterList.filter(group => group.isActive).length;
      } else {
        this.activeGroups = 0;
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  onSubmitClick() {
    this.isFormSubmitted = true;
    if(!this.isValidForm()) {
      return;
    }
    this.isLoading = true;
    if(!this.isEditMode) {
      this.addNewGroup();
    } else {
      this.updateExistingGroup();
    }
  }

  onEditGroupMasterClick(groupMaster: GroupMasterModel) {
    this.isEditMode = true;
    this.getGroupMasterDetail(groupMaster);
    this.addElementList = this.newGroup.elements;
    this.activeTab = this.tabList[1];
  }

  onSetActiveClick() {
    if(!this.newGroup.isActive && this.groupMasterList.filter(res => res.isActive).length === this.maxActiveGroups) {
      this.newGroup.isActive = false;
      this.handlerLoaderService.notificationHandlerService.showWarning("Only "+ this.maxActiveGroups + " group masters can be active!");
    } else {
      this.newGroup.isActive = !this.newGroup.isActive;
    }
  }

  onChangeActivenessClick(grp: GroupMasterModel){
    if(grp){
      this.isLoading = true;
      this.businessLoaderService.groupMasterBusinessService.updateGroupActivenessAsync(grp.id, !grp.isActive).subscribe(res => {
        if(res && res.body && res.body.isSuccess){
          grp.isActive = !grp.isActive;
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  isInactiveBtnDisabled(grp: GroupMasterModel): boolean{
    if(!grp.isActive){
      return (this.groupMasterList.filter(res => res.isActive).length >= this.maxActiveGroups);
    }
    return false;
  }

  addElementToGroup() {
    this.isFormSubmitted = true;
    if((this.newGroup && this.newGroup.name === "") || !this.newElement || this.newElement.name === "") {
      return;
    }
    if(this.generalUtility.checkIfAlreadyExists(this.newGroup.elements, this.newElement.name)) {
      this.handlerLoaderService.notificationHandlerService.showWarning("Element '"+ this.newElement + "' already exist!");
      return;
    }
    if(!this.newElement.id || this.newElement.id === undefined) {
      this.addElementList.push(new GroupElementModel().deserialize(this.newElement));
    }
    this.newElement.name = "";
    this.isFormSubmitted = false;
  }

  onDeleteGroupMasterClick(group: GroupMasterModel, isConfirm: boolean) {
    let delIndex = this.groupMasterList.findIndex(grp => grp.id === group.id);
    if(this.gmDeleteIndex === -1 && delIndex >= 0) {
      this.gmDeleteIndex = delIndex;
    } else if(isConfirm) {
      var reqObj = {};
      reqObj["groupName"] = group.name;
      reqObj["groupId"] = group.id;
      this.isLoading = true;
      this.businessLoaderService.groupMasterBusinessService.deleteGroupMasterAsync(reqObj).subscribe(res => {
        this.gmDeleteIndex = -1;
        this.isLoading = false;
        if(res.body.isSuccess) {
          this.groupMasterList.splice(delIndex, 1);
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      })
    } else {
      this.gmDeleteIndex = -1;
    }
  }

  onRemoveElement(element: GroupElementModel) {
    let delIndex = -1;
    if(element && element.id !== undefined) {
      this.removeElementList.push(new GroupElementModel().deserialize(element));
      delIndex = this.addElementList.findIndex(el => el.id === element.id);      
    } else {
      delIndex = this.addElementList.findIndex(el => el.name === element.name);
    }
    if(delIndex >= 0) {
      this.addElementList.splice(delIndex, 1);
      this.newElement = new GroupElementModel();
    }
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
    this.resetInput();
  }

  getLockIcon(goupMaster: GroupMasterModel): string{
    if(goupMaster.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }
}
