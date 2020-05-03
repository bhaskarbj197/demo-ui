/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { GraphDataModel } from '../../../../models/graphData.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { WorkdayJournalStatusModel } from '../../../../models/workdayJournalStatus.model';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-status-by-workday',
  templateUrl: './journal-status-by-workday.component.html',
  styleUrls: ['./journal-status-by-workday.component.scss']
})
export class JournalStatusByWorkdayComponent implements OnInit, OnChanges {

  @Input() workdaySelected: string = "";

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private dataService: DataService,
    private dateConverterPipe: DateConverterPipe,
    private router: Router,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_JOURNAL_STATUS_0, 
    this.constantLoaderService.tabListTextsService.ADVR_JOURNAL_STATUS_1, 
    this.constantLoaderService.tabListTextsService.ADVR_JOURNAL_STATUS_2];
  activeTab: string = this.tabList[0];
  isLoading: boolean = false;
  journalStatusListByWorkday: Array<WorkdayJournalStatusModel> = new Array<WorkdayJournalStatusModel>();
  workdayList: Array<string> = [];
  graphDataByWorkday: GraphDataModel = new GraphDataModel();
  graphData: GraphDataModel = new GraphDataModel();

  ngOnInit() {
    this.loadWorkdayList();
    this.loadJournalStatusByWorkday();
    if(this.dataService.selectedItemOfMainWindowForAdvisorGraph) {
      this.workdaySelected = this.dataService.selectedItemOfMainWindowForAdvisorGraph;
    }
  }

  ngOnChanges(changes: SimpleChanges){
    const workdaySelected: SimpleChange = changes.workdaySelected;
    if(workdaySelected.currentValue !== workdaySelected.previousValue){
      this.loadGraphDataByWorkday();
    }
  }

  private loadWorkdayList(){
    for(var index=this.constantLoaderService.defaultValuesService.WORKDAY_START; 
      index<=this.constantLoaderService.defaultValuesService.WORKDAY_END; index++){
      this.workdayList.push(this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH + index.toString());
    }
  }

  private loadJournalStatusByWorkday(){
    this.isLoading = true;
    this.businessLoaderService.advisorDetailGraphBusinessService.getJournalStatusByWorkdayAsync().subscribe(res => {
      if(res.body){
        this.journalStatusListByWorkday = this.businessLoaderService.advisorDetailGraphBusinessService.getJournalStatusByWorkday(res.body);
        this.loadGraphDataByWorkday();
        this.loadGraphDataForAllWorkday();
        this.isLoading = false;
      }
    }, err =>{
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadGraphDataByWorkday(){
    this.graphDataByWorkday = new GraphDataModel();
    if(this.workdaySelected && this.workdaySelected.length > 0){
      var dataByWorkday: Array<WorkdayJournalStatusModel> = new Array<WorkdayJournalStatusModel>();
      dataByWorkday = this.journalStatusListByWorkday.filter(j => j.workday === this.workdaySelected);
      for(var index = 0; index < Object.keys(this.enumLoaderService.journalStatusByWorkday).length; index++){
        this.graphDataByWorkday.labels.push(Object.values(this.enumLoaderService.journalStatusByWorkday)[index]);
        var count = dataByWorkday.filter(d => d.status.toLowerCase().trim() === this.graphDataByWorkday.labels[index].toLowerCase().trim()).length;
        this.graphDataByWorkday.data.push(count);
        this.graphDataByWorkday.labels[index] = this.graphDataByWorkday.labels[index] + " (" + count.toString() + ")";
      }
      this.graphDataByWorkday.colors.push(this.enumLoaderService.chartColors.PIE_GREEN);
      this.graphDataByWorkday.colors.push(this.enumLoaderService.chartColors.PIE_RED);
      this.graphDataByWorkday.colors.push(this.enumLoaderService.chartColors.PIE_BLUE);
      this.graphDataByWorkday.colors.push(this.enumLoaderService.chartColors.PIE_GRAY);
    }
  }

  private loadGraphDataForAllWorkday(){
    var labels: Array<any> = [];
    for(var index=this.constantLoaderService.defaultValuesService.WORKDAY_START; 
      index<=this.constantLoaderService.defaultValuesService.WORKDAY_END; index++){
        this.graphData.labels.push(this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH + index.toString());
    }
    for(var cnt = 0; cnt < Object.keys(this.enumLoaderService.journalStatusByWorkday).length; cnt++){
      labels.push({label: Object.values(this.enumLoaderService.journalStatusByWorkday)[cnt], data: []});
      for(var index=0; index<this.graphData.labels.length; index++){
        labels[cnt].data.push(this.journalStatusListByWorkday.filter(j => j.workday === this.graphData.labels[index] 
          && j.status.toLowerCase().trim() === Object.values(this.enumLoaderService.journalStatusByWorkday)[cnt].toLowerCase().trim()).length);
      }
    }
    this.graphData.data = labels;
    this.graphData.colors.push(this.enumLoaderService.chartColors.BAR_GREEN_1);
    this.graphData.colors.push(this.enumLoaderService.chartColors.BAR_RED_1);
    this.graphData.colors.push(this.enumLoaderService.chartColors.BAR_BLUE);
    this.graphData.colors.push(this.enumLoaderService.chartColors.BAR_GRAY);
  }

  onChangedActiveTab(obj: any){
    if(obj && obj.activeTab !== this.tabList[1]){
      this.activeTab = obj.activeTab;
    }
  }

  onWorkdatChanged(obj: any){
    if(obj && obj.item){
      this.workdaySelected = obj.item.key;
      this.loadGraphDataByWorkday();
    }
  }

  onJournalItemClick(selectedItem: WorkdayJournalStatusModel, segment: string) {
    this.dataService.journalId = selectedItem.journalId;
    this.dataService.advisorSegment = segment;
    this.dataService.journalRunDate = this.dateConverterPipe.transform(selectedItem.runDate, false, true);
    this.router.navigate(["advisor"]);
  }
}
