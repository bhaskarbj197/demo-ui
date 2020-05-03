
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
import { HomeDataService } from '../data/home-data.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class HomeBusinessService {

  constructor(private homeData: HomeDataService,
    private generalUtility: GeneralUtility) { }

  getJournalListAsync(tableConfig: TableConfigModel, journalStatus: string, runStatus: string, 
    category: string = "", month: number): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.monthNo= month;
    request.journalStatus = journalStatus;
    request.runStatus = runStatus;
    request.cat = category;
    return this.homeData.getJournalListAsync(request);
  }

  deleteJournalById(journalId: journalIdType): Observable<HttpResponse<any>> {
    var request = { jid: journalId };
    return this.homeData.deleteJournalById(request);
  }
  
  copyToNewJournalAsync(request: any): Observable<HttpResponse<any>> {
    return this.homeData.copyToNewJournalAsync(request);
  }

  getJournalStatusCountListAsync(request: any): Observable<HttpResponse<any>> {
    return this.homeData.getJournalStatusCountListAsync(request);
  }
}
