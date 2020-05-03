/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastNamesService {

  constructor() { }

  public TREE_NODE_TO_RESULT_VIEW: string = "treeNodeToResultView";
  public STEP_LIST_TO_RESULT_VIEW: string = "stepListToResultView";
  public HOME_TO_HEADER_MENU: string = "homeToHeaderMenu";
  public INPUT_TABLE_TO_RESULT_VIEW: string = "inputTableToResultView";
  public SAVE_JOURNAL: string = "saveJournal";
  public LOGIN_HEADER_MENU_SHOW: string = "loginHeaderMenuShow";
  public USER_ROLE_SHOW: string = "userRoleShow";
  public UPDATE_BUSINESS_RULES: string = "updateBusinessRules";
  public REFRESH_ADVISOR_VALIDATION_VIEW: string = "validationResults";
  public REFRESH_ADVISOR_PROFIT_LOSS_VIEW: string = "profitLoss";
  public REFRESH_ADVISOR_DOC_EVIDENCE_VIEW: string = "documentaryEvidence";
  public REFRESH_ADVISOR_INPUT_LOGS_VIEW: string = "inputLogs";
  public REFRESH_ADVISOR_PROCESSED_LOGS_VIEW: string = "processedLogs";
  public REFRESH_ADVISOR_INPUT_FILE_ANOMALY_VIEW: string = "dataAnomalies";
  public REFRESH_ADVISOR_BALANCH_SHEET_VIEW: string = "balanceSheet";
  public REFRESH_ADVISOR_OUTPUT_RESULT_VIEW: string = "outputResult";
  public REFRESH_ADVISOR_SUPPPORTING_DOCS_VIEW: string = "supportingDocs";
  public REFRESH_ADVISOR_COMMENTS_VIEW: string = "comments";
  public SHOW_NOTIFICATION: string = "showNotification";
}
