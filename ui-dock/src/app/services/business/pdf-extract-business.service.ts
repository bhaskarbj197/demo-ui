/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { PdfExtractDataService } from '../data/pdf-extract-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfExtractBusinessService {

  constructor(private pdfExtractData: PdfExtractDataService) { }

  uploadPdfForExtractAsync(request: any): Observable<HttpResponse<any>> {
    return this.pdfExtractData.uploadPdfForExtractAsync(request);
  }

  extractPdfAsyc(request: any): Observable<HttpResponse<any>> {
    return this.pdfExtractData.extractPdfAsyc(request);
  }

  setExtractPdfTypeAsyc(request: any): Observable<HttpResponse<any>> {
    return this.pdfExtractData.setExtractPdfTypeAsyc(request);
  }
}
