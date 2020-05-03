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

  public ACTIVITY_LOG_LIST: string = "activityLogList";
  public ADHOC_LIST: string = "adhocList";
  public ADHOC_HOME_LIST: string = "adhocHomeList";
  public JOURNAL_HOME_LIST: string = "journalHomeList";
  public USER_LIST: string = "userMasterList";
  public ADVISOR_JOURNAL_LIST: string = "advisorJournalList";
  public ADVISOR_ADHOC_LIST: string = "advisorAdhocList";
  public VALIDATION_RULE_LIST: string = "validationRuleList";
  public VALIDATION_RULE_LIST_BY_JOURNAL: string = "validationRuleListByJournal";
  public RPRT_JOURNAL_POSTING_SMR: string = "reprtJournalPostingSummary";
  public RPRT_NOT_TO_POSTING_JOURNAL: string = "reprtNotToPostingJournal";
  public SCHEDULE_RUN_HISTORY_LIST: string = "scheduleRunHistoryList";
}
