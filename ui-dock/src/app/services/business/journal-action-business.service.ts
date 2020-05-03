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
import { JournalDetailsDataService } from '../data/journal-details-data.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class JournalActionBusinessService {

  constructor(private journalDetailsData: JournalDetailsDataService) { }

  getJournalRunByIdAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.journalDetailsData.getJournalRunByIdAsync(journalId, runDate);
  }

  executeJournalSteps(requestJson: any): Observable<HttpResponse<any>> {
    return this.journalDetailsData.executeJournalSteps(requestJson);
  }

  updateJournalStatusAsync(journalId: journalIdType, newStatus: string): Observable<HttpResponse<any>> {
    var request = {
      jid: journalId,
      status: newStatus
    };
    return this.journalDetailsData.updateJournalStatusAsync(request);
  }
}
