/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { AnomalyInputLogsModel, AnomalyInputLogsHistoryModel, AnomalyInputLogsDataModel } from '../../../../models/anomalyInputLogs.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-data-anomalies-input-logs',
  templateUrl: './data-anomalies-input-logs.component.html',
  styleUrls: ['./data-anomalies-input-logs.component.scss']
})
export class DataAnomaliesInputLogsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() childWindowCode: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  constructor(private businessLoaderService: BusinessLoaderService,
    private dateConverterPipe: DateConverterPipe,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private broadcaster: Broadcaster,
    private handlerLoaderService: HandlerLoaderService) { }

  inputLogs: AnomalyInputLogsModel = new AnomalyInputLogsModel();
  inputLogHistory: Array<AnomalyInputLogsHistoryModel> = [];
  isInputLogsLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_INPUT_LOG_0, 
    this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_INPUT_LOG_1];
  disableTabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_INPUT_LOG_1]
  activeTab: string = this.tabList[0];

  journalGraphs: any = { 
    inputLogAnomaly: [{data:[], label:""}],
    colors: [{
      backgroundColor: this.enumLoaderService.chartColors.LINE_GREEN_LIGHT,
      borderColor: this.enumLoaderService.chartColors.BAR_GREEN_1,
      pointBackgroundColor: this.enumLoaderService.chartColors.BAR_BLUE,
      pointBorderColor: this.enumLoaderService.chartColors.BAR_BLUE
    }],
    labels: []
  };

  ngOnInit() {
    this.getInputLogsDataAnomalies();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_INPUT_LOGS_VIEW){
        this.journalInfo = obj.data;
        this.getInputLogsDataAnomalies();
      }
    });
  }

  private getInputLogsDataAnomalies(){
    this.isInputLogsLoading = true;
    this.businessLoaderService.advisorAnomalyBusinessService.getJournalInputLogDataAnomalyAsync(this.journalInfo.id, this.journalInfo.runDateSelected).subscribe(response => {
      if(response.body){
        this.inputLogs = this.businessLoaderService.advisorAnomalyBusinessService.getJournalInputLogDataAnomaly(response.body);
      }
      this.isInputLogsLoading = false;
    }, err => {
      this.isInputLogsLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onShowLogHistoryClick(inputLog: AnomalyInputLogsDataModel) {
    var request: any = {};
    request.fileName = inputLog.fileName;
    request.jid = inputLog.journalId;
    request.date = this.dateConverterPipe.transform(inputLog.runDate);
    this.loadInputLogHistory(request);
    this.activeTab = this.tabList[1];
  }

  onChangedActiveTab(obj: any){
    if(obj && obj.activeTab !== this.tabList[1]){
      this.activeTab = obj.activeTab;
    }
  }

  private loadInputLogHistory(request: any) {
    this.businessLoaderService.advisorAnomalyBusinessService.getJournalInputLogHistoryAsync(request).subscribe(res => {
      if(res.body && res.body.length > 0) {
        this.inputLogHistory = res.body;
        this.fedTheGraph();
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  private fedTheGraph() {
    this.journalGraphs.inputLogAnomaly = [];
    let dataSet = [], labelsToShow = [];
    for(var index = 0; index < this.inputLogHistory.length; index++) {
      dataSet.push(this.inputLogHistory[index].removeRecordCount)
      labelsToShow.push(this.inputLogHistory[index].runDate);
    }
    this.journalGraphs.inputLogAnomaly.push({
      data: dataSet, label: "Remove Record Count"
    });
    this.journalGraphs.labels = labelsToShow;
  }

  onDownloadInputLogAnomalyExcel(){
    
  }
}
