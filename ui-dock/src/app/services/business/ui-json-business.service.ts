/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../../services/data/ui-json-data.service';
import { TreeNodeModel } from '../../models/treeNode.model';
import { FieldModel } from '../../models/field.model';
import { InputSourceModel } from '../../models/inputSource.model';
import { ProcessStepModel } from 'src/app/models/processStep.model';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { HeaderMenuModel } from '../../models/headerMenu.model';
import { DataService } from '../../services/data.service';

@Injectable({
  providedIn: 'root'
})

export class UiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService,
    private constantLoaderService: ConstantLoaderService,
    private dataService: DataService) { }

  private jsonTemplate = this.uiJsonDataService.getStaticTreeStructure();
  private jsonItem : any;
  private childJsonItem : any;

  private createTreeNode(nodeDetail: any) {
    let treeNode = new TreeNodeModel();
    treeNode.id = nodeDetail.id;
    treeNode.name = nodeDetail.name;
    treeNode.seq = nodeDetail.seq;
    treeNode.code = nodeDetail.code;
    treeNode.isDisabled = nodeDetail.isDisabled;
    treeNode.isExpanded = nodeDetail.isExpanded;
    treeNode.isSelected = nodeDetail.isSelected;
    treeNode.isVisible = nodeDetail.isVisible;
    treeNode.actionBtnIcon = nodeDetail.actionBtnIcon ? nodeDetail.actionBtnIcon : "";
    treeNode.openIn = nodeDetail.openIn;
    treeNode.children = new Array<TreeNodeModel>();
    treeNode.isChildrenOpenInDifferent = nodeDetail.isChildrenOpenInDifferent ? nodeDetail.isChildrenOpenInDifferent : false;
    treeNode.isCountShow = nodeDetail.isCountShow ? nodeDetail.isCountShow : false;
    treeNode.isWithoutJournalId = nodeDetail.isWithoutJournalId ? nodeDetail.isWithoutJournalId : false;
    treeNode.roleCode = nodeDetail.roleCode ? nodeDetail.roleCode : "";
    treeNode.isOnlyForJeh = (nodeDetail.isOnlyForJeh === undefined || nodeDetail.isOnlyForJeh === null) ?
      false : nodeDetail.isOnlyForJeh;
    return treeNode;
  }

  private getField(fieldDetail: any): FieldModel {
    let field = new FieldModel();
    field.fieldName = fieldDetail.fieldName;
    field.fieldCode = fieldDetail.fieldCode;
    field.typ = fieldDetail.typ;
    field.help = fieldDetail.help;
    field.placeHolder = fieldDetail.placeHolder;
    field.isRequired = fieldDetail.isRequired;
    field.value = fieldDetail.value;
    field.validationRegex = fieldDetail.validationRegex;
    field.visibility = fieldDetail.visibility;
    field.isDisabled = fieldDetail.isDisabled;
    field.defaultValue = fieldDetail.defaultValue;
    field.fieldBackLabelIcon = fieldDetail.fieldBackLabelIcon ? fieldDetail.fieldBackLabelIcon : "";
    field.adjoinedFieldCode = fieldDetail.adjoinedFieldCode ? fieldDetail.adjoinedFieldCode : "";
    field.isAdjoined = fieldDetail.isAdjoined;
    if(fieldDetail.list){
      field.list = fieldDetail.list;
    }
    return field;
  }

  private getFields(fieldList: any): Array<FieldModel>{
    let fList: Array<FieldModel> = [];
    for(var index=0; index<fieldList.length; index++){
      fList.push(this.getField(fieldList[index]));
    }
    return fList;
  }

  public getStaticTreeStructure(): Array<TreeNodeModel>{
    let treeNode = new TreeNodeModel();
    let childNode = new TreeNodeModel();
    var treeModel= new Array<TreeNodeModel>();
    for(var index=0; index < this.jsonTemplate.length; index++) {
      this.jsonItem = this.jsonTemplate[index];
      treeNode = new TreeNodeModel();
      treeNode = this.createTreeNode(this.jsonItem);
      if(this.jsonItem.fields && this.jsonItem.fields.length > 0) {
        treeNode.fields = this.getFieldList(this.jsonItem.code);
      }
      if(this.jsonItem.tabs && this.jsonItem.tabs.length > 0) {
        for(var tIndex = 0 ; tIndex < this.jsonItem.tabs.length ; tIndex++) {
          this.childJsonItem = this.jsonItem.tabs[tIndex];
          childNode = new TreeNodeModel();
          childNode = this.createTreeNode(this.childJsonItem);
          treeNode.children.push(childNode);
        }
      }
      treeModel.push(treeNode);
    }
    return treeModel;
  }

  public getFieldList(nodeCode: string){
    for(var index=0; index<this.jsonTemplate.length; index++){
      if(this.jsonTemplate[index].code === nodeCode){
        if(this.jsonTemplate[index].fields){
          return this.getFields(this.jsonTemplate[index].fields);
        }
      }
      if(this.jsonTemplate[index].tabs && this.jsonTemplate[index].tabs.length>0){
        for(var cnt=0; cnt<this.jsonTemplate[index].tabs.length; cnt++){
          if(this.jsonTemplate[index].tabs[cnt].code === nodeCode){
            if(this.jsonTemplate[index].tabs[cnt].fields){
              return this.getFields(this.jsonTemplate[index].tabs[cnt].fields);
            }
          }
        }
      }
    }
    return [];
  }

  public getInputSourceChildrenTreeNodes(inputSources: Array<InputSourceModel>): Array<TreeNodeModel>{
    let children: Array<TreeNodeModel> = [];
    for(var cnt=0; cnt<inputSources.length; cnt++){
      if(inputSources[cnt].sourceName && inputSources[cnt].sourceName.value){
        let treeNode = new TreeNodeModel();
        treeNode.id = cnt+100;
        treeNode.name = inputSources[cnt].sourceName.value;
        treeNode.seq = cnt+1;
        treeNode.code = inputSources[cnt].sourceName.value.replace(" ", "");
        treeNode.isDisabled = false;
        treeNode.isExpanded = false;
        treeNode.isSelected = false;
        treeNode.isVisible = true;
        treeNode.actionBtnIcon = "";
        treeNode.openIn = "bottom";
        treeNode.children = new Array<TreeNodeModel>();
        treeNode.folderType = this.constantLoaderService.folderTypesService.INPUT;
        treeNode.isMasterFile = (inputSources[cnt].isMaster && inputSources[cnt].isMaster.value) ? inputSources[cnt].isMaster.value : false;
        children.push(treeNode);
      }
    }
    this.dataService.inputSources = children;
    return children;
  }

  public getProcessDataChildrenTreeNodes(steps: Array<ProcessStepModel>): Array<TreeNodeModel>{
    let children: Array<TreeNodeModel> = [];
    for(var cnt=0; cnt<steps.length; cnt++){
      if(steps[cnt].resultTab && steps[cnt].resultTab.newTab && steps[cnt].resultTab.tabName){
        if(steps[cnt].resultTab.newTab){
          if(children.findIndex(c => c.code === steps[cnt].resultTab.tabName.replace(" ", "")) < 0){
            let treeNode = new TreeNodeModel();
            treeNode.id = steps[cnt].id;
            treeNode.name = steps[cnt].resultTab.tabName;
            treeNode.seq = steps[cnt].id;
            treeNode.code = steps[cnt].resultTab.tabName.replace(" ", "");
            treeNode.isDisabled = false;
            treeNode.isExpanded = false;
            treeNode.isSelected = false;
            treeNode.isVisible = true;
            treeNode.actionBtnIcon = "";
            treeNode.openIn = "bottom";
            treeNode.children = new Array<TreeNodeModel>();
            treeNode.folderType = this.constantLoaderService.folderTypesService.PROCESS;
            children.push(treeNode);
          }
        }
      }
    }
    return children;
  }

  public getOutputTemaplateChildrenTreeNodes(templates: Array<string>): Array<TreeNodeModel>{
    let children: Array<TreeNodeModel> = [];
    for(var cnt=0; cnt<templates.length; cnt++){
      let treeNode = new TreeNodeModel();
      treeNode.id = cnt;
      treeNode.name = templates[cnt];
      treeNode.seq = cnt;
      treeNode.code = templates[cnt].replace(" ", "");
      treeNode.isDisabled = false;
      treeNode.isExpanded = false;
      treeNode.isSelected = false;
      treeNode.isVisible = true;
      treeNode.actionBtnIcon = "";
      treeNode.openIn = "bottom";
      treeNode.children = new Array<TreeNodeModel>();
      treeNode.folderType = this.constantLoaderService.folderTypesService.OUTPUT;
      children.push(treeNode);
    }
    return children;
  }

  public getHeaderMenuJson(): Array<HeaderMenuModel>{
    var menuTemplate = this.uiJsonDataService.getHeaderMenuJson();
    var menuList: Array<HeaderMenuModel> = [];
    for(var index=0; index<menuTemplate.length; index++){
      var item = new HeaderMenuModel();
      item.name = menuTemplate[index].name;
      item.code = menuTemplate[index].code;
      item.seq = menuTemplate[index].seq;
      item.isSelected = menuTemplate[index].isSelected;
      item.isVisible = menuTemplate[index].isVisible;
      item.isClickable = menuTemplate[index].isClickable;
      item.route = menuTemplate[index].route;
      menuList.push(item);
    }
    return menuList;
  }

  public setHeaderMenuSelectedItemByCode(itemCode: string){
    this.dataService.headerMenu.filter(m => m.isSelected = false);
    this.dataService.headerMenu[this.dataService.headerMenu.findIndex(m => m.code === itemCode)].isSelected = true;
  }

  public selectDefaultHeaderMenuItem(){
    var menuList: Array<HeaderMenuModel> = new Array<HeaderMenuModel>();
    menuList = this.getHeaderMenuJson();
    this.setHeaderMenuSelectedItemByCode(menuList.find(m => m.isSelected).code);
  }

  public getTermsConditions(){
    return this.uiJsonDataService.getTermsConditions();
  }

  public getJournalAutoApproverRuleActions(){
    return this.uiJsonDataService.getJournalAutoApproverRuleActions();
  }
}
