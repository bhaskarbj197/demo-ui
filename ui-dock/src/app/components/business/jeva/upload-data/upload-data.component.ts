/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataService } from 'src/app/services/data.service';
import { UploadDataModel } from 'src/app/models/uploadData.model';
import { map } from 'rxjs/operators';
import { HandlerLoaderService } from '../../../../loaders/handler-loader.service';
import { journalIdType } from 'src/app/services/types';


@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService, 
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) { }

  runDate: object = {};
  uploadFileList: Array<UploadDataModel> = [];
  formData: FormData = new FormData();
  isFileInfoLoading: boolean = false;
  originalFileName: string;
  fileToUpload: File;
  journalId: journalIdType = 0;
  isPrimaryControlsDisable: boolean = false;
  errMsg: string = "";

  ngOnInit() {
  }

  loadJournalInputSourcesInfo() {
    this.errMsg = "";
    this.isFileInfoLoading = true;
    this.uploadFileList = [];
    this.businessLoaderService.journalDetailsBusinessService
      .getJournalInputSourcesInfoAsync(this.journalId).pipe(
        map((res:any)=> {
          if(res.body.msg) {
            return new UploadDataModel().deserialize(res.body);
          }
          return res.body.map((file: UploadDataModel) => new UploadDataModel().deserialize(file))
        })
      ).subscribe(fileList => {
        if(fileList instanceof UploadDataModel && fileList.errorMessage) {
          this.errMsg = fileList.errorMessage;
        } else { 
          this.uploadFileList = fileList;
          this.isPrimaryControlsDisable = true;
        }        
        this.isFileInfoLoading = false;
      }, err => {
        this.isFileInfoLoading = false;
        this.isPrimaryControlsDisable = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
  }

  onUploadFile(obj: any, fileinfo: any, fileIndex: any) {
    if(obj.file === undefined || obj.file.length === 0 || this.isFileInfoLoading){
      return;
    }
    this.isFileInfoLoading = true;
    this.fileToUpload = obj.file;
    this.originalFileName = this.fileToUpload.name;
    var extn = this.originalFileName.substr(this.originalFileName.lastIndexOf("."));
    this.isFileInfoLoading = true;
    this.dataService.runDate = this.handlerLoaderService.momentDateHandlerService.getDateInCorrectFormat(this.runDate);
    this.formData = new FormData();
    this.formData.append('file', obj.file, fileinfo.file + extn);
    this.formData.append("date", this.dataService.runDate);
    this.formData.append("jid", this.journalId.toString());
    this.businessLoaderService.journalDetailsBusinessService
      .postUploadInputFileAsync(this.formData).subscribe(res => {
        this.isFileInfoLoading = false;
        this.uploadFileList[fileIndex].lastUpdated = res.body.uploadTime;
        this.uploadFileList[fileIndex].size = res.body.fileSize;
        this.uploadFileList[fileIndex].isUploaded = true;
      }, err => {
        this.isFileInfoLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });   
  }

  onRunClick(){
    this.isFileInfoLoading = true;
    this.businessLoaderService.journalActionBusinessService.getJournalRunByIdAsync(this.journalId, 
      this.handlerLoaderService.momentDateHandlerService.getDateInCorrectFormat(this.runDate))
      .subscribe(res => {
        this.handlerLoaderService.notificationHandlerService.showSuccess("Journal " + this.journalId.toString() +" execute successfully for " + 
          this.handlerLoaderService.momentDateHandlerService.getDateInCorrectFormat(this.runDate));
        this.isFileInfoLoading = false;
        this.onCancelRunClick();
      },
      err => {
        this.businessLoaderService.logBusinessService.addLog("Journal " + this.journalId.toString() +" execution failed.", false);
        this.handlerLoaderService.errorHandlerService.handleError(err);
        this.isFileInfoLoading = false;
      });
  }

  isRunDisabled(): boolean {
    return (this.uploadFileList 
        && this.uploadFileList.length > 0 
        && this.uploadFileList.findIndex(f => !f.isUploaded) > -1);
  }

  onGetJournalClick(){
    this.errMsg = "";
    if(this.journalId && this.runDate["day"]){
      this.loadJournalInputSourcesInfo();
    } else {
      this.errMsg = "Journal id and run date both are needed!";
    }
  }

  onCancelRunClick(){
    this.journalId = 0;
    this.runDate = {};
    this.uploadFileList = [];
    this.isPrimaryControlsDisable = false;
  }
}
