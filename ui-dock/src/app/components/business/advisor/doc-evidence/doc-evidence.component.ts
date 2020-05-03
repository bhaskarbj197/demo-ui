/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { DataService } from '../../../../services/data.service';
import { DocEvidenceModel } from '../../../../models/docEvidence.model';
import { FolderTypes } from 'src/app/enums/folderTypes';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-doc-evidence',
  templateUrl: './doc-evidence.component.html',
  styleUrls: ['./doc-evidence.component.scss']
})
export class DocEvidenceComponent implements OnInit, OnChanges {

  @Input() heading: string = "";
  @Input() childWindowCode: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  isLoading: boolean = false;
  folderType: string;

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService, 
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  docEvidenceList: Array<DocEvidenceModel> = []

  ngOnInit() {
    this.docEvidenceList = [];
  }

  ngOnChanges(changes: SimpleChanges){
    this.docEvidenceList = [];
    const childWindowCode: SimpleChange = changes.childWindowCode;
    this.folderType = FolderTypes.INPUT;
    if(childWindowCode.currentValue !== childWindowCode.previousValue) {
      if(this.dataService.docEvidenceFolderTypeMap && this.dataService.docEvidenceFolderTypeMap.get(childWindowCode.currentValue)) {
        this.folderType = this.dataService.docEvidenceFolderTypeMap.get(childWindowCode.currentValue);
      }
      this.getDocumentEvidences();
    }
  }

  private getDocumentEvidences(){
    this.isLoading = true;
    this.businessLoaderService.advisorDocEvidenceBusinessService.getJournalDocEvidenceByFolderAsync(
        this.journalInfo.id, this.journalInfo.runDateSelected, this.folderType).subscribe(response =>{
        this.isLoading = false;
        if(response.body){
          let fileList = response.body;
          for(var index=0; index<fileList.length; index++){
            var docEvidence = new DocEvidenceModel();
            docEvidence.fileName = fileList[index].fileName;
            docEvidence.fileType = fileList[index].fileType;
            docEvidence.markedUpFileName = fileList[index].markedUpName;
            docEvidence.comments = fileList[index].warning;
            this.docEvidenceList.push(docEvidence);
          }
          this.docEvidenceList = this.generalUtility.getSortedArray(this.docEvidenceList, "fileName");
        }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onFileDownloadClick(fileType: string, file: string){
    var reqJson = {};
    let responseType: string = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV;
    let fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV;
    let downloadFilename: string = "";
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.journalInfo.id;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = this.journalInfo.runDateSelected;
    reqJson["folder"] = this.folderType;
    reqJson["file"] = file;
    reqJson["fileType"] = fileType;
    if((this.folderType.toLowerCase() === FolderTypes.LOGS.toLowerCase()) 
      || (this.folderType.toLowerCase() === FolderTypes.PROCESSED.toLowerCase())) {
      reqJson["evidenceType"] = "log";
    } else  {
      reqJson["evidenceType"] = "file";
    }
    if(fileType === "marked") {
      responseType = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_BLOB;
      fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_PDF;
      downloadFilename = file + ".pdf";
    } else {
      responseType = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV;
      fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV;
      downloadFilename = file + ".csv";
    }
    this.businessLoaderService.commonBusinessService.downloadEvidenceAsync(reqJson, responseType).subscribe(res => {
      this.generalUtility.download(res.body, downloadFilename, fileContentType);
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }
}