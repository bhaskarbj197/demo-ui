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
import { CalendarMasterDataService } from '../data/calendar-master-data.service';
import { CalendarPartialModel, CalendarYearMonthModel, CalendarModel, CalendarMonthModel, 
  CalendarWorkdayModel, CalendarMonthByYearResponseModel, CalendarMonthByYearModel, WorkdayDateModel } from 'src/app/models/calendar.model';
import { CompanyModel } from 'src/app/models/company.model';
import { MonthPartialModel } from 'src/app/models/financialMonth.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { companyIdType } from '../types';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarMasterBusinessService {

  constructor(private calendarMasterData: CalendarMasterDataService,
    private constantLoaderService: ConstantLoaderService,
    private dataService: DataService) { }

  private setWorkdayDates(calendarMonths: Array<CalendarMonthModel>): Array<object>{
    var workdayDates = new Array<{workDay: string, workDate: String}>();
    if(calendarMonths){
      for(var index=0; index<calendarMonths.length; index++){
        if(calendarMonths[index].dayArray){
          for(var cnt=0; cnt<calendarMonths[index].dayArray.length; cnt++){
            var dArr = calendarMonths[index].dayArray[cnt];
            for(var dCnt=0; dCnt<dArr.length; dCnt++){
              var cWd: CalendarWorkdayModel = new CalendarWorkdayModel();
              cWd = dArr[dCnt];
              if(cWd.isWorkday && cWd.workday.length>0){
                workdayDates.push({
                  workDay: cWd.workday,
                  workDate: ((cWd.day.toString().length<2 ? "0" : "") + cWd.day.toString()) + "-" + 
                    ((calendarMonths[index].month.monthNumber.toString().length<2 ? "0" : "") + calendarMonths[index].month.monthNumber.toString()) 
                    + "-" + calendarMonths[index].year.toString()
                });
              }
            }
          }
        }
      }
    }
    return workdayDates;
  }

  getCalendarListAsync(): Observable<HttpResponse<any>> {
    var companyId: companyIdType = this.dataService.user.role.isPlatformAdmin ? null : (this.dataService.user.company.id as any);
    return this.calendarMasterData.getCalendarListAsync(companyId);
  }

  getCalendarList(response: any): Array<CalendarPartialModel>{
    var result: Array<CalendarPartialModel> = new Array<CalendarPartialModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var cal: CalendarPartialModel = new CalendarPartialModel();
        cal.id = response[index].calendarId;
        cal.name = response[index].name;
        cal.isActive = response[index].isActive;
        cal.company = new CompanyModel(response[index].companyId, response[index].companyName);
        result.push(cal);
      }
    }
    return result;
  }

  getCalendarYearMonthListByCalendarIdAsync(calId: number): Observable<HttpResponse<any>> {
    return this.calendarMasterData.getCalendarYearMonthListByCalendarIdAsync(calId);
  }

  getCalendarYearMonthListByCalendarId(response: any): Array<CalendarYearMonthModel> {
    var result: Array<CalendarYearMonthModel> = new Array<CalendarYearMonthModel>();
    if(response && response.data){
      for(var index=0; index<response.data.length; index++){
        if(response.data[index].months){
          for(var cnt=0; cnt<response.data[index].months.length; cnt++){
            var yMonth: CalendarYearMonthModel = new CalendarYearMonthModel();
            yMonth.year = response.data[index].year;
            yMonth.month = new MonthPartialModel(response.data[index].months[cnt].monthName, response.data[index].months[cnt].monthNo);
            yMonth.workday0 = (response.data[index].months[cnt].workDay === 
              (this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH + "0")) ? response.data[index].months[cnt].workDate : "";
            result.push(yMonth);
          }
        }
      }
    }
    return result;
  }

  insertCalendarWithMonthAsync(calendarInfo: CalendarModel, calendarMonths: Array<CalendarMonthModel>): Observable<HttpResponse<any>> {
    var request: any = {};
    request.calendarId = calendarInfo.id;
    request.name = calendarInfo.name;
    request.companyId = calendarInfo.company.id;
    request.isActive = calendarInfo.isActive;
    request.year = calendarInfo.year;
    request.month = calendarInfo.month.name;
    request.dates = this.setWorkdayDates(calendarMonths);
    return this.calendarMasterData.insertCalendarWithMonthAsync(request);
  }

  getCalendarMonthsByYearAsync(calId: number, year: number): Observable<HttpResponse<any>> {
    return this.calendarMasterData.getCalendarMonthsByYearAsync(calId, year);
  }

  getCalendarMonthsByYear(response: any): CalendarMonthByYearResponseModel {
    var result: CalendarMonthByYearResponseModel = new CalendarMonthByYearResponseModel();
    if(response){
      result.calendarId = response.calendarId;
      result.year = response.year;
      result.months = [];
      if(response.months){
        for(var index=0; index<response.months.length; index++){
          var mYear: CalendarMonthByYearModel = new CalendarMonthByYearModel();
          mYear.month = new MonthPartialModel();
          mYear.month.name = response.months[index].monthName;
          mYear.month.monthNumber = response.months[index].monthNo;
          mYear.dates = [];
          if(response.months[index].dates){
            for(var cnt=0; cnt<response.months[index].dates.length; cnt++){
              var dt: WorkdayDateModel = new WorkdayDateModel();
              dt.workDate = response.months[index].dates[cnt].workDateList;
              dt.workday = response.months[index].dates[cnt].workDay;
              mYear.dates.push(dt);
            }
          }
          result.months.push(mYear);
        }
      }
    }
    return result;
  }

  saveCalendarMonthAsync(calendarInfo: CalendarModel, calendarMonths: Array<CalendarMonthModel>): Observable<HttpResponse<any>> {
    var request: any = {};
    request.calendarId = calendarInfo.id;
    request.year = calendarInfo.year;
    request.monthNo = calendarInfo.month.monthNumber;
    request.dates = this.setWorkdayDates(calendarMonths);
    return this.calendarMasterData.saveCalendarMonthAsync(request);
  }

  updateCalendarMasterAsync(calId: number, isActive: boolean): Observable<HttpResponse<any>> {
    var request: any = {
      calendarId: calId,
      isActive: isActive
    };
    return this.calendarMasterData.updateCalendarMasterAsync(request);
  }

  deleteCalendarAsync(calendarId: number): Observable<HttpResponse<any>> {
    var request: any = {
      calendarId: calendarId
    };
    return this.calendarMasterData.deleteCalendarAsync(request);
  }
}
