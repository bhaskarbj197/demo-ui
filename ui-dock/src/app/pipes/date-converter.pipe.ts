/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common'
import { HandlerLoaderService } from '../loaders/handler-loader.service';

@Pipe({
  name: 'dateConverter'
})
export class DateConverterPipe implements PipeTransform {

  constructor(public datepipe: DatePipe,
    private handlerLoaderService: HandlerLoaderService){}

  transform(value: number|string, isTimeNeeded: boolean = true, isValueInMS: boolean = false): any {
    if(value === null || value === undefined){
      return value;
    }
    if(typeof value === "string"){
      return !value ? "" : this.handlerLoaderService.momentDateHandlerService.getDateStringFormatInDdmmyyyy(value);
    }
    if(!isValueInMS){
      value = value * 1000;
    }
    if(!isTimeNeeded){
      return !value ? "" : this.handlerLoaderService.momentDateHandlerService.getDateStringFormatInDdmmyyyy(value);
    }
    return !value ? "" : this.handlerLoaderService.momentDateHandlerService.getDateStringFormatInDdmmyyyy(value, true);
  }
}
