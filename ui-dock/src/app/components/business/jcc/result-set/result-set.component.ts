/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Broadcaster } from '../../../../utility/broadcaster';
import { TreeNodeModel } from '../../../../models/treeNode.model';
import { ResultSetTabModel, ResultSetDataModel } from '../../../../models/resultSetTab.model';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { DataService } from '../../../../services/data.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { StepColumnsSelectedModel } from '../../../../models/stepColumnsSelected.model';
import { GeneralUtility } from '../../../../utility/general-utility';
import { Subscription } from 'rxjs';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-result-set',
  templateUrl: './result-set.component.html',
  styleUrls: ['./result-set.component.scss']
})
export class ResultSetComponent implements OnInit, OnDestroy {

  resultTabs: Array<ResultSetTabModel> = [];
  resultData: ResultSetDataModel;
  isResultSetLoading: boolean = false;
  stepColumnsSelected: Array<StepColumnsSelectedModel> = [];
  folderTypes: Array<string> = [];
  resultSetDataErrMsg: string = "";
  subscription: Subscription;

  constructor(private broadcaster: Broadcaster, 
    private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  ngOnInit() {
    for(var type in this.constantLoaderService.folderTypesService){
      this.folderTypes.push(this.constantLoaderService.folderTypesService[type]);
    }
    this.subscription = this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.STEP_LIST_TO_RESULT_VIEW){
        this.getDataByStepId(this.dataService.stepIdForData);
      } else if(obj.name === this.constantLoaderService.broadcastNamesService.TREE_NODE_TO_RESULT_VIEW){
        this.setupResultSetTabs(obj.data);
      } else if(obj.name === this.constantLoaderService.broadcastNamesService.INPUT_TABLE_TO_RESULT_VIEW){
        this.setupResultSetTabs(obj.data);
      }
    });
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }    
  }

  private setupResultSetTabs(node: TreeNodeModel){
    if(node){
      if(this.resultTabs.findIndex(r => r.id === node.id && r.code === node.code) >= 0){
        this.resultTabs.find(r => r.isActive = false);
        this.resultTabs.find(r => r.id === node.id && r.code === node.code).isActive = true;
      }else{
        var tab = new ResultSetTabModel();
        tab.id = node.id;
        tab.code = node.code;
        tab.name = node.name;
        tab.folderType = node.folderType;
        tab.isActive = true;

        this.resultTabs.find(r => r.isActive = false);
        this.resultTabs.splice(0, 0, tab);
      }
      this.getDataByTableName();
    }
  }

  private getDataByTableName(){
    this.isResultSetLoading = true;
    var tblName = this.resultTabs.find(r => r.isActive).name;
    this.businessLoaderService.journalDetailsBusinessService.getResultDataByTblNameAsync(tblName, 
      this.dataService.journalId, this.resultTabs.find(r => r.isActive).folderType, this.dataService.selectedRunHistoryDate)
      .subscribe(res => {
        if(res.body){
          this.resultData = new ResultSetDataModel();
          this.resultData.fileData = res.body.fileData;
          this.resultData.fileHeader = res.body.fileHeader;
          this.resultData.fileName = res.body.fileName;
          this.setStepColumnsSelected();
        }
        this.isResultSetLoading = false;
        this.resultSetDataErrMsg = "";
      },
      err => {
        this.resultData = new ResultSetDataModel();
        if(err.status === 604){
          this.resultSetDataErrMsg = tblName +" is not found.";
        }
        this.isResultSetLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err, false);
      });
  }

  private getDataByStepId(stepId: number){
    this.isResultSetLoading = true;
    if(this.resultTabs.findIndex(r => r.id === stepId && r.folderType === this.constantLoaderService.folderTypesService.STEP) >= 0){
      this.resultTabs.find(r => r.isActive = false);
      this.resultTabs.find(r => r.id === stepId && r.folderType === this.constantLoaderService.folderTypesService.STEP).isActive = true;
    }else{
      var tab = new ResultSetTabModel();
      tab.id = stepId;
      tab.code = "step" + stepId.toString();
      tab.name = "Step " + stepId.toString();
      tab.folderType = this.constantLoaderService.folderTypesService.STEP;
      tab.isActive = true;

      this.resultTabs.find(r => r.isActive = false);
      this.resultTabs.splice(0, 0, tab);
    }
    this.businessLoaderService.journalDetailsBusinessService.getStepDataAsync(this.dataService.journalId, stepId)
      .subscribe(res => {
        if(res.body){
          this.resultData = new ResultSetDataModel();
          this.resultData.fileData = res.body.fileData;
          this.resultData.fileHeader = res.body.fileHeader;
          this.resultData.fileName = res.body.fileName;
          this.setStepColumnsSelected();
          this.resultSetDataErrMsg = "";
        }
        this.isResultSetLoading = false;
      },
      err => {
        this.resultData = new ResultSetDataModel();
        if(err.status === 604){
          this.resultSetDataErrMsg = "Step-" + stepId.toString() + " data is not found.";
        }
        this.isResultSetLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err, false);
      })
  }

  public setStepColumnsSelected(){
    if(this.dataService.stepColumnsSelected){
      this.stepColumnsSelected = this.dataService.stepColumnsSelected.filter(c => c.tabName === (this.resultTabs.find(r => r.isActive).name));
    }
  }

  getColor(head: string, index: number): string{
    if(this.dataService.stepColumnsSelected !== undefined && this.dataService.stepColumnsSelected.findIndex(s => s.colName === head) > -1){
      this.dataService.stepColumnsSelected[this.dataService.stepColumnsSelected.findIndex(s => s.colName === head)].headerIndex = index;
      return this.dataService.stepColumnsSelected.find(s => s.colName === head).colorCode;
    }
    return this.constantLoaderService.defaultValuesService.SELECTED_COLUMN_DEFAULT_COLOR;
  }

  getRowColor(index: number): string{
    if(this.dataService.stepColumnsSelected){
      if(this.dataService.stepColumnsSelected.findIndex(s => s.tabName === (this.resultTabs.find(r => r.isActive).name)) < 0){
        return this.constantLoaderService.defaultValuesService.SELECTED_COLUMN_DEFAULT_COLOR;
      }
      if(this.stepColumnsSelected.findIndex(s => s.headerIndex === index) > -1){
        return this.stepColumnsSelected[this.stepColumnsSelected.findIndex(s => s.headerIndex === index)].colorCode;
      }
      return this.constantLoaderService.defaultValuesService.SELECTED_COLUMN_DEFAULT_COLOR;
    }
    return "";
  }

  onResultTabCloseClick(tab: ResultSetTabModel){
    if(this.resultTabs.findIndex(r => r.id === tab.id) >= 0){
      this.resultTabs.splice(this.resultTabs.findIndex(r => r.id === tab.id), 1);
      if(this.resultTabs.length > 0 && tab.isActive){
        this.resultTabs[0].isActive = true;
        this.getDataByTableName();
      }
    }
    if(this.resultTabs.length === 0){
      this.resultData = new ResultSetDataModel();
    }
  }

  onTabClick(tab: ResultSetTabModel){
    this.resultTabs.find(r => r.isActive = false);
    this.resultTabs.find(r => r.id === tab.id && r.code === tab.code).isActive = true;
    if(tab.folderType === this.constantLoaderService.folderTypesService.STEP){
      this.getDataByStepId(tab.id);
    }else{
      this.getDataByTableName();
    }
  }

  onDownloadFile(){
    var requestJson = {};
    var activeResultset: ResultSetTabModel = this.resultTabs.find(r => r.isActive);
    requestJson["jid"] = this.dataService.journalId;
    requestJson["file"] = activeResultset.name;
    requestJson["folder"] = activeResultset.folderType;
    requestJson["date"] = this.dataService.selectedRunHistoryDate !== "" ? this.dataService.selectedRunHistoryDate : "";

    this.businessLoaderService.journalDetailsBusinessService.downloadFileAsync(requestJson).subscribe(data => 
      this.generalUtility.download(data.body, this.getFileName(activeResultset), 
      this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV));
  }

  private getFileName(fileInfo) {
    let name: string = "";
    name = fileInfo.name  + "(" + fileInfo.folderType.substr(0,1) + ")"+ ".csv";
    return name;
  }
}
