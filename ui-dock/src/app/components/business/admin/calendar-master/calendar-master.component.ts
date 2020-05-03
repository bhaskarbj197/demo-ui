/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { CalendarModel, CalendarMonthModel, CalendarWorkdayModel, CalendarMonthHolderModel, CalendarPartialModel, 
  CalendarDetailModel, CalendarYearMonthModel, CalendarMonthByYearResponseModel } from 'src/app/models/calendar.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { MonthPartialModel, MonthModel } from 'src/app/models/financialMonth.model';
import { HandlerLoaderService } from '../../../../loaders/handler-loader.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-calendar-master',
  templateUrl: './calendar-master.component.html',
  styleUrls: ['./calendar-master.component.scss']
})
export class CalendarMasterComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private dataService: DataService) { }

  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.CALENDAR_MASTER_0, 
    this.constantLoaderService.tabListTextsService.CALENDAR_MASTER_1];
  activeTab: string = this.tabList[0];
  isSubmit: boolean = false;
  calendarInfo: CalendarModel = new CalendarModel();
  yearList: Array<number> = [];
  monthList: Array<MonthPartialModel> = new Array<MonthPartialModel>();
  monthArrayByYearCompany: Array<MonthModel> = new Array<MonthModel>();
  monthSelected: MonthModel = new MonthModel();
  calendarMonths: Array<CalendarMonthModel> = new Array<CalendarMonthModel>();
  weekDays: Array<string> = this.handlerLoaderService.momentDateHandlerService.getAllWeekdays();
  workdayList: Array<string> = new Array<string>();
  monthMarkedKeyList: Array<string> = [];
  calendarList: Array<CalendarPartialModel> = new Array<CalendarPartialModel>();
  calendarDetail: CalendarDetailModel = new CalendarDetailModel();
  calendarMonthsByYear: CalendarMonthByYearResponseModel = new CalendarMonthByYearResponseModel();
  errorMsg: string = "";
  deletingCalendarId: number = 0;

  minWorkday: number = this.constantLoaderService.defaultValuesService.WORKDAY_START;
  maxWorkday: number = this.constantLoaderService.defaultValuesService.WORKDAY_END;
  workdayText: string = this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH;

  ngOnInit() {
    this.loadCalendarList();
    this.calendarInfo.company = this.dataService.user.company;
    this.loadYears();
    this.loadWorkday();
  }

  private loadCalendarList(){
    this.isLoading = true;
    this.businessLoaderService.calendarMasterBusinessService.getCalendarListAsync().subscribe(res => {
      if(res.body){
        this.calendarList = this.businessLoaderService.calendarMasterBusinessService.getCalendarList(res.body);
      }
      this.isLoading = false;
    }, err => { 
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadWorkday(){
    for(var index=this.minWorkday; index<=this.maxWorkday; index++){
      this.workdayList.push(this.workdayText + index.toString());
    }
  }

  private loadYears(){
    var currentYear = (new Date()).getFullYear();
    for(var index= currentYear-2; index<= currentYear+5; index++){
      this.yearList.push(index);
    }
  }

  loadMonths(){
    this.monthMarkedKeyList = [];
    this.monthList = [];
    var months: Array<string> = this.handlerLoaderService.momentDateHandlerService.getFullMonthNameList();
    for(var index=0; index<months.length; index++){
      var mnth = new MonthPartialModel();
      mnth.name = months[index];
      mnth.monthNumber = index + 1;
      if(this.calendarInfo.calendarMonthHolders.length > 0 && this.calendarInfo.year > 0){
        if(this.calendarInfo.calendarMonthHolders.findIndex(c => c.year === this.calendarInfo.year && c.month.monthNumber === mnth.monthNumber) > -1){
          this.monthMarkedKeyList.push(mnth.monthNumber.toString());
        }
      }
      this.monthList.push(mnth);
    }
  }

  private loadFinancialMonth(yMonth: CalendarYearMonthModel = null){
    if(!this.calendarInfo.year || !this.calendarInfo.company.id){
      return;
    }
    if(this.calendarInfo.year === 0 || this.calendarInfo.company.id === null){
      return;
    }
    this.isLoading = true;
    this.monthArrayByYearCompany = [];
    this.businessLoaderService.financialMonthMasterBusinessService.getFinancialMonthssMasterAsync(this.calendarInfo.year, 
      this.calendarInfo.company.id).subscribe(res => {
      if(res.body && res.body.months){
        for(var index=0; index<res.body.months.length; index++){
          var mnth: MonthModel = new MonthModel();
          mnth.id = res.body.months[index].id;
          mnth.name = res.body.months[index].name;
          mnth.monthNumber = res.body.months[index].monthNo;
          mnth.startDate = res.body.months[index].newStartDate;
          mnth.endDate = res.body.months[index].newEndDate;
          this.monthArrayByYearCompany.push(mnth);
        }
        this.calendarInfo.month = new MonthPartialModel("", 0);
        this.calendarMonths = new Array<CalendarMonthModel>();
        if(yMonth){
          this.loadMonthWithDates(yMonth, true);
        }
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 2500);
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadMonthWithDates(yMonth: CalendarYearMonthModel = null, isLoadingCont: boolean = false){
    this.calendarInfo.month = new MonthPartialModel(yMonth.month.name, yMonth.month.monthNumber);
    this.loadMonthSelected();
    this.businessLoaderService.calendarMasterBusinessService.getCalendarMonthsByYearAsync(this.calendarDetail.id, yMonth.year).subscribe(res => {
      if(res.body){
        this.calendarMonthsByYear = this.businessLoaderService.calendarMasterBusinessService.getCalendarMonthsByYear(res.body);
        if(this.calendarMonths && this.calendarMonthsByYear && this.calendarMonthsByYear.months){
          for(var idx=0; idx<this.calendarMonthsByYear.months.length; idx++){
            this.loadMonthHolder(this.calendarMonthsByYear.year, this.calendarMonthsByYear.months[idx].month);
            for(var cnt=0; cnt<this.calendarMonths.length; cnt++){
              for(var dCnt=0; dCnt<this.calendarMonthsByYear.months[idx].dates.length; dCnt++){
                for(var cntArr=0; cntArr<this.calendarMonths[cnt].dayArray.length; cntArr++){
                  for(var indArr=0; indArr<this.calendarMonths[cnt].dayArray[cntArr].length; indArr++){
                    var dt: object = {day: Number, month: Number, year: Number};
                    dt["day"] = (this.calendarMonths[cnt].dayArray[cntArr])[indArr].day;
                    dt["month"] = this.calendarMonths[cnt].month.monthNumber;
                    dt["year"] = this.calendarMonths[cnt].year;
                    if(this.calendarMonthsByYear.months[idx].dates[dCnt].workDate === this.handlerLoaderService.momentDateHandlerService.getDateInCorrectFormat(dt)){
                      (this.calendarMonths[cnt].dayArray[cntArr])[indArr].workday = this.calendarMonthsByYear.months[idx].dates[dCnt].workday;
                    }
                  }
                }
              }
            }
          }
        }
        this.activeTab = this.tabList[1];
      }
      if(!isLoadingCont){
        this.isLoading = false;
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadMonthSelected(){
    this.errorMsg = "";
    if(this.calendarInfo.month.monthNumber && this.calendarInfo.month.monthNumber>0){
      if(this.monthArrayByYearCompany){
        this.monthSelected = this.monthArrayByYearCompany.find(m => m.monthNumber === this.calendarInfo.month.monthNumber);

        if(this.monthSelected === undefined){
          this.errorMsg = "Financial month is not configured. Please configure the financial month first!";
          return;
        }

        var startMonth: number = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(this.monthSelected.startDate as string)["month"];
        var endMonth: number = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(this.monthSelected.endDate as string)["month"];
        this.calendarMonths = new Array<CalendarMonthModel>();
        if(startMonth === endMonth){
          var calendarMonth: CalendarMonthModel = new CalendarMonthModel();
          calendarMonth.year = this.calendarInfo.year;
          calendarMonth.month = new MonthPartialModel(this.monthSelected.name, this.monthSelected.monthNumber);
          var startDay: number = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(this.monthSelected.startDate as string)["day"];
          var endDay: number = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(this.monthSelected.endDate as string)["day"];
          for(var idx=startDay; idx<=endDay; idx++){
            calendarMonth.days.push(idx);
          }
          calendarMonth.startWeekDayNumber = this.handlerLoaderService.momentDateHandlerService.getWeekDayByDateString(this.monthSelected.startDate as string);
          calendarMonth.startWeekDay = this.handlerLoaderService.momentDateHandlerService.getWeekdayShortNameByWeekdayNumber(calendarMonth.startWeekDayNumber);
          this.calendarMonths.push(calendarMonth);
        } else {
          var processEndMonth: number = (startMonth > endMonth) ? (endMonth + 12) : endMonth;
          for(var cnt=startMonth; cnt<=processEndMonth; cnt++){
            var calendarMonth: CalendarMonthModel = new CalendarMonthModel();
            calendarMonth.year = this.calendarInfo.year;
            var actualMonthNumber: number = ((startMonth > endMonth) && (cnt > 12)) ? (cnt - 12) : cnt;
            calendarMonth.month = new MonthPartialModel(this.monthList.find(m => m.monthNumber === actualMonthNumber).name, actualMonthNumber);
            if(cnt === startMonth){
              calendarMonth.days = this.handlerLoaderService.momentDateHandlerService.getDaysToCompleteMonth(this.monthSelected.startDate as string);
              calendarMonth.startWeekDayNumber = this.handlerLoaderService.momentDateHandlerService.getWeekDayByDateString(this.monthSelected.startDate as string);
              calendarMonth.startWeekDay = this.handlerLoaderService.momentDateHandlerService.getWeekdayShortNameByWeekdayNumber(calendarMonth.startWeekDayNumber);
            } else if (cnt === processEndMonth) {
              calendarMonth.days = this.handlerLoaderService.momentDateHandlerService.getDaysToDateOfMonth(this.monthSelected.endDate as string);
              var endMonthDateObj = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(this.monthSelected.endDate as string);
              endMonthDateObj["day"] = 1;
              var endMonthDate = this.handlerLoaderService.momentDateHandlerService.getStringFromDateObject(endMonthDateObj);
              calendarMonth.startWeekDayNumber = this.handlerLoaderService.momentDateHandlerService.getWeekDayByDateString(endMonthDate as string);
              calendarMonth.startWeekDay = this.handlerLoaderService.momentDateHandlerService.getWeekdayShortNameByWeekdayNumber(calendarMonth.startWeekDayNumber);
            } else{
              calendarMonth.days = this.handlerLoaderService.momentDateHandlerService.getAllDaysInMonth(this.monthSelected.endDate as string);
            }
            
            this.calendarMonths.push(calendarMonth);
          }
        }
      }
    }
    this.processDays();
  }

  private processDays(){
    for(var index=0; index<this.calendarMonths.length; index++){
      if(this.calendarMonths[index].startWeekDayNumber > 1){
        for(var cnt=1; cnt<this.calendarMonths[index].startWeekDayNumber; cnt++){
          this.calendarMonths[index].days.splice(0, 0, 0);
        }
      }
      var dayArr: Array<CalendarWorkdayModel> = new Array<CalendarWorkdayModel>();
      var dayArrays: Array<Array<CalendarWorkdayModel>> = new Array<Array<CalendarWorkdayModel>>();
      for(var cnt=0; cnt<this.calendarMonths[index].days.length; cnt++){
        dayArr.push(new CalendarWorkdayModel(this.calendarMonths[index].days[cnt], "", true));
        if((cnt+1) % 7 === 0){
          dayArrays.push(dayArr);
          dayArr = new Array<CalendarWorkdayModel>();
        } else if((this.calendarMonths[index].days.length - 1) === cnt){
          if(dayArr.length < 7){
            var len = dayArr.length;
            for(var idx=0; idx<(7-len); idx++){
              dayArr.push(new CalendarWorkdayModel(0, "", false));
            }
          }
          dayArrays.push(dayArr);
          dayArr = new Array<CalendarWorkdayModel>();
        }
      }
      this.calendarMonths[index].dayArray = dayArrays;
    }
  }

  private resetCalendar(calendarMonths: Array<CalendarMonthModel>){
    for(var indx=0; indx<calendarMonths.length; indx++){
      for(var dCnt=0; dCnt<calendarMonths[indx].dayArray.length; dCnt++){
        var dArr: Array<CalendarWorkdayModel> = calendarMonths[indx].dayArray[dCnt];
        for(var ddCnt=0; ddCnt<dArr.length; ddCnt++){
          dArr[ddCnt].workday = "";
        }
      }
    }
  }

  private loadMonthHolder(year: number = 0, month: MonthPartialModel = new MonthPartialModel("", 0)){
    var calendarMonthHolder: CalendarMonthHolderModel = new CalendarMonthHolderModel();
    if(year>0 && month.monthNumber>0){
      calendarMonthHolder.year = year;
      calendarMonthHolder.month = month;
    } else {
      calendarMonthHolder.year = this.calendarInfo.year;
      calendarMonthHolder.month = this.calendarInfo.month;
    }
    if(this.calendarInfo.calendarMonthHolders.findIndex(c => c.year === calendarMonthHolder.year && 
      c.month.monthNumber === calendarMonthHolder.month.monthNumber) === -1){
      this.calendarInfo.calendarMonthHolders.push(calendarMonthHolder);
    }
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      this.onResetCalendar();
    }
  }

  onSetActiveClick() {
    this.calendarInfo.isActive = !this.calendarInfo.isActive;
  }

  onYearChanged(obj: any){
    if(obj){
      this.calendarInfo.year = obj.item.key;
      this.errorMsg = "";
      this.loadMonths();
      this.loadFinancialMonth();
    }
  }

  onMonthChanged(obj: any){
    if(obj){
      this.calendarInfo.month = new MonthPartialModel(obj.item.name, obj.item.monthNumber);
      this.loadMonthWithDates(new CalendarYearMonthModel(this.calendarInfo.year, this.calendarInfo.month));
      this.loadMonthHolder();
    }
  }

  onWorkdayChanged(day: CalendarWorkdayModel, obj: any, month: CalendarMonthModel, calendarMonths: Array<CalendarMonthModel>){
    if(obj){
      if(!this.calendarInfo.isNotManual){
        day.workday = obj.item.key;
        return;
      }
      this.resetCalendar(calendarMonths);
      day.workday = obj.item.key;

      var setMinWorkday: number = parseInt(day.workday.replace(this.workdayText, ""));
      setMinWorkday = setMinWorkday - 1;
      var isDayfound: boolean = false;
      var isMonthFound: boolean = false;
      for(var idx=(calendarMonths.length-1); idx>=0; idx--){
        if(calendarMonths[idx].month.monthNumber === month.month.monthNumber){
          isMonthFound = true;
        }
        if(isMonthFound){
          var mnth: CalendarMonthModel = calendarMonths[idx];
          for(var index=(mnth.dayArray.length-1); index>=0; index--){
            var dArr: Array<CalendarWorkdayModel> = mnth.dayArray[index];
            for(var cnt=(dArr.length - 1); cnt>=0; cnt--){
              if(isDayfound && (setMinWorkday>=this.minWorkday)){
                if(dArr[cnt].isWorkday && dArr[cnt].day>0){
                  dArr[cnt].workday = this.workdayText + (setMinWorkday).toString();
                  setMinWorkday = setMinWorkday - 1;
                }
              }
              if(dArr[cnt].day === day.day){
                isDayfound = true;
              }
            }
          }
        }
      }

      var setMaxWorkday: number = parseInt(day.workday.replace(this.workdayText, ""));
      setMaxWorkday = setMaxWorkday + 1;
      var isDayfound: boolean = false;
      var isMonthFound: boolean = false;
      for(var idx=0; idx<calendarMonths.length; idx++){
        if(calendarMonths[idx].month.monthNumber === month.month.monthNumber){
          isMonthFound = true;
        }
        if(isMonthFound){
          var mnth: CalendarMonthModel = calendarMonths[idx];
          for(var index=0; index<mnth.dayArray.length; index++){
            var dArr: Array<CalendarWorkdayModel> = mnth.dayArray[index];
            for(var cnt=0; cnt<dArr.length; cnt++){
              if(isDayfound && (setMaxWorkday<=this.maxWorkday)){
                if(dArr[cnt].isWorkday && dArr[cnt].day>0){
                  dArr[cnt].workday = this.workdayText + (setMaxWorkday).toString();
                  setMaxWorkday = setMaxWorkday + 1;
                }
              }
              if(dArr[cnt].day === day.day){
                isDayfound = true;
              }
            }
          }
        }
      }
    }
  }

  onWorkdayAvailableClick(day: CalendarWorkdayModel, calendarMonths: Array<CalendarMonthModel>){
    day.isWorkday = !day.isWorkday;
    if(!day.isWorkday && day.workday !== ""){
      this.resetCalendar(calendarMonths);
    }
  }

  onSetManualClick(){
    this.calendarInfo.isNotManual = !this.calendarInfo.isNotManual;
  }

  onResetCalendar(){
    this.calendarInfo = new CalendarModel();
    this.calendarInfo.company = this.dataService.user.company;
    this.calendarMonths = new Array<CalendarMonthModel>();
    this.errorMsg = "";
  }

  onSubmitCalendar(){
    if(this.calendarInfo.name === null || this.calendarInfo.name === undefined || this.calendarInfo.name.trim().length === 0){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select calendar name!");
      return;
    }
    if(this.errorMsg.trim().length > 0){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please configure the financial month first!");
      return;
    }
    if(this.calendarInfo.year === null || this.calendarInfo.year === undefined || this.calendarInfo.year === 0){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select calendar year!");
      return;
    }
    if(this.calendarInfo.month === null || this.calendarInfo.month === undefined || this.calendarInfo.month.monthNumber === 0){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select calendar month!");
      return;
    }
    if(this.calendarInfo === undefined){
      return;
    }
    if(!this.calendarInfo.company.id || this.calendarInfo.name.trim() === "" || !this.calendarInfo.company.id){
      return;
    }
    this.isSubmit = true;
    this.isLoading = true;
    if(this.calendarInfo.id === 0){
      this.businessLoaderService.calendarMasterBusinessService.insertCalendarWithMonthAsync(this.calendarInfo, this.calendarMonths).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess("Calendar is created successfully.");
          this.loadCalendarList();
        }
        this.isLoading = false;
        this.isSubmit = false;
        this.onChangedActiveTab({activeTab: this.tabList[0]});
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      this.businessLoaderService.calendarMasterBusinessService.saveCalendarMonthAsync(this.calendarInfo, this.calendarMonths).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess("Calendar is updated successfully.");
        }
        this.isLoading = false;
        this.isSubmit = false;
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
    this.loadMonthHolder();
    this.loadMonths();
  }

  getLockIcon(calendar: CalendarPartialModel): string{
    if(calendar.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onUpdateActivity(calendar: CalendarPartialModel){
    if(calendar){
      this.isLoading = true;
      this.businessLoaderService.calendarMasterBusinessService.updateCalendarMasterAsync(calendar.id, !calendar.isActive).subscribe(res => {
        if(res.body && res.body.isSuccess){
          calendar.isActive = !calendar.isActive;
          this.handlerLoaderService.notificationHandlerService.showSuccess("Calendar is updated successfully.");
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onCalendarYearMonthClick(calendar: CalendarPartialModel){
    if(calendar){
      this.isLoading = true;
      this.businessLoaderService.calendarMasterBusinessService.getCalendarYearMonthListByCalendarIdAsync(calendar.id).subscribe(res => {
        if(res.body){
          this.calendarDetail.id = calendar.id;
          this.calendarDetail.name = calendar.name;
          this.calendarDetail.company = calendar.company;
          this.calendarDetail.yearMonthDetail = this.businessLoaderService.calendarMasterBusinessService.getCalendarYearMonthListByCalendarId(res.body);
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onEditCalendarClick(yMonth: CalendarYearMonthModel){
    if(!yMonth){
      return;
    }
    this.calendarInfo.id = JSON.parse(JSON.stringify(this.calendarDetail.id));
    this.calendarInfo.name = JSON.parse(JSON.stringify(this.calendarDetail.name));
    this.calendarInfo.company = JSON.parse(JSON.stringify(this.calendarDetail.company));
    this.calendarInfo.year = JSON.parse(JSON.stringify(yMonth.year));
    this.loadMonths();
    this.loadFinancialMonth(yMonth);
  }

  onDeleteCalendarClick(calId: number, isConfirm: boolean){
    if(isConfirm === null){
      this.deletingCalendarId = calId;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.calendarMasterBusinessService.deleteCalendarAsync(calId).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.deletingCalendarId = 0;
          this.loadCalendarList();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Caledar is deleted successfully.");
          this.isLoading = false;
        } else {
          var msg: string = "Caledar is using";
          if(res.body.jidList){
            msg += " by " + res.body.jidList.length.toString() + " journal(s)!";
          }
          this.handlerLoaderService.notificationHandlerService.showWarning(msg);
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else{
      this.deletingCalendarId = 0;
    }
  }
}