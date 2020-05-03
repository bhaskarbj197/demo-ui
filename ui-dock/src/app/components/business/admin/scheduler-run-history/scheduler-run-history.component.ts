import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { ScheduleRunHistoryModel, ScheduleRunHistoryDetailModel, ScheduleRunHistoryStepModel, ScheduleRunGraphDataModel, SchedulerRunHistoryFilterModel } from 'src/app/models/scheduleRunHistory.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { GraphDataModel } from 'src/app/models/graphData.model';

@Component({
  selector: 'app-scheduler-run-history',
  templateUrl: './scheduler-run-history.component.html',
  styleUrls: ['./scheduler-run-history.component.scss']
})
export class SchedulerRunHistoryComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private enumLoaderService: EnumLoaderService) { }

  isLoading: boolean = false;
  isJobLoading: boolean = false;
  isGraphLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.SCHEDULER_RUN_GRAPH_0,
    this.constantLoaderService.tabListTextsService.SCHEDULER_RUN_GRAPH_1];
  activeTab: string = this.tabList[0];
  runHistoryList: Array<ScheduleRunHistoryModel> = new Array<ScheduleRunHistoryModel>();
  runHistoryDetails: ScheduleRunHistoryDetailModel = new ScheduleRunHistoryDetailModel();
  monthList: Array<object> = this.constantLoaderService.defaultValuesService.SCHEDULER_HISTORY_MONTH_LIST;
  statusList: Array<string> = [];
  graphData: ScheduleRunGraphDataModel = new ScheduleRunGraphDataModel();
  statusCountGraphData: GraphDataModel = new GraphDataModel();
  wdStatusCountGraphData: GraphDataModel = new GraphDataModel();
  tableConfigModel: TableConfigModel = new TableConfigModel();
  filterObject: SchedulerRunHistoryFilterModel = new SchedulerRunHistoryFilterModel();
  totalScheduleRunCount: number = 0;
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.SCHEDULE_RUN_HISTORY_LIST);

  ngOnInit() {
    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.SCHEDULE_RUN_HISTORY_LIST);
    this.tableConfigModel.pageIndex = 0;
    this.initGraphs();
    this.loadStatusList();
    this.loadGraphData();
    this.loadScheduleHistoryList();
  }

  private initGraphs(){
    
  }

  private loadGraphData(){
    this.isGraphLoading = true;
    this.graphData = new ScheduleRunGraphDataModel();
    this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunGraphsAsync(this.filterObject.monthNumber).subscribe(res => {
      if(res.body){
        if(res.body){
          this.graphData = this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunGraphs(res.body);
          this.setGraphData();
        }
      }
      this.isGraphLoading = false;
    }, err => {
      this.isGraphLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private setGraphData(){
    this.statusCountGraphData = new GraphDataModel();
    this.statusCountGraphData.colors = [this.enumLoaderService.chartColors.PIE_GREEN, 
      this.enumLoaderService.chartColors.PIE_RED, this.enumLoaderService.chartColors.PIE_BLUE];
    this.statusCountGraphData.labels = ["Pass", "Fail", "In Progress"];
    this.statusCountGraphData.data = [this.graphData.countDetails.passCount, 
      this.graphData.countDetails.failCount, this.graphData.countDetails.inProgressCount];

    this.wdStatusCountGraphData = new GraphDataModel();
    this.wdStatusCountGraphData.colors =[this.enumLoaderService.chartColors.BAR_GREEN_1, 
      this.enumLoaderService.chartColors.BAR_RED_1, this.enumLoaderService.chartColors.BAR_BLUE_1];
    if(this.graphData.wdWiseCountDetails){
      var wdGphData: Array<any> = [];
      wdGphData.push({
        label: this.enumLoaderService.schedulerRunHistoryStatuses.PASS,
        data: []
      });
      wdGphData.push({
        label: this.enumLoaderService.schedulerRunHistoryStatuses.FAIL,
        data: []
      });
      wdGphData.push({
        label: this.enumLoaderService.schedulerRunHistoryStatuses.IN_PROGRESS,
        data: []
      });
      for(var index=0; index<this.graphData.wdWiseCountDetails.length; index++){
        this.wdStatusCountGraphData.labels.push(this.graphData.wdWiseCountDetails[index].workDay);
        wdGphData.find(w => w.label === this.enumLoaderService.schedulerRunHistoryStatuses.PASS).data.push(this.graphData.wdWiseCountDetails[index].passCount);
        wdGphData.find(w => w.label === this.enumLoaderService.schedulerRunHistoryStatuses.FAIL).data.push(this.graphData.wdWiseCountDetails[index].failCount);
        wdGphData.find(w => w.label === this.enumLoaderService.schedulerRunHistoryStatuses.IN_PROGRESS).data.push(this.graphData.wdWiseCountDetails[index].inProgressCount);
      }
      this.wdStatusCountGraphData.data = wdGphData;
    }
  }

  private loadStatusList(){
    this.statusList = [];
    for(var index = 0; index < Object.keys(this.enumLoaderService.schedulerRunHistoryStatuses).length; index++){
      if(Object.values(this.enumLoaderService.schedulerRunHistoryStatuses)[index] !== 
        this.enumLoaderService.schedulerRunHistoryStatuses.NOT_RUN){
        this.statusList.push(Object.values(this.enumLoaderService.schedulerRunHistoryStatuses)[index]);
      }
    }
  }

  private loadScheduleHistoryList(){
    this.isLoading = true;
    this.runHistoryList = new Array<ScheduleRunHistoryModel>();
    this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunHistoryAsync(this.tableConfigModel, this.filterObject).subscribe(res => {
      if(res.body){
        if(res.body.data){
          this.runHistoryList = this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunHistory(res.body.data);
        }
        if(res.body.totalCount){
          this.totalScheduleRunCount = res.body.totalCount;
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadRunHistoryDetailsByJobId(){
    this.isJobLoading = true;
    this.runHistoryDetails.stepList = new Array<ScheduleRunHistoryStepModel>();
    this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunStepsAsync(this.runHistoryDetails.jobId).subscribe(res => {
      if(res.body){
        this.runHistoryDetails.stepList = this.businessLoaderService.scheduleRunHistoryBusinessService.getSchedulerRunSteps(res.body);
      }
      this.isJobLoading = false;
    }, err => {
      this.isJobLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadScheduleHistoryList();
    }
  }

  onPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadScheduleHistoryList();
    }
  }

  onViewRunHistoryDetails(run: ScheduleRunHistoryModel){
    if(run){
      this.runHistoryDetails = new ScheduleRunHistoryDetailModel();
      this.runHistoryDetails.jobId = run.jobId;
      this.runHistoryDetails.journalId = run.journalId;
      this.runHistoryDetails.rundate = run.rundate;
      this.runHistoryDetails.startTime = run.startTime;
      this.runHistoryDetails.endTime = run.endTime;
      this.runHistoryDetails.status = run.status;
      this.loadRunHistoryDetailsByJobId();
    }
  }

  onFilterClick(){
    this.loadScheduleHistoryList();
    this.loadGraphData();
  }

  getStatusCss(status: string): string {
    if(status){
      if(status === this.enumLoaderService.schedulerRunHistoryStatuses.FAIL){
        return "fail-sts-txt";
      } else if (status === this.enumLoaderService.schedulerRunHistoryStatuses.PASS){
        return "pass-sts-txt";
      }
    }
    return "";
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
    }
  }

  onCloseScheduleRunDetailClick(){
    this.runHistoryDetails = new ScheduleRunHistoryDetailModel();
  }

  onResetClick(){
    this.filterObject = new SchedulerRunHistoryFilterModel();
    this.loadScheduleHistoryList();
    this.loadGraphData();
  }
}
