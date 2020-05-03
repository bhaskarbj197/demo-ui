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
import { FinancialMonthMasterDataService } from '../data/financial-month-master-data.service';
import { FinancialMonthModel, MonthModel } from 'src/app/models/financialMonth.model';
import { HandlerLoaderService } from '../../loaders/handler-loader.service';
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FinancialMonthMasterBusinessService {

  constructor(private financialMonthMasterData: FinancialMonthMasterDataService,
    private handlerLoaderService: HandlerLoaderService) { }

  getFinancialMonthssMasterAsync(year: number, companyId: companyIdType): Observable<HttpResponse<any>> {
    var request: any = {
      year: year,
      companyId: companyId
    };
    return this.financialMonthMasterData.getFinancialMonthssMasterAsync(request);
  }

  getFinancialMonthssMaster(response: any, monthNames: Array<string>): FinancialMonthModel {
    var financialMonth: FinancialMonthModel = new FinancialMonthModel();
    if(response){
      financialMonth.year = response.year;
      financialMonth.company.id = response.companyId;
      financialMonth.months = new Array<MonthModel>();
      if(response.months && response.months.length > 0){
        for(var index=0; index<response.months.length; index++){
          var month: MonthModel = new MonthModel();
          month.id = response.months[index].id;
          month.monthNumber = response.months[index].monthNo;
          if(monthNames[response.months[index].monthNo - 1]){
            month.name = monthNames[response.months[index].monthNo - 1];
          }
          month.startDate = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(response.months[index].newStartDate);
          month.endDate = this.handlerLoaderService.momentDateHandlerService.getDateObjectFromString(response.months[index].newEndDate);
          financialMonth.months.push(month);
        }
      } else {
        for(var index=0; index<monthNames.length; index++){
          var month: MonthModel = new MonthModel();
          month.id = 0;
          month.monthNumber = index + 1;
          month.name = monthNames[index];
          month.startDate = {};
          month.endDate = {};
          financialMonth.months.push(month);
        }
      }
    }
    return financialMonth;
  }

  saveFinancialMonthssMasterAsync(financialMonth: FinancialMonthModel): Observable<HttpResponse<any>> {
    var request: any = {};
    request.year = financialMonth.year;
    request.companyId = financialMonth.company.id;
    request.months = [];
    for(var index=0; index<financialMonth.months.length; index++){
      var req: any = {};
      req.id = financialMonth.months[index].id;
      req.name = financialMonth.months[index].name;
      req.startDate = this.handlerLoaderService.momentDateHandlerService.getStringFromDateObject(financialMonth.months[index].startDate as object);
      req.endDate = this.handlerLoaderService.momentDateHandlerService.getStringFromDateObject(financialMonth.months[index].endDate as object);
      request.months.push(req);
    }
    return this.financialMonthMasterData.saveFinancialMonthssMasterAsync(request);
  }
}
