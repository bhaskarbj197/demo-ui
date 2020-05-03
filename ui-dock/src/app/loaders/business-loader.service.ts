/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { HomeBusinessService } from '../services/business/home-business.service';
import { UiJsonBusinessService } from '../services/business/ui-json-business.service';
import { JournalDetailsBusinessService } from '../services/business/journal-details-business.service';
import { FunctionsUiJsonBusinessService } from '../services/business/functions-ui-json-business.service';
import { RuleJsonBusinessService } from '../services/business/rule-json-business.service';
import { OperatorJsonBusinessService } from '../services/business/operator-json-business.service';
import { JournalActionBusinessService } from '../services/business/journal-action-business.service';
import { LogBusinessService } from '../services/business/log-business.service';
import { AdvisorUiJsonBusinessService } from '../services/business/advisor-ui-json-business.service';
import { AdvisorHomeBusinessService } from '../services/business/advisor-home-business.service';
import { AdvisorDocEvidenceBusinessService } from '../services/business/advisor-doc-evidence-business.service';
import { AdvisorAnomalyBusinessService } from '../services/business/advisor-anomaly-business.service';
import { FinancialImpactBusinessService } from '../services/business/financial-impact-business.service';
import { AdvisorValidationResultBusinessService } from '../services/business/advisor-validation-result-business.service';
import { AdvisorDetailGraphBusinessService } from '../services/business/advisor-detail-graph-business.service';
import { CommonBusinessService } from '../services/business/common-business.service';
import { SupportingDocumentBusinessService } from '../services/business/supporting-document-business.service';
import { BotoBusinessService } from '../services/business/boto-business.service';
import { UserBusinessService } from '../services/business/user-business.service';
import { AdminUiJsonBusinessService } from '../services/business/admin-ui-json-business.service';
import { JevaUiJsonBusinessService } from '../services/business/jeva-ui-json-business.service';
import { GroupMasterBusinessService } from '../services/business/group-master-business.service';
import { TemplateMasterBusinessService } from '../services/business/template-master-business.service';
import { ValidationRuleMasterBusinessService } from '../services/business/validation-rule-master-business.service';
import { CompanyBusinessService } from '../services/business/company-business.service';
import { RoleBusinessService } from '../services/business/role-business.service';
import { FinancialMonthMasterBusinessService } from '../services/business/financial-month-master-business.service';
import { CalendarMasterBusinessService } from '../services/business/calendar-master-business.service';
import { AdhocJournalBusinessService } from '../services/business/adhoc-journal-business.service';
import { FrequencyBusinessService } from '../services/business/frequency-business.service';
import { TimeZoneBusinessService } from '../services/business/time-zone-business.service';
import { PdfExtractBusinessService } from '../services/business/pdf-extract-business.service';
import { ActivityLogBusinessService } from '../services/business/activity-log-business.service';
import { CommentsBusinessService } from '../services/business/comments-business.service';
import { UserUiJsonBusinessService } from '../services/business/user-ui-json-business.service';
import { BulkUploadBusinessService } from '../services/business/bulk-upload-business.service';
import { OutputFormatBusinessService } from '../services/business/output-format-business.service';
import { ReportUiJsonBusinessService } from '../services/business/report-ui-json-business.service';
import { ReportBusinessService } from '../services/business/report-business.service';
import { JournalAutoApproverBusinessService } from '../services/business/journal-auto-approver-business.service';
import { OutputHeaderTemplateBusinessService } from '../services/business/output-header-template-business.service';
import { ScheduleRunHistoryBusinessService } from '../services/business/schedule-run-history-business.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessLoaderService {

  constructor(private _homeBusinessService: HomeBusinessService, 
    private _uiJsonBusinessService: UiJsonBusinessService,
    private _journalDetailsBusinessService: JournalDetailsBusinessService,
    private _functionsUiJsonBusinessService: FunctionsUiJsonBusinessService,
    private _ruleJsonBusinessService: RuleJsonBusinessService,
    private _operatorJsonBusinessService: OperatorJsonBusinessService,
    private _journalActionBusinessService: JournalActionBusinessService,
    private _logBusinessService: LogBusinessService,
    private _advisorUiJsonBusinessService: AdvisorUiJsonBusinessService,
    private _advisorHomeBusinessService: AdvisorHomeBusinessService,
    private _advisorDocEvidenceBusinessService: AdvisorDocEvidenceBusinessService,
    private _advisorAnomalyBusinessService: AdvisorAnomalyBusinessService,
    private _financialImpactBusinessService: FinancialImpactBusinessService,
    private _advisorValidationResultBusinessService: AdvisorValidationResultBusinessService,
    private _advisorDetailGraphBusinessService: AdvisorDetailGraphBusinessService,
    private _commonBusinessService: CommonBusinessService,
    private _supportingDocumentBusinessService: SupportingDocumentBusinessService,
    private _botoBusinessService: BotoBusinessService,
    private _userBusinessService: UserBusinessService,
    private _adminUiJsonBusinessService: AdminUiJsonBusinessService,
    private _jevaUiJsonBusinessService: JevaUiJsonBusinessService,
    private _groupMasterBusinessService: GroupMasterBusinessService,
    private _templateMasterBusinessService: TemplateMasterBusinessService,
    private _validationRuleMasterBusinessService: ValidationRuleMasterBusinessService,
    private _companyBusinessService: CompanyBusinessService,
    private _roleBusinessService: RoleBusinessService,
    private _financialMonthMasterBusinessService: FinancialMonthMasterBusinessService,
    private _calendarMasterBusinessService: CalendarMasterBusinessService,
    private _adhocJournalBusinessService: AdhocJournalBusinessService,
    private _frequencyBusinessService: FrequencyBusinessService,
    private _timeZoneBusinessService: TimeZoneBusinessService,
    private _pdfExtractBusinessService: PdfExtractBusinessService,
    private _activityLogBusinessService: ActivityLogBusinessService,
    private _commentsBusinessService: CommentsBusinessService,
    private _userUiJsonBusinessService: UserUiJsonBusinessService,
    private _bulkUploadBusinessService: BulkUploadBusinessService,
    private _outputFormatBusinessService: OutputFormatBusinessService,
    private _reportUiJsonBusinessService: ReportUiJsonBusinessService,
    private _reportBusinessService: ReportBusinessService,
    private _journalAutoApproverBusinessService: JournalAutoApproverBusinessService,
    private _outputHeaderTemplateBusinessService: OutputHeaderTemplateBusinessService,
    private _scheduleRunHistoryBusinessService: ScheduleRunHistoryBusinessService) { }

  public homeBusinessService = this._homeBusinessService;
  public uiJsonBusinessService = this._uiJsonBusinessService;
  public journalDetailsBusinessService = this._journalDetailsBusinessService;
  public functionsUiJsonBusinessService = this._functionsUiJsonBusinessService;
  public ruleJsonBusinessService = this._ruleJsonBusinessService;
  public operatorJsonBusinessService = this._operatorJsonBusinessService;
  public journalActionBusinessService = this._journalActionBusinessService;
  public logBusinessService = this._logBusinessService;
  public advisorUiJsonBusinessService = this._advisorUiJsonBusinessService;
  public advisorHomeBusinessService = this._advisorHomeBusinessService;
  public advisorDocEvidenceBusinessService = this._advisorDocEvidenceBusinessService;
  public advisorAnomalyBusinessService = this._advisorAnomalyBusinessService;
  public financialImpactBusinessService = this._financialImpactBusinessService;
  public advisorValidationResultBusinessService = this._advisorValidationResultBusinessService;
  public advisorDetailGraphBusinessService = this._advisorDetailGraphBusinessService;
  public commonBusinessService = this._commonBusinessService;
  public supportingDocumentBusinessService = this._supportingDocumentBusinessService;
  public botoBusinessService = this._botoBusinessService;
  public userBusinessService = this._userBusinessService;
  public adminUiJsonBusinessService = this._adminUiJsonBusinessService;
  public jevaUiJsonBusinessService = this._jevaUiJsonBusinessService;
  public groupMasterBusinessService = this._groupMasterBusinessService;
  public templateMasterBusinessService = this._templateMasterBusinessService
  public validationRuleMasterBusinessService = this._validationRuleMasterBusinessService;
  public companyBusinessService = this._companyBusinessService;
  public roleBusinessService = this._roleBusinessService;
  public financialMonthMasterBusinessService = this._financialMonthMasterBusinessService;
  public calendarMasterBusinessService = this._calendarMasterBusinessService;
  public adhocJournalBusinessService = this._adhocJournalBusinessService;
  public frequencyBusinessService = this._frequencyBusinessService;
  public timeZoneBusinessService = this._timeZoneBusinessService;
  public pdfExtractBusinessService = this._pdfExtractBusinessService;
  public activityLogBusinessService = this._activityLogBusinessService;
  public commentsBusinessService = this._commentsBusinessService;
  public userUiJsonBusinessService = this._userUiJsonBusinessService;
  public bulkUploadBusinessService = this._bulkUploadBusinessService;
  public outputFormatBusinessService = this._outputFormatBusinessService;
  public reportUiJsonBusinessService = this._reportUiJsonBusinessService;
  public reportBusinessService = this._reportBusinessService;
  public journalAutoApproverBusinessService = this._journalAutoApproverBusinessService;
  public outputHeaderTemplateBusinessService = this._outputHeaderTemplateBusinessService;
  public scheduleRunHistoryBusinessService = this._scheduleRunHistoryBusinessService;
}
