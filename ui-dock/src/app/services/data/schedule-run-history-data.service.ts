import { Injectable } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleRunHistoryDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getSchedulerRunHistoryAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.GET_SCHEDULE_RUN_HISTORY, request);
  }

  getSchedulerRunStepsAsync(jobId: number): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_SCHEDULE_RUN_JOB_DETAILS.replace("{jobId}", jobId.toString()));
  }

  getSchedulerRunGraphsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.GET_SCHEDULE_RUN_GRAPH, request);
  }
}
