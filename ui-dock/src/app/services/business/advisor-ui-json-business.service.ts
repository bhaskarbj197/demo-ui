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
import { DataService } from '../data.service';
import { FolderTypes } from 'src/app/enums/folderTypes';
import { GeneralUtility } from 'src/app/utility/general-utility';

@Injectable({
  providedIn: 'root'
})
export class AdvisorUiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService, 
    private dataService: DataService,
    private generalUtility: GeneralUtility) { }

  private createTreeNode(jsonTree: any, isAdhoc: boolean = false): TreeNodeModel{
    var node = new TreeNodeModel();
    node.id = jsonTree.id;
    node.seq = jsonTree.seq;
    node.name = jsonTree.name;
    node.code = jsonTree.code;
    node.isSelected = jsonTree.isSelected;
    node.isVisible = jsonTree.isVisible;
    node.isDisabled = jsonTree.isDisabled;
    node.isExpanded = jsonTree.isExpanded;
    node.countPropertyName = (jsonTree.countPropertyName) ? jsonTree.countPropertyName : "";
    node.anomalyCount = -1;
    node.children = [];
    if(jsonTree.children && jsonTree.children.length > 0){
      for(var cnt=0; cnt< jsonTree.children.length; cnt++){
        if(isAdhoc){
          if(!jsonTree.children[cnt].isForAdhoc){
            continue;
          }
        }
        var chld = this.createTreeNode(jsonTree.children[cnt], isAdhoc);
        this.createDocEvidenceFolderTypeMap(chld);
        node.children.push(chld);
      }
    }
    node.isWithoutJournalId = true;
    node.isAllChildrenOpenInSamePage = (jsonTree.isAllChildrenOpenInSamePage === undefined) ? false : jsonTree.isAllChildrenOpenInSamePage;
    node.children = this.generalUtility.getSortedArray(node.children, "seq");
    return node;
  }

  private createDocEvidenceFolderTypeMap(childNode: TreeNodeModel) {
    let docEvidenceName = childNode.name.split(" ")[0];
    if(docEvidenceName && docEvidenceName !== "" && FolderTypes[docEvidenceName.toUpperCase()]) {
      this.dataService.docEvidenceFolderTypeMap.set(childNode.code, FolderTypes[docEvidenceName.toUpperCase()]);
    }
  }

  public getStaticTreeStructureForAdvisor(isAdhoc: boolean = false): Array<TreeNodeModel>{
    let treeNodes: Array<TreeNodeModel> = [];
    var jsonTreeList = this.uiJsonDataService.getStaticTreeStructureForAdvisor();
    if(jsonTreeList){
      for(var index=0; index<jsonTreeList.length; index++){
        if(isAdhoc){
            if(!jsonTreeList[index].isForAdhoc){
              continue;
            }
        }
        var node = this.createTreeNode(jsonTreeList[index], isAdhoc);
        if(node){
          treeNodes.push(node);
        }
      }
    }
    treeNodes = this.generalUtility.getSortedArray(treeNodes, "seq");
    return treeNodes;
  }
}
