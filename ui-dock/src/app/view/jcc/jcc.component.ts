/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNodeModel } from '../../models/treeNode.model';
import { ProcessStepModel } from '../../models/processStep.model';
import { BusinessLoaderService } from '../../loaders/business-loader.service';
import { EnumLoaderService } from '../../loaders/enum-loader.service';
import { DataService } from 'src/app/services/data.service';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { Router } from '@angular/router';
import { ResultSetComponent } from '../../components/business/jcc/result-set/result-set.component';
import { InputSourceModel } from 'src/app/models/inputSource.model';
import { RunHistoryModel } from '../../models/runHistory.model';
import { LogsModel } from 'src/app/models/logs.model';
import { Broadcaster } from '../../utility/broadcaster';
import { AboutModel } from 'src/app/models/about.model';
import { journalIdType } from 'src/app/services/types';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-jcc',
  templateUrl: './jcc.component.html',
  styleUrls: ['./jcc.component.scss']
})
export class JccComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService, 
    private dataService: DataService, 
    private constantLoaderService: ConstantLoaderService,
    private router: Router,
    private enumLoaderService: EnumLoaderService,
    private broadcaster: Broadcaster,
    private dateConverterPipe: DateConverterPipe,
    private handlerLoaderService: HandlerLoaderService) { }

  @ViewChild(ResultSetComponent, {static: false}) resultSetComponent: ResultSetComponent;

  treeNodes: Array<TreeNodeModel>;
  aboutTreeNodes: Array<TreeNodeModel> = [];
  aboutObject: AboutModel = new AboutModel();
  mainWindow: string = this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG;
  bottomWindow: string = "";
  mainWindowHeading: string = "";
  isLeftLoading: boolean = false;
  journalId: journalIdType;
  inputSourceNode: TreeNodeModel;
  isMainLoading: boolean = false;
  isJcc = (this.router.url.replace("/", "") === this.constantLoaderService.defaultValuesService.HEADER_MENU_ITEM_JCC_CODE);
  runHistoryList: Array<RunHistoryModel> = [];
  selectedRunHistoryDate: string = "";
  logList: Array<LogsModel>;
  stepLogList: Array<LogsModel> = [];
  genericErrorMessage: string = "No logs Available. Execute to generate the logs.";
  isStepLogAvailable:boolean = false;
  templateList: Array<Object> = [];
  
  ngOnInit() {
    this.businessLoaderService.uiJsonBusinessService.setHeaderMenuSelectedItemByCode(this.router.url.replace("/", ""));
    if(this.dataService.journalViewMode === this.constantLoaderService.viewModesService.NEW){
      this.journalId = 0;
      this.treeNodes = [];
      this.dataService.allLogs = [];
      this.dataService.aboutDetails = new AboutModel();
    } else if(this.dataService.journalViewMode === this.constantLoaderService.viewModesService.EDIT){
      this.journalId = this.dataService.journalId;
      if(!this.journalId) {
        this.router.navigate(["home"]);
      } else {
        this.getJournalDetailsById(this.journalId);
      }
    } else if(this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW){
      this.journalId = this.dataService.journalId;
      if(!this.journalId) {
        this.router.navigate(["home"]);
      } else {
        this.getJournalDetailsById(this.journalId);
      }
    } else{
      this.router.navigate(["home"]);
    }
    this.logList = this.dataService.allLogs;
    this.dataService.processStepsDetails = [];
    this.getTreeStructure();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.UPDATE_BUSINESS_RULES){
        this.aboutObject.riskManagement.businessRules.id = this.dataService.aboutDetails.riskManagement.businessRules.id;
        this.aboutObject.riskManagement.businessRules.name = this.dataService.aboutDetails.riskManagement.businessRules.name;
      }
    });
  }

  private resetInputFields() {
    var inputSourceNode = this.treeNodes.filter( node => {
      if(node.code === this.constantLoaderService.defaultValuesService.JSON_INPUT_SOURCE_TAG) {
        return node;
      }
    })[0];
    if(inputSourceNode.fields && inputSourceNode.fields.length > 0) {
      for(var index=0;index<inputSourceNode.fields.length;index++) {
        inputSourceNode.fields[index].value = "";
        if(inputSourceNode.fields[index].fieldCode === "sampleFile") {
          inputSourceNode.fields[index].visibility = false;
        }
      }
    }
  }

  private setupWindow(obj: any){
    if(obj.selectedNode !== null){
      if(obj.selectedNode.code === this.constantLoaderService.defaultValuesService.JSON_JEH_MENU_GO_TO_ADVISOR_TAG){
        var journalShortInfo: JournalInfoPartial = new JournalInfoPartial();
        journalShortInfo.id = this.journalId;
        journalShortInfo.name = this.aboutObject.journalInfo.name;
        journalShortInfo.advisorSegmentSelected = this.constantLoaderService.defaultValuesService.JSON_ADVISOR_VALIDATION_RESULT_TAG;
        journalShortInfo.runDateSelected = this.dateConverterPipe.transform(this.selectedRunHistoryDate, false, true);
        journalShortInfo.isAdhoc = false;
        this.dataService.journalShortInfo = journalShortInfo;
        this.businessLoaderService.uiJsonBusinessService.setHeaderMenuSelectedItemByCode(
          this.constantLoaderService.defaultValuesService.JSON_HEADER_MENU_ADVISOR_TAG);
        this.router.navigate(["advisor"]);
      } else {
        if(obj.selectedNode.openIn === "main" && (!obj.selectedNode.isChildrenOpenInDifferent || obj.selectedNode.code === obj.node.code)){
          this.mainWindow = obj.selectedNode.code;
          this.mainWindowHeading = obj.node.name;
        }
      }
    }
  }

  private getTreeStructure(){
    this.treeNodes = this.businessLoaderService.uiJsonBusinessService.getStaticTreeStructure();
    for(var index=0; index<this.treeNodes.length; index++){
      if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG){
        for(var cnt=0; cnt<this.treeNodes[index].children.length; cnt++){
          this.aboutTreeNodes.push(this.treeNodes[index].children[cnt]);
        }        
      }
    }
    if(this.isJcc){
      for(var index=this.treeNodes.length-1; index>=0; index--){
        if(this.treeNodes[index].isOnlyForJeh){
          this.treeNodes.splice(index, 1);
        }
      }
    }
  }

  private getJournalDetailsById(journalId: journalIdType, isBroadcast: boolean = false){
    this.isLeftLoading = true;
    this.businessLoaderService.journalDetailsBusinessService.getJournalDetailsByIdAsync(journalId)
      .subscribe(res => {
        this.isLeftLoading = false; 
        this.dataService.masterJson = res.body;
        if(res.body){
          this.refreshTreeNodes(res.body);
          if(isBroadcast){
            this.broadcaster.send(this.constantLoaderService.broadcastNamesService.SAVE_JOURNAL);
          }
          if(res.body.runHistory){
            this.runHistoryList = res.body.runHistory;
            if(!this.isJcc){
              if(this.runHistoryList.length > 0){
                if(this.dataService.selectedRunHistoryDate.length > 0){
                  this.selectedRunHistoryDate = this.dataService.selectedRunHistoryDate;
                } else {
                  this.selectedRunHistoryDate = this.runHistoryList[0].runDate;
                  this.dataService.selectedRunHistoryDate = this.selectedRunHistoryDate;
                }
              }
            }
          }
        }
    }, err => {
      this.isLeftLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
    this.retrieveSaveLogs();
  }

  private retrieveSaveLogs() {
    let logAPI: any;
    if(this.dataService.selectedRunHistoryDate !== undefined && this.dataService.selectedRunHistoryDate !== null && this.dataService.selectedRunHistoryDate !== "") {
      logAPI = this.businessLoaderService.logBusinessService.getSavedLogWithDateAsync(this.dataService.journalId.toString(), this.dataService.selectedRunHistoryDate)
    } else {
      logAPI = this.businessLoaderService.logBusinessService.getSavedLogWithoutDateAsync(this.dataService.journalId.toString());
    }
    logAPI.subscribe(res => {
      if(res !== undefined && res !== null && res.body !== null && res.body.logs !== undefined && res.body.logs !== null && res.body.logs.length > 0) {
        this.dataService.allLogs = res.body.logs;
        this.logList = this.dataService.allLogs;
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  private refreshTreeNodes(masterJson: any) {
    for(var index=0; index<this.treeNodes.length; index++){
      if(masterJson.input && masterJson.input.length>0){
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_INPUT_SOURCE_TAG){
          this.treeNodes[index].children = this.businessLoaderService.uiJsonBusinessService.getInputSourceChildrenTreeNodes(masterJson.input);
        }
      }else {
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_INPUT_SOURCE_TAG){
          this.treeNodes[index].children = [];
        }
      }

      if(masterJson.processSteps && masterJson.processSteps.length>0){
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_PROCESS_DATA_TAG){
          this.treeNodes[index].children = this.businessLoaderService.uiJsonBusinessService.getProcessDataChildrenTreeNodes(masterJson.processSteps);
          this.dataService.processData = this.treeNodes[index].children;
        }
      } else{
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_PROCESS_DATA_TAG){
          this.treeNodes[index].children = [];
          this.dataService.processData = this.treeNodes[index].children;
        }
      }

      if(masterJson.outputTemplate && masterJson.outputTemplate.length>0){
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_OUTPUT_TEMPLATE_TAG){
          this.treeNodes[index].children = this.businessLoaderService.uiJsonBusinessService.getOutputTemaplateChildrenTreeNodes(masterJson.outputTemplate);
        }
      } else {
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_OUTPUT_TEMPLATE_TAG){
          this.treeNodes[index].children = [];
        }
      }
    }
    if(masterJson.input && masterJson.input.length>0){
      this.dataService.inputSourceDetail = masterJson.input;
    } else {
      this.dataService.inputSourceDetail = [];
    }
    if(masterJson.processSteps){
      this.dataService.processStepsDetails = masterJson.processSteps;
    }
    if(masterJson.outputMapping){
      this.dataService.outputMapping = masterJson.outputMapping;
    }
    if(masterJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG]){
      this.aboutObject = this.businessLoaderService.journalDetailsBusinessService.loadAboutObject(masterJson[this.constantLoaderService.defaultValuesService.JSON_ABOUT_TAG]);
      if(this.aboutObject.journalInfo.template){
        this.dataService.uploadedTemplateMaster = 
          this.dataService.templateMasterList.find(tmp => tmp.id === this.aboutObject.journalInfo.template.id);
      }
    }
    this.dataService.aboutDetails = JSON.parse(JSON.stringify(this.aboutObject));
  }

  private executeRun(){
    this.isMainLoading = true;
    var requestJson = JSON.parse(JSON.stringify(this.dataService.masterJson));
    requestJson.outputMapping = this.dataService.outputMapping;
    if(this.dataService.aboutDetails){
      requestJson.outputTemplate = ["Result" + this.dataService.aboutDetails.journalInfo.template.name];
    }
    
    this.businessLoaderService.journalActionBusinessService.executeJournalSteps(requestJson)
      .subscribe(res => {
        this.getJournalDetailsById(this.journalId, true);
        this.businessLoaderService.logBusinessService.addLog("Journal " + this.dataService.journalId.toString() +" execute successfully.");
        this.isMainLoading = false;
        this.loadStepLogs();
      }, err => {
        this.businessLoaderService.logBusinessService.addLog("Journal " + this.dataService.journalId.toString() +" execution failed.", false);
        this.isMainLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onLeftMenuNodeClick(obj: any){
    this.setupWindow(obj);
  }

  onLeftMenuActionButtonClick(obj: any){
    this.setupWindow(obj);
  }

  onRunHeaderActionClick(event?: any){
    this.onSaveHeaderActionClick(event, true);
  }

  onColumnSelection(){
    this.resultSetComponent.setStepColumnsSelected();
  }

  onSaveHeaderActionClick(obj?: any, isRunExecute: boolean = false){
    this.isMainLoading = true;
    if(this.journalId === 0){
      this.businessLoaderService.logBusinessService.addLog("Journal creation initiated");
      if(obj && obj !== undefined) {
        if(obj.key !== undefined) {
          this.aboutTreeNodes[obj.key] = obj.value;
        }
      }
      this.businessLoaderService.journalDetailsBusinessService.createJournalAsync(this.aboutObject)
      .subscribe(res => {
        if(res.body){
          if(res.body.journalId){
            this.journalId = res.body.journalId;
            this.dataService.journalId = this.journalId;
            this.dataService.journalViewMode = this.constantLoaderService.viewModesService.EDIT;
            this.dataService.journalStatus = this.enumLoaderService.journalStatuses.IN_PROGRESS;
            this.dataService.inputSourceDetail = [];
            this.dataService.processStepsDetails = [];
            this.dataService.aboutDetails = new AboutModel();
            this.dataService.inputSources = [];
            this.dataService.processData = [];
            this.dataService.outputMapping = {};            
            this.getJournalDetailsById(this.journalId);
            this.handlerLoaderService.notificationHandlerService.showSuccess(this.constantLoaderService.messagesService.CREATE_JOURNAL_SUCCESS);
            this.businessLoaderService.logBusinessService.addLog("Journal " + this.journalId.toString() +" created successfully.");
          } else if(res.body.message){
            this.handlerLoaderService.notificationHandlerService.showWarning(res.body.message);
            this.businessLoaderService.logBusinessService.addLog(res.body.message);
          }
          this.saveLogInFile();
        }
        this.isMainLoading = false;
      },
      err => {
        this.isMainLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      let reqJson = this.businessLoaderService.journalDetailsBusinessService.createAboutJson(this.aboutObject);
      reqJson["input"] = new Array<InputSourceModel>()
      reqJson["input"] = this.dataService.inputSourceDetail;
      reqJson["processSteps"] = new Array<ProcessStepModel>()
      reqJson["processSteps"] = this.dataService.processStepsDetails;
      reqJson["outputMapping"] = this.dataService.outputMapping;
      if(this.dataService.masterJson.outputTemplate){
        reqJson["outputTemplate"] = this.dataService.masterJson.outputTemplate;
      } else{
        reqJson["outputTemplate"] = [];
      }
      reqJson["runHistory"] = this.runHistoryList;
      if(this.dataService.masterJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG]) {
        reqJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG] = this.dataService.masterJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG];
      }
      if(this.dataService.masterJson["processSteps"]){
        this.dataService.masterJson["processSteps"] = this.dataService.processStepsDetails;
      }
      if(this.dataService.masterJson["outputMapping"]){
        this.dataService.masterJson["outputMapping"] = this.dataService.outputMapping;
      }
      this.businessLoaderService.journalDetailsBusinessService.saveJournalAsync(reqJson).subscribe(res => {
        this.resetInputFields();
        if(obj !== undefined && obj.log !== undefined) {
          if(obj.replaceText !== undefined){
            this.businessLoaderService.logBusinessService.addLog(obj.log.success.replace("{text}", obj.replaceText));
          } else {
            this.businessLoaderService.logBusinessService.addLog(obj.log.success);
          }
        }
        this.businessLoaderService.logBusinessService.addLog("Journal " + this.journalId.toString() +" saved successfully.");
        this.isMainLoading = false;
        this.saveLogInFile(isRunExecute);
      },
      err => {
        if(obj !== undefined && obj.log !== undefined) {
          if(obj.replaceText !== undefined){
            this.businessLoaderService.logBusinessService.addLog(obj.log.failure.replace("{text}", obj.replaceText));
          } else {
            this.businessLoaderService.logBusinessService.addLog(obj.log.failure);
          }
        }
        this.isMainLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  saveLogInFile(isRunExecute? : boolean) {       
    var requestJson: any = {};
    this.isMainLoading = true;
    requestJson["jid"] = this.dataService.journalId;
    requestJson["logs"] = this.dataService.logs;
    this.businessLoaderService.logBusinessService.saveLogAsync(requestJson).subscribe(res=>{
      this.dataService.logs = [];
      if(isRunExecute){
        this.executeRun();
      }else{
        this.getJournalDetailsById(this.dataService.journalId, true);
      }
      this.isMainLoading = false;
    },
    err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onRunHistoryDateChanged(obj: any){
    this.dataService.selectedRunHistoryDate = obj.runDate;
    this.selectedRunHistoryDate = obj.runDate;
  }

  onRunHistoryLogClick(){
    this.mainWindowHeading = "Run History Logs";
    this.mainWindow = "runHisLog";
    this.treeNodes.filter(t => t.openIn === "main").filter(t => t.isSelected = false);
    this.treeNodes.filter(t => t.children.filter(c => c.openIn === "main").filter(c => c.isSelected = false));
  }

  onRunHistoryDateChangedByList(obj: any){
    this.dataService.selectedRunHistoryDate = obj.log.runDate;
    this.selectedRunHistoryDate = obj.log.runDate;
  }

  loadStepLogs() {    
    if(this.dataService.selectedRunHistoryDate !== null &&  this.dataService.selectedRunHistoryDate !== "") {
      this.businessLoaderService.logBusinessService.getProcessStepLogByDateAsync(this.dataService.journalId.toString(), this.dataService.selectedRunHistoryDate).subscribe(res =>{
        let stepLogs = [];
        this.stepLogList = [];
        var log: LogsModel;
        if(res.body && res.body.procStepLog != null && res.body.procStepLog.length > 0) {
          this.isStepLogAvailable = true;
          stepLogs = res.body.procStepLog;
          for(var index = 0; index < stepLogs.length; index++) {
            log = new LogsModel(stepLogs[index].beforeMessage, stepLogs[index].isSuccess, true, Date.parse(stepLogs[index].datetime));
            this.stepLogList.push(log);
            log = new LogsModel(stepLogs[index].afterMessage, stepLogs[index].isSuccess, true);
            this.stepLogList.push(log);
          }
        }
      }, err => {
        this.isStepLogAvailable = false;
        if (err.status === 604 && err.error && err.error.errorType === "FileNotFoundError") {
          this.stepLogList = [];
          this.stepLogList.push(new LogsModel(this.genericErrorMessage, false, true));
        }
      })
    }
  }
}
