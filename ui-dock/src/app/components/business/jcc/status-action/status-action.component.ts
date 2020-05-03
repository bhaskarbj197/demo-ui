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
  selector: 'app-status-action',
  templateUrl: './status-action.component.html',
  styleUrls: ['./status-action.component.scss']
})
export class StatusActionComponent implements OnInit {

  @Output() activeStatusClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private dataService: DataService,
    private enumLoaderService: EnumLoaderService,
    private roleActionConverterPipe: RoleActionConverterPipe) { }

  ngOnInit() {
  }

  setStatusCss(status: string): string{
    if(this.dataService.journalStatus === ""){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.CREATED){
        return "bc-text-active pointer";
      } else{
        return "bc-text-dis";
      }
    }
    if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.APPROVED){
      return "";
    }
    if(this.enumLoaderService.journalStatuses[status] === this.dataService.journalStatus){
      return "bc-text-active pointer";
    }
    if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.IN_PROGRESS ||
      this.dataService.journalStatus === this.enumLoaderService.journalStatuses.RETURNED){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.PENDING_APPROVAL ||
        this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.APPROVED){
        return "bc-text-dis";
      }
    } else if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.PENDING_APPROVAL){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.APPROVED){
        return "bc-text-dis";
      }
    }
    return "";
  }

  setStatusIcon(status: string): string{
    if(this.dataService.journalStatus === ""){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.CREATED){
        return "fa fa-circle-o";
      } else{
        return "fa fa-circle";
      }
    }
    if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.APPROVED){
      return "fa-check-circle";
    }
    if(this.enumLoaderService.journalStatuses[status] === this.dataService.journalStatus){
      return "fa fa-circle-o";
    }
    if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.IN_PROGRESS ||
      this.dataService.journalStatus === this.enumLoaderService.journalStatuses.RETURNED){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.PENDING_APPROVAL ||
        this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.APPROVED){
        return "fa fa-circle";
      } 
    } else if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.PENDING_APPROVAL){
      if(this.enumLoaderService.journalStatuses[status] === this.enumLoaderService.journalStatuses.APPROVED){
        return "fa fa-circle";
      } 
    }
    return "fa-check-circle";
  }

  isReturnedShow(): boolean{
    return (this.dataService.journalStatus === this.enumLoaderService.journalStatuses.RETURNED)
  }

  onStatusClick(status: string){
    if(this.dataService.journalStatus === this.enumLoaderService.journalStatuses.APPROVED){
      return;
    }
    if(this.enumLoaderService.journalStatuses[status] === this.dataService.journalStatus){
      if(!this.roleActionConverterPipe.transform("workflowAction", "journalStatus", this.enumLoaderService.journalStatusRoleAction[status])){
        this.activeStatusClick.emit();
      }
    }
  }
}
