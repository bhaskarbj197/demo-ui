/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TreeNodeModel } from '../../../../models/treeNode.model';
import { DataService } from 'src/app/services/data.service';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { OutputMappingModel, OutputMappingNativeModel } from '../../../../models/outputMapping.model';
import { ConstantLoaderService} from '../../../../loaders/constant-loader.service';
import { AboutModel } from 'src/app/models/about.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-output-template',
  templateUrl: './output-template.component.html',
  styleUrls: ['./output-template.component.scss']
})
export class OutputTemplateComponent implements OnInit {

  @Input() heading: string = "";
  @Input() aboutDetails: AboutModel = new AboutModel();

  @Output() saveHeaderActionClick: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dataService: DataService,
    private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isOutputMappingLoading: boolean = false;
  outputTableList: Array<TreeNodeModel> = [];
  outputTableDr: string = "";
  outputTableCr: string = "";
  templateColumnListDr: Array<string> = [];
  templateColumnListCr: Array<string> = [];
  mappingDrList: Array<OutputMappingModel> = [];
  mappingCrList: Array<OutputMappingModel> = [];
  outputTableColumnListDr: Array<string> = [];
  outputTableColumnListCr: Array<string> = [];
  isViewOnly: boolean = (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW);
  drRequiredCols: Array<string> = [];
  crRequiredCols: Array<string> = [];

  ngOnInit() {
    if(this.dataService.uploadedTemplateMaster) {
      this.drRequiredCols = this.dataService.uploadedTemplateMaster.drReq;
      this.crRequiredCols = this.dataService.uploadedTemplateMaster.crReq;
    }
    this.loadOutputTableList();
    this.loadTemplateColumns();
  }

  private loadOutputTableList(){
    this.outputTableList = this.dataService.processData;
  }

  private loadTemplateColumns(){
    this.isOutputMappingLoading = true;
    this.businessLoaderService.journalDetailsBusinessService.getTemplateColumnsAsync(this.aboutDetails.journalInfo.template.name)
      .subscribe(res => {
        if(res.body && res.body.length>0){
          if(this.dataService.outputMapping.dr && this.dataService.outputMapping.dr.srcTab && 
            this.dataService.outputMapping.dr.srcTab.value){
            this.outputTableDr = this.dataService.outputMapping.dr.srcTab.value;
          }
          if(this.dataService.outputMapping.cr && this.dataService.outputMapping.cr.srcTab && 
            this.dataService.outputMapping.cr.srcTab.value){
            this.outputTableCr = this.dataService.outputMapping.cr.srcTab.value;
          }

          this.templateColumnListDr = res.body;
          this.templateColumnListCr = res.body;
        }
        this.onOutputTableChanged({item: {code: this.outputTableDr}}, 'dr', true);
        this.onOutputTableChanged({item: {code: this.outputTableCr}}, 'cr', true);
        this.isOutputMappingLoading = false;
    },
    err => {
      this.isOutputMappingLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadMappingDataDr(isInitiallyLoaded: boolean = false){
    if(!this.dataService.outputMapping.dr){
      this.dataService.outputMapping.dr = {};
      return;
    }
    if(!this.dataService.outputMapping.dr.map){
      this.dataService.outputMapping.dr.map = {
        value: ""
      };
      return;
    }
    var valueMapListDr = this.dataService.outputMapping.dr.map.value;
    for(var index=0; index<valueMapListDr.length; index++){
      if(!isInitiallyLoaded){
        for(var cnt=0; cnt<this.mappingDrList.length; cnt++){
          if(valueMapListDr[index].destCol.trim() === this.mappingDrList[cnt].templateColum.trim()){
            if(valueMapListDr[index].srcTyp === "column"){
              this.mappingDrList[cnt].isTable = true;
              this.mappingDrList[cnt].columnName = valueMapListDr[index].srcData;
            } else if(valueMapListDr[index].srcTyp === "value"){
              this.mappingDrList[cnt].isTable = false;
              this.mappingDrList[cnt].value = valueMapListDr[index].srcData;
            }
          }
        }
      } else {
        var outputMapping = new OutputMappingModel();
        if(valueMapListDr[index].srcTyp === "column"){
          outputMapping.isTable = true;
          outputMapping.value = "";
          outputMapping.columnName = valueMapListDr[index].srcData;
        } else if(valueMapListDr[index].srcTyp === "value"){
          outputMapping.isTable = false;
          outputMapping.value = valueMapListDr[index].srcData;
          outputMapping.columnName = "";
        }
        outputMapping.templateColum = valueMapListDr[index].destCol.trim();
        this.mappingDrList.push(outputMapping);
      }
    }
  }

  private loadMappingDataCr(isInitiallyLoaded: boolean = false){
    if(!this.dataService.outputMapping.cr){
      this.dataService.outputMapping.cr = {};
      this.dataService.outputMapping.cr.map = {
        value: ""
      };
      return;
    }
    if(!this.dataService.outputMapping.cr.map){
      this.dataService.outputMapping.cr.map = {
        value: ""
      };
      return;
    }
    var valueMapListCr = this.dataService.outputMapping.cr.map.value;
    for(var index=0; index<valueMapListCr.length; index++){
      if(!isInitiallyLoaded){
        for(var cnt=0; cnt<this.mappingCrList.length; cnt++){
          if(valueMapListCr[index].destCol.trim() === this.mappingCrList[cnt].templateColum.trim()){
            if(valueMapListCr[index].srcTyp === "column"){
              this.mappingCrList[cnt].isTable = true;
              this.mappingCrList[cnt].columnName = valueMapListCr[index].srcData;
            } else if(valueMapListCr[index].srcTyp === "value"){
              this.mappingCrList[cnt].isTable = false;
              this.mappingCrList[cnt].value = valueMapListCr[index].srcData;
            }
          }
        }
      } else{
        var outputMapping = new OutputMappingModel();
        if(valueMapListCr[index].srcTyp === "column"){
          outputMapping.isTable = true;
          outputMapping.value = "";
          outputMapping.columnName = valueMapListCr[index].srcData;
        } else if(valueMapListCr[index].srcTyp === "value"){
          outputMapping.isTable = false;
          outputMapping.value = valueMapListCr[index].srcData;
          outputMapping.columnName = "";
        }
        outputMapping.templateColum = valueMapListCr[index].destCol.trim();
        this.mappingCrList.push(outputMapping);
      }
    }
  }

  private isRequiredColumnsPresent(mappingList: Array<OutputMappingNativeModel>, requiredCols: Array<string>, templateColumns: Array<string>): boolean{
    for(var index=0; index<requiredCols.length; index++){
      if(templateColumns.findIndex(c => c.toLowerCase().trim() === requiredCols[index].toLowerCase().trim()) >= 0){
        if(mappingList.findIndex(m => m.destCol.toLowerCase().trim() === requiredCols[index].toLowerCase().trim()) < 0){
          return false;
        } else {
          if(mappingList.find(m => m.destCol.toLowerCase().trim() === requiredCols[index].toLowerCase().trim()).srcData.length === 0){
            return false;
          }
        }
      }
    }
    return true;
  }

  private setMappingDataDr(): boolean{
    var drMappingList: Array<OutputMappingNativeModel> = [];
    for(var index=0; index<this.mappingDrList.length; index++){
      if((this.mappingDrList[index].isTable && this.mappingDrList[index].columnName.length > 0) ||
        !this.mappingDrList[index].isTable && this.mappingDrList[index].value.trim().length > 0){
        var outputMappingNative = new OutputMappingNativeModel();
        outputMappingNative.srcTyp = this.mappingDrList[index].isTable ? "column" : "value";
        outputMappingNative.errorAction = "NA";
        outputMappingNative.srcData = this.mappingDrList[index].isTable ? this.mappingDrList[index].columnName : 
          this.mappingDrList[index].value.trim();
        outputMappingNative.destCol = this.mappingDrList[index].templateColum;
        drMappingList.push(outputMappingNative);
      }
    }

    if(!this.isRequiredColumnsPresent(drMappingList, this.drRequiredCols, this.templateColumnListDr)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Missing the required column(s) in DR Template Mapping!");
      return false;
    }

    this.dataService.outputMapping.dr = {
      map: {
        value: drMappingList
      },
      destName: {},
      srcTab: {}
    };
    return true;
  }

  private setMappingDataCr(): boolean{
    var crMappingList: Array<OutputMappingNativeModel> = [];
    for(var index=0; index<this.mappingCrList.length; index++){
      if((this.mappingCrList[index].isTable && this.mappingCrList[index].columnName.length > 0) ||
        !this.mappingCrList[index].isTable && this.mappingCrList[index].value.trim().length > 0){
        var outputMappingNative = new OutputMappingNativeModel();
        outputMappingNative.srcTyp = this.mappingCrList[index].isTable ? "column" : "value";
        outputMappingNative.errorAction = "NA";
        outputMappingNative.srcData = this.mappingCrList[index].isTable ? this.mappingCrList[index].columnName : 
          this.mappingCrList[index].value.trim();
        outputMappingNative.destCol = this.mappingCrList[index].templateColum;
        crMappingList.push(outputMappingNative);
      }
    }
    
    if(!this.isRequiredColumnsPresent(crMappingList, this.crRequiredCols, this.templateColumnListCr)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Missing the required column(s) in CR Template Mapping!");
      return false;
    }

    this.dataService.outputMapping.cr = {
      map: {
        value: crMappingList
      },
      destName: {},
      srcTab: {}
    };
    return true;
  }

  private setMappingDataInfo(){
    if(this.dataService.aboutDetails){
      this.dataService.outputMapping.dr.destName = {
        value: this.dataService.aboutDetails.journalInfo.template.name + "_DR",
        typ: "text"
      };
      this.dataService.outputMapping.cr.destName = {
        value: this.dataService.aboutDetails.journalInfo.template.name + "_CR",
        typ: "text"
      }
    }
    this.dataService.outputMapping.dr.srcTab.value = this.outputTableDr;
    this.dataService.outputMapping.cr.srcTab.value = this.outputTableCr;
  }

  private validateDelete(deleteItem: OutputMappingModel, mappingTableType: string) {
    let searchList = [];
    if(mappingTableType === this.constantLoaderService.defaultValuesService.OUTPUT_TEMPLATE_TYPE_DR) {
      searchList = this.drRequiredCols;
    } else if(mappingTableType === this.constantLoaderService.defaultValuesService.OUTPUT_TEMPLATE_TYPE_CR) {
      searchList = this.crRequiredCols;
    }
    if(deleteItem && deleteItem.templateColum && searchList.findIndex(col => col === deleteItem.templateColum) >=0) {
      return false;
    }
    return true;
  }

  onOutputTableChanged(obj: any, type: string, isInitiallyLoaded: boolean = false){
    if(obj && obj.item.code !== ""){
      this.isOutputMappingLoading = true;
      this.businessLoaderService.journalDetailsBusinessService.getProcessedDataTableColumnsAsync(this.dataService.journalId, obj.item.code)
      .subscribe(res => {
        if(res.body && res.body.length>0){
          if(type === 'dr'){
            this.outputTableColumnListDr = [];
          }else{
            this.outputTableColumnListCr = [];
          }
          for(var index=0; index<res.body.length; index++){
            if(type === 'dr'){
              this.outputTableColumnListDr.push(res.body[index]);
            }else{
              this.outputTableColumnListCr.push(res.body[index]);
            }
          }
        }
        if(!isInitiallyLoaded){
          if(type === 'dr'){
            this.loadMappingDataDr();
            this.mappingDrList.filter(c => c.isTable = false);
          }else{
            this.loadMappingDataCr();
            this.mappingCrList.filter(c => c.isTable = false);
          }
        }else{
          if(type === 'dr'){
            this.loadMappingDataDr(true);
          }else{
            this.loadMappingDataCr(true);
          }
        }
        this.isOutputMappingLoading = false;
      },
      err => {
        this.isOutputMappingLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onChkValueDrChanged(output: OutputMappingModel){
    output.isTable = !output.isTable;
  }

  onChkValueCrChanged(output: OutputMappingModel){
    output.isTable = !output.isTable;
  }

  onHeaderActionSaveClick(){
    if(!this.setMappingDataDr()){
      return;
    }
    if(!this.setMappingDataCr()){
      return;
    }
    this.setMappingDataInfo();
    this.saveHeaderActionClick.emit();
  }

  onNewMappingAddForDr(){
    var outputMapping = new OutputMappingModel();
    outputMapping.isTable = true;
    outputMapping.value = "";
    outputMapping.columnName = "";
    outputMapping.templateColum = "";
    this.mappingDrList.push(outputMapping);
  }

  onNewMappingAddForCr(){
    var outputMapping = new OutputMappingModel();
    outputMapping.isTable = true;
    outputMapping.value = "";
    outputMapping.columnName = "";
    outputMapping.templateColum = "";
    this.mappingCrList.push(outputMapping);
  }

  onOutputColumnsDrKeypress(obj: any, index: number){
    if(this.mappingDrList[index]){
      this.mappingDrList[index].isTable = false;
      this.mappingDrList[index].value = obj.key;
    }
  }

  onOutputMappingColumnDrBackLabelClick(index: number){
    if(this.mappingDrList[index]){
      this.mappingDrList[index].isTable = false;
    }
  }

  onOutputMappingValueDrBackLabelClick(index: number){
    if(this.mappingDrList[index]){
      this.mappingDrList[index].isTable = true;
    }
  }

  onOutputColumnsCrKeypress(obj: any, index: number){
    if(this.mappingCrList[index]){
      this.mappingCrList[index].isTable = false;
      this.mappingCrList[index].value = obj.key;
    }
  }

  onOutputMappingColumnCrBackLabelClick(index: number){
    if(this.mappingCrList[index]){
      this.mappingCrList[index].isTable = false;
    }
  }

  onOutputMappingValueCrBackLabelClick(index: number){
    if(this.mappingCrList[index]){
      this.mappingCrList[index].isTable = true;
    }
  }

  onDeleteMappingClick(mappingItem: OutputMappingModel, mappingTableType: string, deleteIndex: number) {
    if(!this.validateDelete(mappingItem, mappingTableType)) {
      this.handlerLoaderService.notificationHandlerService.showWarning("This is required column in " 
        + mappingTableType.toUpperCase() + " Template Mapping!");
      return false;
    }
    if(mappingTableType === this.constantLoaderService.defaultValuesService.OUTPUT_TEMPLATE_TYPE_DR) {
      this.mappingDrList.splice(deleteIndex, 1)
    } else if(mappingTableType === this.constantLoaderService.defaultValuesService.OUTPUT_TEMPLATE_TYPE_CR) {
      this.mappingCrList.splice(deleteIndex, 1)
    }
  }
}
