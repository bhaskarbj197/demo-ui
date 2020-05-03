/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class ProfitLossModel {
    costCenter: number;
    cr: number;
    crossCompanyCode: number;
    currentValue: number;
    dr: number;
    drOrCr: string;
    glAccount: number;
    impact: number;
    impactRange: string;
    impactRiskLevel: number;
    journalId: journalIdType;
    profitCenter: number;
    runDate: string;

    constructor(costCenter: number = 0, cr: number = 0, crossCompanyCode: number = 0, currentValue: number = 0, dr: number = 0,
        drOrCr: string = "", glAccount: number = 0, impact: number = 0, impactRange: string = "", impactRiskLevel: number = 0,
        journalId: journalIdType = 0, profitCenter: number = 0, runDate: string = "") {
        this.costCenter = costCenter;
        this.cr = cr;
        this.crossCompanyCode = crossCompanyCode;
        this.currentValue = currentValue;
        this.dr = dr;
        this.drOrCr = drOrCr;
        this.glAccount = glAccount;
        this.impact = impact;
        this.impactRange = impactRange;
        this.impactRiskLevel = impactRiskLevel;
        this.journalId = journalId;
        this.profitCenter = profitCenter;
        this.runDate = runDate;
    }
}

export class ProfitLossGraphModel {
    glCostCenter: string;
    impact: number;

    constructor(glCostCenter: string = "", impact: number = 0) {
        this.glCostCenter = glCostCenter;
        this.impact = impact;
    }
}