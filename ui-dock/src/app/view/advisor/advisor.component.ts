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
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { DataService } from 'src/app/services/data.service';
import { RunHistoryPartialModel } from '../../models/runHistory.model';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { Router } from '@angular/router';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { journalIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.scss']
})
export class AdvisorComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private broadcaster: Broadcaster,
    private dateConverterPipe: DateConverterPipe,
    private constantLoaderService: ConstantLoaderService,
    private router: Router,
    private handlerLoaderService: HandlerLoaderService) { }

  journalReqObject: JournalInfoPartial = new JournalInfoPartial();
  journalShortInfo: JournalInfoPartial = new JournalInfoPartial();
  treeNodes: Array<TreeNodeModel>;
  journalList: JournalInfoPartial[] = new Array<JournalInfoPartial>();
  selectedSegment: string = "";
  mainWindow: string = "";
  childWindowCode: string = "";
  mainWindowHeading: string = "";
  journalId: journalIdType = 0;
  isTreeLoading: boolean = false;
  isMainLoading: boolean = false;
  journalDateRunStatus: string = "";
  runDateList: Array<RunHistoryPartialModel> = [];
  runDateSelectedForAdvisor: string = "";
  journalListBackLblInfo: string = "";
  selectedNode: any = {};
  node: any = {};

  ngOnInit() {
    this.init();
    this.setJournalInfo();
    this.getDataOnLoad();
    this.selectedSegment = this.journalShortInfo.advisorSegmentSelected;
  }

  private init() {
    this.dataService.docEvidenceFolderTypeMap = new Map();
    this.isTreeLoading = true;
    this.isMainLoading = true;
    this.dataService.selectedRunHistoryDate = "";
  }

  private setJournalInfo() {
    this.journalShortInfo = this.dataService.journalShortInfo;
    if(this.journalShortInfo.id === 0){
      return;
    }
    if (this.selectedSegment !== "") {
      this.journalShortInfo.advisorSegmentSelected = this.selectedSegment;
      this.mainWindow = this.selectedSegment;
    }
    this.journalListBackLblInfo = this.journalShortInfo.isAdhoc ? "Adhoc" : "";
    this.runDateSelectedForAdvisor = this.journalShortInfo.runDateSelected;
    this.journalReqObject = JSON.parse(JSON.stringify(this.journalShortInfo));
    this.setAdvisorSetting();
  }

  private getDataOnLoad() {
    this.getAllRunDatesByJournalId(this.journalShortInfo.id);
    this.getTreeStructure();
    this.getAllJournals();
  }

  private setAdvisorSetting() {
    if(this.constantLoaderService.configValuesService.IS_ADVISOR_HARDCODED_SETTING){
      this.journalReqObject.id = 4522;
      this.journalReqObject.runDateSelected = '31-10-2019';
    }
  }

  private getAllJournals(){
    if(this.journalShortInfo.isAdhoc){
      this.businessLoaderService.adhocJournalBusinessService.getAdvisoryAdhocJournalsAsync().subscribe(response => {
        if(response.body && response.body.data){
          for(var index=0; index<response.body.data.length; index++){
            var journal = new JournalInfoPartial();
            journal.id = response.body.data[index].id;
            journal.name = response.body.data[index].name;
            this.journalList.push(journal);
          }
          this.setupWindow();
        }
        this.isTreeLoading = false;
        this.isMainLoading = false;
      }, err => {
        this.isTreeLoading = false;
        this.isMainLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }else{
      this.businessLoaderService.advisorHomeBusinessService.getJournalDataListAsync().subscribe(response => {
        if(response.body && response.body.data){
          for(var index=0; index<response.body.data.length; index++){
            var journal = new JournalInfoPartial();
            journal.id = response.body.data[index].id;
            journal.name = response.body.data[index].name;
            journal.advisorSegmentSelected = this.selectedSegment;
            journal.runDateSelected = this.dateConverterPipe.transform(response.body.data[index].runDate, false, true);
            journal.isAdhoc = false;
            this.journalList.push(journal);
          }
          this.setupWindow();
        }
        this.isTreeLoading = false;
        this.isMainLoading = false;
      }, err => {
        this.isTreeLoading = false;
        this.isMainLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  private setupWindow(){
    this.journalId = this.journalShortInfo.id;
    this.mainWindow = this.journalShortInfo.advisorSegmentSelected;
    if(this.treeNodes){
      if(this.treeNodes.findIndex(t => t.code === this.mainWindow) > -1){
        this.mainWindowHeading = this.treeNodes.find(t => t.code === this.mainWindow).name;
        this.treeNodes.find(t => t.code === this.mainWindow).isSelected = true;
      }
      for(var index=0; index<this.treeNodes.length; index++){
        if(this.treeNodes[index].children && this.treeNodes[index].children.length > 0){
          for(var cnt=0; cnt<this.treeNodes[index].children.length; cnt++){
            if(this.treeNodes[index].children[cnt].code === this.mainWindow){
              this.mainWindowHeading = this.treeNodes[index].name + " - " + this.treeNodes[index].children[cnt].name;
              if(this.treeNodes[index].isAllChildrenOpenInSamePage){
                this.mainWindow = this.treeNodes[index].code;
              } else {
                this.mainWindow = this.treeNodes[index].children[cnt].code;
              }
              this.treeNodes[index].children[cnt].isSelected = true;
              this.treeNodes[index].isSelected = true;
              break;
            }
          }
        }
      }
    }
  }

  private getAllRunDatesByJournalId(journalId: journalIdType, reload: boolean = false){
    this.isTreeLoading = true;
    this.runDateList = [];
    if(journalId){
      this.businessLoaderService.advisorHomeBusinessService.getAllRunDatesByJournalIdAsync(journalId).subscribe(response => {
        if(response.body && response.body.data){
          for(var index=0; index<response.body.data.length; index++){
            var runHistoryPartial = new RunHistoryPartialModel();
            runHistoryPartial.status = response.body.data[index].status;
            runHistoryPartial.runDate = response.body.data[index].runDate;
            this.runDateList.push(runHistoryPartial);
            if(reload) {
              this.runDateSelectedForAdvisor = response.body.data[index].runDate;
              this.journalShortInfo.runDateSelected = this.runDateSelectedForAdvisor;
            }
          }
        }
        this.updateJournalDateRunStatus();
        this.isTreeLoading = false;
      }, err => {
        this.isTreeLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  private getTreeStructure(){
    this.treeNodes = this.businessLoaderService.advisorUiJsonBusinessService.getStaticTreeStructureForAdvisor(this.journalShortInfo.isAdhoc);
    this.businessLoaderService.advisorAnomalyBusinessService.getAnomalyStatCountAsync(this.journalReqObject.id, this.journalReqObject.runDateSelected).subscribe(res =>{
      if(res.body){
        for(var index=0; index<this.treeNodes.length; index++){
          if(this.treeNodes[index].countPropertyName.length > 0 && res.body[this.treeNodes[index].countPropertyName]){
            this.treeNodes[index].anomalyCount = res.body[this.treeNodes[index].countPropertyName];
          }
          if(this.treeNodes[index].children && this.treeNodes[index].children.length > 0){
            for(var cnt=0; cnt<this.treeNodes[index].children.length; cnt++){
              if(this.treeNodes[index].children[cnt].countPropertyName && this.treeNodes[index].children[cnt].countPropertyName.length > 0 && 
                res.body[this.treeNodes[index].children[cnt].countPropertyName]){
                  this.treeNodes[index].children[cnt].anomalyCount = res.body[this.treeNodes[index].children[cnt].countPropertyName];
              }
            }
          }
        }
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });

    if(!this.journalReqObject.isAdhoc){
      this.businessLoaderService.advisorAnomalyBusinessService
        .getAdvisoryConfigListAsync(this.journalReqObject.id, this.journalReqObject.runDateSelected)
        .subscribe(response => {
        if(response.body){
          var configFileList = response.body;
          var nodes: Array<TreeNodeModel> = [];
          for(var index=0; index<configFileList.length; index++){
            var treeNode = new TreeNodeModel();
            treeNode.id = 1000 + index;
            treeNode.name = configFileList[index].fileName + "-" + configFileList[index].targetName;
            treeNode.code = configFileList[index].fileName + "-" + configFileList[index].targetName;
            treeNode.isExpanded = false;
            treeNode.isSelected = false;
            treeNode.isVisible = true;
            treeNode.isDisabled = false;
            treeNode.seq = 1000 + index;
            treeNode.isWithoutJournalId = true;
            if(configFileList[index].isAnomaly){
              treeNode.dangerCount = configFileList[index].anomalyCount;
            }
            nodes.push(treeNode);
          }
          this.treeNodes.find(t => t.code === "dataAnomalies").children = nodes;
        }
      }, err => {
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  private updateJournalDateRunStatus(){
    this.journalDateRunStatus = this.runDateList.find(r => r.runDate === this.journalShortInfo.runDateSelected).status;
    this.dataService.journalRunStatus = this.runDateList.find(r => r.runDate === this.journalShortInfo.runDateSelected).status;
  }

  onLeftMenuNodeClick(obj: any){
    if(obj.node !== null){
      this.node = obj.node;
      if(obj.node.code === this.constantLoaderService.defaultValuesService.JSON_ADVR_JOURNAL_DATA_TAG){
        this.dataService.logs = [];
        this.dataService.journalId = this.journalId;
        this.dataService.journalStatus = this.dataService.journalRunStatus;
        this.dataService.selectedRunHistoryDate = this.journalShortInfo.runDateSelected;
        this.dataService.journalViewMode = this.constantLoaderService.viewModesService.VIEW;
        this.router.navigate(["jeva"]);
      }
      if(obj.node.children && obj.node.children.length > 0){
        return;
      }
      if(obj.selectedNode && obj.selectedNode.id !== obj.node.id && obj.selectedNode.isAllChildrenOpenInSamePage){
        this.selectedNode = obj.selectedNode;
        this.mainWindow = obj.selectedNode.code;
        this.selectedSegment = this.mainWindow;
        this.childWindowCode = obj.node.code;
      } else{
        this.mainWindow = obj.node.code;
        this.selectedSegment = this.mainWindow;
      }
      var headingInit = "";
      if(obj.selectedNode){
        if(obj.selectedNode.id !== obj.node.id){
          headingInit = obj.selectedNode.name + " - ";
        }
      }
      this.mainWindowHeading = headingInit + obj.node.name;
    }
  }

  onJournalIdChanged(obj: any){
    if(obj && obj.journalInfo){
      this.dataService.journalShortInfo = obj.journalInfo;
      this.setJournalInfo();      
      this.getAllRunDatesByJournalId(this.journalShortInfo.id);
      this.getTreeStructure();
      this.setupWindow();
      this.broadcaster.send(this.mainWindow,  this.journalReqObject);
    }
  }

  onRunDateChanged(obj: any){
    if(obj && obj.runDate){
      this.runDateSelectedForAdvisor = obj.runDate;
      this.journalShortInfo.runDateSelected = obj.runDate;
      this.journalShortInfo.advisorSegmentSelected = this.selectedSegment;
      this.journalReqObject = JSON.parse(JSON.stringify(this.journalShortInfo));
      this.updateJournalDateRunStatus();
      this.broadcaster.send(this.mainWindow,  this.journalReqObject);
      this.getTreeStructure();
      this.setupWindow();
    }
  }
}