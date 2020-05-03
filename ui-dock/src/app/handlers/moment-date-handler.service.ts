/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentDateHandlerService {

  constructor() { }

  private setDayAndMonth(value: string): string {
    return (value.length < 2) ? "0"+value : value;
  }

  getFullMonthNameList(){
    return moment.localeData('en').months();
  }

  getDateInCorrectFormat(inputDate: any): string {
    return this.setDayAndMonth(inputDate["day"].toString()) + "-" + this.setDayAndMonth(inputDate["month"].toString()) + "-" + inputDate["year"];
  }
  
  getDateObjectFromString(dateString: string){
    var result: object = {};
    if(dateString){
      var dateParts: Array<string> = dateString.split("-");
      if(dateParts.length === 3){
        result["year"] = parseInt(dateParts[0]);
        result["month"] = parseInt(dateParts[1]);
        result["day"] = parseInt(dateParts[2]);
      }
    }
    return result;
  }

  getStringFromDateObject(date: object){
    var result: string = "";
    if(date){
      return date["year"].toString() + "-" + this.setDayAndMonth(date["month"].toString()) + "-" + this.setDayAndMonth(date["day"].toString());
    }
    return result;
  }

  getDateStringFormatInDdmmyyyy(value: string|number, isTime: boolean = false){
    if(isTime){
      return moment(value).format("DD-MM-YYYY hh:mm:ss");
    }
    return moment(value).format("DD-MM-YYYY");
  }

  getDateStringFormatInOnlyTime(value: string|number){
    return moment(value).format("hh:mm:ss");
  }

  getDaysToCompleteMonth(dateString: string): Array<number> {
    var days: Array<number> = [];
    if(dateString){
      var dateObj = this.getDateObjectFromString(dateString);
      var maxDay = moment((dateObj["year"].toString() + "-" + this.setDayAndMonth(dateObj["month"].toString())), "YYYY-MM").daysInMonth();
      for(var idx=dateObj["day"]; idx<=maxDay; idx++){
        days.push(idx);
      }
    }
    return days;
  }

  getDaysToDateOfMonth(dateString: string): Array<number> {
    var days: Array<number> = [];
    if(dateString){
      var dateObj = this.getDateObjectFromString(dateString);
      for(var idx=1; idx<=dateObj["day"]; idx++){
        days.push(idx);
      }
    }
    return days;
  }

  getAllDaysInMonth(dateString: string): Array<number> {
    var days: Array<number> = [];
    if(dateString){
      var dateObj = this.getDateObjectFromString(dateString);
      var numberOfDays: number = moment(dateObj["year"].toString() + "-" +this.setDayAndMonth(dateObj["month"].toString()), "YYYY-MM").daysInMonth();
      for(var idx=1; idx<=numberOfDays; idx++){
        days.push(idx);
      }
    }
    return days;
  }

  getAllWeekdays(): Array<string>{
    var result: Array<string> = new Array<string>();
    result = moment.weekdaysShort();
    if(result.length>0){
      result.push(result[0]);
      result.splice(0, 1);
    }
    return result;
  }

  getWeekdayShortNameByWeekdayNumber(index: number): string {
    return moment.weekdaysShort(index);
  }

  getWeekDayByDateString(dateString: string): number{
    if(dateString){
      return moment(dateString).day();
    }
    return 0;
  }

  getCurrentTimestamp(): number{
    return moment().valueOf();
  }
}
