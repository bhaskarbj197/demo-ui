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
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Injectable({
  providedIn: 'root'
})
export class PdfExtractDataService {

  constructor(private dataAccess: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  uploadPdfForExtractAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.postFormAsync(this.constantLoaderService.relativeUrlsService.UPLOAD_PDF_FOR_EXTRACT, request);
  }

  extractPdfAsyc(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.postAsync(this.constantLoaderService.relativeUrlsService.EXTRACT_PDF, request);
  }

  setExtractPdfTypeAsyc(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.postAsync(this.constantLoaderService.relativeUrlsService.SET_EXTRACT_PDF_TYPE, request);
  }
}
