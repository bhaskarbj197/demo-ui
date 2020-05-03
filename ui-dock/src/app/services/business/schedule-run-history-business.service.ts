import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../data/ui-json-data.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { ScheduleRunHistoryDataService } from '../data/schedule-run-history-data.service';
import { ScheduleRunHistoryModel, ScheduleRunHistoryStepModel, ScheduleRunStepModel, ScheduleRunGraphDataModel, ScheduleRunStatusCountGraphModel, ScheduleRunWorkdayCountGraphModel, SchedulerRunHistoryFilterModel } from 'src/app/models/scheduleRunHistory.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleRunHistoryBusinessService {

  constructor(private uiJsonData: UiJsonDataService,
    private generalUtility: GeneralUtility,
    private scheduleRunHistoryData: ScheduleRunHistoryDataService,
    private enumLoaderService: EnumLoaderService) { }

  private getScheduleRunSteps(): Array<ScheduleRunStepModel> {
    return this.uiJsonData.getScheduleRunSteps();
  }

  getSchedulerRunHistoryAsync(tableConfig: TableConfigModel, filterObj: SchedulerRunHistoryFilterModel): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.monthNumber = filterObj.monthNumber;
    request.journalId = filterObj.journalId;
    request.status = filterObj.status;
    return this.scheduleRunHistoryData.getSchedulerRunHistoryAsync(request);
  }

  getSchedulerRunHistory(response: any): Array<ScheduleRunHistoryModel> {
    var result: Array<ScheduleRunHistoryModel> = new Array<ScheduleRunHistoryModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var run: ScheduleRunHistoryModel = new ScheduleRunHistoryModel();
        run.jobId = response[index].jobId;
        run.journalId = response[index].jid;
        run.rundate = response[index].runDate;
        run.startTime = response[index].startTime;
        run.endTime = response[index].endTime;
        run.status = response[index].status;
        result.push(run);
      }
    }
    return result;
  }

  getSchedulerRunStepsAsync(jobId: number): Observable<HttpResponse<any>> {
    return this.scheduleRunHistoryData.getSchedulerRunStepsAsync(jobId);
  }

  getSchedulerRunSteps(response: any): Array<ScheduleRunHistoryStepModel> {
    var result: Array<ScheduleRunHistoryStepModel> = new Array<ScheduleRunHistoryStepModel>();
    var runStepsValues: Array<ScheduleRunStepModel> = this.getScheduleRunSteps();
    if(response){
      for(var index=0; index<runStepsValues.length; index++){
        var step: ScheduleRunHistoryStepModel = new ScheduleRunHistoryStepModel();
        step.stepCode = runStepsValues[index].code;
        step.stepValue = runStepsValues[index].name;
        step.seq = runStepsValues[index].seq;
        if(response.findIndex(r => r.state === runStepsValues[index].code) >= 0){
          step.startTime = response.find(r => r.state === runStepsValues[index].code).startTime;
          step.endTime = response.find(r => r.state === runStepsValues[index].code).endtime;
          step.status = response.find(r => r.state === runStepsValues[index].code).status;
        } else {
          step.status = this.enumLoaderService.schedulerRunHistoryStatuses.NOT_RUN;
        }
        result.push(step);
      }
    }
    return result;
  }

  getSchedulerRunGraphsAsync(monthNumber: number): Observable<HttpResponse<any>> {
    var request: any = {
      monthNumber: monthNumber
    };
    return this.scheduleRunHistoryData.getSchedulerRunGraphsAsync(request);
  }

  getSchedulerRunGraphs(response: any): ScheduleRunGraphDataModel {
    var result: ScheduleRunGraphDataModel = new ScheduleRunGraphDataModel();
    if(response){
      if(response.countDetails){
        var statusCount: ScheduleRunStatusCountGraphModel = new ScheduleRunStatusCountGraphModel();
        statusCount.passCount = response.countDetails.passCount;
        statusCount.failCount = response.countDetails.failCount;
        statusCount.inProgressCount = response.countDetails.inProgressCount;
        result.countDetails = statusCount;
      }
      if(response.wdWiseCountDetails){
        result.wdWiseCountDetails = new Array<ScheduleRunWorkdayCountGraphModel>();
        for(var index=0; index<response.wdWiseCountDetails.length; index++){
          var wdStatusCount: ScheduleRunWorkdayCountGraphModel = new ScheduleRunWorkdayCountGraphModel();
          wdStatusCount.workDay = response.wdWiseCountDetails[index].workDay;
          wdStatusCount.passCount = response.wdWiseCountDetails[index].passCount;
          wdStatusCount.failCount = response.wdWiseCountDetails[index].failCount;
          wdStatusCount.inProgressCount = response.wdWiseCountDetails[index].inProgressCount;
          result.wdWiseCountDetails.push(wdStatusCount);
        }
      }
    }
    return result;
  }
}
