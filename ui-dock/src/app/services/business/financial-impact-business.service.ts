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
import { FinancialImpactDataService } from '../data/financial-impact-data.service';
import { ProfitLossModel } from 'src/app/models/profitLoss.model';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FinancialImpactBusinessService {

  constructor(private financialImpactDataService: FinancialImpactDataService) { }

  getFinancialImpactAsync(journalId: journalIdType, runDate: string): Observable<HttpResponse<any>> {
    return this.financialImpactDataService.getFinancialImpactAsync(journalId, runDate);
  }

  getFinancialImpact(response: any): Array<ProfitLossModel> {
    var result: Array<ProfitLossModel> = [];
    if(response && response.financialImpactData){
      for(var index=0; index<response.financialImpactData.length; index++){
        var profitLoss = new ProfitLossModel();
        profitLoss.costCenter = response.financialImpactData[index].costCenter;
        profitLoss.cr = Math.abs(response.financialImpactData[index].cr);
        profitLoss.crossCompanyCode = response.financialImpactData[index].crossCompanyCode;
        profitLoss.currentValue = response.financialImpactData[index].currentValue;
        profitLoss.dr = response.financialImpactData[index].dr;
        profitLoss.drOrCr = response.financialImpactData[index].drOrCr;
        profitLoss.glAccount = response.financialImpactData[index].glAccount;
        profitLoss.impact = response.financialImpactData[index].impact;
        profitLoss.impactRange = response.financialImpactData[index].impactRange;
        profitLoss.impactRiskLevel = response.financialImpactData[index].impactRiskLevel;
        profitLoss.journalId = response.financialImpactData[index].journalId;
        profitLoss.profitCenter = response.financialImpactData[index].profitCenter;
        profitLoss.runDate = response.financialImpactData[index].runDate;
        result.push(profitLoss);
      }
    }
    return result;
  }
}
