/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RunHistoryModel } from '../../../../models/runHistory.model';

@Component({
  selector: 'app-run-history-logs',
  templateUrl: './run-history-logs.component.html',
  styleUrls: ['./run-history-logs.component.scss']
})
export class RunHistoryLogsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() historyLogs: Array<RunHistoryModel> = [];
  @Input() selectedRunHistoryDate: string = "";

  @Output() runDateClick: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

  onRunDateClick(log: RunHistoryModel){
    this.runDateClick.emit({
      log: log
    });
  }
}
