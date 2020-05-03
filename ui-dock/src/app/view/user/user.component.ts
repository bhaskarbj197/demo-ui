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
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private router: Router) { }

  treeNodes: Array<TreeNodeModel> = [];
  mainWindow: string = "";
  mainWindowHeading: string = "";
  isTreeLoading: boolean = false;

  ngOnInit() {
    this.businessLoaderService.uiJsonBusinessService.setHeaderMenuSelectedItemByCode(this.router.url.replace("/", ""));
    this.getTreeStructure();
  }

  private getTreeStructure(){
    this.isTreeLoading = true;
    this.treeNodes = this.businessLoaderService.userUiJsonBusinessService.getUserLeftTree();
    if(this.treeNodes.length > 0){
      if(this.dataService.userInfoCode === ""){
        this.setLeftMenu(this.treeNodes[0]);
      } else {
        if(this.treeNodes.findIndex(t => t.code === this.dataService.userInfoCode) >= 0){
          this.setLeftMenu(this.treeNodes.find(t => t.code === this.dataService.userInfoCode));
        }
      }
    }
    this.isTreeLoading = false;
  }

  private setLeftMenu(treeNode: TreeNodeModel){
    if(treeNode){
      this.mainWindow = treeNode.code;
      this.mainWindowHeading = treeNode.name;
      this.treeNodes.find(t => t.isSelected = false);
      this.treeNodes.find(t => t.code === treeNode.code).isSelected = true;
    }
  }

  onLeftMenuNodeClick(obj: any){
    if(obj){
      this.setLeftMenu(obj.node);
    }
  }
}
