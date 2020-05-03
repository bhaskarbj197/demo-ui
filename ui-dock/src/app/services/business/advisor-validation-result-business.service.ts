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
import { AdvisorValidationResultDataService } from '../data/advisor-validation-result-data.service';
import { ValidationResultModel } from '../../models/validationResult.model';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AdvisorValidationResultBusinessService {

  constructor(private advisorValidationResultDataService: AdvisorValidationResultDataService) { }

  getValidationResultAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>>{
    return this.advisorValidationResultDataService.getValidationResultAsync(journalId, runDate);
  }

  getValidationResult(response: any): Array<ValidationResultModel> {
    var results: Array<ValidationResultModel> = [];
    if(response){
      for(var index=0; index<response.length; index++){
        var validationResult = new ValidationResultModel();
        validationResult.category = response[index].category;
        validationResult.description = response[index].description;
        validationResult.statusText = response[index].status;
        validationResult.isSuccess = (response[index].status.toLowerCase().trim() === "ok");
        validationResult.type = response[index].type;
        validationResult.validationNo = response[index].validationNo;
        results.splice(0, 0, validationResult);
      }
    }
    return results;
  }
}
