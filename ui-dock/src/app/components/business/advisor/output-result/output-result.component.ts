/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { ResultSetDataModel } from '../../../../models/resultSetTab.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { DataService } from '../../../../services/data.service';
import { GeneralUtility } from '../../../../utility/general-utility';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-output-result',
  templateUrl: './output-result.component.html',
  styleUrls: ['./output-result.component.scss']
})
export class OutputResultComponent implements OnInit {

  @Input() heading: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private dataService: DataService,
    private generalUtility: GeneralUtility,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  resultData: ResultSetDataModel;
  isLoading: boolean = false;
  templateFileName: string = "";

  ngOnInit() {
    this.loadResultData();
  }

  private loadResultData(){
    this.isLoading = true;
    this.businessLoaderService.journalDetailsBusinessService.getTemplateNameByJournalIdAsync(this.dataService.journalShortInfo.id).subscribe(response => {
      if(response.body && response.body.outputTemplate){
        this.templateFileName = response.body.outputTemplate;
        this.heading = this.heading + " - " + response.body.outputTemplate;
        this.businessLoaderService.journalDetailsBusinessService.getResultDataByTblNameAsync(this.templateFileName, 
          this.dataService.journalShortInfo.id, this.enumLoaderService.folderTypes.OUTPUT, "")
          .subscribe(res => {
            if(res.body){
              this.resultData = new ResultSetDataModel();
              this.resultData.fileData = res.body.fileData;
              this.resultData.fileHeader = res.body.fileHeader;
              this.resultData.fileName = res.body.fileName;
            }
            this.isLoading = false;
          },
          err => {
            this.isLoading = false;
            this.resultData = new ResultSetDataModel();
            this.handlerLoaderService.errorHandlerService.handleError(err);
          });
      }
    }, error => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(error);
    });
  }

  onDownloadFile(){
    var requestJson = {};
    requestJson["jid"] = this.dataService.journalShortInfo.id;
    requestJson["file"] = this.templateFileName;
    requestJson["folder"] = this.enumLoaderService.folderTypes.OUTPUT;
    requestJson["date"] = "";

    this.businessLoaderService.journalDetailsBusinessService.downloadFileAsync(requestJson).subscribe(data => 
      this.generalUtility.download(data.body, (this.templateFileName  + "(" + this.enumLoaderService.folderTypes.OUTPUT.substr(0,1) + ")"+ ".csv"), 
      this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV));
  }
}