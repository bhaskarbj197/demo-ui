/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNodeModel } from 'src/app/models/treeNode.model';
import { FieldModel } from 'src/app/models/field.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataService } from 'src/app/services/data.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DefaultValueObject } from 'src/app/models/defaultValueObject.model';
import { InputSourceModel } from 'src/app/models/inputSource.model';
import { ModifyInputFileInfoModel } from 'src/app/models/modifyInputFileInfo.model';
import { Broadcaster } from '../../../../utility/broadcaster';
import { ModifyInputFileContentView } from '../../../../animations/modifyInputFileContentAnimation';
import { interval, Subscription } from 'rxjs';
import { RoleActionConverterPipe } from '../../../../pipes/role-action-converter.pipe';
import { ResultSetDataModel } from 'src/app/models/resultSetTab.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-input-source',
  templateUrl: './input-source.component.html',
  styleUrls: ['./input-source.component.scss'],
  animations: [ModifyInputFileContentView]
})
export class InputSourceComponent implements OnInit {

  @Input() heading: string = "";
  @Input() treeNodes: Array<TreeNodeModel> = [];
  
  @Output() saveHeaderActionClick: EventEmitter<Object> = new EventEmitter<Object>();
  
  constructor(private businessLoaderService: BusinessLoaderService, 
    private dataService: DataService, 
    private constantLoaderService: ConstantLoaderService,
    private broadcaster: Broadcaster,
    private roleActionConverterPipe: RoleActionConverterPipe,
    private enumLoaderService: EnumLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  fileNode: TreeNodeModel;
  inputSourceNode: TreeNodeModel;
  isFileInfoLoading = false;
  originalFileName: string;
  fileToUpload: File;
  fileName: string;
  isFormSubmitted: boolean = false;
  fileList: Array<InputSourceModel> = [];
  fileDeletingName: string = "";
  isViewOnly: boolean = (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW);
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.INPUT_SOURCE_0, 
    this.constantLoaderService.tabListTextsService.INPUT_SOURCE_1];
  activeTab: string = (this.roleActionConverterPipe.transform("jcc", "inputSource", "fileUpload")) ? this.tabList[1] : this.tabList[0];
  requestParamsArrayForExtract: Array<string> = ["sourceName", "sourceType", "sourceLocation", "locationType", "sourceContact"]
  modifyFileContentTypes: Array<string> = this.constantLoaderService.defaultValuesService.INPUT_FILE_MODIFICATION_TYPE;
  modifyInputFileInfo: ModifyInputFileInfoModel = new ModifyInputFileInfoModel();
  selectedLocationType: string = "";
  sourceLocationModel: string = "";
  sapFieldList: Array<{parameter: string, value: string}> = [];
  sapFieldParameterList: Array<Object> = this.constantLoaderService.defaultValuesService.INPUT_SOURCE_SAP_FIELD_PARAM_LIST;
  mailServer: string = "";
  acceptedFileTypes: string = "";
  subscription: Subscription;
  subscriptionInterval: any;
  countOfExceution: number = 0;
  extractPdfEnabled: boolean = false;
  extractFileName: string = "";
  showExtractComparison: boolean = false;
  extractResultData_Tabula: any = {};
  extractResultData_Camelot: any = {}

  categoryTypes: {camelot: boolean, tabula: boolean} = {camelot: true, tabula: false};

  ngOnInit() {
    this.subscriptionInterval = interval(this.constantLoaderService.defaultValuesService.INTERVAL_10_SEC)
    this.isFormSubmitted = false;
    this.inputSourceNode = this.treeNodes.filter( node => {
      if(node.code === this.constantLoaderService.defaultValuesService.JSON_INPUT_SOURCE_TAG) {
        return node;
      }
    })[0];
    this.reset();
    this.loadFileList();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.SAVE_JOURNAL){
        this.loadFileList();
      } 
    });
  }

  private reset() {
    var fields = this.inputSourceNode.fields;
    for(var index =0; index < fields.length; index++) {
      fields[index].value = "";
      if(fields[index].fieldCode === "sampleFile") {
        fields[index].visibility = false;
      }
    }
  }

  private updateMasterTemplateForInputSource() {    
    this.dataService.inputSourceDetail = this.dataService.inputSourceDetail == undefined 
      ? new Array<InputSourceModel>() : this.dataService.inputSourceDetail
    let nodeName:string = "";
    var newNode = new InputSourceModel() ;
    for(var fIndex=0;fIndex < this.inputSourceNode.fields.length; fIndex++) {
      nodeName = this.inputSourceNode.fields[fIndex].fieldCode;      
      newNode[nodeName] = this.createFieldObject(this.inputSourceNode, nodeName);
    }
    newNode.sourceLocation = new DefaultValueObject("text", "", "");
    if(this.selectedLocationType === 'shared') {
      newNode.sourceLocation = new DefaultValueObject("text", this.sourceLocationModel, "");
    }
    this.dataService.inputSourceDetail.push(newNode);
  }

  private createFieldObject(inputSourceTreeNode: TreeNodeModel, fieldname: string) {
    var node = inputSourceTreeNode.fields.filter(field => {
      if(field.fieldCode == fieldname) {
        return field;
      }
    })[0];
    return new DefaultValueObject(node.typ, node.value, node.help);
  }

  saveJournal() {
    this.saveHeaderActionClick.emit();
  }

  onExtractInputClick() {  
    var reqJson = {};
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.dataService.journalId;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JOURNAL_NAME] = this.dataService.masterJson["about"]["journalInfo"]["name"]["value"];
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = "";
    for(var fIndex=0; fIndex < this.requestParamsArrayForExtract.length; fIndex++) {
      if(this.requestParamsArrayForExtract[fIndex] === "sourceLocation") {
        reqJson[this.requestParamsArrayForExtract[fIndex]] = this.sourceLocationModel;
      } else if(this.inputSourceNode.fields.findIndex(field => field.fieldCode === this.requestParamsArrayForExtract[fIndex]) >= 0) {
        reqJson[this.requestParamsArrayForExtract[fIndex]] = this.inputSourceNode.fields.find(field => field.fieldCode === this.requestParamsArrayForExtract[fIndex]).value;
      }
    }
    this.businessLoaderService.journalDetailsBusinessService.extractInputFileAsync(reqJson).subscribe(res => {
      this.updateMasterTemplateForInputSource();
      this.businessLoaderService.logBusinessService.addLog(res.body.message);
      this.saveJournal();
    });    
  }

  loadFileList(){
    this.isFileInfoLoading = true;
    this.fileList = this.dataService.inputSourceDetail;
    for(var index=0; index<this.fileList.length; index++){
      if(!this.fileList[index].isMaster){
        this.fileList[index].isMaster = new DefaultValueObject(null, false, "");
      }
    }
    this.isFileInfoLoading = false;
  }

  onUploadFile(fileInfo : any) {
    if(this.isFileInfoLoading) {
      return;
    }
    this.businessLoaderService.logBusinessService.addLog("File upload processing...");
    this.fileToUpload = fileInfo.file;
    this.originalFileName = this.fileToUpload.name;
    this.isFileInfoLoading = true;
    var extn = this.originalFileName.substr(this.originalFileName.lastIndexOf(".")+1);
    this.fileName = this.inputSourceNode.fields.filter(field => {
      if(field.fieldCode === "sourceName") {
        return field;
      }
    })[0].value as string;
    this.fileName = this.fileName? (this.fileName + "." + extn) : (this.originalFileName);
    let formData = new FormData();
    formData.append('file', fileInfo.file, this.fileName);
    formData.append('jid', this.dataService.journalId.toString());
    if(this.dataService.runDate && this.dataService.runDate !== ""){
      formData.append('date', this.dataService.runDate);
    }
    if(extn === "pdf" || extn === "PDF") {
      this.businessLoaderService.pdfExtractBusinessService.uploadPdfForExtractAsync(formData).subscribe(res=> {
        this.extractFileName = res.body.fileName;
        this.fileName = res.body.fileName;
        this.inputSourceNode.fields.filter(field => {
          if(field.fieldCode === "sourceName") {
            return field;
          }
        })[0].value = this.fileName.substr(0, this.fileName.lastIndexOf("."));
        this.inputSourceNode.fields.filter(field => {
          if(field.fieldCode === "sourceType") {
            return field;
          }
        })[0].value = extn;
        // this.updateMasterTemplateForInputSource();
        this.businessLoaderService.logBusinessService.addLog(this.fileName + " uploaded successfully");
        // this.saveJournal();
        // this.loadFileList();
        this.isFileInfoLoading = false;
        this.extractPdfEnabled = true;
        this.isFileInfoLoading = false;
      }, err=> {
        this.isFileInfoLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      })
    } else{
      this.businessLoaderService.journalDetailsBusinessService
        .postUploadInputFileAsync(formData).subscribe(res => {
          this.inputSourceNode.fields.filter(field => {
            if(field.fieldCode === "sourceName") {
              return field;
            }
          })[0].value = res.body.fileName;
          this.fileName = res.body.fileName;
          this.inputSourceNode.fields.filter(field => {
            if(field.fieldCode === "sourceType") {
              return field;
            }
          })[0].value = extn;
          this.updateMasterTemplateForInputSource();
          this.businessLoaderService.logBusinessService.addLog(this.fileName + "." + extn + " uploaded successfully");
          this.saveJournal();
          this.loadFileList();
          this.isFileInfoLoading = false;
        }, err => {
          this.isFileInfoLoading = false;
          this.handlerLoaderService.errorHandlerService.handleError(err);
        }); 
      }  
  }  

  onExtractPDFClick() {
    var request = {
      jid: this.dataService.journalId,
      fileName: this.extractFileName 
    };
    if(this.dataService.runDate){
      request["date"] = this.dataService.runDate;
    }
    var tmpResultData = new ResultSetDataModel();
    this.isFileInfoLoading = true;
    this.businessLoaderService.pdfExtractBusinessService.extractPdfAsyc(request).subscribe(res => {
      this.isFileInfoLoading = false;
      if(res.body) {
        if(res.body.Type1) {
          this.extractResultData_Tabula.type = this.enumLoaderService.extractResultTypes.TABULA
          tmpResultData = new ResultSetDataModel();
          tmpResultData.fileData = res.body.Type1.fileData;
          tmpResultData.fileHeader = res.body.Type1.fileHeader;
          tmpResultData.fileName = res.body.Type1.fileName;
          this.extractResultData_Tabula.data = tmpResultData;
        }
        if(res.body.Type2) {
          this.extractResultData_Camelot = {type: this.enumLoaderService.extractResultTypes.CAMELOT}
          tmpResultData = new ResultSetDataModel();
          tmpResultData.fileData = res.body.Type2.fileData;
          tmpResultData.fileHeader = res.body.Type2.fileHeader;
          tmpResultData.fileName = res.body.Type2.fileName;
          this.extractResultData_Camelot["data"] = tmpResultData;
        }
        this.showExtractComparison = true;
      }
    }, err => {
      this.isFileInfoLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onPdfExtractorClick(){
    this.categoryTypes.tabula = !this.categoryTypes.tabula;
    this.categoryTypes.camelot = !this.categoryTypes.camelot;
  }

  onSetPdfExtractorClick(){ 
    this.isFileInfoLoading = true;   
    this.updateMasterTemplateForInputSource();
    var currentNode = new InputSourceModel();
    if(this.dataService.inputSourceDetail && this.dataService.inputSourceDetail.length > 0) {
      currentNode = this.dataService.inputSourceDetail[this.dataService.inputSourceDetail.length-1];
    }
    var request = {
      jid: this.dataService.journalId,
      fileName: this.extractFileName 
    };
    if(this.dataService.runDate){
      request["date"] = this.dataService.runDate;
    }
    if(this.categoryTypes.tabula) {
      if(currentNode.sourceName.value === this.extractFileName.substr(0, this.extractFileName.lastIndexOf("."))) {
        currentNode.pdfExtractor = new DefaultValueObject("", this.enumLoaderService.extractResultTypes.TABULA, "");        
        request["extractType"] = this.enumLoaderService.extractResultTypes.TABULA;
        request["extractFileName"] = this.extractResultData_Tabula.data.fileName;
      }
    } else {
      if(currentNode.sourceName.value === this.extractFileName.substr(0, this.extractFileName.lastIndexOf("."))) {
        currentNode.pdfExtractor = new DefaultValueObject("", this.enumLoaderService.extractResultTypes.CAMELOT, "");
        request["extractType"] = this.enumLoaderService.extractResultTypes.CAMELOT;
        request["extractFileName"] = this.extractResultData_Camelot.data.fileName;
      }
    }
    currentNode.sourceType.value = request["extractFileName"].substr(request["extractFileName"].lastIndexOf(".") + 1);
    this.businessLoaderService.pdfExtractBusinessService.setExtractPdfTypeAsyc(request).subscribe(res=> {
      this.isFileInfoLoading = false;
      if(res.body && res.body["isSuccess"]) {
        this.saveJournal();
      }
    }, err => {
      this.isFileInfoLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
    
    this.showExtractComparison = false;
    this.extractPdfEnabled = false;    
  }

  onCancelSetClick() {
    this.showExtractComparison = false;
    this.extractPdfEnabled = false;
  }

  
  onDeleteInputFileClick(fileInfo: InputSourceModel, isConfirm: boolean = null, delIndex: number = -1){
    if(isConfirm === null){
      this.fileDeletingName = fileInfo.sourceName.value;
    } else if(isConfirm){
      if(fileInfo){
        this.isFileInfoLoading = true;
        var request = {
          jid: this.dataService.journalId,
          file: fileInfo.sourceName.value
        };
        if(fileInfo.sourceType.value !== undefined && fileInfo.sourceType.value !== "") {
          request["fileType"] = "csv";
        }
        this.businessLoaderService.journalDetailsBusinessService.deleteInputFileAsync(request)
          .subscribe(res => {
            this.dataService.inputSourceDetail.splice(delIndex, 1);
            this.saveJournal();
            this.isFileInfoLoading = false;
          },
          err => {
            this.isFileInfoLoading = false;
            this.handlerLoaderService.errorHandlerService.handleError(err);
          });
      }
    } else{
      this.fileDeletingName = "";
    }
  }

  showExtract() {
    var valueRequired = ""
    if(this.inputSourceNode.fields !== null && this.inputSourceNode.fields.length > 0) {
      valueRequired = this.inputSourceNode.fields.find(f => f.fieldCode === "sourceLocation").value as string;
      if(valueRequired !== null && valueRequired !== "") {
        return true;
      }
    }
    return false;
  }

  isDeleteBtnDisabled(fileInfo: InputSourceModel): boolean{
    if(this.isViewOnly || this.modifyInputFileInfo.fileName !== null && this.modifyInputFileInfo.fileName === fileInfo.sourceName.value 
      && this.modifyInputFileInfo.displayStatus === "show"){
      return true;
    }
    if(this.dataService.processStepsDetails){
      for(var index=0; index<this.dataService.processStepsDetails.length; index++){
        if(this.dataService.processStepsDetails[index].inputTab.findIndex(i => i === fileInfo.sourceName.value) > -1){
          return true;
        }
      }
    }
    return false;
  }

  onInputSourceChkValueChanged(field: any){
    field.value = !field.value;
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
  }

  onModifyInputFileClick(fileInfo: InputSourceModel){
    this.modifyInputFileInfo.fileName = fileInfo.sourceName.value;
    if(this.inputSourceNode.children !== null && this.inputSourceNode.children.length > 0) {
      this.fileNode = this.inputSourceNode.children.find(child => child.code === this.modifyInputFileInfo.fileName)
    }    
    this.modifyInputFileInfo.displayStatus = "show";
  }
  
  onClearInputFileContentClick(){
    this.isFormSubmitted = true;
    if(!this.isValidateInput()) {
      return;
    }
    this.isFileInfoLoading = true;
    var reqBody = {};
    reqBody[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.dataService.journalId;
    reqBody["fileName"] = this.modifyInputFileInfo.fileName;
    reqBody["delType"] = this.modifyInputFileInfo.type;
    reqBody["start"] = this.modifyInputFileInfo.start;
    reqBody["end"] = this.modifyInputFileInfo.end;
    this.businessLoaderService.journalDetailsBusinessService.clearInputFileContent(reqBody).subscribe(res => {
      this.broadcaster.send(this.constantLoaderService.broadcastNamesService.TREE_NODE_TO_RESULT_VIEW, this.fileNode)
      this.isFileInfoLoading = false;
      this.isFormSubmitted = false;
      this.modifyInputFileInfo = new ModifyInputFileInfoModel();
    }, err => {
      this.isFileInfoLoading = false;
      this.isFormSubmitted = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  isClearBtnDisabled(fileInfo: InputSourceModel): boolean {
    return (this.isViewOnly || 
      (this.modifyInputFileInfo.fileName !== null && this.modifyInputFileInfo.fileName === fileInfo.sourceName.value));
  }

  onCancelClearClick() {    
    this.modifyInputFileInfo = new ModifyInputFileInfoModel();
  }

  private isValidateInput() {
    if((this.modifyInputFileInfo.type === null || this.modifyInputFileInfo.fileName === "") 
      || (this.modifyInputFileInfo.start === 0 || (this.modifyInputFileInfo.type !== "header" && this.modifyInputFileInfo.end === 0))
      || (this.modifyInputFileInfo.type !== "header" && (this.modifyInputFileInfo.start > this.modifyInputFileInfo.end))){
        return false;
    }
    return true;
  }

  onModifyFileContentTypeChanged(obj: any){
    this.modifyInputFileInfo.type = obj.item.value;
  }

  onComboboxValueChanged(obj: any, fieldItem: FieldModel){
    var sourceType: FieldModel = this.inputSourceNode.fields.find(fld => fld.fieldCode === "sourceType");
    var locationType: FieldModel = this.inputSourceNode.fields.find(fld => fld.fieldCode === "locationType");
    if(fieldItem.fieldCode === "sourceType") {
      this.acceptedFileTypes = this.enumLoaderService.allowedFormats[obj.item.val];
      if(locationType && locationType.value && locationType.value !== "") {
        this.inputSourceNode.fields.find(fld => fld.fieldCode === "sampleFile").visibility = true;
      }
    }
    if(fieldItem.fieldCode === "locationType"){
      this.selectedLocationType = obj.item.code;
      if(sourceType && sourceType.value && sourceType.value !== "") {
        this.inputSourceNode.fields.find(fld => fld.fieldCode === "sampleFile").visibility = true;
      }
    }
  }

  onNewParameterValueSetForSapClick(){
    this.sapFieldList.push({parameter: "", value: ""});
  }

  onDeleteParameterValueSetForSapClick(index: number){
    this.sapFieldList.splice(index, 1);
  }

  onExtractFromSapClick(){
    var reqJson = {};
    
    this.isFileInfoLoading = true;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.dataService.journalId;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JOURNAL_NAME] = this.dataService.masterJson["about"]["journalInfo"]["name"]["value"];
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = "";
    for(var fIndex=0; fIndex < this.requestParamsArrayForExtract.length; fIndex++) {
     if(this.inputSourceNode.fields.findIndex(field => field.fieldCode === this.requestParamsArrayForExtract[fIndex]) >= 0) {
        reqJson[this.requestParamsArrayForExtract[fIndex]] = this.inputSourceNode.fields.find(field => field.fieldCode === this.requestParamsArrayForExtract[fIndex]).value;
      }else{
        reqJson[this.requestParamsArrayForExtract[fIndex]] = "";
      }
    }
    for(var fIndex=0; fIndex < this.sapFieldList.length; fIndex++) {
        reqJson[this.sapFieldList[fIndex].parameter] = this.sapFieldList[fIndex].value;
      
    }
    this.businessLoaderService.journalDetailsBusinessService.extractInputFileAsync(reqJson).subscribe(res => {
      this.isFileInfoLoading = false;
      this.updateMasterTemplateForInputSource();
      this.businessLoaderService.logBusinessService.addLog(res.body.message);
      this.saveJournal();
      this.sapFieldList = [];
      this.selectedLocationType = "";
      let sourceName = this.inputSourceNode.fields.find(field => field.fieldCode === "sourceName").value as string;
      this.subscription = this.subscriptionInterval.subscribe(val => this.checkFileExtractionStatus(sourceName));
    }, err=> {
      this.isFileInfoLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private checkFileExtractionStatus(sourceName: string): any {
    this.countOfExceution++;
    this.businessLoaderService.journalDetailsBusinessService.getFileExtractionStatusAsync(this.dataService.journalId, sourceName, "").subscribe(res=> {
        if((res.body && res.body.status && res.body.status === "completed") 
            || this.countOfExceution === this.constantLoaderService.defaultValuesService.MAX_TIMES_TO_RUN) {
          this.subscription.unsubscribe();
        }
    }, err => {
      if(this.countOfExceution === this.constantLoaderService.defaultValuesService.MAX_TIMES_TO_RUN) {
        this.subscription.unsubscribe();
      }
      this.handlerLoaderService.errorHandlerService.handleError(err, false);
    });
  }
}