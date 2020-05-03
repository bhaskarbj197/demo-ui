/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { LogsModel } from '../../models/logs.model';
import { LogDataService } from '../data/log-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogBusinessService {

  constructor(private dataService: DataService, private logDataService:LogDataService) { }

  public addLog(msg: string, isSuccess: boolean = true){
    var newLog = new LogsModel(msg, isSuccess);
    this.dataService.logs.splice(0, 0, newLog);
    this.dataService.allLogs.splice(0, 0, newLog);
  }

  saveLogAsync(data: any): Observable<HttpResponse<any>> {
    return this.logDataService.saveLogAsync(data);
  }

  getSavedLogWithoutDateAsync(journalId: string): Observable<HttpResponse<any>> {
    return this.logDataService.getSavedLogWithoutDateAsync(journalId);
  }

  getSavedLogWithDateAsync(journalId: string, runDate: string): Observable<HttpResponse<any>> {
    return this.logDataService.getSavedLogWithDateAsync(journalId, runDate);
  }

  getProcessStepLogWithoutDateAsync(journalId: string): Observable<HttpResponse<any>> {
    return this.logDataService.getProcessStepLogWithoutDateAsync(journalId);
  }

  getProcessStepLogByDateAsync(journalId: string, runDate: string): Observable<HttpResponse<any>> {
    return this.logDataService.getProcessStepLogByDateAsync(journalId, runDate);
  }
}
