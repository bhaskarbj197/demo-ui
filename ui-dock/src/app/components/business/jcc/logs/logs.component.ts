/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LogsModel, LogTypeModel } from 'src/app/models/logs.model';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  @Input() logs: Array<LogsModel> = [];
  @Input() stepLogs: Array<LogsModel> = [];
  @Input() isLogsAvailable: boolean = true;



  @Output() stepLogClick: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  logTypeList: Array<LogTypeModel> = [{id: 1, name: "Logs", isActive: true}, {id: 2, name: "Step Logs", isActive: false}];

  ngOnInit() {
  }

  onTabClick(logType: LogTypeModel){
    if(this.logTypeList.findIndex(l => l.id === logType.id && logType.isActive) > -1){
      return;
    }
    this.logTypeList.findIndex(l => l.isActive = false);
    logType.isActive = true;
    if(logType.id == 2) {
      this.stepLogClick.emit();
    }
  }

  isLogDetailsShowWithId(id: number){
    return (this.logTypeList.findIndex(l => l.id === id && l.isActive) > -1);
  }
}
