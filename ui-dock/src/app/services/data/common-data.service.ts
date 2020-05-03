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
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  downloadEvidenceAsync(request: any, responseType: string): Observable<HttpResponse<any>>  {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.ADVR_POST_DOWNLOAD_EVIDENCE_FILE, request, responseType);
  }
}
