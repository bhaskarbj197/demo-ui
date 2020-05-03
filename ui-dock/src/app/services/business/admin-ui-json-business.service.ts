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
import { ValidationRuleCategoryModel } from 'src/app/models/validationRuleCategory.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService) { }

  private createTreeNode(jsonTree: any): TreeNodeModel{
    var node = new TreeNodeModel();
    node.id = jsonTree.id;
    node.seq = jsonTree.seq;
    node.name = jsonTree.name;
    node.code = jsonTree.code;
    node.isSelected = jsonTree.isSelected;
    node.isVisible = jsonTree.isVisible;
    node.isDisabled = jsonTree.isDisabled;
    node.isExpanded = jsonTree.isExpanded;
    node.children = [];
    if(jsonTree.tabs && jsonTree.tabs.length > 0){
      for(var cnt=0; cnt< jsonTree.tabs.length; cnt++){
        var chld = this.createTreeNode(jsonTree.tabs[cnt]);
        node.children.push(chld);
      }
    }
    node.isAllChildrenOpenInSamePage = (jsonTree.isAllChildrenOpenInSamePage === undefined) ? false : jsonTree.isAllChildrenOpenInSamePage;
    node.isWithoutJournalId = true;
    node.roleCode = jsonTree.roleCode ? jsonTree.roleCode : "";
    return node;
  }

  public getAdminLeftTree(): Array<TreeNodeModel>{
    let treeNodes: Array<TreeNodeModel> = [];
    var jsonTreeList = this.uiJsonDataService.getAdminLeftTree();
    if(jsonTreeList){
      for(var index=0; index<jsonTreeList.length; index++){
        var node = this.createTreeNode(jsonTreeList[index]);
        if(node){
          treeNodes.push(node);
        }
      }
    }
    return treeNodes;
  }

  public getValidationRuleCategoryList(): Array<ValidationRuleCategoryModel> {
    let result: Array<ValidationRuleCategoryModel> = new Array<ValidationRuleCategoryModel>();
    
    var list = this.uiJsonDataService.getValidationRuleCategoryList().filter(c => !c.isDisabled);
    for(var index=0; index<list.length; index++){
      var cat: ValidationRuleCategoryModel = new ValidationRuleCategoryModel();
      cat.name = list[index].name;
      cat.code = list[index].code;
      cat.isDisabled = list[index].isDisabled;
      cat.isColumnListShow = list[index].isColumnListShow;
      cat.isOperatorShow = list[index].isOperatorShow;
      cat.isDestColumnValueShow = list[index].isDestColumnValueShow;
      cat.isAndOrShow = list[index].isAndOrShow;
      result.push(cat);
    }
    return result;
  }
}
