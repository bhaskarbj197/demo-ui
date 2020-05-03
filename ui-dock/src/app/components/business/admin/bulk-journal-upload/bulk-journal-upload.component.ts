/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { BulkJournalModel } from 'src/app/models/journalInfo.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-bulk-journal-upload',
  templateUrl: './bulk-journal-upload.component.html',
  styleUrls: ['./bulk-journal-upload.component.scss']
})
export class BulkJournalUploadComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private enumLoaderService: EnumLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  isUploadEnabled: boolean = true;
  showFilters: boolean = false;
  filterValidationList: Array<string> = ["All", "Passed", "Failed"];
  filterValidationText: string = this.filterValidationList[0];
  formData: FormData = new FormData();
  originalFileName: string = "";
  uploadedFile: string = "";
  activeStep: number = 1;
  maxStep: number = 3;
  bulkValidatedDataAll: Array<BulkJournalModel> = [];
  bulkValidatedData: Array<BulkJournalModel> = [];
  bulkProcessedData: Array<BulkJournalModel> = [];
  bulkDataInput: Array<BulkJournalModel> = [];
  noOfPassedRecords: number = 0;
  noOfFailedRecords: number = 0;
  bulkJournalKeys: Array<string> = Object.keys(new BulkJournalModel);
  errMsg: string = "";

  ngOnInit() {
  }

  private reset() {
    this.formData = new FormData();
    this.originalFileName = "";
    this.uploadedFile = "";    
    this.isUploadEnabled = true;
    this.showFilters = false;
    this.bulkDataInput = [];
    this.bulkValidatedDataAll = [];
    this.bulkValidatedData = []; 
    this.bulkProcessedData = [];
    this.noOfPassedRecords = 0;
    this.noOfFailedRecords = 0; 
  }

  private processBulkJournals() {
    var request: any = {};
    this.isLoading = true;
    if(!this.generalUtility.isEmptyOrUndefined(this.uploadedFile)) {
      request.fileName = this.uploadedFile;
    }
    request.dataInput = this.bulkDataInput.filter(data => data.validationStatus === "Passed");
    this.businessLoaderService.bulkUploadBusinessService.processBulkJournalTemplateFile(request).subscribe(res => {
      this.bulkProcessedData = this.businessLoaderService.bulkUploadBusinessService.getBulkJournalList(res.body.data.dataResult);
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private updateStatistic() {
    if(this.bulkValidatedData && this.bulkValidatedData.length) {
      this.noOfPassedRecords = this.bulkValidatedData.filter(data => data.isValid).length;
      this.noOfFailedRecords = this.bulkValidatedData.filter(data => !data.isValid).length;
    } else {
      this.noOfPassedRecords = 0;
      this.noOfFailedRecords = 0;
    }
  } 

  onTemplateDownloadClick(){
    this.businessLoaderService.bulkUploadBusinessService.downloadBulkTemplateFile(this.enumLoaderService.bulkTemplateTypes.JOURNAL).subscribe(res => {
      this.generalUtility.download(res.body, this.enumLoaderService.bulkTemplateFileNames.JOURNAL + "." +
        this.constantLoaderService.defaultValuesService.EXTENSION_TYPE_CSV, 
        this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV);
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  onUploadData(obj: any){
    this.errMsg = "";
    if(obj.file === undefined || obj.file.length === 0 || this.isLoading){
      return;
    }
    this.isLoading = true;
    this.originalFileName = obj.file.name;
    var extn = this.originalFileName.substr(this.originalFileName.lastIndexOf("."));
    this.isLoading = true;
    this.formData = new FormData();
    this.formData.append('file', obj.file, this.originalFileName);
    this.businessLoaderService.bulkUploadBusinessService
      .uploadBulkTemplateFile(this.formData).subscribe(res => {
        this.isLoading = false;
        if(res.body.isSuccess) {
          this.uploadedFile = res.body.fileName;
          this.isUploadEnabled = false;
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
  }

  onDataFilterValueChanged(obj: any){
    if(obj){
      this.filterValidationText = obj.item.value;
      if(this.filterValidationText === "All") {
        this.bulkValidatedData = JSON.parse(JSON.stringify(this.bulkValidatedDataAll));
      } else {
        this.bulkValidatedData = this.bulkValidatedDataAll.filter(data => data.validationStatus === this.filterValidationText)
      }
      this.updateStatistic();
    }
  }

  getStepCss(step: number): string{
    if(step === this.activeStep){
      return "cur-step";
    } else if(step < this.activeStep){
      return "pas-step";
    } else if(step > this.activeStep){
      return "fut-step";
    }
    return "";
  }

  onNextClick(){
    if(this.activeStep < this.maxStep){
      this.activeStep += 1;
    }
    if(this.activeStep === 3) {
      this.processBulkJournals();
    }
  }

  onBackClick(){
    if(this.activeStep > 0){
      if(this.activeStep === 2) {
        this.reset();
      }
      this.activeStep -= 1;      
    }
  }

  onStartOverClick() {
    this.reset();
    this.activeStep = 1;
  }

  onValidateDataClick(){
    var request: any = {};
    this.isLoading = true;
    if(!this.generalUtility.isEmptyOrUndefined(this.uploadedFile)) {
      request.fileName = this.uploadedFile;
      this.businessLoaderService.bulkUploadBusinessService.validateBulkJournalTemplateFile(request).subscribe(res => {
        this.bulkDataInput = res.body.data.dataInput;
        this.bulkValidatedDataAll = this.businessLoaderService.bulkUploadBusinessService.getBulkJournalList(res.body.data.dataResult);
        if(this.bulkValidatedDataAll.length > 0) {
          this.showFilters = true;
          this.bulkValidatedData = JSON.parse(JSON.stringify(this.bulkValidatedDataAll));
          if(res.body.data.status === "Passed") {
            this.noOfPassedRecords = this.bulkValidatedData.length;
            this.noOfFailedRecords = 0;
          } else {
            this.updateStatistic();
          }
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.isUploadEnabled = true;
        this.errMsg = "Error processing the uploaded file. Verify the format and content.";
        this.handlerLoaderService.errorHandlerService.handleError(err, false);
      });
    }
  }
}
