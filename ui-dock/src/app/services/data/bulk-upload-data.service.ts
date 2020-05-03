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
export class BulkUploadDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }
    
  downloadBulkTemplateFile(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_DOWNLOAD_BULK_TEMPLATE, request, 
      this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV);
  }

  uploadBulkTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postFormAsync(this.constantLoaderService.relativeUrlsService.POST_BULK_UPLOAD_FILE, request);
  }

  validateBulkJournalTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_VALIDATE_BULK_JOURNAL_UPLOAD, request);
  }

  processBulkJournalTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_PROCESS_BULK_JOURNAL_UPLOAD, request);
  }

  validateBulkFinanceMonthTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_VALIDATE_BULK_FIN_MON_MASTER, request);
  }

  processBulkFinanceMonthTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_PROCESS_BULK_FIN_MON_MASTER, request);
  }

  validateBulkCalendarMasterTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_VALIDATE_BULK_CALENDAR_MASTER, request);
  }

  processBulkCalendarMasterTemplateFile(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_PROCESS_BULK_CALENDAR_MASTER, request);
  }

  uploadBulkInputZipAsync(formData:any): Observable<HttpResponse<any>> {
    return this.dataService.postFormAsync(this.constantLoaderService.relativeUrlsService.POST_UPLOAD_BULK_INPUT_ZIP, formData);
  }

  validateBulkInputZipAsync(request:any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_VALIDATE_BULK_INPUT_ZIP, request);
  }
}
