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
import { UserInfoListItemModel } from 'src/app/models/userInfoListItem.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';

@Injectable({
  providedIn: 'root'
})
export class UserUiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility) { }

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
    if(jsonTree.children && jsonTree.children.length > 0){
      for(var cnt=0; cnt< jsonTree.children.length; cnt++){
        var chld = this.createTreeNode(jsonTree.children[cnt]);
        node.children.push(chld);
      }
    }
    node.isAllChildrenOpenInSamePage = false;
    node.isWithoutJournalId = true;
    node.children = this.generalUtility.getSortedArray(node.children, "seq");
    return node;
  }

  public getUserLeftTree(): Array<TreeNodeModel>{
    let treeNodes: Array<TreeNodeModel> = [];
    var jsonTreeList = this.uiJsonDataService.getUserLeftTree();
    if(jsonTreeList){
      for(var index=0; index<jsonTreeList.length; index++){
        if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE && 
          !jsonTreeList[index].isKeyCloakAccess){
          continue;
        }
        var node = this.createTreeNode(jsonTreeList[index]);
        if(node){
          treeNodes.push(node);
        }
      }
    }
    treeNodes = this.generalUtility.getSortedArray(treeNodes, "seq");
    return treeNodes;
  }

  public getUserInfoList(): Array<UserInfoListItemModel>{
    var result: Array<UserInfoListItemModel> = new Array<UserInfoListItemModel>();
    var jsonTreeList = this.uiJsonDataService.getUserLeftTree();
    if(jsonTreeList){
      for(var index=0; index<jsonTreeList.length; index++){
        if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE && !jsonTreeList[index].isKeyCloakAccess){
          continue;
        }
        if(jsonTreeList[index].isInUserInfoList){
          var item: UserInfoListItemModel = new UserInfoListItemModel();
          item.id = jsonTreeList[index].id;
          item.code = jsonTreeList[index].code;
          item.name = jsonTreeList[index].name;
          item.userInfoListIcon = jsonTreeList[index].userInfoListIcon;
          item.isKeyCloakAccess = jsonTreeList[index].isKeyCloakAccess;
          result.push(item);
        }
      }
    }
    return result;
  }
}
