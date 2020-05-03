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
export class ValidationRuleMasterDataService {

  constructor(private constantLoaderService: ConstantLoaderService,
    private dataAccessService: DataAccessService) { }

  addValidationRuleMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(
      this.constantLoaderService.relativeUrlsService.ADD_GLOBAL_VALIDATION_RULE, request);
  }

  getValidationRulesMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.GET_GLOBAL_VALIDATION_RULES, request);
  }

  updateValidationRulesMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.ACTIVENESS_UPDATE_GLOBAL_VALIDATION_RULE, request);
  }

  deleteValidationRuleMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_GLOBAL_VALIDATION_RULE, request);
  }

  addValidationRuleAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(
      this.constantLoaderService.relativeUrlsService.ADD_VALIDATION_RULE, request);
  }

  getValidationRulesByJournalAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.GET_VALIDATION_RULES, request);
  }

  updateValidationRuleActivityAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.UPDATE_VALIDATION_RULE_ACTIVITY, request);
  }

  deleteValidationRuleAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_VALIDATION_RULE, request);
  }

  getValidationRuleSetsByTemplateAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.dataAccessService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_VALIDATION_RULES_BY_TEMPLATE.replace("{templateId}", templateId.toString()));
  }

  saveValidationRuleSetAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(
      this.constantLoaderService.relativeUrlsService.SAVE_RULE_SET, request);
  }

  updateValidationRulesInRuleSetForJournal(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.postAsync(
      this.constantLoaderService.relativeUrlsService.UPDATE_VALIDATION_MASTER_RULE, request);
  }

  deleteRuleSetAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccessService.putAsync(
      this.constantLoaderService.relativeUrlsService.DELETE_RULE_SET, request);
  }
}
