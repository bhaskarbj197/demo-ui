/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { TreeNodeModel } from '../../../../models/treeNode.model';
import { DataService } from 'src/app/services/data.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ColumnInfoModel } from 'src/app/models/columnInfo.model';
import { AdvisorConfigModel } from 'src/app/models/advisorConfig.model';
import { RoleActionConverterPipe } from '../../../../pipes/role-action-converter.pipe';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-advisor-config',
  templateUrl: './advisor-config.component.html',
  styleUrls: ['./advisor-config.component.scss']
})
export class AdvisorConfigComponent implements OnInit {

  @Input() heading: string = "";
  @Input() nodes: Array<TreeNodeModel> = [];

  @Output() saveClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataservice: DataService,
    private businessLoaderService: BusinessLoaderService,
    private roleActionConverterPipe: RoleActionConverterPipe,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }
  
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVISOR_CONFIG_0, 
    this.constantLoaderService.tabListTextsService.ADVISOR_CONFIG_1];
  activeTab: string = (this.roleActionConverterPipe.transform("jcc", "advisorConfig", "add")) ? this.tabList[1] : this.tabList[0];
  inputFileList: Array<TreeNodeModel> = [];
  inputTableColumns: Array<ColumnInfoModel> = [];
  modelList: Array<string> = ["Decision Tree", "Clustering Method"];
  newAdvisorConfig: AdvisorConfigModel;
  existingAdvisorConfig: AdvisorConfigModel;
  advisorConfigList: Array<AdvisorConfigModel> = [];
  masterJson: any;
  analyticsData: any;
  tobeDeleted: string = "";
  mode: string;
  isViewOnly: boolean = (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW);

  ngOnInit() {
    this.mode = this.constantLoaderService.viewModesService.NEW;
    this.newAdvisorConfig =  new AdvisorConfigModel();
    this.masterJson = this.dataservice.masterJson;
    if(this.masterJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG]) {
      this.advisorConfigList = this.masterJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG];
    }
    this.loadInputList();
  }

  private reset() {
    this.newAdvisorConfig = new AdvisorConfigModel();
    this.tobeDeleted = "";
    this.loadInputList();
  }

  private isAlreadyAdded(selectedItem) { 
    return (this.advisorConfigList.findIndex(file => file.fileName === selectedItem.name) >= 0); 
  }
  
  private loadInputList() {
    this.inputFileList = this.dataservice.inputSources.filter(input=> !this.isAlreadyAdded(input));
  }

  onDeleteConfigClick(config: AdvisorConfigModel, isConfirm: boolean, delIndex: number = -1){
    if(isConfirm === null) {
      this.tobeDeleted = config.fileName;
    }else if(isConfirm){
      if(config) {
        this.advisorConfigList.splice(delIndex, 1);
        this.saveJournal();
      }
    } else {
      this.tobeDeleted = "";
    }
  }

  openUrlClick(url: string) {
    if(url && url !== "") {
      window.open(url, "_blank");
    }
  }

  isDisabledColumnListInput(): boolean {
    return (this.isViewOnly || !this.newAdvisorConfig.fileName);
  }

  isDisabledModelListInput(): boolean {
    return (this.isViewOnly || !this.newAdvisorConfig.columnName);
  }

  isDisabledFileInputListInput(): boolean {    
    return (this.isViewOnly || !this.inputFileList || this.inputFileList.length == 0);
  }

  isSaveDisabled() {
    return !this.newAdvisorConfig || !this.newAdvisorConfig.fileName || 
      !this.newAdvisorConfig.columnName || !this.newAdvisorConfig.model;
  }

  onEditConfigClick(configToEdit: AdvisorConfigModel, editIndex: number) {
    this.mode = this.constantLoaderService.viewModesService.EDIT;
    this.existingAdvisorConfig = configToEdit;
    this.newAdvisorConfig = this.existingAdvisorConfig;
    this.advisorConfigList.splice(editIndex, 1);
    this.activeTab = this.tabList[0];
  }

  onSaveClick() {
    this.advisorConfigList.push(this.newAdvisorConfig);
    this.saveJournal();
  }

  saveJournal() {
    this.dataservice.masterJson[this.constantLoaderService.defaultValuesService.JSON_ANALYTICS_TAG] = this.advisorConfigList;
    this.reset();
    this.saveClick.emit();
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
  }

  loadColumnList(event: any) {
    let selectedInput: TreeNodeModel;
    let columnInfo;
    this.inputTableColumns = [];
    if(event !==undefined && event !== null && event.item !== undefined && event.item !== null) {
      selectedInput = event.item;
    }
    this.businessLoaderService.journalDetailsBusinessService.getJournalFilesColumnsInfoByIdAsync(this.dataservice.journalId)
      .subscribe(res => {
        if(res.body){
          let colDetail = res.body;
          var cols = [];
          if(colDetail && colDetail["columnWithType"]){              
            cols = colDetail["columnWithType"][selectedInput.name + ".csv"];
          }
          for(var index = 0; index < cols.length; index++) {
            columnInfo = new ColumnInfoModel(cols[index].columnName, cols[index].columnName.toLowerCase(), cols[index].columnType);
            this.inputTableColumns.push(columnInfo);
          }
        }
      },
      err => {
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
  }
}
