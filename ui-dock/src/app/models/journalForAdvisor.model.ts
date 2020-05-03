/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class JournalForAdvisorModel {
    id: number;
    name: string;
    dataAnomalies: string;
    docEvidence: string;
    financialImpact: string;
    runType: string;
    runStatus: string;
    runDate: number;
    validationStatus: string;

    constructor(id?: number, name?: string, dataAnomalies?: string, docEvidence?: string, runDate?: number,
        financialImpact?: string, runType?: string, runStatus?: string, validationStatus?: string) {
        this.id = id;
        this.name = name;
        this.dataAnomalies = dataAnomalies;
        this.docEvidence = docEvidence;
        this.financialImpact = financialImpact;
        this.runType = runType;
        this.runStatus = runStatus;
        this.validationStatus = validationStatus;
        this.runDate = runDate;
    }
}
