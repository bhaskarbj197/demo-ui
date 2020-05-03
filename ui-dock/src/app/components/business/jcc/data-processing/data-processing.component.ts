/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { FunctionModel, FunctionTabModel, StepDataModel, StepDataParamModel, SearchPdfTextModel, ExcelFunctionListModel } from '../../../../models/function.model';
import { TreeNodeModel } from '../../../../models/treeNode.model';
import { RuleModel, RuleParamModel } from '../../../../models/rule.model';
import { ColumnInfoModel } from '../../../../models/columnInfo.model';
import { OperatorModel } from '../../../../models/operator.model';
import { ChangeDataProcessingTabsView } from '../../../../animations/dataProcessingtabsAnimations';
import { ProcessStepModel, ProcessOperationModel } from '../../../../models/processStep.model';
import { resultTabModel } from '../../../../models/resultTab.model';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DataService } from '../../../../services/data.service';
import { Broadcaster } from '../../../../utility/broadcaster';
import { StepColumnsSelectedModel } from '../../../../models/stepColumnsSelected.model'; 
import { GeneralUtility } from '../../../../utility/general-utility';
import { HandlerLoaderService } from '../../../../loaders/handler-loader.service';
import { QuickHelpModel } from 'src/app/models/quickHelp.model';

@Component({
  selector: 'app-data-processing',
  templateUrl: './data-processing.component.html',
  styleUrls: ['./data-processing.component.scss'],
  animations: [ChangeDataProcessingTabsView]
})
export class DataProcessingComponent implements OnInit, OnDestroy {

  @Input() treeNodes: Array<TreeNodeModel> = [];
  @Input() stepId: number;
  @Input() detailMode: string = this.constantLoaderService.viewModesService.NEW;

  @Output() runHeaderActionClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() backHeaderActionClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() columnSelect: EventEmitter<object> = new EventEmitter<object>();

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private broadcaster: Broadcaster,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  functionList: Array<FunctionModel> = [];
  inputFiles: Array<TreeNodeModel> = [];
  ruleList: Array<RuleModel> = [];
  activeFunction: FunctionModel;
  activeStepData: StepDataModel = null;
  isNewActiveStepData: boolean = false;
  isNewOutputTable: boolean = true;
  inputTablesColumns: Array<ColumnInfoModel> = [];
  columnsInfo: Array<ColumnInfoModel> = [];
  operatorList: Array<OperatorModel> = [];
  selectedRule: RuleModel;
  processStepDetails: ProcessStepModel;
  inputTableName: string = ""; // in future multiple table can be selected
  isEditablCtrlDisabled: boolean = false;
  isDataProcessLoading: boolean = false;
  queryBuildingValue: string = "";
  tempStepId: number = 0;
  isHeaderInputTableSelectionDisabled: boolean = false;
  isEntryManual: string = "inactive";
  excelFunction:string = "";
  excelFunctionParamList: Array<StepDataParamModel> = [];
  excelFunctionList: Array<FunctionTabModel> = [];
  ruleFilterText: string = "";
  tableFilterText: string = "";
  columnFilterText: string = "";
  operatorFilterText: string = "";
  searchPdfTextList: Array<SearchPdfTextModel> = new Array<SearchPdfTextModel>();
  quickHelpList: Array<QuickHelpModel> = new Array<QuickHelpModel>();

  excelModel: string  = "";
  excelNewCol: string = "";
  excelFuncColList: Array<ExcelFunctionListModel> = new Array<ExcelFunctionListModel>();

  ngOnInit() {
    this.dataService.stepColumnsSelected = [];
    this.isDataProcessLoading = true;
    this.getFunctionList();
    this.getInputTables();
    this.getRules();
    this.getColumnsInfo();
    this.getOperators();
    this.loadQuickHelp()

    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.SAVE_JOURNAL){
        this.setStepIdAndModeAfterJournalSave();
      }
    });
  }

  ngOnDestroy(){
    this.dataService.stepColumnsSelected = [];
    this.columnSelect.emit();
  }

  private loadQuickHelp(){
    var quickHelps = this.businessLoaderService.commonBusinessService.getQuickHelps();
    for(var index=0; index<quickHelps.length; index++){
      this.quickHelpList.push(new QuickHelpModel(quickHelps[index].code, quickHelps[index].html))
    }
  }

  private getViewMopdeSetup(){
    if(this.detailMode === this.constantLoaderService.viewModesService.VIEW){
      this.getProcessStepsDetails();
      this.isEditablCtrlDisabled = true;
    } else if(this.detailMode === this.constantLoaderService.viewModesService.NEW){
      this.processStepDetails = new ProcessStepModel();
      this.processStepDetails.comment = "";
      this.processStepDetails.command = [];
      this.processStepDetails.id = 0;
      this.processStepDetails.inputTab = [];
      this.processStepDetails.operation = new ProcessOperationModel();
      this.processStepDetails.operation.func = "";
      this.processStepDetails.resultTab = new resultTabModel();
      this.processStepDetails.resultTab.tabName = "";
      this.isEditablCtrlDisabled = false;
    } else if(this.detailMode === this.constantLoaderService.viewModesService.EDIT){
      this.getProcessStepsDetails();
      this.isEditablCtrlDisabled = false;
    }
    this.isDataProcessLoading = false;
  }

  private getProcessStepsDetails(){
    if(this.stepId){
      this.processStepDetails = this.dataService.processStepsDetails.find(ps => ps.id === this.stepId);
      if(this.processStepDetails){
        this.inputTableName = (this.processStepDetails.inputTab.length>0) ? this.processStepDetails.inputTab[0] : "";
        this.processStepDetails.resultTab.isNewTab = (this.processStepDetails.resultTab.newTab === "Y");
        this.isNewOutputTable = this.processStepDetails.resultTab.isNewTab;
        this.activeFunction = this.functionList.find(f => f.code === this.processStepDetails.operation.func);
        if(this.activeFunction.tabs.length === this.processStepDetails.command.length){
          for(var index=0; index<this.activeFunction.tabs.length; index++){
            if(this.processStepDetails.command[index]["valueParams"] && 
              this.detailMode === this.constantLoaderService.viewModesService.EDIT){
              for(var cnt=0; cnt<this.processStepDetails.command[index]["valueParams"].length; cnt++){
                var sData = new StepDataModel();
                sData.column = this.processStepDetails.command[index]["valueParams"][cnt].newCol;
                sData.isEditing = (cnt === 0);
                sData.seq = this.processStepDetails.command[index].seq;
                sData.params = this.processStepDetails.command[index]["valueParams"][cnt].params;
                sData.params.filter(p => p.isActive = false);
                this.addAnyStepDataParam(sData);
                this.activeFunction.tabs[index].stepDataList.push(sData);
                if(sData.isEditing){
                  for(var indP=0; indP<sData.params.length; indP++){
                    if(sData.params[indP].typ === "column"){
                      this.addSelectedColumnForResultView(sData.params[indP].originalValue, this.inputTableName);
                    }
                  }
                }
              }
              this.onInputTableChanged({item: this.inputFiles.find(i => i.code === this.inputTableName)}); 
            } else if(this.processStepDetails.command[index].value.length > 0){
              var sData = new StepDataModel();
              sData.column = "";
              sData.isEditing = false;
              sData.seq = this.processStepDetails.command[index].seq;
              sData.params = [];
              var sdParam = new StepDataParamModel();
              sdParam.seq = 1;
              sdParam.isActive = false;
              sdParam.isUserEntry = false;
              sdParam.typ = "unknown";
              sdParam.value = this.processStepDetails.command[index].value;
              sData.params.push(sdParam);
              this.activeFunction.tabs[index].stepDataList.push(sData);
            }
          }
        }
      }
    }
  }

  private getOperators(){
    this.operatorList = this.businessLoaderService.operatorJsonBusinessService.getOperatorListForStepCreation();
  }

  private getColumnsInfo(){
    this.businessLoaderService.journalDetailsBusinessService.getJournalFilesColumnsInfoByIdAsync(this.dataService.journalId)
    .subscribe(res => {
      if(res.body){
        var columInfo = res.body;
        if(columInfo && columInfo["columnWithType"]){
          for(var index=0; index<this.inputFiles.length; index++){
            var cols = [];
            if(columInfo["columnWithTypeProcessed"] && columInfo["columnWithTypeProcessed"][this.inputFiles[index].name + ".csv"]){
              cols = columInfo["columnWithTypeProcessed"][this.inputFiles[index].name + ".csv"];
            }else if(columInfo["columnWithType"][this.inputFiles[index].name + ".csv"]){
              cols = columInfo["columnWithType"][this.inputFiles[index].name + ".csv"];
            }
            if(cols.length > 0){
              for(var cnt=0; cnt<cols.length; cnt++){
                this.inputTablesColumns.push({
                  columnName: cols[cnt]["columnName"],
                  columnCode: cols[cnt]["columnName"],
                  columnType: cols[cnt]["columnType"],
                  tab: this.inputFiles[index].code
                });
              }
            }
          }
        }
        this.getViewMopdeSetup();
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getFunctionList(){
    this.functionList = this.businessLoaderService.functionsUiJsonBusinessService.getfunctionList();
  }

  private getInputTables(){
    if(this.treeNodes){
      var processedTbls: Array<TreeNodeModel> = [];
      var inputTbls: Array<TreeNodeModel> = [];
      for(var index=0; index<this.treeNodes.length; index++){
        if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_PROCESS_DATA_TAG){
          processedTbls = this.treeNodes[index].children;
        } else if(this.treeNodes[index].code === this.constantLoaderService.defaultValuesService.JSON_INPUT_SOURCE_TAG){
          inputTbls = this.treeNodes[index].children;
        }
      }
      for(var index=0; index<processedTbls.length; index++){
        this.inputFiles.push(processedTbls[index]);
      }
      for(var index=0; index<inputTbls.length; index++){
        if(this.inputFiles.findIndex(f => f.code === inputTbls[index].code) < 0){
          this.inputFiles.push(inputTbls[index]);
        }
      }
    }
  }

  private getRules(){
    this.ruleList = null;
    this.ruleList = this.businessLoaderService.ruleJsonBusinessService.getRuleList();
  }

  private cleanData(){
    this.activeStepData = null;
    this.selectedRule = null;
    this.getRules();
  }

  private addSelectedColumnForResultView(colName: string, tabName: string){
    var stepCols = new StepColumnsSelectedModel();
    stepCols.colName = colName;
    stepCols.tabName = tabName;
    stepCols.colorCode = this.generalUtility.getRandomColorCodeInRgb();
    this.dataService.stepColumnsSelected.push(stepCols);

    var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
    var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.isEditing);
    var columnParams = this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.filter(p => p.typ === "column" && p.isUserEntry);
    for(var index=0; index<this.dataService.stepColumnsSelected.length; index++){
      if(columnParams.findIndex(p => p.originalValue === this.dataService.stepColumnsSelected[index].colName) < 0){
        this.dataService.stepColumnsSelected.splice(index, 1);
      }
    }
  }

  private addAnyStepDataParam(newStepData: StepDataModel){
    var anyParam = new StepDataParamModel();
    anyParam.seq = 1000;
    anyParam.typ = "any";
    anyParam.value = "@any";
    anyParam.isUserEntry = true;
    anyParam.isActive = true;
    anyParam.isValueCoded = false;
    newStepData.params.push(anyParam);
  }

  private loadExcelFunctionColList(){
    this.excelFuncColList = new Array<ExcelFunctionListModel>();
    this.excelFuncColList = this.businessLoaderService.ruleJsonBusinessService.getRuleListForExcel();
    if(this.columnsInfo){
      for(var index=0; index<this.columnsInfo.length; index++){
        var item: ExcelFunctionListModel = new ExcelFunctionListModel();
        item.name = this.columnsInfo[index].columnName;
        item.value = this.columnsInfo[index].columnName;
        item.isSelected = false;
        item.typ = "col";
        this.excelFuncColList.push(item);
      }
    }
    this.activeFunction.tabs[0].stepDataList = new Array<StepDataModel>();
    var step: StepDataModel = new StepDataModel();
    step.seq = 1;
    step.params = new Array<StepDataParamModel>();
    var param: StepDataParamModel = new StepDataParamModel();
    param.seq = 1000;
    param.typ = "excel";
    param.isUserEntry = true;
    param.value = "";
    param.originalValue = "";
    param.isActive = false;
    param.isValueCoded = false;
    param.inputTableName = this.inputTableName ? this.inputTableName : "";
    step.params.push(param);
    this.activeFunction.tabs[0].stepDataList.push(step);
  }

  getPraramColor(param: StepDataParamModel): string{
    if(param.typ === "column" && param.isUserEntry){
      if(this.dataService.stepColumnsSelected.findIndex(s => s.colName === param.originalValue) > -1){
        return this.dataService.stepColumnsSelected[this.dataService.stepColumnsSelected.findIndex(s => s.colName === param.originalValue)].colorCode;
      }
    }
    return this.constantLoaderService.defaultValuesService.SELECTED_COLUMN_DEFAULT_COLOR;
  }

  onFunctionChanged(obj: any){
    this.activeFunction = obj.item;
    this.isHeaderInputTableSelectionDisabled = obj.item.isInputTableDisabled;
    if(this.isHeaderInputTableSelectionDisabled){
      this.inputTableName = "";
    }
    if(this.activeFunction.code === this.constantLoaderService.defaultValuesService.JSON_EXCEL_FUNCTION_TAG){
      this.loadExcelFunctionColList();
    }
  }

  onTabHeaderClick(index: number, tab: FunctionTabModel){
    this.activeFunction.tabs[index].displayStatus = (this.activeFunction.tabs[index].displayStatus === "hide") ? "show" : "hide";
    for(var cnt=0; cnt<this.activeFunction.tabs.length; cnt++){
      if(cnt !== index){
        if(this.activeFunction.tabs[cnt].displayStatus === "show"){
          this.activeFunction.tabs[cnt].displayStatus = "hide";
        }
      }
    }
  }

  getStepDataParamStringFromArray(sDataParams: Array<StepDataParamModel>): string {
    let result: string = "";
    if(sDataParams && sDataParams.length>0){
      for(var index=0; index<sDataParams.length; index++){
        if(sDataParams[index].typ !== "any"){
          if(sDataParams[index].typ === "operator"){
            result += sDataParams[index].originalValue;
          } else {
            result += sDataParams[index].value;
          }
        }
      }
    }
    return result;
  }

  isAnyStepDataEditing(sDataList: Array<StepDataModel>): boolean {
    return (sDataList.findIndex(s => s.isEditing) > -1);
  }

  onAddNewColumnForStepDataClick(sDataList: Array<StepDataModel>){
    var newStepData = new StepDataModel();
    newStepData.seq = sDataList.length + 1;
    newStepData.column = "";
    newStepData.params = [];

    this.addAnyStepDataParam(newStepData);
    newStepData.isEditing = true;
    sDataList.push(newStepData);
    this.activeStepData = JSON.parse(JSON.stringify(newStepData));
    this.isNewActiveStepData = true;
  }

  onSaveStepDataClick(stepData: StepDataModel){
    stepData.isEditing = false;
    this.cleanData();
  }

  onCancelStepDataClick(stepData: StepDataModel, sDataList: Array<StepDataModel>){
    if(this.activeStepData && this.activeStepData !== null){
      if(this.isNewActiveStepData){
        sDataList.splice(sDataList.findIndex(s => s.column === stepData.column), 1);
      } else {
        sDataList[sDataList.findIndex(s => s.column === stepData.column)] = JSON.parse(JSON.stringify(this.activeStepData));
        stepData.isEditing = false;
      }
    }
    this.cleanData();
  }

  onEditStepDataClick(stepData: StepDataModel){
    var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
    var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.seq === stepData.seq);
    this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].isEditing = true;
    this.stepId = this.activeFunction.id ? this.activeFunction.id : null;
  }

  onOutputTableBackLabelClick(){
    this.isNewOutputTable = !this.isNewOutputTable;
  }

  onInputTableChanged(obj: any){
    if(obj && obj.item && (obj.item as TreeNodeModel)){
      this.columnsInfo = this.inputTablesColumns.filter(c => c.tab === obj.item.code);
      this.broadcaster.send(this.constantLoaderService.broadcastNamesService.INPUT_TABLE_TO_RESULT_VIEW,  obj.item);
      if(this.activeFunction.code === this.constantLoaderService.defaultValuesService.JSON_EXCEL_FUNCTION_TAG){
        this.loadExcelFunctionColList();
      }
    }
  }

  onRuleValueChanged(obj: any){
    if(obj.items.length>0){
      var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
      var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.isEditing);
      var activeParamIndex = this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.findIndex(p => p.isActive);

      for(var index=0; index<obj.items[0].params.length; index++){
        this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.splice(activeParamIndex+index, 0, 
          JSON.parse(JSON.stringify(obj.items[0].params[index])));
      }

      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex + obj.items[0].params.length].isActive = false;
      for(var index=activeParamIndex+1; index<this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.length; index++){
        if(this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[index].isUserEntry){
          this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[index].isActive = true;
          break;
        }
      }
    }
  }

  onRuleParamClick(param: RuleParamModel){ 
    var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
    var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.isEditing);
    var activeParamIndex = this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.findIndex(p => p.isActive);
    this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].isActive = false;
    this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.findIndex(p => p.seq === param.seq)].isActive = true;
  }

  onColumnListValueChanged(obj: any){
    if(obj.items.length > 0){
      this.setParam("column", (this.inputTableName + "[" + obj.items[0].columnName + "]"), obj.items[0].columnName);
      this.addSelectedColumnForResultView(obj.items[0].columnName, this.inputTableName);
      this.columnSelect.emit();
    }
  }

  onTableListValueChanged(obj: any){
    if(obj.items.length > 0){
      this.setParam("table", obj.items[0].name + "  ", obj.items[0].name);
    }
  }

  private setParam(paramType: string, assignValue: string, originalValue?: string){
    var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
    var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.isEditing);
    var activeParamIndex = this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.findIndex(p => p.isActive);
    if(this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].isUserEntry &&
      (this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].typ === paramType ||
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].typ === "any")){
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].value = assignValue;
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].originalValue = (originalValue) ? originalValue : assignValue;
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].isActive = false;
      this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].inputTableName = 
        (paramType === "column") ? this.inputTableName : "";
      
      for(var index=activeParamIndex+1; index<this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.length; index++){
        if(this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[index].isUserEntry){
          this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[index].isActive = true;
          break;
        }
      }
      if(this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].typ === "any"){
        var anyParam = new StepDataParamModel();
        anyParam.seq = this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.length + 1000;
        anyParam.typ = "any";
        anyParam.value = "@any";
        anyParam.isUserEntry = true;
        anyParam.isActive = true;
        anyParam.isValueCoded = false;
        this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params.push(anyParam);
        this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params[activeParamIndex].typ = paramType;
      }
    }
  }

  onOperatorListValueChanged(obj: any){
    if(obj.items.length > 0){
      var originalVal = "";
      if(obj.items[0].isValueCoded){
        originalVal = this.constantLoaderService.defaultValuesService.OPERATOR_BIND_STRING + obj.items[0].value + 
          this.constantLoaderService.defaultValuesService.OPERATOR_BIND_STRING;
      } else{
        originalVal =  obj.items[0].value;
      }
      this.setParam("operator", obj.items[0].value, originalVal);
    }
  }

  onParamValueBackLabelClick(){
    if(this.queryBuildingValue.length > 0){
      this.setParam("value", this.queryBuildingValue);
      this.queryBuildingValue = "";
    }
  }

  onQueryBuildingDateValueChanged(obj: any){
    this.setParam("value", "'" + this.handlerLoaderService.momentDateHandlerService.getDateInCorrectFormat(obj.date) + "'");
  }

  setStepIdAndModeAfterJournalSave(){
    if(this.tempStepId){
      this.stepId = this.tempStepId;
      this.detailMode === this.constantLoaderService.viewModesService.EDIT;
    }
  }

  onHeaderActionRunClick(){
    this.tempStepId = 0;
    this.dataService.saveInProcess = !this.dataService.saveInProcess ? true : this.dataService.saveInProcess;
    this.dataService.processStepsDetails = this.dataService.processStepsDetails == undefined 
      ? new Array<ProcessStepModel>() : this.dataService.processStepsDetails

    var processStep = JSON.parse(JSON.stringify(this.processStepDetails));
    processStep.operation = {
      func: this.activeFunction.code
    };
    processStep.id = (this.stepId) ? this.stepId : this.dataService.processStepsDetails.length+1;
    processStep.inputTab = this.getUsedInputTables();
    processStep.resultTab = {
      newTab: this.isNewOutputTable ? "Y" : "N",
      tabName: !this.processStepDetails.resultTab.tabName ? this.inputTableName : this.processStepDetails.resultTab.tabName
    }
    for(var index=0; index<this.activeFunction.tabs.length; index++){
      var cmd = {
        name: this.activeFunction.tabs[index].name,
        type: this.activeFunction.tabs[index].typ,
        value: (this.activeFunction.isNoCommand) ? "" : this.getStepDataStringFromArray(this.activeFunction.tabs[index].stepDataList, this.activeFunction.isExcelFunction),
        valueParams: this.getStepDataArray(this.activeFunction.tabs[index].stepDataList),
        seq: index+1
      };
      if(processStep.command.findIndex(c => c.seq === cmd.seq) >= 0){
        processStep.command.splice(processStep.command.findIndex(c => c.seq === cmd.seq), 1, cmd);
      }else{
        processStep.command.push(cmd);
      }
    }
    if(this.stepId){
      var indexStp = this.dataService.processStepsDetails.findIndex(s => s.id === this.stepId);
      this.dataService.processStepsDetails.splice(indexStp, 1, processStep);
    }else{
      this.dataService.processStepsDetails.push(processStep);
      this.tempStepId = processStep.id;
    }
    let log: any = {};
    if(this.detailMode === this.constantLoaderService.viewModesService.NEW) {
      log = this.constantLoaderService.messagesService.LOG_PROCESS_STEP_CREATE;
    } else if(this.detailMode === this.constantLoaderService.viewModesService.EDIT) {
      log = this.constantLoaderService.messagesService.LOG_PROCESS_STEP_EDIT;
    }
    this.runHeaderActionClick.emit({
      "log": log,
      "replaceText": processStep.comment
    });
  }

  onHeaderActionBackClick(){
    this.stepId = 0;
    this.backHeaderActionClick.emit();
  }

  private getStepDataArray(stepData: Array<StepDataModel>){
    var result: Array<any> = [];
    if(stepData && stepData.length>0) {
      for(var index=0; index<stepData.length; index++){
        var sData = {
          newCol: stepData[index].column,
          params: stepData[index].params.filter(s => s.typ !== "any")
        };
        result.push(sData);
      }
    }
    return result;
  }

  private getStepDataStringFromArray(stepData: Array<StepDataModel>, isExcelFunction: boolean = false) {
    let result: string = "";
    if(stepData && stepData.length>0){
      for(var index=0; index<stepData.length; index++){
        if(result.length > 0){
          result = result + ";";
        }
        if(stepData[index].column && stepData[index].column !== ""){
          result += this.processStepDetails.resultTab.tabName + "[" + stepData[index].column + (isExcelFunction? "]" : "]=");
        }
        result += this.getStepDataParamStringFromArray(stepData[index].params);
      }
    }
    return result;
  }

  private getUsedInputTables():Array<string> {
    let tbls: Array<string> = [];
    if(this.activeFunction.tabs && this.activeFunction.tabs.length>0){
      for(var ind=0; ind<this.activeFunction.tabs.length; ind++){
        var stepData = this.activeFunction.tabs[ind].stepDataList;
        if(stepData && stepData.length>0){
          for(var index=0; index<stepData.length; index++){
            for(var cnt=0; cnt<stepData[index].params.length; cnt++){
              if(this.activeFunction.isNoCommand){
                if(stepData[index].params[cnt].isUserEntry && stepData[index].params[cnt].typ !== "any"){
                  tbls.push(stepData[index].params[cnt].originalValue);
                }
              } else{
                if(stepData[index].params[cnt].inputTableName && stepData[index].params[cnt].inputTableName.length > 0){
                  if(tbls.findIndex(t => t === stepData[index].params[cnt].inputTableName) < 0){
                    tbls.push(stepData[index].params[cnt].inputTableName);
                  }
                }
              }
            }
          }
        }
      }
    }
    return tbls;
  }

  onClearStepDataClick(){
    var activeTabIndex = this.activeFunction.tabs.findIndex(t => t.displayStatus === "show");
    var activeStepDataIndex = this.activeFunction.tabs[activeTabIndex].stepDataList.findIndex(sd => sd.isEditing);
    this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex].params = [];
    this.addAnyStepDataParam(this.activeFunction.tabs[activeTabIndex].stepDataList[activeStepDataIndex]);
    this.dataService.stepColumnsSelected = [];
  }

  isQueryCompleted(sData: StepDataModel, tab: FunctionTabModel): boolean {
    var sDataParams: Array<StepDataParamModel> = sData.params;
    if(sDataParams === undefined || sDataParams.length === 0){
      return true;
    }
    if(sDataParams.findIndex(p => p.value === "@column" && p.isUserEntry) > -1){
      return true;
    }
    if(sDataParams.findIndex(p => p.value === "@value" && p.isUserEntry) > -1){
      return true;
    }
    if(tab.isNewColumnMandatory && sData.column.length === 0){
      return true;
    }
    return false;
  }

  onManualOrBuilderEntryClick(){
    this.queryBuildingValue = "";
    this.isEntryManual = (this.isEntryManual === "inactive") ? "active" : "inactive";
  }

  onAddSearchPdfTextClick(){
    this.searchPdfTextList.push(new SearchPdfTextModel());
  }

  onCreateQueryClick(sDataList: Array<StepDataModel> = new Array<StepDataModel>()){
    if(sDataList.length > 0){
      sDataList[0].isEditing = false;
      sDataList[0].seq = 1;
      var query: string = "";
      for(var index=0; index<this.searchPdfTextList.length; index++){
        if(this.searchPdfTextList[index].searchText.trim().length>0){
          if(query.length > 0){
            query += ", ";
          }
          query += "(\'" + this.searchPdfTextList[index].searchText + "\', " + this.searchPdfTextList[index].cellNumber.toString() + ")";
        }
      }
      if(sDataList[0].params.length>0){
        sDataList[0].params.splice(0,1);
      }
      var param: StepDataParamModel = new StepDataParamModel();
      param.seq = 1;
      param.typ = "pdf";
      param.value = "[" + query + "]";
      param.originalValue = "[" + query + "]";
      param.inputTableName = this.inputTableName;
      param.isActive = true;
      param.isUserEntry = false;
      param.isValueCoded = false;
      sDataList[0].params.push(param);
    } 
  }

  onPdfBackLabelClick(index: number){
    if(index !== null){
      this.searchPdfTextList.splice(index, 1);
    }
  }

  onExcelBoxBlur(){
    if(this.activeFunction.isExcelFunction){
      if(this.activeFunction.tabs.length > 0 && this.activeFunction.tabs[0].stepDataList.length > 0 &&
        this.activeFunction.tabs[0].stepDataList[0].params.length > 0)
      this.activeFunction.tabs[0].stepDataList[0].params[0].value = this.excelModel;
      this.activeFunction.tabs[0].stepDataList[0].params[0].originalValue = this.excelModel;
      this.activeFunction.tabs[0].stepDataList[0].params[0].inputTableName = this.inputTableName;
      this.activeFunction.tabs[0].stepDataList[0].column = this.excelNewCol;
    }
  }
}