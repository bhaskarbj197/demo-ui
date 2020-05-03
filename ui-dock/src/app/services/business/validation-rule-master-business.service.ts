/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ValidationRuleMasterDataService } from '../data/validation-rule-master-data.service';
import { ValidationRulesModel, ValidationRulePropertyModel, RuleSetModel, ValidationRulesByTemplateModel, CombinedQueryModel } from 'src/app/models/validationRules.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { ValidationRuleCategoryModel } from 'src/app/models/validationRuleCategory.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataService } from 'src/app/services/data.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';

@Injectable({
  providedIn: 'root'
})
export class ValidationRuleMasterBusinessService {
  
  constructor(private validationRuleMasterDataService: ValidationRuleMasterDataService,
    private constantLoaderService: ConstantLoaderService,
    private dataService: DataService,
    private generalUtility: GeneralUtility) { }

  createRequestForAddValidationRuleMaster(newRule: ValidationRulesModel, finalQuery: string,
    selectedTemplateList: Array<TemplateMasterPartialModel>, categoryList: Array<ValidationRuleCategoryModel>, isMaster: boolean = true): any{
    var request: any = { ruleDetails: {} };
    request.ruleDetails = {
      ruleId: 0,
      name: newRule.name,
      category: categoryList.find(c => c.code === newRule.category).name,
      description: newRule.description,
      ruleCommand: finalQuery,
      isActive: newRule.isActive,
      templates: [],
      ruleProperty: []
    };

    if(isMaster !== undefined){
      request.ruleDetails.isMaster = isMaster;
    }

    for(var index=0; index<selectedTemplateList.length; index++){
      request.ruleDetails.templates.push({id: selectedTemplateList[index].id,
        tablename: selectedTemplateList[index].name});
    }

    for(var index=0; index<newRule.ruleProperties.length; index++){
      var property = new ValidationRulePropertyModel();
      property = newRule.ruleProperties[index];
      request.ruleDetails.ruleProperty.push(property);
    }
    return request;
  }

  getValidationRules(response: any): Array<ValidationRulesByTemplateModel> {
    var result: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
    if(response && response.ruleDetails){
      for(var index=0; index<response.ruleDetails.length; index++){
        if(response.ruleDetails[index]){
          var rule = new ValidationRulesByTemplateModel();
          rule.id = response.ruleDetails[index].ruleId;
          rule.name = response.ruleDetails[index].name;
          rule.category = response.ruleDetails[index].category;
          rule.description = response.ruleDetails[index].description;
          rule.isActive = response.ruleDetails[index].isActive;
          rule.ruleCommand = response.ruleDetails[index].ruleCommand;
          rule.templates = response.ruleDetails[index].templates;
          rule.ruleProperties = response.ruleDetails[index].ruleProperty;
          if(response.ruleDetails[index].isMaster != undefined){
            rule.isMaster = response.ruleDetails[index].isMaster;
          }
          if(response.ruleDetails[index].masterId != undefined){
            rule.masterId = response.ruleDetails[index].masterId;
          }
          if(response.ruleDetails[index].isSelected != undefined){
            rule.isSelected = response.ruleDetails[index].isSelected;
          } else {
            rule.isSelected = true;
          }
          result.push(rule);
        }
      }
    }
    return result.filter(r => r.isSelected);
  }

  private buildQueryByOperation(rule: ValidationRulePropertyModel, queryString) {
    let operationObj = rule.operationObj;
    queryString += " " + rule.andOr;
    if(this.constantLoaderService.defaultValuesService.MATH_OPERATIONS.indexOf(rule.operation) >= 0) {
      queryString += " " + rule.operationObj.qCode + "("
        + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + "["
        + rule.columnName + "]) "
        + rule.operationValue + " " + rule.value;
    } else if(operationObj && operationObj["name"] !== undefined && operationObj["name"] !== "") {
      if (operationObj["name"] === "Operator") {
        queryString += " " + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME +
          "[" + rule.columnName + "] " +
          rule.operationValue + " " + rule.value;
      }
      if(operationObj["name"] === "Type") {
        queryString += " " + rule.operationObj.qCode + "(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
          "[" + rule.columnName + "]) == '" + 
          rule.value + "'";
      }
    } else if(rule.operationValue !== null && rule.operationValue !== "") {
      queryString += " " + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME +
          "[" + rule.columnName + "] " +
          rule.operationValue + " " + rule.value;
    }
    return queryString;
  }

  private buildNewRuleQuerySubFunc(rules: Array<ValidationRulePropertyModel>) {
    let queryString: string = "";
    for(var index = 0; index < rules.length; index++){
      queryString = this.buildQueryByOperation(rules[index], queryString);
    }
    return queryString;
  }

  buildNewRuleQuery(newRule: ValidationRulesModel, combinedQuery?: CombinedQueryModel): string {
    let result: string = "";
    if(newRule.category === "combined" && combinedQuery) {
      result = this.buildNewRuleQuerySubFunc(combinedQuery.ruleProperties);
      return result;
    }
    for(var index=0; index<newRule.ruleProperties.length; index++){
      if(newRule.category === "mandatory"){
        result += " " + newRule.ruleProperties[index].andOr + " " + 
          this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + "[" + 
          newRule.ruleProperties[index].columnName + "] != ''";
      } else {
        result += " " + newRule.ruleProperties[index].andOr;
        if(newRule.ruleProperties[index].operation === "Operator"){
          result += " " + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
            "[" + newRule.ruleProperties[index].columnName + "] " + 
            newRule.ruleProperties[index].operationValue + " " + newRule.ruleProperties[index].value;
        } else if(newRule.ruleProperties[index].operation === "Start With") {
          result += " STARTSWITH(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
            "[" + newRule.ruleProperties[index].columnName + 
            (newRule.ruleProperties[index].isValueNumeric ? ("], " + 
              newRule.ruleProperties[index].value + ")") : ("], '" + newRule.ruleProperties[index].value + "')"));
        } else if(newRule.ruleProperties[index].operation === "End With") {
          result += " ENDSWITH(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
            "[" + newRule.ruleProperties[index].columnName + 
            (newRule.ruleProperties[index].isValueNumeric ? ("], " + 
              newRule.ruleProperties[index].value + ")") : ("], '" + newRule.ruleProperties[index].value + "')"));
        } else if(this.constantLoaderService.defaultValuesService.MATH_OPERATIONS.indexOf(newRule.ruleProperties[index].operation) >= 0) {
          result += " " + newRule.ruleProperties[index].operationObj.qCode+ "(" 
                        + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + "["
                        + newRule.ruleProperties[index].columnName + "]) "  
                      + newRule.ruleProperties[index].operationValue + " " + newRule.ruleProperties[index].value ;
        } else if(newRule.ruleProperties[index].operation === "Type") {
          result += " TYPE(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
            "[" + newRule.ruleProperties[index].columnName + "]) == '" + 
            newRule.ruleProperties[index].value + "'";
        }
      }
    }
    result = result.replace("  ", " ");
    result = result.replace("  ", " ");
    return result;
  }

  buildNewRuleConditionQuery(newRule: ValidationRulesModel): string {
    let result: string = "";
    for(var index=0; index<newRule.conditionProperties.length; index++){
      result += " " + newRule.conditionProperties[index].andOr;
      if(newRule.conditionProperties[index].operation === "Operator"){
        result += " " + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
          "[" + newRule.conditionProperties[index].columnName + "] " + 
          newRule.conditionProperties[index].operationValue + " " + newRule.conditionProperties[index].value;
      } else if(newRule.conditionProperties[index].operation === "Start With") {
        result += " STARTSWITH(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
          "[" + newRule.conditionProperties[index].columnName + 
          (newRule.conditionProperties[index].isValueNumeric ? ("], " + 
            newRule.conditionProperties[index].value + ")") : ("], '" + newRule.conditionProperties[index].value + "')"));
      } else if(newRule.conditionProperties[index].operation === "End With") {
        result += " ENDSWITH(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
          "[" + newRule.conditionProperties[index].columnName + 
          (newRule.conditionProperties[index].isValueNumeric ? ("], " + 
            newRule.conditionProperties[index].value + ")") : ("], '" + newRule.conditionProperties[index].value + "')"));
      } else if(this.constantLoaderService.defaultValuesService.MATH_OPERATIONS.indexOf(newRule.conditionProperties[index].operation) >= 0) {
        result += " " + newRule.conditionProperties[index].operationObj.qCode+ "(" 
                      + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + "["
                      + newRule.conditionProperties[index].columnName + "]) "  
                    + newRule.conditionProperties[index].operationValue + " " + newRule.conditionProperties[index].value ;
      } else if(newRule.conditionProperties[index].operation === "Type") {
        result += " TYPE(" + this.constantLoaderService.defaultValuesService.VALIDATION_RULE_TABLE_NAME + 
          "[" + newRule.conditionProperties[index].columnName + "]) == '" + 
          newRule.conditionProperties[index].value + "'";
      }
    }
    result = result.replace("  ", " ");
    result = result.replace("  ", " ");
    return ((result.length > 0) ? ("WHERE (" + result + ")") : result);
  }

  addValidationRuleMasterAsync(request: any): Observable<HttpResponse<any>> {
    return this.validationRuleMasterDataService.addValidationRuleMasterAsync(request);
  }

  getValidationRulesMasterAsync(tableConfig: TableConfigModel): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.isComNeeded = true;
    return this.validationRuleMasterDataService.getValidationRulesMasterAsync(request);
  }

  updateValidationRulesMasterAsync(id: number, isActive: boolean): Observable<HttpResponse<any>> {
    var request = {
      ruleId: id,
      isActive: isActive
    };
    return this.validationRuleMasterDataService.updateValidationRulesMasterAsync(request);
  }

  deleteValidationRuleMasterAsync(id: number): Observable<HttpResponse<any>> {
    var request = {
      ruleId: id
    };
    return this.validationRuleMasterDataService.deleteValidationRuleMasterAsync(request);
  }

  addValidationRuleAsync(request: any): Observable<HttpResponse<any>> {
    request.jid = this.dataService.journalId;
    return this.validationRuleMasterDataService.addValidationRuleAsync(request);
  }

  getValidationRulesByJournalAsync(tableConfig: TableConfigModel): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    request.jid = this.dataService.journalId;
    request.date = this.dataService.runDate ? this.dataService.runDate : "";
    return this.validationRuleMasterDataService.getValidationRulesByJournalAsync(request);
  }

  updateValidationRuleActivityAsync(id: number, isActive: boolean): Observable<HttpResponse<any>> {
    var request = {
      jid: this.dataService.journalId,
      ruleId: id,
      isActive: isActive
    };
    return this.validationRuleMasterDataService.updateValidationRuleActivityAsync(request);
  }

  deleteValidationRuleAsync(id: number): Observable<HttpResponse<any>> {
    var request = {
      jid: this.dataService.journalId,
      ruleId: id
    };
    return this.validationRuleMasterDataService.deleteValidationRuleAsync(request);
  }

  getValidationRuleSetsByTemplateAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.validationRuleMasterDataService.getValidationRuleSetsByTemplateAsync(templateId);
  }

  getValidationRuleSetsByTemplate(response: any): Array<RuleSetModel>{
    var result: Array<RuleSetModel> = new Array<RuleSetModel>();
    if(response && response.ruleSetDetails){
      for(var index=0; index<response.ruleSetDetails.length; index++){
        var ruleSet: RuleSetModel = new RuleSetModel();
        ruleSet.id = response.ruleSetDetails[index].ruleSetId;
        ruleSet.name = response.ruleSetDetails[index].name;
        ruleSet.template = new TemplateMasterPartialModel();
        ruleSet.template.id = response.ruleSetDetails[index].template.id;
        ruleSet.template.name = response.ruleSetDetails[index].template.name;
        ruleSet.rules = new Array<ValidationRulesModel>();
        if(response.ruleSetDetails[index].rules){
          for(var cnt=0; cnt<response.ruleSetDetails[index].rules.length; cnt++){
            var rule = new ValidationRulesModel();
            rule.id = response.ruleSetDetails[index].rules[cnt];
            ruleSet.rules.push(rule);
          }
        }
        result.push(ruleSet);
      }
    }
    return result;
  }

  getValidationRulesByTemplate(response: any): Array<ValidationRulesByTemplateModel> {
    var result: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
    if(response && response.ruleDetails) {
      for(var index=0; index<response.ruleDetails.length; index++){
        var rule = new ValidationRulesByTemplateModel();
        rule.id = response.ruleDetails[index].ruleId;
        rule.name = response.ruleDetails[index].name;
        rule.ruleCommand = response.ruleDetails[index].ruleCommand;
        rule.isSelected = false;
        result.push(rule);
      }
    }
    return result;
  }

  saveValidationRuleSetAsync(ruleSet: RuleSetModel): Observable<HttpResponse<any>> {
    var request: any = {};
    request.ruleSetDetails = {};
    request.ruleSetDetails.ruleSetId = ruleSet.id;
    request.ruleSetDetails.name = ruleSet.name;
    request.ruleSetDetails.template = new TemplateMasterPartialModel(ruleSet.template.id, ruleSet.template.name);
    request.ruleSetDetails.rules = new Array<number>();
    if(ruleSet.rules){
      for(var index=0; index<ruleSet.rules.length; index++){
        request.ruleSetDetails.rules.push(ruleSet.rules[index].id);
      }
    }
    return this.validationRuleMasterDataService.saveValidationRuleSetAsync(request);
  }

  updateValidationRulesInRuleSetForJournal(ruleSetId: number, rules: Array<ValidationRulesByTemplateModel>): Observable<HttpResponse<any>> {
    var request: any = {};
    request.jid = this.dataService.journalId;
    request.ruleSetId = ruleSetId;
    request.rules = [];
    if(rules){
      for(var index=0; index<rules.length; index++){
        var req = {
          ruleId: rules[index].id,
          isSelected: rules[index].isSelected
        };
        request.rules.push(req);
      }
    }
    return this.validationRuleMasterDataService.updateValidationRulesInRuleSetForJournal(request);
  }

  deleteRuleSetAsync(ruleSetId: number): Observable<HttpResponse<any>> {
    var request: any = {
      ruleSetId: ruleSetId
    };
    return this.validationRuleMasterDataService.deleteRuleSetAsync(request);
  }
}
