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
import { AdvisorDocEvidenceDataService } from '../data/advisor-doc-evidence-data.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AdvisorDocEvidenceBusinessService {

  constructor(private advisorDocEvidenceDataService: AdvisorDocEvidenceDataService) { }

  getJournalDocEvidenceByFolderAsync(journalId: journalIdType, runDate: string, folderType: string): Observable<HttpResponse<any>>{
    return this.advisorDocEvidenceDataService.getJournalDocEvidenceByFolderAsync(journalId, runDate, folderType);
  }
}
