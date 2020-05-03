/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabListTextsService {

  constructor() { }

  public ADVR_PROFIT_LOSS_0: string = "Data Analysis";
  public ADVR_PROFIT_LOSS_1: string = "Graphical Representation";
  public ADVR_ANOMALY_INPUT_LOG_0: string = "Data Analysis";
  public ADVR_ANOMALY_INPUT_LOG_1: string = "Graphical Representation";
  public ADVR_ANOMALY_PROCESSED_LOG_0: string = "Data Analysis";
  public ADVR_ANOMALY_PROCESSED_LOG_1: string = "Graphical Representation";
  public ADVR_ANOMALY_INPUT_FILE_0: string = "Data Analysis";
  public ADVR_ANOMALY_INPUT_FILE_1: string = "Graphical Representation";
  public ADVR_DATA_ANOMALY_0: string = "Data Analysis";
  public ADVR_DATA_ANOMALY_1: string = "Graphical Representation";
  public ADVR_INPUT_FILE_AVLB_0: string = "Data Analysis";
  public ADVR_JOURNAL_STATUS_0: string = "Data Analysis";
  public ADVR_JOURNAL_STATUS_1: string = "Graphical Representation";
  public ADVR_JOURNAL_STATUS_2: string = "Graphical Representation - All Workdays";
  public ADVR_JOURNAL_VALIDATION_0: string = "Data Analysis";
  public ADVR_JOURNAL_VALIDATION_1: string = "Graphical Representation";
  public ADVISOR_CONFIG_0: string = "New Configuration";
  public ADVISOR_CONFIG_1: string = "List of Configuration";
  public INPUT_SOURCE_0: string = "Upload New File";
  public INPUT_SOURCE_1: string = "List of Input Source File(s)";
  public ADMIN_TEMPLATE_0: string = "New Template";
  public ADMIN_TEMPLATE_1: string = "List of Template";
  public GROUP_MASTER_0: string = "New Group";
  public GROUP_MASTER_1: string = "List of Group";
  public VALIDATION_RULE_MASTER_1: string = "New Validation Rule";
  public VALIDATION_RULE_MASTER_0: string = "List of Validation Rule";
  public VALIDATION_RULE_MASTER_2: string = "Validation Rule Set";
  public VALIDATION_RULE_MASTER_2a: string = "Business Rule";
  public USER_MASTER_0: string = "New/Edit User";
  public USER_MASTER_1: string = "List of User";
  public CALENDAR_MASTER_0: string = "List of Calendar";
  public CALENDAR_MASTER_1: string = "New Calendar";
  public COMPANY_MASTER_0: string = "List of Company";
  public COMPANY_MASTER_1: string = "New Company";
  public JOURNAL_AUTO_APPROVER_0: string = "List of Rules";
  public JOURNAL_AUTO_APPROVER_1: string = "New/Edit Rule";
  public SCHEDULER_RUN_GRAPH_0: string = "Journal Run Status Count in Month";
  public SCHEDULER_RUN_GRAPH_1: string = "WD Wise Status in Month";
}