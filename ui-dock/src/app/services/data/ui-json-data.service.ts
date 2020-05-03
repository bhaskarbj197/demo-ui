/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import uiJason from '../../../assets/json/uiJson.json';
import functionsUiJason from '../../../assets/json/functionsUiJson.json';
import rulesUiJason from '../../../assets/json/rulesJson.json';
import operatorJson from '../../../assets/json/operatorJson.json';
import headerMenuJson from '../../../assets/json/headerMenuJson.json';
import advisorLeftTree from '../../../assets/json/advisorLeftTree.json';
import excelFunctions from '../../../assets/json/excelFunctions.json';
import adminLeftTree from '../../../assets/json/adminLeftTree.json';
import roleAction from '../../../assets/json/roleAction.json';
import jevaLeftTree from '../../../assets/json/jevaLeftTree.json';
import validationRuleCategoryList from '../../../assets/json/validationRuleCategoryList.json';
import timeZoneList from '../../../assets/json/timeZone.json';
import quickHelps from '../../../assets/json/quickHelp.json';
import tableHeaderConfig from '../../../assets/json/tableHeaderConfig.json';
import userLeftTree from '../../../assets/json/userLeftTree.json';
import termsConditions from '../../../assets/json/termsConditions.json';
import reportLeftTree from '../../../assets/json/reportLeftTree.json';
import journalAutoApproverRuleAction from '../../../assets/json/journalAutoApproverRuleAction.json';
import scheduleRunSteps from '../../../assets/json/scheduleRunSteps.json';

@Injectable({
  providedIn: 'root'
})
export class UiJsonDataService {

  constructor() { }

  getStaticTreeStructure(){
    return uiJason;
  }

  getFunctionsUiJson(){
    return functionsUiJason;
  }

  getRulesUiJson(){
    return rulesUiJason;
  }

  getOperatorJson(){
    return operatorJson;
  }

  getHeaderMenuJson(){
    return headerMenuJson;
  }

  getStaticTreeStructureForAdvisor(){
    return advisorLeftTree;
  }

  getExcelFunctions(){
    return excelFunctions;
  }

  getAdminLeftTree(){
    return adminLeftTree;
  }

  getRoleActions(){
    return roleAction;
  }

  getJevaLeftTree(){
    return jevaLeftTree;
  }

  getValidationRuleCategoryList(){
    return validationRuleCategoryList;
  }
  
  getTimeZones(){
    return timeZoneList;
  }

  getQuickHelps(){
    return quickHelps;
  }

  getTableHeaders(){
    return tableHeaderConfig;
  }

  getUserLeftTree(){
    return userLeftTree;
  }

  getTermsConditions(){
    return termsConditions;
  }

  getReportLeftTree(){
    return reportLeftTree;
  }

  getJournalAutoApproverRuleActions(){
    return journalAutoApproverRuleAction;
  }

  getScheduleRunSteps(){
    return scheduleRunSteps;
  }
}
