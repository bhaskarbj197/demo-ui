/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { RoleActionConverterPipe } from '../../../../pipes/role-action-converter.pipe';

@Component({
  selector: 'app-run-status-action',
  templateUrl: './run-status-action.component.html',
  styleUrls: ['./run-status-action.component.scss']
})
export class RunStatusActionComponent implements OnInit {

  @Output() activeStatusClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private dataService: DataService,
    private enumLoaderService: EnumLoaderService,
    private roleActionConverterPipe: RoleActionConverterPipe) { }

  ngOnInit() {
  }

  setStatusCss(status: string): string{
    if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.APPROVED){
      return "";
    }
    if(this.enumLoaderService.journalStatusByWorkday[status] === this.dataService.journalRunStatus){
      if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.REJECTED ||
        this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR){
        return "bc-text-active-err";
      } else {
        return "bc-text-active pointer";
      }
    }
    if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.SUBMIT_FOR_REVIEW){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.PENDING ||
        this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "bc-text-dis";
      }
    } else if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.PENDING){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "bc-text-dis";
      }
    } else if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.PENDING ||
        this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "bc-text-dis bc-text-strick";
      }
    } 
    return "";
  }

  setStatusIcon(status: string): string{
    if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.APPROVED){
      return "fa-check-circle";
    }
    if(this.enumLoaderService.journalStatusByWorkday[status] === this.dataService.journalRunStatus){
      if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.REJECTED ||
        this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR){
        return "fa fa-ban";
      } else {
        return "fa fa-circle-o";
      }
    }
    if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.SUBMIT_FOR_REVIEW){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.PENDING ||
        this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "fa fa-circle";
      }
    } else if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.PENDING){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "fa fa-circle";
      }
    } else if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR){
      if(this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.PENDING ||
        this.enumLoaderService.journalStatusByWorkday[status] === this.enumLoaderService.journalStatusByWorkday.APPROVED){
        return "fa fa-circle";
      }
    } 
    return "fa-check-circle";
  }

  isRunErrorShow(){
    return (this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR);
  }

  isRejectedShow(){
    return (this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.REJECTED);
  }

  onStatusClick(status: string){
    if(this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.APPROVED ||
      this.dataService.journalRunStatus === this.enumLoaderService.journalStatusByWorkday.REJECTED){
      return;
    }
    if(this.enumLoaderService.journalStatusByWorkday[status] === this.dataService.journalRunStatus){
      if(!this.roleActionConverterPipe.transform("workflowAction", "runStatus", this.enumLoaderService.journalStatusByWorkdayRoleAction[status])){
        this.activeStatusClick.emit();
      }
    }
  }
}
