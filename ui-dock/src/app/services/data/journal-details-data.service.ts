/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from '../../loaders/constant-loader.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class JournalDetailsDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  getJournalDetailsByIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_JOURNAL_BY_ID + journalId.toString());
  }

  getJournalFilesColumnsInfoByIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_JOURNAL_FILES_INFO + journalId.toString());
  }

  getJournalInputSourcesInfoAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(
      this.constantLoaderService.relativeUrlsService.GET_INPUT_SOURCES_INFO_BY_JID, request);
  }

  getResultDataByTblNameAsync(tblName: string, journalId: journalIdType, folderType: string, runDate: string = ""): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_RESULT_DATA_BY_FILE_NAME
        .replace("{journalId}", journalId.toString())
        .replace("{runDate}", ((runDate.length === 0) ? "" : ("/" + runDate)))
        .replace("{folder}", folderType) + tblName);
  }

  postUploadInputFileAsync(body: any) {
    return this.dataService.postFormAsync(
      this.constantLoaderService.relativeUrlsService.UPLOAD_INPUT_FILE, body);
  }
  
  getJournalRunByIdAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_RUN_EXECUTE + journalId.toString() + "/" + runDate);
  }

  getStepDataAsync(journalId: journalIdType, stepId: number): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_STEP_DATA.replace("{journalId}", journalId.toString()) + stepId.toString());
  }

  createJournalAsync(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.CREATE_JOURNAL_ID, requestJson);
  }

  executeJournalSteps(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.POST_EXECUTE_STEP, requestJson);
  }

  saveJournalAsync(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.SAVE_JOURNAL, requestJson);
  }

  getTemplateColumnsAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.putAsync(
      this.constantLoaderService.relativeUrlsService.GET_TEMPLATE_COLUMNS_BY_NAME, request);
  }
  
  getProcessedDataTableColumnsAsync(journalId: journalIdType, tabName: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_PROCESSED_DATA_FILE_COLUMNS_BY_NAME.replace("{journalId}", journalId.toString()) + tabName);
  }

  downloadFileAsync(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.DOWNLOAD_FILE, requestJson, 'text');
  }

  deleteInputFileAsync(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_INPUT_FILE, requestJson);
  }

  extractInputFileAsync(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.EXTRACT_INPUT_FILE_ENDPOINT, requestJson);
  }

  clearInputFileContent(requestJson: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.CLEAR_INPUT_CONTENT, requestJson);
  }

  getFileExtractionStatusAsync(journalId: journalIdType, sourceName: string, runDate: string): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.JCC_GET_FILE_EXTRACT_STATUS
      .replace("{journalId}", journalId.toString())
      .replace("{sourceName}", sourceName + ".csv") + (runDate ? runDate : ""));
  }

  updateJournalStatusAsync(request: any): Observable<HttpResponse<any>>{
    return this.dataService.postAsync(
      this.constantLoaderService.relativeUrlsService.UPDATE_JOURNAL_STATUS, request);
  }

  getTemplateNameByJournalIdAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_TEMPLATE_BY_JOURNAL_ID + journalId.toString());
  }
}
