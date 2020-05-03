/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultValuesService {

  constructor() { }

  public JSON_INPUT_SOURCE_TAG: string = "inputSource";
  public JSON_PROCESS_STEPS_TAG: string = "processSteps";
  public JSON_PROCESS_DATA_TAG: string = "processData";
  public JSON_OUTPUT_TEMPLATE_TAG: string = "outputTemplate";
  public JSON_ABOUT_TAG: string = "about";
  public JSON_ANALYTICS_TAG: string = "analytics";
  public JSON_JEVA_ADHOC_LIST_TAG: string = "adhocJournalList";
  public JSON_JEVA_NEW_ADHOC_TAG: string = "newAdhocJournal";
  public JSON_EXCEL_FUNCTION_TAG: string = "EXCEL_FUNCTION";
  public JSON_JEH_MENU_GO_TO_ADVISOR_TAG: string = "goToAdvisor";
  public JSON_ADVISOR_VALIDATION_RESULT_TAG: string = "validationResults";
  public JSON_HEADER_MENU_ADVISOR_TAG: string = "advisor";

  public SELECTED_COLUMN_DEFAULT_COLOR: string = "inherit";
  public HEADER_MENU_ITEM_JCC_CODE: string = "jcc";
  public JSON_TEMPLATE_TAG: string = "template";
  public MASTER_SOURCE_FILE_INDICATOR: string = "fa fa-flag-checkered";

  public PARAM_JID: string = "jid";
  public PARAM_JOURNAL_NAME = "journalname";
  public PARAM_DATE: string = "date";
  public PARAM_FILE_NAME = "fileName";
  public PARAM_FILE_TYPE = "fileType";
  public PARAM_USERID: string = "userId";
  public PARAM_COMPANYID: string = "companyId";
  public PARAM_COMMENT_TEXT: string = "commentText";
  public PARAM_COMMENT_SOURCE: string = "commentSource";

  public INPUT_FILE_MODIFICATION_TYPE: Array<string> = ["row", "column", "header"];
  public DR_TEMPLATE_MAPPING_REQUIRED_COLS: Array<string> = ["GL Account", "Document Amount", "Cost Center"];
  public CR_TEMPLATE_MAPPING_REQUIRED_COLS: Array<string> = ["GL Account", "Document Amount", "Profit Center"];
  public OPERATOR_BIND_STRING: string = "";
  public MONEY_SYMBOL: string = "$";
  public COMMA_SYMBOL: string = ", ";

  public EXTENSION_TYPE_CSV: string = "csv";
  public RESPONSE_TYPE_CSV: string = "text/csv";
  public RESPONSE_TYPE_BLOB: string = "blob";
  public FILE_CONTENT_TYPE_PDF: string = "application/pdf";
  public FILE_CONTENT_TYPE_CSV: string = "text/csv";

  public INPUT_SOURCE_SAP_FIELD_PARAM_LIST: Array<Object> = [{ code: "saptcode", val: "SAP T-Code" },
  { code: "controllingarea", val: "Controlling Area" }, { code: "costcenter", val: "Cost Center" },
  { code: "postingdatefrom", val: "Posting Date From" }, { code: "postingdateto", val: "Posting Date To" },
  { code: "layout", val: "Layout" }];
  public JSON_ADVR_JOURNAL_DATA_TAG: string = "viewJournalData";
  public INTERVAL_10_SEC: number = 10000;
  public MAX_TIMES_TO_RUN: number = 12;
  public OUTPUT_TEMPLATE_TYPE_DR: string = "dr";
  public OUTPUT_TEMPLATE_TYPE_CR: string = "cr";
  public WORKDAY_START: number = -5;
  public WORKDAY_END: number = 10;
  public WORKDAY_START_WITH: string = "WD";
  public JOURNAL_CAT_LIST: Array<object> = [{ key: "", value: "Both" }, { key: "config", value: "Config" }, { key: "run", value: "Run" }];
  public JOURNAL_TYPE_CAT_LIST: Array<object> = [{ key: "", value: "Standard" }, { key: "adhoc", value: "Adhoc" }];
  public JOURNAL_MONTH_LIST: Array<object> = [{ key: 1, value: "Current Month" }, { key: 2, value: "Previous Month" }, { key: 3, value: "2 Months Ago" },
    { key: -1, value: "All Data" }];
  public VALIDATION_RULE_TABLE_NAME: string = "output";
  public VALIDATION_RULE_OPERATION_LIST: Array<object> = [
    { name: "Operator", qCode: "Operator", isList: true },
    { name: "Start With", qCode: "STARTSWITH", isList: false },
    { name: "End With", qCode: "ENDSWITH", isList: false },
    { name: "Length", qCode: "LENGTH", isList: true },
    { name: "Sum", qCode: "SUM", isList: true },
    { name: "Max", qCode: "MAX", isList: true },
    { name: "Min", qCode: "MIN", isList: true },
    { name: "Avg", qCode: "AVG", isList: true },
    { name: "Type", qCode: "TYPE", isList: true, "valueControlHidden": true }];
  public MATH_OPERATIONS: Array<string> = ["Length", "Sum", "Max", "Min", "Avg"];
  public VALIDATION_RULE_ANDOR_LIST: Array<object> = [{ code: "", name: "NA" }, { code: "and", name: "And" }, { code: "or", name: "Or" }];
  public DEFAULT_AND_OR_VALUE: string = "and";
  public VALIDATION_RULE_ANDORWHERE_LIST: Array<object> = [
    { code: "", name: "NA" },
    { code: "AND", name: "AND" },
    { code: "OR", name: "OR" },
    {code: "WHERE", name: "WHERE"}];
  public USER_MIN_PASS_LENGTH: number = 5;
  public OPEN_PARENTHESIS: string = " ( ";
  public CLOSE_PARENTHESIS: string = " ) ";
  public OUTPUT_FORMAT_TYPES: Array<object> = [{key: "minNumChar", value: "Length", prfx: true, chr: true, mLen: true, dPlc: false}, 
    {key: "decimalPlace", value: "Decimal Place", prfx: false, chr: false, mLen: false, dPlc: true}];
  public ALL_OPTION_FOR_COMBO: string = "All";
  public NO_RECORDS_IN_TABLE: string = "No Records";
  public SCHEDULER_HISTORY_MONTH_LIST: Array<object> = [{ key: 0, value: "Current Month" }, { key: 1, value: "Previous Month" }];
}