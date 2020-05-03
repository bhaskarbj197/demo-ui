/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { SupportingDocModel } from '../../../../models/supportingDoc.model';
import { DataService } from 'src/app/services/data.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-supporting-docs',
  templateUrl: './supporting-docs.component.html',
  styleUrls: ['./supporting-docs.component.scss']
})
export class SupportingDocsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() isAdvisor: boolean = false;
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService, private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  suppDocList: Array<SupportingDocModel> = new Array<SupportingDocModel>();
  isLoading: boolean = false;
  suppDocDeletingIndex: number = -1;
  newSuppDoc: File;
  newDocName: string = "";
  originalFileName: string;
  isFormSubmitted: boolean = false;
  isDocActive: boolean = true;
  docTypes: Array<string> = ["DTP", "Email", "Other"];
  docType: string = "";
  
  ngOnInit() {
    this.suppDocList = new Array<SupportingDocModel>();
    this.loadSupportingDocuments();
  }
  
  private loadSupportingDocuments(){
    if(this.dataService.journalId){
      this.isLoading = true;      
      this.businessLoaderService.supportingDocumentBusinessService.getSupportingDocumentListByJournalIdAsync(this.dataService.journalId).subscribe(
        response => {
          if(response.body){
            this.suppDocList = this.businessLoaderService.supportingDocumentBusinessService.getSupportingDocumentList(response.body);
          }
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this.handlerLoaderService.errorHandlerService.handleError(err);
        }
      );
    }
  }

  private resetForm() {
    this.isFormSubmitted = false;
    this.isDocActive = true;
    this.newDocName = "";
    this.docType = "";
  }

  private isValidForm() {
    let isValid = true;
    if(!this.newDocName || this.newDocName.trim().length === 0 || this.docType === "") {
      isValid = false;
    }
    return isValid;
  }

  private isNameAlreadyUsed() {
    let alreadyExist = false;
    if(this.suppDocList.findIndex(suppDoc => suppDoc.fileName === this.newDocName) >= 0) {
      alreadyExist = true;
    }
    return alreadyExist;
  }

  onDeleteSuppDocClick(index: number, selectedItem: SupportingDocModel, isConfirm: boolean = undefined){
    var deleteReq: any = {};
    let docIndex =this.suppDocList.findIndex(doc => doc.fileName === selectedItem.fileName && doc.fileType === selectedItem.fileType);
    if(isConfirm === undefined){
      this.suppDocDeletingIndex = index;
    } else if(isConfirm){
      this.isLoading = true;
      this.suppDocDeletingIndex = -1;
      deleteReq["jid"] = this.dataService.journalId;
      deleteReq["fileName"] = selectedItem.fileName;
      deleteReq["fileType"] = selectedItem.fileType;
      this.businessLoaderService.supportingDocumentBusinessService.deleteSupportingDocAsync(deleteReq).subscribe(res => {
        this.suppDocList.splice(docIndex, 1);
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else{
      this.suppDocDeletingIndex = -1;
    }
  }

  getLockIcon(suppDoc: SupportingDocModel): string{
    if(!suppDoc.isActive){
      return "fa-unlock-alt";
    }
    return "fa-lock";
  }

  onSuppDocStatusChangedClick(suppDoc: SupportingDocModel){
    if(suppDoc){
      this.isLoading = true;
      this.businessLoaderService.supportingDocumentBusinessService.updateSupportingDocActivityAsync(suppDoc).subscribe(response => {
          suppDoc.isActive = !suppDoc.isActive;
          this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onUploadSuppDocClick(newFileInfo: any) {
    this.isFormSubmitted = true;
    this.suppDocList = [];
    if(!this.isValidForm()) {
      return;
    }
    if(this.isNameAlreadyUsed()) {
      this.handlerLoaderService.notificationHandlerService.showWarning("File already exist with this name!")
      return;
    }
    if(this.isLoading) {
      return;
    }
    this.businessLoaderService.logBusinessService.addLog("Supporting File upload processing...");
    this.newSuppDoc = newFileInfo.file;
    this.originalFileName = this.newSuppDoc.name;
    this.isLoading = true;
    var extn = this.originalFileName.substr(this.originalFileName.lastIndexOf(".")+1);
    let formData = new FormData();
    formData.append('file', this.newSuppDoc, this.newSuppDoc.name);
    formData.append('jid', this.dataService.journalId.toString());
    formData.append('fileType', extn);
    var docInfo = {"fileName": this.newDocName, "docType": this.docType, "isActive": this.isDocActive}
    formData.append("docInfo", JSON.stringify(docInfo));
    this.businessLoaderService.supportingDocumentBusinessService
      .uploadSupportingDocumentAsync(formData).subscribe(res => {
        this.resetForm();
        this.loadSupportingDocuments();
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
  }

  onFileDownloadClick(suppDoc: SupportingDocModel) {
    var requestBody = {};
    requestBody[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.dataService.journalId;
    requestBody[this.constantLoaderService.defaultValuesService.PARAM_FILE_NAME] = suppDoc.fileName;
    requestBody[this.constantLoaderService.defaultValuesService.PARAM_FILE_TYPE] = suppDoc.fileType;

    this.businessLoaderService.supportingDocumentBusinessService.downloadSupportingDocAsync(requestBody, 
      this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_BLOB).subscribe(res => {
      this.generalUtility.download(res.body, suppDoc.fileName + "." + suppDoc.fileType, this.enumLoaderService.fileContentTypes[suppDoc.fileType]);
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onDocProtectClick() {
    this.isDocActive = !this.isDocActive;
  }
}

