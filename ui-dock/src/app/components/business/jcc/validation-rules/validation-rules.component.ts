/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ValidationRulesModel, ValidationRulePropertyModel, ColumnListModel, 
  RuleSetModel, ValidationRulesByTemplateModel, CombinedQueryModel } from '../../../../models/validationRules.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { OperatorModel } from 'src/app/models/operator.model';
import { ValidationRuleCategoryModel } from 'src/app/models/validationRuleCategory.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { DataService } from 'src/app/services/data.service';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-validation-rules',
  templateUrl: './validation-rules.component.html',
  styleUrls: ['./validation-rules.component.scss']
})
export class ValidationRulesComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private dataService: DataService,
    private broadcaster: Broadcaster,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_0, 
    this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_1,
    this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_2a];
  activeTab: string = this.tabList[0];
  newRule: ValidationRulesModel = new ValidationRulesModel();
  validationRuleListByJournal: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
  validationRuleCategoryList: Array<ValidationRuleCategoryModel> = new Array<ValidationRuleCategoryModel>();
  operatorList: Array<OperatorModel> = [];
  finalQuery: string = "";
  isSubmit: boolean = false;
  andOrWhereList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_ANDORWHERE_LIST;
  andOrList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_ANDOR_LIST;
  operationList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_OPERATION_LIST;
  allOperatorList: Array<OperatorModel> = [];
  columnList: Array<ColumnListModel> = [];
  validationRuleAddFrom: string = "";
  deletingRuleId: number = 0;
  ruleSetList: Array<RuleSetModel> = new Array<RuleSetModel>();
  allMasterRulesByTemplate: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
  ruleSetRuleList: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
  workingRuleSet: RuleSetModel = new RuleSetModel();
  template: TemplateMasterPartialModel = new TemplateMasterPartialModel();
  tableConfigModel: TableConfigModel = new TableConfigModel();
  totalRulesCount: number = 0;
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.VALIDATION_RULE_LIST_BY_JOURNAL);

  ngOnInit() {
    if(!this.dataService.aboutDetails.journalInfo.template){
      return;
    }

    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.VALIDATION_RULE_LIST_BY_JOURNAL);
    this.tableConfigModel.pageIndex = 0;

    this.template.id = this.dataService.aboutDetails.journalInfo.template.id;
    this.template.name = this.dataService.aboutDetails.journalInfo.template.name;

    this.loadValidationRuleCategoryList();
    this.loadOperators();
    this.loadRuleSetWithMasterRuleListList();
    this.loadValidationRuleListByJournal();
    this.loadColumnList();
    this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
  }

  private loadRuleSetWithMasterRuleListList(){
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplateAsync(this.template.id).subscribe(res => {
      if(res.body){
        this.allMasterRulesByTemplate = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRulesByTemplate(res.body);
        this.ruleSetList = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplate(res.body);
        if(this.dataService.aboutDetails.riskManagement.businessRules){
          var obj = {
            item: {
              id: this.dataService.aboutDetails.riskManagement.businessRules.id,
              name: this.dataService.aboutDetails.riskManagement.businessRules.name
            }
          };
          this.onRuleSetChanged(obj);
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadValidationRuleListByJournal(){
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.getValidationRulesByJournalAsync(this.tableConfigModel).subscribe(res => {
      if(res.body && res.body.data){
        this.validationRuleListByJournal = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRules(res.body.data);
        if(res.body.data.ruleSetDetails){
          var obj = {
            item: {
              id: res.body.data.ruleSetDetails.id,
              name: this.ruleSetList.find(r => r.id === res.body.data.ruleSetDetails.id).name
            }
          };
          this.onRuleSetChanged(obj, res.body.data.ruleSetDetails);
        }
        if(res.body.totalCount){
          this.totalRulesCount = res.body.totalCount;
        }
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadValidationRuleCategoryList(){
    this.validationRuleCategoryList = this.businessLoaderService.adminUiJsonBusinessService.getValidationRuleCategoryList();
  }

  private loadOperators(){
    this.allOperatorList = this.businessLoaderService.operatorJsonBusinessService.getOperatorListForValidationRule();
  }

  private buildQuery(combinedQuery?: CombinedQueryModel){
    setTimeout(() => {
      this.finalQuery = "";
      var res = "";
      res = this.businessLoaderService.validationRuleMasterBusinessService.buildNewRuleQuery(this.newRule, combinedQuery) + " " +
        this.businessLoaderService.validationRuleMasterBusinessService.buildNewRuleConditionQuery(this.newRule);
      
      if(this.newRule.category === "combined" && combinedQuery) {
        combinedQuery.queryString = res;        
        for(var index = 0; index < this.newRule.combinedQueries.length; index++){
          if(this.newRule.combinedQueries[index].operator !== "") {
            this.finalQuery = this.constantLoaderService.defaultValuesService.OPEN_PARENTHESIS +
            this.finalQuery + this.constantLoaderService.defaultValuesService.CLOSE_PARENTHESIS + 
            this.newRule.combinedQueries[index].operator + 
            this.constantLoaderService.defaultValuesService.OPEN_PARENTHESIS +
            this.newRule.combinedQueries[index].queryString  + 
            this.constantLoaderService.defaultValuesService.CLOSE_PARENTHESIS;
          } else {
            this.finalQuery = this.finalQuery + this.newRule.combinedQueries[index].queryString;
          }
        }
      } else {
        this.finalQuery = res;
      }
      this.finalQuery = this.finalQuery.trim();
      for(var cnt=0; cnt<this.andOrList.length; cnt++){
        if(this.andOrList[cnt]["code"].trim().length>0){
          if(this.finalQuery.indexOf(this.andOrList[cnt]["code"]) === 0){
            this.finalQuery = this.finalQuery.substr(this.andOrList[cnt]["code"].length);
          }
        }
      }
    }, 2);
  }

  private loadColumnList(){
    this.isLoading = true;
    this.columnList = new Array<ColumnListModel>();
    this.businessLoaderService.templateMasterBusinessService.getAllTemplateColumnsAsync([this.template.id]).subscribe(res => {
      if(res.body){
        for(var index=0; index<res.body.length; index++){
          if(res.body[index].columnName){
            for(var cnt=0; cnt<res.body[index].columnName.length; cnt++){
              var col = new ColumnListModel();
              col.code = res.body[index].columnName[cnt];
              col.name = res.body[index].columnName[cnt];
              this.columnList.push(col);
            }
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private saveNewRule(){
    this.isSubmit = true;
    var request: any = {};
    if(!this.newRule){
      return;
    }
    if(this.newRule.name.trim().length === 0 || this.newRule.category.length === 0){
      return;
    }
    if(this.newRule.category === "combined") {
      if (this.newRule.combinedQueries.length === 0) {
        return;
      }
    } else {
      if (this.newRule.ruleProperties.length === 0) {
        return;
      } else {
        if (this.newRule.ruleProperties.findIndex(prop => prop.columnName === undefined || prop.columnName === null || prop.columnName === "") >= 0) {
          return;
        }
      }
    }
    
    if(!this.dataService.aboutDetails.journalInfo.template){
      return;
    }
    this.isLoading = true;
    var templates: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
    templates.push(this.template);
    request = this.businessLoaderService.validationRuleMasterBusinessService.createRequestForAddValidationRuleMaster(
      this.newRule, this.finalQuery, templates, this.validationRuleCategoryList, false);
    
    if(request){
      this.businessLoaderService.validationRuleMasterBusinessService.addValidationRuleAsync(request).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is saved successfully.");
          this.onResetRule();
          this.loadValidationRuleListByJournal();
        }
        this.isLoading = false;
        this.isSubmit = false;
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      this.isLoading = false;
      this.isSubmit = false;
    }
  }

  private updateRuleSet(){
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.updateValidationRulesInRuleSetForJournal(this.workingRuleSet.id, this.ruleSetRuleList).subscribe(res => {
      if(res.body && res.body.isSuccess){
        this.handlerLoaderService.notificationHandlerService.showSuccess("Business rule is saved successfully.");
        this.loadValidationRuleListByJournal();
        this.dataService.aboutDetails.riskManagement.businessRules.id = this.workingRuleSet.id;
        this.dataService.aboutDetails.riskManagement.businessRules.name = this.workingRuleSet.name;
        this.broadcaster.send(this.constantLoaderService.broadcastNamesService.UPDATE_BUSINESS_RULES);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  isNewRule(index: number, combinedIndex: number = 0) {
    var isNew: boolean = false;
    if(this.newRule.combinedQueries[combinedIndex].ruleProperties.length === 1) {
      if(index === 0) {
        isNew = true;
      }
    } else {
      if(index > 0 && index === this.newRule.combinedQueries[combinedIndex].ruleProperties.length -1) {
        isNew = true;
      }
    }
    return isNew;
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      this.isSubmit = false;
      this.onResetRule();
    }
  }

  onSetConditionClick() {
    this.newRule.isCondition = !this.newRule.isCondition;
    if(this.newRule.isCondition){
      this.newRule.conditionProperties.push(new ValidationRulePropertyModel());
    }else{
      this.newRule.conditionProperties = new Array<ValidationRulePropertyModel>();
    }
    this.buildQuery();
  }

  onSubmitRule(){
    if(this.activeTab === this.tabList[1]){
      this.saveNewRule();
    } else {
      this.updateRuleSet();
    }
  }

  onResetRule(){
    this.isSubmit = false;    
    this.newRule = new ValidationRulesModel();
    this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
    this.finalQuery = "";
  }

  onCategoryChanged(event){
    var queryModel1 = new CombinedQueryModel();
    var queryModel2 = new CombinedQueryModel()
    if(event.item.code === "combined") {
      queryModel1.ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries.push(queryModel1);
      queryModel2.ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries.push(queryModel2);
      this.newRule.isCondition = false;
      this.newRule.conditionProperties = new Array<ValidationRulePropertyModel>();
    }
    this.buildQuery();
  }

  onSetActiveClick() {
    this.newRule.isActive = !this.newRule.isActive;
  }

  onAndOrChanged(combinedQuery?: CombinedQueryModel){
    this.buildQuery(combinedQuery);
  }

  isValidRuleProperty(ruleProp: ValidationRulePropertyModel, categoryChosen: ValidationRuleCategoryModel) {
    if(categoryChosen.isAndOrShow) {
      if(this.generalUtility.isEmptyOrUndefined(ruleProp.andOr)) {
        return false;
      }
    }
    if(categoryChosen.isColumnListShow) {
      if(this.generalUtility.isEmptyOrUndefined(ruleProp.columnName)) {
        return false;
      }      
    }
    if(categoryChosen.isOperatorShow) {
      if(this.generalUtility.isEmptyOrUndefined(ruleProp.operationValue)
        || this.generalUtility.isEmptyOrUndefined(ruleProp.operation)) {
        return false;
      }
    }
    if(categoryChosen.isDestColumnValueShow) {
      if(this.generalUtility.isEmptyOrUndefined(ruleProp.value)) {
        return false;
      }
    }
    return true;
  }

  isSpecificRuleQueryItemHide(key: string): boolean{
    if(this.validationRuleCategoryList && this.newRule.category){
      return !this.validationRuleCategoryList.find(c => c.code === this.newRule.category)[key];
    }
    return true;
  }

  onTemplateColumChanged(combinedQuery?: CombinedQueryModel){
    this.buildQuery(combinedQuery);
  }

  onOprtStrtEndValueChanged(event?: any, prop?: ValidationRulePropertyModel, combinedQuery?: CombinedQueryModel){
    this.operatorList = this.allOperatorList;
    if(event.item && event.item.name && event.item.name !== "" && prop) {
      prop.operationObj = event.item;
      prop.operationValue = "";
      prop.isValueNumeric = (this.constantLoaderService.defaultValuesService.MATH_OPERATIONS.indexOf(event.item.name) >= 0) ? true : false;
      prop.valueTypeText =  (prop.isValueNumeric) ? "123" : "Abc";
      prop.value = "";
      prop.valueControlHidden = event.item.valueControlHidden !== undefined ? event.item.valueControlHidden : false;
      this.operatorList = this.populateOperationList(event.item.name);
    }
    this.buildQuery(combinedQuery);
  }

  populateOperationList(func: string) {
    var list: Array<OperatorModel> = [];
    if(func && func !== "") {
      list = this.allOperatorList.filter(opr => opr.functionsApplicable.findIndex(fn => fn === func) >=0)
    }
    return list;
  }

  onValueChanged(combinedQuery?: CombinedQueryModel){
    this.buildQuery(combinedQuery);
  }

  isOperatorValueHide(key: string, prop: ValidationRulePropertyModel, valueType: string): boolean{
    var result: boolean = true;
    if(this.validationRuleCategoryList && this.newRule.category){
      result = !this.validationRuleCategoryList.find(c => c.code === this.newRule.category)[key];
      if(!result){
        if(prop.operation.length === 0){
          return true;
        }
        for(var index=0; index<this.operationList.length; index++){
          if(this.operationList[index]["name"] === prop.operation){
            if(valueType === "list"){
              return !this.operationList[index]["isList"];
            }
            return this.operationList[index]["isList"];
          }
        }
      }
    }
    return result;
  }

  isOperatorValueHideForCondition(prop: ValidationRulePropertyModel, valueType: string): boolean {
    var result: boolean = true;
    if(prop.operation.length === 0){
      return true;
    }
    for(var index=0; index<this.operationList.length; index++){
      if(this.operationList[index]["name"] === prop.operation){
        if(valueType === "list"){
          return !this.operationList[index]["isList"];
        }
        return this.operationList[index]["isList"];
      }
    }
    return result;
  }

  onChangeValueType(prop: ValidationRulePropertyModel){
    if(prop){
      prop.value = "";
      prop.isValueNumeric = !prop.isValueNumeric;
      prop.valueTypeText =  (prop.isValueNumeric) ? "123" : "Abc";
    }
  }

  onAddNewRuleProperty(ruleCategory?: string, index?: number){
    if(ruleCategory && ruleCategory !== "" && ruleCategory === "combined") {
      this.newRule.combinedQueries[index].ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries[index].ruleProperties[this.newRule.combinedQueries[index].ruleProperties.length-1].andOr = 
        this.constantLoaderService.defaultValuesService.DEFAULT_AND_OR_VALUE;
    } else {
      this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.ruleProperties[this.newRule.ruleProperties.length-1].andOr = 
        this.constantLoaderService.defaultValuesService.DEFAULT_AND_OR_VALUE;
    }
  }

  onAddNewRuleConditionProperty(ruleCategory?: string, index?: number){
    if(ruleCategory && ruleCategory !== "" && ruleCategory === "combined") {
      this.newRule.combinedQueries[index].conditionProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries[index].conditionProperties[this.newRule.combinedQueries[index].conditionProperties.length-1].andOr = 
        this.constantLoaderService.defaultValuesService.DEFAULT_AND_OR_VALUE;
    } else {
      this.newRule.conditionProperties.push(new ValidationRulePropertyModel());
      this.newRule.conditionProperties[this.newRule.conditionProperties.length-1].andOr = 
        this.constantLoaderService.defaultValuesService.DEFAULT_AND_OR_VALUE;
    }
  }

  onDeleteRuleProperty(index: number, combineQuery?: CombinedQueryModel){
    if(combineQuery &&  combineQuery.ruleProperties[index]){
      combineQuery.ruleProperties.splice(index, 1);
      if(combineQuery.ruleProperties.length > 0) {
        combineQuery.ruleProperties[0].andOr = "";        
      } else {
        combineQuery.ruleProperties.push(new ValidationRulePropertyModel());
      }
      this.buildQuery(combineQuery);
    } else {
      if(this.newRule.ruleProperties[index]){
        this.newRule.ruleProperties.splice(index, 1);
        if(this.newRule.conditionProperties.length > 0){
          this.newRule.conditionProperties[0].andOr = "";
        } else {
          this.newRule.conditionProperties.push(new ValidationRulePropertyModel());
        }
        this.buildQuery();
      }
    }
  }

  onDeleteRuleConditionProperty(index: number){
    if(this.newRule.conditionProperties[index]){
      this.newRule.conditionProperties.splice(index, 1);
      this.buildQuery();
    }
  }

  getTemplatesInString(templates: any): string{
    if(templates.length>0){
      return templates[0].tablename;
    }
    return "";
  }

  getLockIcon(rule: ValidationRulesModel): string{
    if(rule.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onUpdateActivity(rule: ValidationRulesModel){
    if(rule){
      this.isLoading = true;
      this.businessLoaderService.validationRuleMasterBusinessService.updateValidationRuleActivityAsync(rule.id, !rule.isActive).subscribe(res => {
        if(res.body && res.body.isSuccess){
          rule.isActive = !rule.isActive;
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is updated successfully.");
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  onDeleteRuleClick(ruleId: number, isConfirm: boolean = undefined){
    if(isConfirm === undefined){
      this.deletingRuleId = ruleId;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.validationRuleMasterBusinessService.deleteValidationRuleAsync(ruleId).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.deletingRuleId = 0;
          this.loadValidationRuleListByJournal();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is deleted successfully.");
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else{
      this.deletingRuleId = 0;
    }
  }

  onRuleSetChanged(obj: any, rulesetObj: Array<object> = null) {
    if(obj){
      this.workingRuleSet.id = obj.item.id;
      this.workingRuleSet.name = obj.item.name;
      var selectedruleSet: RuleSetModel = this.ruleSetList.find(r => r.id === obj.item.id);
      this.ruleSetRuleList = new Array<ValidationRulesByTemplateModel>();
      if(selectedruleSet && selectedruleSet.rules){
        for(var index=0; index<this.allMasterRulesByTemplate.length; index++){
          if(selectedruleSet.rules.findIndex(r => r.id === this.allMasterRulesByTemplate[index].id) >= 0){
            this.ruleSetRuleList.push(this.allMasterRulesByTemplate[index]);
          }
        }
        this.ruleSetRuleList.filter(r => r.isMaster = true);
        this.ruleSetRuleList.filter(r => r.isSelected = true);
        if(rulesetObj && rulesetObj["rules"]){
          for(var index=0; index<this.ruleSetRuleList.length; index++){
            for(var cnt=0; cnt<rulesetObj["rules"].length; cnt++){
              if(this.ruleSetRuleList[index].id === rulesetObj["rules"][cnt].ruleId){
                this.ruleSetRuleList[index].isSelected = rulesetObj["rules"][cnt].isSelected;
              }
            }
          }
        }
      }
    }
  }

  onRuleSelectionClick(rule: ValidationRulesByTemplateModel){
    rule.isSelected = !rule.isSelected;
  }

  getRuleViewValue(rule: ValidationRulesByTemplateModel): string {
    if(rule){
      return rule.name + " [" + rule.ruleCommand + "]";
    }
    return "";
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadValidationRuleListByJournal();
    }
  }

  onPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadValidationRuleListByJournal();
    }
  }
}
