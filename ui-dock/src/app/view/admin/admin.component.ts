/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { TreeNodeModel } from '../../models/treeNode.model';
import { BusinessLoaderService } from '../../loaders/business-loader.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService) { }

  treeNodes: Array<TreeNodeModel> = [];
  mainWindow: string = "";
  mainWindowHeading: string = "";
  isTreeLoading: boolean = false;

  ngOnInit() {
    this.getTreeStructure();
  }

  private getTreeStructure(){
    this.isTreeLoading = true;
    this.treeNodes = this.businessLoaderService.adminUiJsonBusinessService.getAdminLeftTree();
    if(this.treeNodes.length > 0){
      if(this.treeNodes.findIndex(t => t.isSelected) >= 0){
        this.setLeftMenu(this.treeNodes.find(t => t.isSelected));
      } else {
        this.setLeftMenu(this.treeNodes[0]);
      }
    }
    this.isTreeLoading = false;
  }

  private setLeftMenu(treeNode: TreeNodeModel){
    if(treeNode){
      this.mainWindow = treeNode.code;
      this.mainWindowHeading = treeNode.name;
    }
  }

  onLeftMenuNodeClick(obj: any){
    if(obj){
      this.setLeftMenu(obj.node);
    }
  }
}
