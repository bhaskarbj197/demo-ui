/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RelativeUrlsService {
  
  constructor() { }

  public GET_CONFIG: string = "/AAFGSCWE12";
  public GET_ALL_JOURNALS: string = "/journalHome";
  public GET_ALL_JOURNALS_STATUS_COUNT: string = "/getJournalHomeStat";
  public GET_JOURNAL_BY_ID: string = "/getJournalById/";
  public GET_JOURNAL_FILES_INFO: string = "/getColumnNameType/";
  public GET_INPUT_SOURCES_INFO_BY_JID: string = "/getJournalFileInfo";
  public GET_RESULT_DATA_BY_FILE_NAME: string = "/getData/{journalId}{runDate}/{folder}/";
  public UPLOAD_INPUT_FILE: string = "/upload";
  public GET_RUN_EXECUTE: string = "/getExec/";
  public POST_EXECUTE_STEP: string = "/execJournalSteps";
  public GET_STEP_DATA: string = "/getStepData/{journalId}/";
  public CREATE_JOURNAL_ID: string = "/createJournalId";
  public SAVE_JOURNAL: string = "/saveJournal";
  public GET_TEMPLATE_COLUMNS_BY_NAME: string = "/getTemplateColumns";
  public GET_PROCESSED_DATA_FILE_COLUMNS_BY_NAME: string = "/getProcessedColumns/{journalId}/";
  public DOWNLOAD_FILE: string = "/downloadFile";
  public SAVE_LOG: string = "/saveJournalLog";
  public GET_SAVED_LOG_WITHOUT_DATE: string = "/getJournalLog/";
  public GET_SAVED_LOG_WITH_DATE: string = "getJournalLog/{journalId}/";
  public DELETE_JOURNAL: string = "/deleteJournal";
  public DELETE_INPUT_FILE: string = "/deleteFile";
  public EXTRACT_INPUT_FILE_ENDPOINT: string = "/dataExtract";
  public CLEAR_INPUT_CONTENT: string = "/deleteRowColumn";
  public ADVR_JOURNAL_DATA: string = "/getJournalData";
  public GET_PROCESS_STEP_LOG_WITHOUT_DATE: string = "/getProcessStepLog/";
  public GET_PROCESS_STEP_LOG_BY_DATE: string = "/getProcessStepLog/{journalId}/";
  public ADVR_JOURNAL_GRAPHS: string = "/getJournalStat";
  public ADVR_DOC_EVIDENCE: string = "/getEvidenceFile/{journalId}/{runDate}/{folder}";
  public ADVR_INPUT_LOG_ANOMALY: string = "/inputLogAnomaly";
  public ADVR_PROCESSED_LOG_ANOMALY: string = "/processLogAnomaly";
  public ADVR_GET_VALIDATION_RESULT: string = "/outputValidationResult/{journalId}/{runDate}";
  public ADVR_GET_FINANCIAL_IMPACT: string = "/financialImpact/{journalId}/{runDate}";
  public ADVR_POST_DOWNLOAD_EVIDENCE_FILE: string = "/downloadEvidenceFile";
  public ADVR_GET_INPUT_LOG_HOSTORY: string = "/inputLogHistory";
  public ADVR_GET_PROCESS_LOG_HOSTORY: string = "/processLogHistory";
  public ADVR_GET_CONFIG_LIST: string = "/getAdvisoryConfigList/{journalId}/{runDate}";
  public ADVR_GET_ANOMALY_DATA: string = "/getAnomalyData/{journalId}/{runDate}";
  public ADVR_GET_ALL_RUNDATE_BY_JOURNAL_ID: string = "/getAllRunDateByJid/{journalId}";
  public ADVR_UPDATE_WORKFLOW_STATUS: string = "/updateWorkFlowStatus";
  public JCC_GET_FILE_EXTRACT_STATUS: string = "/getFileExtractionStatus/{journalId}/{sourceName}";
  public JCC_POST_COPY_JOURNAL: string = "/copyJournalId";
  public ADVR_GET_VALIDATION_STATUS: string = "/getValidationStatus";
  public ADVR_GET_WORKDAY_JOURNAL_STATUS: string = "/getWorkDayWiseStatus";
  public ADVR_GET_DATA_ANOMALY_BY_TYPE: string = "/getDataAnomalies/";
  public ADVR_GET_INPUT_FILE_AVAILIBILITY: string = "/getInputFileAvailable";
  public GET_SUPP_DOC_LIST: string = "/getSupportDocList/";
  public UPLOAD_SUPP_DOC: string = "/uploadSupportDoc";
  public DELETE_SUPP_DOC: string = "/deleteSupportDoc";
  public DOWNLOAD_SUPP_DOC: string = "/downloadSupportingDoc";
  public SEND_MESSAGE: string = "/orchestrator";
  public UPDATE_JOURNAL_STATUS: string = "/updateJournalStatus";
  public GET_TEMPLATE_BY_JOURNAL_ID: string = "/getTemplateByJid/";
  public USER_LOGIN: string = "/login";
  public UPDATE_SUPP_DOC_ACTIVITY: string = "/activateDeactivateSupportDoc";
  public GET_GROUP_MASTER_INFO: string = "/getGroupMasterDetails";
  public ADD_GROUP_MASTER: string = "/addGroupMaster";
  public UPDATE_GROUP_MASTER: string = "/updateGroupMaster";
  public DELETE_GROUP_MASTER: string = "/deleteGroupMaster";
  public ADD_TEMPLATE_MASTER: string = "/addTemplate";
  public GET_TEMPLATE_MASTER_INFO: string = "/getTemplateDetails";
  public UPDATE_TEMPLATE_CR_DR_COL: string = "/activateMandColForCrDr";
  public ACTIVATE_DEACTIVATE_TEMPLATE_MASTER: string = "/activateDeactivateTempMaster";
  public ADVR_ANOMALY_STAT_COUNT: string = "/getAnomalyStat/{journalId}/{runDate}";
  public GET_ALL_TEMPLATE_COLUMNS: string = "/allTemplateMasterList";
  public DELETE_TEMPLATE: string = "/updateIsdeletedTempMaster";
  public ADD_GLOBAL_VALIDATION_RULE: string = "/addGlobalRules";
  public GET_GLOBAL_VALIDATION_RULES: string = "/getGlobalRules";
  public ACTIVENESS_UPDATE_GLOBAL_VALIDATION_RULE: string = "/updateRules";
  public DELETE_GLOBAL_VALIDATION_RULE: string = "/deleteGlobalRule";
  public ADD_VALIDATION_RULE: string = "/addRules";
  public GET_VALIDATION_RULES: string = "/getRules";
  public UPDATE_VALIDATION_RULE_ACTIVITY: string = "/updateRuleActivity";
  public DELETE_VALIDATION_RULE: string = "/deleteRules";
  public GET_ALL_ROLES: string = "/getAllRoles";
  public GET_ALL_COMPANIES: string = "/getAllCompanies";
  public GET_ALL_USERS: string = "/getAllUsers";
  public UPDATE_USER_BY_ID: string = "/updateUser";
  public ADD_USER: string = "/register";
  public ADD_EDIT_FINANCIAL_MONTH: string = "/addFinancialMonth";
  public GET_FINANCIAL_MONTHS: string = "/getFinancialMonthList";
  public GET_CAL_MASTER_LIST: string = "/getCalendarMasterList";
  public GET_CAL_YEAR_MONTH_LIST: string = "/getCalendarYearMonth/{calId}";
  public INSERT_CAL_MASTER: string = "/insertMasterCalMonth";
  public GET_CAL_MONTHS_BY_YEAR: string = "/getMonthsByYear/{calId}/{year}";
  public SAVE_CAL_MONTH: string = "/updateCalMmonth";
  public UPDATE_CAL_MASTER: string = "/updateCalMaster";
  public SAVE_ADHOC_JOURNAL: string = "/createAdhocJournalId";
  public GET_ADHOC_JOURNAL_LIST: string = "/getAdhocJidList";
  public GET_VALIDATION_RULES_BY_TEMPLATE: string = "/getRulesByTemplateId/{templateId}";
  public SAVE_RULE_SET: string = "/addRuleSet";
  public GET_USER_LIST_BY_ROLE: string = "/getUserListByRoleId/{roleId}";
  public UPDATE_VALIDATION_MASTER_RULE: string = "/updateRuleSetDetails";
  public UPLOAD_PDF_FOR_EXTRACT: string = "/uploadPdfFile";
  public EXTRACT_PDF: string = "/getPdfExtract";
  public SET_EXTRACT_PDF_TYPE: string = "/setPdfExtractType";
  public GET_ACTIVITY_LOG_LIST: string = "/getAuditDetail";
  public DELETE_RULE_SET: string = "/deleteRuleSet";
  public DELETE_CALENDAR: string = "/deleteCal";
  public POST_COMMENT: string = "/addComment";
  public GET_COMMENTS: string = "/getCommentsByJid";
  public SAVE_ADHOC_MANUAL: string ="/saveAdhoc";
  public GET_ADHOC_DETAILS: string = "/getAdhocInfo/{journalId}";
  public GET_COMPANY_LIST: string = "/getCompanyDetails";
  public ADD_COMPANY: string = "/addCompany";
  public GET_COMPANY_DETAILS: string = "/getCompanyDetails/{companyId}";
  public UPDATE_COMPANY: string = "/updateCompany";
  public DELETE_COMPANY: string = "/deleteCompany";
  public GET_FREQUENCY_LIST: string = "/getAllFrequency";
  public GET_ADVISORY_ADHOC_LIST: string = "/getAdhocJournalData";
  public GET_USER_DETAILS: string = "/getUserDetails/{userId}";
  public POST_DOWNLOAD_BULK_TEMPLATE: string = "/downloadBulkTemplate";
  public POST_DOWNLOAD_REPORT: string = "/downloadReport";
  public POST_BULK_UPLOAD_FILE: string = "/bulkUploadFile";
  public POST_VALIDATE_BULK_JOURNAL_UPLOAD: string = "/validateJournals";
  public POST_VALIDATE_BULK_FIN_MON_MASTER: string = "/validateFinMonMaster";
  public POST_VALIDATE_BULK_CALENDAR_MASTER: string = "/validateCalendarMaster";
  public POST_PROCESS_BULK_JOURNAL_UPLOAD: string = "/processJournals";
  public POST_PROCESS_BULK_CALENDAR_MASTER: string = "/processCalendarMaster";
  public POST_PROCESS_BULK_FIN_MON_MASTER: string = "/processFinMonMaster";
  public CHANGE_PASSWORD: string = "/changePassword";
  public GET_OUTPUT_FORMAT: string = "/getOutputFormat/{templateId}";
  public SAVE_OUTPUT_FORMAT: string = "/saveOutputFormat";
  public RPRT_JOURNAL_POSTING_SMRY: string = "/viewSummaryReport";
  public POST_UPLOAD_BULK_INPUT_ZIP: string = "/uploadInputZipFile";
  public POST_VALIDATE_BULK_INPUT_ZIP: string = "/validateInputZipFile";
  public SAVE_JOURNAL_AUTO_APPROVER_RULE: string = "/addAutoApvRule";
  public UPDATE_JOURNAL_AUTO_APPROVER_RULE: string = "/updAutoApvRule";
  public GET_JOURNAL_AUTO_APPROVER_RULE_LIST: string = "/getAutoApvRule";
  public DELETE_JOURNAL_AUTO_APPROVER_RULE: string = "/delAutoApvRule";
  public SAVE_JOURNAL_AUTO_APPROVER_RULE_STATUS: string = "/updIsBlockedAutoApvRule";
  public KEYCLOAK_GET_USERS_BY_ROLE: string = "/kc/getUsersByRole";
  public KEYCLOAK_GET_USER_LIST: string = "/kc/getLoginDetails";
  public GET_DOWNLOAD_JOURNAL_STEPS: string = "/downloadJournalStep/"
}