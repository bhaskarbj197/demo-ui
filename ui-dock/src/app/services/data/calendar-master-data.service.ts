/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CalendarMasterDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getCalendarListAsync(companyId: companyIdType): Observable<HttpResponse<any>>  {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_CAL_MASTER_LIST + (companyId ? ("/" + companyId.toString()) : ""));
  }

  getCalendarYearMonthListByCalendarIdAsync(calId: number): Observable<HttpResponse<any>>  {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_CAL_YEAR_MONTH_LIST.replace("{calId}", calId.toString()));
  }

  insertCalendarWithMonthAsync(request: any): Observable<HttpResponse<any>>  {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.INSERT_CAL_MASTER, request);
  }

  getCalendarMonthsByYearAsync(calId: number, year: number): Observable<HttpResponse<any>>  {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.GET_CAL_MONTHS_BY_YEAR
        .replace("{calId}", calId.toString())
        .replace("{year}", year.toString()));
  }

  saveCalendarMonthAsync(request: any): Observable<HttpResponse<any>>  {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.SAVE_CAL_MONTH, request);
  }

  updateCalendarMasterAsync(request: any): Observable<HttpResponse<any>>  {
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.UPDATE_CAL_MASTER, request);
  }

  deleteCalendarAsync(request: any): Observable<HttpResponse<any>>  {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.DELETE_CALENDAR, request);
  }
}
