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
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Component({
  selector: 'app-jeva',
  templateUrl: './jeva.component.html',
  styleUrls: ['./jeva.component.scss']
})
export class JevaComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService) { }

  treeNodes: Array<TreeNodeModel> = [];
  mainWindow: string = "";
  mainWindowHeading: string = "";

  ngOnInit() {
    this.getTreeStructure();
  }

  private getTreeStructure(){
    this.treeNodes = this.businessLoaderService.jevaUiJsonBusinessService.getJevaLeftTree();
    if(this.treeNodes.length > 0){
      if(this.dataService.isNewAdhocJournal){
        this.dataService.isNewAdhocJournal = false;
        this.setLeftMenuActivateByOutsider(this.constantLoaderService.defaultValuesService.JSON_JEVA_NEW_ADHOC_TAG);
      } else if(this.dataService.adhocJournalId && this.dataService.adhocJournalId !== 0){
        this.setLeftMenuActivateByOutsider(this.constantLoaderService.defaultValuesService.JSON_JEVA_ADHOC_LIST_TAG);
      }else{
        if(this.treeNodes.findIndex(t => t.isSelected) >= 0){
          this.leftMenuNodeClick(this.treeNodes.find(t => t.isSelected));
        }
      }
    }
  }

  private setLeftMenuActivateByOutsider(code: string = ""){
    for(var index=0; index<this.treeNodes.length; index++){
      if(this.treeNodes[index].code === code){
        this.treeNodes[index].isSelected = true;
        this.leftMenuNodeClick(this.treeNodes[index]);
      }else{
        this.treeNodes[index].isSelected = false;
      }
    }
  }

  private leftMenuNodeClick(treeNode: TreeNodeModel){
    if(treeNode){
      this.mainWindow = treeNode.code;
      this.mainWindowHeading = treeNode.name;
    }
  }

  onLeftMenuNodeClick(obj: any){
    if(obj){
      this.leftMenuNodeClick(obj.node);
    }
  }
}
