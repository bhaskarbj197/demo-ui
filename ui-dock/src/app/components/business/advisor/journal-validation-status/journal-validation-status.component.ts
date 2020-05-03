/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { ValidationStatusModel } from '../../../../models/validationStatus.model';
import { GraphDataModel } from '../../../../models/graphData.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { DateConverterPipe } from '../../../../pipes/date-converter.pipe';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-validation-status',
  templateUrl: './journal-validation-status.component.html',
  styleUrls: ['./journal-validation-status.component.scss']
})
export class JournalValidationStatusComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private dateConverterPipe: DateConverterPipe,
    private dataService: DataService,
    private router: Router,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_JOURNAL_VALIDATION_0, 
    this.constantLoaderService.tabListTextsService.ADVR_JOURNAL_VALIDATION_1];
  activeTab: string = this.tabList[0];
  isLoading: boolean = false;
  validationStatusList: Array<ValidationStatusModel> = new Array<ValidationStatusModel>();
  validationStatusGraph: GraphDataModel = new GraphDataModel();

  ngOnInit() {
    this.loadValidationStatus();
  }

  private loadValidationStatus(){
    this.isLoading = true;
    this.businessLoaderService.advisorDetailGraphBusinessService.getValidationStatusAsync().subscribe(res => {
      if(res.body){
        this.validationStatusList = this.businessLoaderService.advisorDetailGraphBusinessService.getValidationStatusList(res.body);
        this.setupValidationStatusGraph();
        this.isLoading = false;
      }
    }, err =>{
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private setupValidationStatusGraph(){
    var labels: Array<{label: string, data: Array<number>}> = new Array<{label: string, data: Array<number>}>();
    for(var index=0; index<this.validationStatusList.length; index++){
      this.validationStatusGraph.labels.push(this.validationStatusList[index].journalId + "(" + 
        this.dateConverterPipe.transform(this.validationStatusList[index].runDate, false, true) + ")");
      if(index === 0){
        labels.push({label: "Pass", data: []});
        labels.push({label: "Fail", data: []});
      }
      labels[0].data.push(this.validationStatusList[index].validationPassCount);
      labels[1].data.push(this.validationStatusList[index].validationFailCount);
    }
    this.validationStatusGraph.data = labels;
    this.validationStatusGraph.colors = [this.enumLoaderService.chartColors.BAR_GREEN_1, this.enumLoaderService.chartColors.BAR_RED_1];
  }

  onChangedActiveTab(obj: any){
    if(obj && obj.activeTab !== this.tabList[1]){
      this.activeTab = obj.activeTab;
    }
  }

  onValidationStatusItemClick(selectedItem: ValidationStatusModel, segment: string) {
    this.dataService.journalId = selectedItem.journalId;
    this.dataService.advisorSegment = segment;
    this.dataService.journalRunDate = this.dateConverterPipe.transform(selectedItem.runDate, false, true);
    this.router.navigate(["advisor"]);
  }
}
