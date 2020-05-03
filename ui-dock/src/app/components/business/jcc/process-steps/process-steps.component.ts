/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNodeModel } from '../../../../models/treeNode.model';
import { ProcessStepModel } from 'src/app/models/processStep.model';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DataService } from '../../../../services/data.service';
import { Broadcaster } from '../../../../utility/broadcaster';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { JsonPipe } from '@angular/common';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-process-steps',
  templateUrl: './process-steps.component.html',
  styleUrls: ['./process-steps.component.scss']
})
export class ProcessStepsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() treeNodes: Array<TreeNodeModel> = [];

  @Output() runHeaderActionClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() columnSelect: EventEmitter<object> = new EventEmitter<object>();

  constructor(private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private broadcaster: Broadcaster,
    private enumLoaderService: EnumLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  processSteps: Array<ProcessStepModel> = [];
  isStepsShow: boolean = true;
  selectedProcessStepForDetails: number;
  gotoDetailMode: string = this.constantLoaderService.viewModesService.NONE;
  isNewStepButtonShow: boolean = ((this.dataService.journalViewMode === this.constantLoaderService.viewModesService.NEW) ||
    (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.EDIT));
  stepDeleteClickId: number = 0;
  stepCopingId: number = 0;
  viewMode: string = this.enumLoaderService.stepListViewModes.LIST;
  functionList = this.businessLoaderService.functionsUiJsonBusinessService.getfunctionList();

  ngOnInit() {
    this.loadProcessSteps();
  }

  private isColumnMappingExist(selectedProcessStep: ProcessStepModel): boolean {
    let existingOutputMapping = this.dataService.outputMapping;
    let valueParam;
    let columnMappings;
    let mappingExist = false;
    if(existingOutputMapping && existingOutputMapping.cr 
        && existingOutputMapping.cr.srcTab 
        && selectedProcessStep.inputTab.includes(existingOutputMapping.cr.srcTab.value)) {
      columnMappings = existingOutputMapping.cr.map.value.filter(val => val.srcTyp === "column");
    } else if(existingOutputMapping && existingOutputMapping.dr 
        && existingOutputMapping.dr.srcTab 
        && selectedProcessStep.inputTab.includes(existingOutputMapping.dr.srcTab.value)) {
      columnMappings = existingOutputMapping.dr.map.value.filter(val => val.srcTyp === "column");
    }
    if(columnMappings && columnMappings.length > 0) {
      for(var cIndex = 0; cIndex < columnMappings.length  && !mappingExist; cIndex++) {
        for(var sIndex = 0; sIndex < selectedProcessStep.command.length && !mappingExist; sIndex++) {
          valueParam = selectedProcessStep.command[sIndex]["valueParams"];
          for(var vIndex = 0; vIndex < valueParam.length; vIndex++) {
            if(valueParam[vIndex].params.filter(param => param.typ === "column").findIndex(fParam => fParam.originalValue === columnMappings[cIndex].srcData) >= 0) {
              mappingExist = true;
              break;
            }
          }
        }
      }
    } else {
      mappingExist = false;
    }
    return mappingExist
  }

  loadProcessSteps() {
    this.processSteps = this.dataService.processStepsDetails;
  }

  onNewStepClick(){
    this.selectedProcessStepForDetails = 0;
    this.gotoDetailMode = this.constantLoaderService.viewModesService.NEW;
    this.isStepsShow = false;
  }

  onStepViewDetailsClick(stepId: number){
    this.selectedProcessStepForDetails = stepId;
    this.gotoDetailMode = this.constantLoaderService.viewModesService.VIEW;
    this.onStepDataViewClick(stepId);
    this.stepDeleteClickId = 0;
    this.isStepsShow = false;
  }

  onHeaderActionRunClick($event?: any){
    this.runHeaderActionClick.emit($event);
  }

  onBackActionButtonClick(){
    this.isStepsShow = true;
    this.loadProcessSteps();
  }

  onStepDataViewClick(stepId: number){
    this.dataService.stepIdForData = stepId;
    this.broadcaster.send(this.constantLoaderService.broadcastNamesService.STEP_LIST_TO_RESULT_VIEW);
  }

  onColumnSelection(){
    this.columnSelect.emit();
  }

  onEditJournalStepClick(stepId: number){
    this.selectedProcessStepForDetails = stepId;
    this.gotoDetailMode = this.constantLoaderService.viewModesService.EDIT;
    this.onStepDataViewClick(stepId);
    this.stepDeleteClickId = 0;
    this.isStepsShow = false;
  }

  onDeleteJournalStepClick(stepId: number, isConfirm: boolean = undefined){
    let selectedProcessStep: ProcessStepModel;
    let selectedIndex: number;
    if(isConfirm === undefined){
      this.stepDeleteClickId = stepId;
    } else if(isConfirm){
      selectedIndex = this.processSteps.findIndex(p => p.id === stepId);
      selectedProcessStep = this.processSteps[selectedIndex];
      if(this.isColumnMappingExist(selectedProcessStep)) {
        this.handlerLoaderService.notificationHandlerService.showWarning("Output mapping exist for one or more columns for step '" + 
          selectedProcessStep.comment + "'. \nRemove associated mapping and try again.");
        this.stepDeleteClickId = 0;
        return false;
      }
      this.processSteps.splice(selectedIndex, 1);
      this.stepDeleteClickId = 0;
      for(var index=0; index<this.processSteps.length; index++){
        this.processSteps[index].id = index + 1;
      }
      this.dataService.processStepsDetails = this.processSteps;
      this.onHeaderActionRunClick();
    } else{
      this.stepDeleteClickId = 0;
    }
  }

  isDeleteDisabled(step: ProcessStepModel): boolean{
    if(this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW){
      return true;
    }
    for(var index=0; index<this.processSteps.length; index++){
      if(this.processSteps[index].id > step.id){
        if(this.processSteps[index].inputTab.findIndex(t => t === step.resultTab.tabName) >= 0){
          return true;
        }
      }
    }
    return false;
  }

  onStepViewModeChangeClick(){
    if(this.viewMode === this.enumLoaderService.stepListViewModes.LIST){
      this.viewMode = this.enumLoaderService.stepListViewModes.CARD;
    } else if(this.viewMode === this.enumLoaderService.stepListViewModes.CARD){
      this.viewMode = this.enumLoaderService.stepListViewModes.QUERY;
    } else if(this.viewMode === this.enumLoaderService.stepListViewModes.QUERY){
      this.viewMode = this.enumLoaderService.stepListViewModes.LIST;
    }
  }

  getFunctionName(code: string){
    if(code){
      if(this.functionList.findIndex(f => f.code === code) > -1){
        return this.functionList.find(f => f.code === code).name;
      }
    }
    return code;
  }

  onCopyJournalStepClick(stepId: number, isConfirm: boolean = null){
    let selectedProcessStep: ProcessStepModel = new ProcessStepModel();
    let selectedIndex: number;
    if(isConfirm === null){
      this.stepCopingId = stepId;
    } else if(isConfirm && stepId !== 0){
      selectedIndex = this.processSteps.findIndex(p => p.id === stepId);
      selectedProcessStep = JSON.parse(JSON.stringify(this.processSteps[selectedIndex]));
      selectedProcessStep.id = this.processSteps[this.processSteps.length-1].id + 1;
      selectedProcessStep.comment = selectedProcessStep.comment + " - copy";
      this.processSteps.push(selectedProcessStep);
      this.stepCopingId = 0;
      this.dataService.processStepsDetails = this.processSteps;
      this.onHeaderActionRunClick();
    } else if(!isConfirm && stepId !== 0){
      selectedIndex = this.processSteps.findIndex(p => p.id === stepId);
      selectedProcessStep = JSON.parse(JSON.stringify(this.processSteps[selectedIndex]));
      for(var index=selectedIndex+1; index<this.processSteps.length; index++){
        this.processSteps[index].id = this.processSteps[index].id + 1;
      }
      selectedProcessStep.id = stepId + 1;
      selectedProcessStep.comment = selectedProcessStep.comment + " - copy";
      this.processSteps.splice(selectedIndex+1, 0, selectedProcessStep);
      this.stepCopingId = 0;
      this.dataService.processStepsDetails = this.processSteps;
      this.onHeaderActionRunClick();
    } else{
      this.stepCopingId = 0;
    }
  }
}
