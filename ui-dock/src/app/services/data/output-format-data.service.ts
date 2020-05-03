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
export class OutputFormatDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getOutputFormatListAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_OUTPUT_FORMAT.replace("{templateId}", templateId.toString()));
  }

  saveOutputFormatListAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.SAVE_OUTPUT_FORMAT, request);
  }
}
