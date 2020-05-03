/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataAnomalyModel, AnomalyInputDataModel } from 'src/app/models/data-anomaly.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-data-anomalies-input-files',
  templateUrl: './data-anomalies-input-files.component.html',
  styleUrls: ['./data-anomalies-input-files.component.scss']
})
export class DataAnomaliesInputFilesComponent implements OnInit {

  @Input() heading: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  inputDataAnomalyInfo: DataAnomalyModel = new DataAnomalyModel();
  isAnomalyLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_INPUT_FILE_0, 
    this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_INPUT_FILE_1];
  activeTab: string = this.tabList[0];
  graphData: any = { data: [], labels: [], colors: []};
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private broadcaster: Broadcaster,
    private handlerLoaderService: HandlerLoaderService) { }

  ngOnInit() {
    this.loadInputAnomalyInfo();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_INPUT_FILE_ANOMALY_VIEW){
        this.journalInfo = obj.data;
        this.loadInputAnomalyInfo();
      }
    });
  }

  private loadInputAnomalyInfo() {
    this.isAnomalyLoading = true;
    this.businessLoaderService.advisorAnomalyBusinessService
      .getInputFileAnomalyDataAsync(this.journalInfo.id, this.journalInfo.runDateSelected, "").subscribe(res => {  
        if(res.body && Object.keys(res.body).length > 0){
          this.inputDataAnomalyInfo.anomalyCount = res.body.anomalyCount;
          this.inputDataAnomalyInfo.fileHeader = res.body.fileHeader;
          if(res.body.fileData && res.body.fileData.length > 0) {
            for(var index=0; index<res.body.fileData.length; index++){
              var fileData: AnomalyInputDataModel = new AnomalyInputDataModel();
              fileData.isAnomaly = res.body.fileData[index].outlier;
              fileData.anomalyComments = res.body.fileData[index].outlierComments;
              fileData.dataValue = res.body.fileData[index].dataValue;
              this.inputDataAnomalyInfo.fileData.push(fileData);
            }
          }          
          this.inputDataAnomalyInfo.fileName = res.body.fileName;
          this.inputDataAnomalyInfo.targetName = res.body.targetName;
          this.inputDataAnomalyInfo.totalCount = res.body.totalCount;
          this.inputDataAnomalyInfo.targetNameIndex = this.inputDataAnomalyInfo.fileHeader
            .findIndex(h => h.toLowerCase().trim() === res.body.targetName.toLowerCase().trim());
        }
        this.graphData.data = [(this.inputDataAnomalyInfo.totalCount - this.inputDataAnomalyInfo.anomalyCount), this.inputDataAnomalyInfo.anomalyCount];
        this.graphData.labels = ["Normal data", "Anomaly data"];
        this.graphData.colors = [this.enumLoaderService.chartColors.PIE_GREEN, this.enumLoaderService.chartColors.PIE_RED];
        this.isAnomalyLoading = false;
    }, err => {
      this.isAnomalyLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    }) 
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      if(this.activeTab === this.tabList[1]) {
        this.loadInputAnomalyInfo();
      }
    }
  }

  onDownloadClick() {
    this.isAnomalyLoading = true;
    var reqJson = {};
    let file = this.inputDataAnomalyInfo.fileName + "_" + this.inputDataAnomalyInfo.targetName;
    let responseType: string = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV;
    let fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV;
    let downloadFilename: string = "";
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.journalInfo.id;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = this.journalInfo.runDateSelected;
    reqJson["fileType"] = this.enumLoaderService.downloadFileTypes.FILE_DATA;
    reqJson["file"] = file;
    downloadFilename = file + ".csv";
    this.businessLoaderService.commonBusinessService.downloadEvidenceAsync(reqJson, responseType).subscribe(res => {
      this.isAnomalyLoading = false;
      this.generalUtility.download(res.body, downloadFilename, fileContentType);
    }, err => {
      this.isAnomalyLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
}
