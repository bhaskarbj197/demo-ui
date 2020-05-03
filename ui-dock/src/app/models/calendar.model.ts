/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { CompanyModel } from './company.model';
import { MonthPartialModel } from './financialMonth.model';
import { Deserialize } from '../services/interfaces/deserialize';
import { PopOverMsgKeyValue } from '../components/ui/popover/popover.component';

export class CalendarModel {
    id: number;
    name: string;
    year: number;
    month: MonthPartialModel;
    isActive: boolean;
    company: CompanyModel;
    isNotManual: boolean;
    calendarMonthHolders: Array<CalendarMonthHolderModel>;

    constructor(_id: number = 0, _name: string = "", _year: number = 0, _month: MonthPartialModel = new MonthPartialModel(), 
        _isActive: boolean = true, _company: CompanyModel = new CompanyModel(), _isNotManual: boolean = true,
        _calendarMonthHolders: Array<CalendarMonthHolderModel> = new Array<CalendarMonthHolderModel>()) {
        this.id = _id;
        this.name = _name;
        this.year = _year;
        this.month = _month;
        this.isActive = _isActive;
        this.company = _company;
        this.isNotManual = _isNotManual;
        this.calendarMonthHolders = _calendarMonthHolders;
    }
}

export class CalendarPartialModel {
    id: number;
    name: string;
    isActive: boolean;
    company: CompanyModel;

    constructor(_id: number = 0, _name: string = "", _isActive: boolean = true, _company: CompanyModel = new CompanyModel()) {
        this.id = _id;
        this.name = _name;
        this.isActive = _isActive;
        this.company = _company;
    }
}

export class CalendarMonthHolderModel {
    year: number;
    month: MonthPartialModel;

    constructor(year: number = 0, month: MonthPartialModel = new MonthPartialModel()){
        this.year = year;
        this.month = month;
    }
}

export class CalendarMonthModel {
    month: MonthPartialModel;
    year: number;
    days: Array<number>;
    startWeekDayNumber: number;
    startWeekDay: string;
    dayArray: Array<Array<CalendarWorkdayModel>>;

    constructor(month: MonthPartialModel = new MonthPartialModel(), year: number = 0, days: Array<number> = [], startWeekDayNumber: number = 0, 
        startWeekDay: string = "", dayArray: Array<Array<CalendarWorkdayModel>> = new Array<Array<CalendarWorkdayModel>>()) {
        this.month = month;
        this.year = year;
        this.days = days;
        this.startWeekDayNumber = startWeekDayNumber;
        this.startWeekDay = startWeekDay;
        this.dayArray = dayArray;
    }
}

export class CalendarWorkdayModel {
    day: number;
    workday: string;
    isWorkday: boolean;

    constructor(day: number = 0, workday: string = "", isWorkday: boolean = true){
        this.day = day;
        this.workday = workday;
        this.isWorkday = isWorkday;
    }
}

export class CalendarDetailModel {
    id: number;
    name: string;
    company: CompanyModel;
    yearMonthDetail: Array<CalendarYearMonthModel>;

    constructor(id: number = 0, name: string = "", company: CompanyModel = new CompanyModel(),
        yearMonthDetail: Array<CalendarYearMonthModel> = new Array<CalendarYearMonthModel>()){
        this.id = id;
        this.name = name;
        this.company = company;
        this.yearMonthDetail = yearMonthDetail;
    }
}

export class CalendarYearMonthModel {
    year: number;
    month: MonthPartialModel;
    workday0: string;

    constructor(year: number = 0, month: MonthPartialModel = new MonthPartialModel(), workday0: string = ""){
        this.year = year;
        this.month = month;
        this.workday0 = workday0;
    }
}

export class CalendarMonthByYearResponseModel {
    calendarId: number;
    months: Array<CalendarMonthByYearModel>;
    year: number;

    constructor(calendarId: number = 0, months: Array<CalendarMonthByYearModel> = new Array<CalendarMonthByYearModel>(), year: number = 0){
        this.calendarId = calendarId;
        this.months = months;
        this.year = year;
    }
}

export class CalendarMonthByYearModel {
    month: MonthPartialModel;
    dates: Array<WorkdayDateModel>;

    constructor(month: MonthPartialModel = new MonthPartialModel()){
        this.month = month;
        this.dates = new Array<WorkdayDateModel>();
    }
}

export class WorkdayDateModel {
    workDate: string;
    workday: string;

    constructor(workDate: string = "", workday: string = ""){
        this.workDate = workDate;
        this.workday = workday;
    }
}

export class BulkCalendarMasterModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        this.isValid = this.validationStatus === "Failed" ? false : true;
        this.failedReasons = this.findValidationMessages(this.validationFailReason);
        return this;
    }

    private findValidationMessages(failedReasons: Array<Object>) {
        var messages: Array<PopOverMsgKeyValue> = [];
        var keys = Object.keys(this);
        var rIndex: number = -1;
        for(var index=0; index < keys.length ; index++) {          
          rIndex = failedReasons.findIndex(data => data[keys[index]]);
          if(rIndex >= 0) {
            messages.push(new PopOverMsgKeyValue(keys[index], failedReasons[rIndex][keys[index]]));
          }
        }
        return messages;
    }

    calendarName: string;
    companyName: string;
    month: string;
    validationFailReason: Array<Object>;
    failedReasons: Array<PopOverMsgKeyValue>;
    isValid: boolean;
    validationStatus: string;
    wd0YyyyMmDd: number;
    year: number;
    serialId: number;                                                       
}