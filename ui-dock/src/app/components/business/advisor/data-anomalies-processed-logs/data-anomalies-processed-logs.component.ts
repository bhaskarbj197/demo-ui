/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { AnomalyProcessLogsModel, AnomalyProcessLogsHistoryModel, AnomalyProcessLogsDataModel } from '../../../../models/anomalyProcessLogs.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-data-anomalies-processed-logs',
  templateUrl: './data-anomalies-processed-logs.component.html',
  styleUrls: ['./data-anomalies-processed-logs.component.scss']
})
export class DataAnomaliesProcessedLogsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() childWindowCode: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private dateConverterPipe: DateConverterPipe,
    private broadcaster: Broadcaster,
    private handlerLoaderService: HandlerLoaderService) { }

  processLogs: AnomalyProcessLogsModel = new AnomalyProcessLogsModel();
  processLogHistory: Array<AnomalyProcessLogsHistoryModel> = [];
  isProcessLogsLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_PROCESSED_LOG_0, 
    this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_PROCESSED_LOG_1];
  disableTabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_ANOMALY_PROCESSED_LOG_1]
  activeTab: string = this.tabList[0];
  journalGraphs: any = { 
    processLogAnomaly: [{data:[], label:""}],
    colors: [{
      backgroundColor: this.enumLoaderService.chartColors.BAR_BLUE_1,
      borderColor: this.enumLoaderService.chartColors.BAR_BLUE,
      pointBackgroundColor: this.enumLoaderService.chartColors.BAR_GREEN_1,
      pointBorderColor: this.enumLoaderService.chartColors.BAR_GREEN_1
    }],
    labels: []
  };

  ngOnInit() {
    this.getProcessLogsDataAnomalies();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_PROCESSED_LOGS_VIEW){
        this.journalInfo = obj.data;
        this.getProcessLogsDataAnomalies();
      }
    });
  }

  private getProcessLogsDataAnomalies(){
    this.isProcessLogsLoading = true;
    this.businessLoaderService.advisorAnomalyBusinessService.getJournalProcessedLogDataAnomalyAsync(this.journalInfo.id, this.journalInfo.runDateSelected).subscribe(response => {
      if(response.body){
        this.processLogs = this.businessLoaderService.advisorAnomalyBusinessService.getJournalProcessLogDataAnomaly(response.body);
      }
      this.isProcessLogsLoading = false;
    }, err => {
      this.isProcessLogsLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onShowLogHistoryClick(processLog: AnomalyProcessLogsDataModel) {
    var request: any = {};
    request.stepNo = processLog.stepNo;
    request.jid = processLog.journalId;
    request.date = this.dateConverterPipe.transform(processLog.runDate);
    this.loadProcessLogHistory(request);
    this.activeTab = this.tabList[1];
  }

  onChangedActiveTab(obj: any){
    if(obj && obj.activeTab !== this.tabList[1]){
      this.activeTab = obj.activeTab;
    }
  }

  private loadProcessLogHistory(request: any) {
    this.businessLoaderService.advisorAnomalyBusinessService.getJournalProcessedLogHistoryAsync(request).subscribe(res => {
      if(res.body && res.body.length > 0) {
        this.processLogHistory = res.body;
        this.fedTheGraph();
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private fedTheGraph() {
    this.journalGraphs.processLogAnomaly = [];
    let dataSet = [], labelsToShow = [];
    for(var index = 0; index < this.processLogHistory.length; index++) {
      dataSet.push(this.processLogHistory[index].removeRecordCount)
      labelsToShow.push(this.processLogHistory[index].runDate);
    }
    this.journalGraphs.processLogAnomaly.push({
      data: dataSet, label: "Remove Record Count"
    });
    this.journalGraphs.labels = labelsToShow;
  }

  onDownloadProcessedLogAnomalyExcel(){
    
  }
}
