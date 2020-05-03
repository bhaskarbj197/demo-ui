/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { FinancialMonthModel } from 'src/app/models/financialMonth.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataService } from 'src/app/services/data.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-financial-month-master',
  templateUrl: './financial-month-master.component.html',
  styleUrls: ['./financial-month-master.component.scss']
})
export class FinancialMonthMasterComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private dataService: DataService) { }

  isLoading: boolean = false;
  yearList: Array<number> = [];
  financialMonth: FinancialMonthModel = new FinancialMonthModel();
  months: Array<string> = this.handlerLoaderService.momentDateHandlerService.getFullMonthNameList();
  isSubmit: boolean = false;

  ngOnInit() {
    this.financialMonth.company = this.dataService.user.company;
    this.loadYears();
  }

  private loadYears(){
    var currentYear = (new Date()).getFullYear();
    for(var index= currentYear-2; index<= currentYear+5; index++){
      this.yearList.push(index);
    }
    this.financialMonth.year = currentYear;
    this.loadFinancialMonth();
  }

  private loadFinancialMonth(){
    this.isLoading = true;
    this.businessLoaderService.financialMonthMasterBusinessService.getFinancialMonthssMasterAsync(this.financialMonth.year, 
      this.financialMonth.company.id).subscribe(res => {
      if(res.body){
        this.financialMonth = this.businessLoaderService.financialMonthMasterBusinessService.getFinancialMonthssMaster(res.body, this.months);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private isAllDateInvalid(): boolean{
    if(this.financialMonth.months){
      for(var index=0; index<this.financialMonth.months.length; index++){
        if(!this.financialMonth.months[index].startDate['day']){
          return true;
        } else if(!this.financialMonth.months[index].endDate['day']){
          return true;
        }
      }
    }
    return false;
  }

  onYearChanged(obj: any){
    if(obj){
      this.financialMonth.year = obj.item.key;
      this.loadFinancialMonth();
    }
  }

  onSubmitBtnClick(){
    if(this.financialMonth){
      this.isLoading = true;
      this.isSubmit = true;
      if(this.isAllDateInvalid()){
        this.isLoading = false;
        return;
      }
      this.businessLoaderService.financialMonthMasterBusinessService.saveFinancialMonthssMasterAsync(this.financialMonth).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess("Financial month saved successfully.");
        }
        this.isLoading = false;
        this.isSubmit = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }
}
