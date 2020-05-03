/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { OutputFormatModel } from 'src/app/models/outputFormat.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-output-format',
  templateUrl: './output-format.component.html',
  styleUrls: ['./output-format.component.scss']
})
export class OutputFormatComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  templateId: number = 0;
  outputFormatters: Array<OutputFormatModel> = new Array<OutputFormatModel>();
  templateNames: Array<string> = [];
  formatTypes: Array<object> = this.constantLoaderService.defaultValuesService.OUTPUT_FORMAT_TYPES;
  deletingId: number = 0;

  ngOnInit() {
    this.loadTemplateList();
  }

  private loadTemplateList(){
    this.isLoading = true;
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body && res.body.length > 0) {
        var templates = res.body.filter(t => t.isActive);
        for(var index=0; index<templates.length; index++){
          this.templateList.push(new TemplateMasterPartialModel(templates[index].templateId, templates[index].templateName));
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadTemplateColumns(){
    this.isLoading = true;
    this.templateNames = [];
    this.businessLoaderService.journalDetailsBusinessService.getTemplateColumnsAsync(this.templateList.find(t => t.id === this.templateId).name)
      .subscribe(res => {
        if(res.body && res.body.length>0){
          this.templateNames = res.body;
          this.loadOutputFormatList();
        }
        this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadOutputFormatList(){
    this.isLoading = true;
    this.outputFormatters = [];
    this.businessLoaderService.outputFormatBusinessService.getOutputFormatListAsync(this.templateId)
      .subscribe(res => {
        if(res.body){
          this.outputFormatters = this.businessLoaderService.outputFormatBusinessService.getOutputFormatList(res.body);
        }
        this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private validRecords(): boolean{
    var result: boolean = true;
    this.outputFormatters.find(o => o.isError = false);
    for(var index=0; index<this.outputFormatters.length; index++){
      if(this.outputFormatters[index].colName === null || this.outputFormatters[index].colName === undefined ||
        this.outputFormatters[index].colName === ""){
        this.outputFormatters[index].isError = true;
        result = false;
      } else if(this.outputFormatters.filter(o => o.colName === this.outputFormatters[index].colName).length > 1){
        this.outputFormatters[index].isError = true;
        result = false;
      } else if(this.outputFormatters[index].formatType === null || this.outputFormatters[index].formatType === undefined ||
        this.outputFormatters[index].formatType === ""){
        this.outputFormatters[index].isError = true;
        result = false;
      } else if(this.formatTypes.findIndex(f => f["key"]===this.outputFormatters[index].formatType) >= 0 &&
        this.formatTypes.find(f => f["key"]===this.outputFormatters[index].formatType)["chr"]){
        if(this.outputFormatters[index].char.trim().length === 0){
          this.outputFormatters[index].isError = true;
          result = false;
        }
      }
    }
    return result;
  }

  onTemplateChanged(obj: any){
    if(obj){
      this.templateId = obj.item.id;
      this.loadTemplateColumns();
    }
  }

  onColumnChanged(obj: any, frmt: OutputFormatModel){
    if(obj){
      frmt.colName = obj.item.key;
    }
  }

  onSetPrefixClick(frmt: OutputFormatModel){
    frmt.isPrefix = !frmt.isPrefix;
  }

  onAddNewFormat(){
    var newFormat: OutputFormatModel = new OutputFormatModel();
    if(this.outputFormatters.length === 0){
      newFormat.id = 1;
    } else {
      newFormat.id = this.outputFormatters.reduce((prev, cur) => (prev.id > cur.id) ? prev : cur).id+1;
    }
    this.outputFormatters.push(newFormat);
  }

  onDeleteFormatClick(frmt: OutputFormatModel, isConfirm: boolean){
    if(isConfirm === null){
      this.deletingId = frmt.id;
    } else if(isConfirm){
      this.outputFormatters.splice(this.outputFormatters.findIndex(f => f.id===this.deletingId), 1);
      this.deletingId = 0;
    } else {
      this.deletingId = 0;
    }
  }

  onFormatTypeChanged(obj: any, frmt: OutputFormatModel){
    if(obj){
      frmt.formatType = obj.item.key;
      frmt.char = "";
      frmt.decimalPlace = 0;
      frmt.isPrefix = true;
      frmt.minLength = 0;

      if(this.formatTypes.findIndex(f => f["key"] === frmt.formatType) >= 0){
        frmt.isPrefixShow = this.formatTypes.find(f => f["key"] === frmt.formatType)["prfx"] as boolean;
        frmt.isCharShow = this.formatTypes.find(f => f["key"] === frmt.formatType)["chr"] as boolean;
        frmt.isMinLenShow = this.formatTypes.find(f => f["key"] === frmt.formatType)["mLen"] as boolean;
        frmt.isDecPlcShow = this.formatTypes.find(f => f["key"] === frmt.formatType)["dPlc"] as boolean;
      }
    }
  }

  onSubmitAllFormat(){
    if(!this.validRecords()){
      return;
    }
    this.isLoading = true;
    this.businessLoaderService.outputFormatBusinessService.saveOutputFormatListAsync(this.outputFormatters,
      this.templateList.find(t => t.id === this.templateId)).subscribe(res => {
      if(res.body && res.body.isSuccess) {
        this.handlerLoaderService.notificationHandlerService.showSuccess("Output formatting saved successfully.");
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onResetAllFormat(){
    this.loadOutputFormatList();
  }
}
