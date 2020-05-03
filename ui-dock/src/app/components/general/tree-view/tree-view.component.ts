/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { TreeNodeModel } from '../../../models/treeNode.model';
import { Broadcaster } from '../../../utility/broadcaster';
import { ConstantLoaderService } from '../../../loaders/constant-loader.service';
import { RunHistoryModel } from '../../../models/runHistory.model';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { RunHistoryPartialModel } from '../../../models/runHistory.model';
import { RoleActionConverterPipe } from '../../../pipes/role-action-converter.pipe';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, DoCheck {

  @Input() nodes: Array<TreeNodeModel> = [];
  @Input() isMultiSelection: boolean = false;
  @Input() isJournalIdFound: boolean = false;
  @Input() isRunDateComboShowing: boolean = false;
  @Input() isJournalListComboShowing: boolean = false;
  @Input() journalListBackInfo: string ="";
  @Input() runStatus: string = "";
  @Input() journalList: Array<JournalInfoPartial> = [];
  @Input() journalIdSelectedForAdvisor: number = 0;
  @Input() runHistoryList: Array<RunHistoryModel> = [];
  @Input() runHistoryDate: string = "";
  @Input() runDateList: Array<RunHistoryPartialModel> = [];
  @Input() runDateSelectedForAdvisor: string = "";
  @Input() mainRoleNode: string = "";
  
  @Output() nodeClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() nodeActionClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() runHistoryDateClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() runHistoryLogClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() journalModelChange: EventEmitter<Object> = new EventEmitter();
  @Output() journalIdChange: EventEmitter<Object> = new EventEmitter();
  @Output() runDateChange: EventEmitter<Object> = new EventEmitter();

  constructor(private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService,
    private roleActionConverterPipe: RoleActionConverterPipe) { }

  ngOnInit() {
  }

  ngDoCheck(){
    this.journalModelChange.next(this.journalIdSelectedForAdvisor);
  }

  private setNoSelection(node: TreeNodeModel){
    for(var index=0; index<this.nodes.length; index++){
      if(node.openIn === this.nodes[index].openIn || (node.openIn !== this.nodes[index].openIn && this.nodes[index].isChildrenOpenInDifferent)){
        this.nodes[index].isSelected = false;
        if(this.nodes[index].children !== undefined && this.nodes[index].children.length>0){
          for(var cnt=0; cnt<this.nodes[index].children.length; cnt++){
            if(node.openIn === this.nodes[index].children[cnt].openIn){
              this.nodes[index].children[cnt].isSelected = false;
              if(this.nodes[index].children[cnt].children !== undefined && this.nodes[index].children[cnt].children.length>0){
                for(var cnt=0; cnt<this.nodes[index].children[cnt].children.length; cnt++){
                  this.nodes[index].children[cnt].children[cnt].isSelected = false;
                }
              }
            }
          }
        }
      }
    }
  }

  private parentSelection(node: TreeNodeModel){
    for(var index=0; index<this.nodes.length; index++){
      if(!this.nodes[index].isChildrenOpenInDifferent){
        if(this.nodes[index].children !== undefined && this.nodes[index].children.length>0){
          for(var cnt=0; cnt<this.nodes[index].children.length; cnt++){
            if(this.nodes[index].children[cnt].code === node.code){
              this.nodes[index].isSelected = node.isSelected;
              break;
            }
          }
        }
      }
    }
  }

  private getMainNode(node: TreeNodeModel): TreeNodeModel{
    for(var index=0; index<this.nodes.length; index++){
      if(this.nodes[index].code === node.code){
        return this.nodes[index];
      }
      if(this.nodes[index].children !== undefined && this.nodes[index].children.length>0){
        for(var cnt=0; cnt<this.nodes[index].children.length; cnt++){
          if(this.nodes[index].children[cnt].code === node.code){
            return this.nodes[index];
          }
        }
      }
    }
    return new TreeNodeModel();
  }

  onNodeClick(node: TreeNodeModel, event: any){
    if(node.isDisabled){
      return;
    }
    var mainNode = null;
    if(node.children !== undefined && node.children.length>0){
      node.isExpanded = !node.isExpanded;
    }else{
      if(!this.isMultiSelection){
        this.setNoSelection(node);
      }
      node.isSelected = !node.isSelected;
      this.parentSelection(node);
      mainNode = this.getMainNode(node);
    }
    this.nodeClick.emit({
      node: node,
      event: event,
      selectedNode: mainNode
    });
    if(node.openIn === "bottom"){
      this.broadcaster.send(this.constantLoaderService.broadcastNamesService.TREE_NODE_TO_RESULT_VIEW, node);
    }
  }

  getArrowClass(node: TreeNodeModel){
    if((node.children && node.children.length === 0) || node.children === undefined){
      return "fa fa-angle-right white-icon";
    }
    if(node.isExpanded){
      return "fa fa-angle-down";
    }
    return "fa fa-angle-right";
  }

  onActionBtnClick(node: TreeNodeModel, event: any){
    if(!this.isMultiSelection){
      this.setNoSelection(node);
    }
    node.isSelected = true;
    this.parentSelection(node);
    this.nodeActionClick.emit({
      node: node,
      event: event,
      selectedNode: node
    });
  }

  isTreeNodeHidden(node: TreeNodeModel, isFirstLayer: boolean = false): boolean {
    if(isFirstLayer && node.roleCode && node.roleCode.length > 0){
      if(this.roleActionConverterPipe.transform(this.mainRoleNode, node.roleCode, "view")){
        return true;
      }
    }
    if(!node.isWithoutJournalId && !this.isJournalIdFound){
      return true;
    }
    return !node.isVisible;
  }

  onRunHistoryDateChanged(obj: any){
    this.runHistoryDateClick.emit({
      runDate: obj.item.runDate
    });
  }

  getRunDateStatus(): boolean{
    if(this.runHistoryDate.length > 0){
      if(this.runHistoryList.findIndex(r => r.runDate === this.runHistoryDate) >= 0){
        return this.runHistoryList.find(r => r.runDate === this.runHistoryDate).isSuccess;
      }
    }
    return false;
  }

  onRunHistoryLogClick(){
    this.runHistoryLogClick.emit();
  }

  onJournalIdChanged(obj: any){
    this.journalIdChange.emit({
      journalInfo: obj.item
    });
  }

  onRunDateChanged(obj: any){
    this.runDateChange.emit({
      runDate: obj.item.runDate
    });
  }
}