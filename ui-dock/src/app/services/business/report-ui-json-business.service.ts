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
import { GeneralUtility } from 'src/app/utility/general-utility';

@Injectable({
  providedIn: 'root'
})
export class ReportUiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService,
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
    if(jsonTree.tabs && jsonTree.tabs.length > 0){
      for(var cnt=0; cnt< jsonTree.tabs.length; cnt++){
        var chld = this.createTreeNode(jsonTree.tabs[cnt]);
        node.children.push(chld);
      }
    }
    node.isAllChildrenOpenInSamePage = (jsonTree.isAllChildrenOpenInSamePage === undefined) ? false : jsonTree.isAllChildrenOpenInSamePage;
    node.isWithoutJournalId = true;
    node.children = this.generalUtility.getSortedArray(node.children, "seq");
    return node;
  }
  
  public getReportLeftTree(): Array<TreeNodeModel>{
    let treeNodes: Array<TreeNodeModel> = [];
    var jsonTreeList = this.uiJsonDataService.getReportLeftTree();
    if(jsonTreeList){
      for(var index=0; index<jsonTreeList.length; index++){
        var node = this.createTreeNode(jsonTreeList[index]);
        if(node){
          treeNodes.push(node);
        }
      }
    }
    treeNodes = this.generalUtility.getSortedArray(treeNodes, "seq");
    return treeNodes;
  }
}
