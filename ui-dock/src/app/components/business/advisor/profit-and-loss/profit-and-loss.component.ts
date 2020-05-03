/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ProfitLossModel, ProfitLossGraphModel } from 'src/app/models/profitLoss.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.scss']
})
export class ProfitAndLossComponent implements OnInit {

  @Input() heading: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private broadcaster: Broadcaster,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_PROFIT_LOSS_0,
    this.constantLoaderService.tabListTextsService.ADVR_PROFIT_LOSS_1];
  activeTab: string = this.tabList[0];
  profitLossList: Array<ProfitLossModel> = [];
  profitLossGraphList: Array<ProfitLossGraphModel> = [];
  graphLabels: Array<string> = [];
  graphData: Array<any> = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.loadProfitLossData();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_PROFIT_LOSS_VIEW){
        this.loadProfitLossData();
      }
    });
  }

  private loadProfitLossData() {
    this.isLoading = true;
    this.businessLoaderService.financialImpactBusinessService.getFinancialImpactAsync(4522, "31-10-2019").subscribe(res => {
      if(res && res.body){
        this.profitLossList = this.businessLoaderService.financialImpactBusinessService.getFinancialImpact(res.body);
        this.setProfitLossGraph();
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private setProfitLossGraph(){
    this.profitLossGraphList = [];
    if(this.profitLossList){
      this.graphData = [];
      this.graphData.push({data: [], label: "", backgroundColor: []});
      this.graphLabels = [];
      for(var index=0; index<this.profitLossList.length; index++){
        var profitLossGraph = new ProfitLossGraphModel();
        profitLossGraph.glCostCenter = this.profitLossList[index].glAccount.toString() + ((this.profitLossList[index].drOrCr.toLowerCase().trim() === "cr") ? 
          this.profitLossList[index].profitCenter : this.profitLossList[index].costCenter).toString();
        profitLossGraph.impact = this.profitLossList[index].impact;
        this.profitLossGraphList.push(profitLossGraph);

        this.graphLabels.push(this.profitLossList[index].glAccount.toString() + "-" + ((this.profitLossList[index].drOrCr.toLowerCase().trim() === "cr") ? 
          this.profitLossList[index].profitCenter : this.profitLossList[index].costCenter).toString());
        this.graphData[0].data.push(this.profitLossList[index].impact);

        if(this.profitLossList[index].impact > 0){
          this.graphData[0].backgroundColor.push(this.enumLoaderService.chartColors.BAR_BLUE);
        }else{
          this.graphData[0].backgroundColor.push(this.enumLoaderService.chartColors.BAR_RED);
        }
      }
    }
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
  }

  onSetImpactRiskLabelColor(riskLabel: number): string{
    if(riskLabel === 0){
      return "back-color-risk-0";
    } else if(riskLabel === 1) {
      return "back-color-risk-1";
    } else if(riskLabel === 2) {
      return "back-color-risk-2";
    } else if(riskLabel === 3) {
      return "back-color-risk-3";
    }
    return "";
  }

  onDownloadFinancialImpact() {
    var reqJson = {};
    let responseType: string = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV;
    let fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV;
    let downloadFilename: string = "financial_impact_withdetails.csv";
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = 4522;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = "31-10-2019";
    reqJson["fileType"] = this.enumLoaderService.downloadFileTypes.PROFIT_LOSS;
    this.businessLoaderService.commonBusinessService.downloadEvidenceAsync(reqJson, responseType).subscribe(res => {
      this.generalUtility.download(res.body, downloadFilename, fileContentType);
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
}