/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableCodesService {

  constructor() { }

  public ACTIVITY_LOG_LIST = "activityLogList";
  public ADHOC_LIST: string = "adhocList";
  public ADHOC_HOME_LIST: string = "adhocHomeList";
  public JOURNAL_HOME_LIST: string = "journalHomeList";
  public USER_LIST: string = "userMasterList";
  public ADVISOR_JOURNAL_LIST = "advisorJournalList";
  public ADVISOR_ADHOC_LIST = "advisorAdhocList";
  public VALIDATION_RULE_LIST = "validationRuleList";
  public VALIDATION_RULE_LIST_BY_JOURNAL = "validationRuleListByJournal";
  public RPRT_JOURNAL_POSTING_SMR = "reprtJournalPostingSummary";
  public RPRT_NOT_TO_POSTING_JOURNAL = "reprtNotToPostingJournal";
}
