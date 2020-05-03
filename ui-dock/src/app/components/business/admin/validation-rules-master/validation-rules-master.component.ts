/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { ValidationRulesModel, ValidationRulePropertyModel, ColumnListModel, RuleSetModel, 
  ValidationRulesByTemplateModel, CombinedQueryModel } from 'src/app/models/validationRules.model';
import { ValidationRuleCategoryModel } from 'src/app/models/validationRuleCategory.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { OperatorModel } from 'src/app/models/operator.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { ComboboxOptions } from 'src/app/components/ui/combobox/combobox-options';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';


@Component({
  selector: 'app-validation-rules-master',
  templateUrl: './validation-rules-master.component.html',
  styleUrls: ['./validation-rules-master.component.scss']
})
export class ValidationRulesMasterComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }
  
  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_0, 
    this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_1, this.constantLoaderService.tabListTextsService.VALIDATION_RULE_MASTER_2];
  activeTab: string = this.tabList[0];
  newRule: ValidationRulesModel = new ValidationRulesModel();
  firstCombinedRuleProperty: CombinedQueryModel = new CombinedQueryModel();
  secondCombinedRuleProperty: CombinedQueryModel = new CombinedQueryModel();
  selectedTemplate: string = "";
  validationRuleCategoryList: Array<ValidationRuleCategoryModel> = new Array<ValidationRuleCategoryModel>();
  andOrList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_ANDOR_LIST;
  andOrWhereList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_ANDORWHERE_LIST;
  operationList: Array<object> = this.constantLoaderService.defaultValuesService.VALIDATION_RULE_OPERATION_LIST;
  combinedOperator: string = "";
  templateList: Array<TemplateMasterPartialModel> = [];
  columnList: Array<ColumnListModel> = [];
  selectedTemplateList: Array<TemplateMasterPartialModel> = [];
  allOperatorList: Array<OperatorModel> = [];
  operatorList: Array<OperatorModel> = [];
  finalQuery: string = "";
  isSubmit: boolean = false;
  validationRules: Array<ValidationRulesModel> = new Array<ValidationRulesModel>();
  deletingRuleId: number = 0;
  validationRuleSet: RuleSetModel = new RuleSetModel();
  ruleSetList: Array<RuleSetModel> = new Array<RuleSetModel>();
  isNewRuleSet: boolean = false;
  ruleListByTemplate: Array<ValidationRulesByTemplateModel> = new Array<ValidationRulesByTemplateModel>();
  isDeletingRuleset: boolean = false;
  tableConfigModel: TableConfigModel = new TableConfigModel();
  totalRulesCount: number = 0;
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.VALIDATION_RULE_LIST);

  ngOnInit() {
    this.initPageConfig();
    this.loadOperators();
    this.loadValidationRuleCategoryList();
    this.loadTemplateList();
    this.loadValidationRules();
    this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
  }

  private initPageConfig() {
    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.VALIDATION_RULE_LIST);
    this.tableConfigModel.pageIndex = 0;
  }

  private loadOperators(){
    this.allOperatorList = this.businessLoaderService.operatorJsonBusinessService.getOperatorListForValidationRule();
  }

  private loadTemplateList(){
    this.isLoading = true;
    this.templateList = [];
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body){
        for(var index=0; index<res.body.length; index++){
          if(res.body[index].isActive){
            this.templateList.push({id: res.body[index].templateId, name: res.body[index].templateName});
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  private loadColumnList(){
    this.isLoading = true;
    var ids: Array<number> = [];
    for(var index=0; index<this.selectedTemplateList.length; index++){
      ids.push(this.selectedTemplateList[index].id);
    }
    this.columnList = new Array<ColumnListModel>();
    if(ids.length === 0){
      this.isLoading = false;
      return;
    }
    this.businessLoaderService.templateMasterBusinessService.getAllTemplateColumnsAsync(ids).subscribe(res => {
      if(res.body){
        for(var index=0; index<res.body.length; index++){
          if(res.body[index].columnName){
            for(var cnt=0; cnt<res.body[index].columnName.length; cnt++){
              if(this.columnList.findIndex(c => c.code === res.body[index].columnName[cnt]) < 0){
                var col = new ColumnListModel();
                col.code = res.body[index].columnName[cnt];
                col.name = res.body[index].columnName[cnt];
                this.columnList.push(col);
              }
            }
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err);
      this.isLoading = false;
    });
  }

  private loadValidationRules(){
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.getValidationRulesMasterAsync(this.tableConfigModel).subscribe(res => {
      if(res.body){
        if(res.body.data){
          this.validationRules = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRules(res.body.data);
        }
        if(res.body.totalCount){
          this.totalRulesCount = res.body.totalCount;
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadValidationRuleCategoryList(){
    this.validationRuleCategoryList = this.businessLoaderService.adminUiJsonBusinessService.getValidationRuleCategoryList();
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

  private loadRuleSetsByTemplate(templateId: number){
    this.isLoading = true;
    this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplateAsync(templateId).subscribe(res => {
      if(res.body){
        this.ruleListByTemplate = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRulesByTemplate(res.body);
        this.ruleSetList = this.businessLoaderService.validationRuleMasterBusinessService.getValidationRuleSetsByTemplate(res.body);
        this.validationRuleSet.id = 0;
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  isNewRule(index: number, combinedIndex: number = 0) {
    var isNew: boolean = false;
    if( this.newRule.combinedQueries[combinedIndex].ruleProperties.length === 1) {
      if( index === 0) {
        isNew = true;
      }
    } else {
      if( index > 0 && index === this.newRule.combinedQueries[combinedIndex].ruleProperties.length -1 ) {
        isNew = true;
      }
    }
    return isNew;
  }

  getAndOrWhereComboOptions(ctrlId: string, queryIndex: number, modelValue: any) {
    var comboOptions: ComboboxOptions = {
      ctrlId: ctrlId,
      key: "code",
      label:"",
      list: this.andOrWhereList,
      model: modelValue,
      value: "name",
      isHide: this.isSpecificRuleQueryItemHide('isAndOrShow') || queryIndex === 0
    }
    return comboOptions;
  }

  populateOperationList(func: string) {
    var list: Array<OperatorModel> = [];
    if(func && func !== "") {
      list = this.allOperatorList.filter(opr => opr.functionsApplicable.findIndex(fn => fn === func) >=0)
    }
    return list;
  }

  populateValueList(func: string) {
    var list: Array<OperatorModel> = [];
    if(func && func!== undefined && func !== "") {
      list = this.allOperatorList.filter(opr => opr.functionsApplicable.findIndex(fn => fn === func) >=0)
    }
    return list;
  }

  onSetActiveClick() {
    this.newRule.isActive = !this.newRule.isActive;
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

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      this.isSubmit = false;
      this.onResetRule();
    }
  }

  addTemplateToRule(){
    if(this.selectedTemplate && parseInt(this.selectedTemplate) > 0){
      if(this.selectedTemplateList && this.selectedTemplateList.length > 0){
        if(this.selectedTemplateList.findIndex(t => t.id === parseInt(this.selectedTemplate))>-1){
          return;
        }
      }
      this.selectedTemplateList.push(this.templateList.find(t => t.id === parseInt(this.selectedTemplate) ));
      this.loadColumnList();
    }
  }

  isSpecificRuleQueryItemHide(key: string): boolean{
    if(this.validationRuleCategoryList && this.newRule.category){
      return !this.validationRuleCategoryList.find(c => c.code === this.newRule.category)[key];
    }
    return true;
  }

  isOperatorValueHide(key: string, prop: ValidationRulePropertyModel, valueType: string): boolean {
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
        if(this.newRule.ruleProperties.length === 0){
          this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
        }
        this.buildQuery();
      }
    }
  }

  onDeleteRuleConditionProperty(index: number){
    if(this.newRule.conditionProperties[index]){
      this.newRule.conditionProperties.splice(index, 1);
      if(this.newRule.conditionProperties.length > 0){
        this.newRule.conditionProperties[0].andOr = "";
      } else {
        this.newRule.conditionProperties.push(new ValidationRulePropertyModel());
      }
      this.buildQuery();
    }
  }

  onCategoryChanged(event: any){
    this.secondCombinedRuleProperty.ruleProperties = [];
    this.firstCombinedRuleProperty.ruleProperties = [];
    this.newRule.combinedQueries = [];
    if(event.item.code === "combined") {
      this.firstCombinedRuleProperty.ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries.push(this.firstCombinedRuleProperty);
      this.secondCombinedRuleProperty.ruleProperties.push(new ValidationRulePropertyModel());
      this.newRule.combinedQueries.push(this.secondCombinedRuleProperty);
      this.newRule.isCondition = false;
      this.newRule.conditionProperties = new Array<ValidationRulePropertyModel>();
    }
    this.buildQuery();
  }

  onAndOrChanged(combinedQuery?: CombinedQueryModel){
    this.buildQuery(combinedQuery);
  }

  onTemplateColumChanged(combinedQuery?: CombinedQueryModel){
    this.buildQuery(combinedQuery);
  }

  onValueChanged(combinedQuery?: CombinedQueryModel){
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

  onChangeValueType(prop: ValidationRulePropertyModel){
    if(prop){
      if(this.constantLoaderService.defaultValuesService.MATH_OPERATIONS.indexOf(prop.operation) >= 0) {
        return;
      }
      prop.value = "";
      prop.isValueNumeric = !prop.isValueNumeric;
      prop.valueTypeText =  (prop.isValueNumeric) ? "123" : "Abc";
    }
  }

  onRemoveTemplate(template: TemplateMasterPartialModel){
    if(template){
      this.selectedTemplateList.splice(this.selectedTemplateList.findIndex(t => t.id === template.id), 1);
      this.loadColumnList();
    }
  }

  onSubmitRule(){
    this.isSubmit = true;
    if(this.activeTab === this.tabList[1]){
      if(!this.newRule){
        return;
      }
      if(this.newRule.name.trim().length === 0 || this.newRule.category.length === 0){
        return;
      }
      if(this.selectedTemplateList.length === 0){
        return;
      }
      if(this.newRule.ruleProperties.length === 0){
        return;
      }

      this.isLoading = true;
      var request = this.businessLoaderService.validationRuleMasterBusinessService.createRequestForAddValidationRuleMaster(
        this.newRule, this.finalQuery, this.selectedTemplateList, this.validationRuleCategoryList);
      if(request){
        this.businessLoaderService.validationRuleMasterBusinessService.addValidationRuleMasterAsync(request).subscribe(res => {
          if(res.body && res.body.isSuccess){
            this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is saved successfully");
            this.onResetRule();
            this.loadValidationRules();
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
    } else {
      if(!this.validationRuleSet.template.id || this.validationRuleSet.template.id === 0){
        return;
      }
      if(this.validationRuleSet.name === undefined || this.validationRuleSet.name === null || 
        this.validationRuleSet.name.trim() === ""){
        this.handlerLoaderService.notificationHandlerService.showWarning("Validation rule set name is required!");
        return;
      }
      this.validationRuleSet.rules = new Array<ValidationRulesModel>();
      for(var index=0; index<this.ruleListByTemplate.length; index++){
        if(this.ruleListByTemplate[index].isSelected){
          this.validationRuleSet.rules.push(new ValidationRulesModel(this.ruleListByTemplate[index].id));
        }
      }
      this.businessLoaderService.validationRuleMasterBusinessService.saveValidationRuleSetAsync(this.validationRuleSet).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.loadRuleSetsByTemplate(this.validationRuleSet.template.id);
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule set is saved successfully");
        }
        this.isLoading = false;
        this.isSubmit = false;
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }
  onResetRule(){
    this.isSubmit = false;
    this.newRule = new ValidationRulesModel();
    this.newRule.ruleProperties.push(new ValidationRulePropertyModel());
    this.firstCombinedRuleProperty = new CombinedQueryModel();
    this.secondCombinedRuleProperty = new CombinedQueryModel();
    this.combinedOperator = "";
    this.columnList = new Array<ColumnListModel>();
    this.selectedTemplateList = [];
    this.selectedTemplate = "";
    this.finalQuery = "";
  }

  getTemplatesInString(templates: any): string{
    var resulṯ: string = "";
    if(templates){
      if(templates.length > 0){
        for(var index=0; index<templates.length; index++){
          resulṯ += ((index>0) ? ", " : "") + templates[index].tablename;
        }
      }
    }
    return resulṯ;
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
      this.businessLoaderService.validationRuleMasterBusinessService.updateValidationRulesMasterAsync(rule.id, !rule.isActive).subscribe(res => {
        if(res.body && res.body.isSuccess){
          rule.isActive = !rule.isActive;
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is updated successfully");
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
      return;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.validationRuleMasterBusinessService.deleteValidationRuleMasterAsync(ruleId).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.deletingRuleId = 0;
          this.loadValidationRules();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Validation rule is deleted successfully");
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

  onNewRuleSetClick(isNew: boolean = false){
    this.isNewRuleSet = isNew;
    if(isNew){
      for(var index=0; index<this.ruleListByTemplate.length; index++){
        this.ruleListByTemplate[index].isSelected = false;
      }
      this.validationRuleSet.id = 0;
    }
    this.validationRuleSet.name = "";
    this.isDeletingRuleset = false;
  }

  onRuleSetChanged(obj: any) {
    if(obj){
      this.validationRuleSet.id = obj.item.id;
      this.validationRuleSet.name = obj.item.name;
      var selectedruleSet: RuleSetModel = this.ruleSetList.find(r => r.id === obj.item.id);
      if(selectedruleSet && selectedruleSet.rules){
        for(var index=0; index<this.ruleListByTemplate.length; index++){
          this.ruleListByTemplate[index].isSelected = 
            (selectedruleSet.rules.findIndex(r => r.id === this.ruleListByTemplate[index].id) > -1);
        }
      }
    }
  }

  getRuleViewValue(rule: ValidationRulesByTemplateModel): string {
    if(rule){
      return rule.name + " [" + rule.ruleCommand + "]";
    }
    return "";
  }

  onRuleSelectionClick(rule: ValidationRulesByTemplateModel){
    rule.isSelected = !rule.isSelected;
  }

  onRuleSetLoadByTemplateChanged(obj: any){
    this.ruleListByTemplate = new Array<ValidationRulesByTemplateModel>();
    this.ruleSetList = new Array<RuleSetModel>();
    if(obj){
      this.loadRuleSetsByTemplate(obj.item.id);
      this.validationRuleSet.template.id = obj.item.id;
      this.validationRuleSet.template.name = obj.item.name;
    }
  }

  onDeleteRuleSetClick(rulesetId: number, isDelete: boolean){
    if(rulesetId){
      if(isDelete === null){
        this.isDeletingRuleset = true;
      }else if(isDelete){
        this.isLoading = true;
        this.businessLoaderService.validationRuleMasterBusinessService.deleteRuleSetAsync(rulesetId).subscribe(res => {
          if(res.body){
            if(res.body.isSuccess){
              this.handlerLoaderService.notificationHandlerService.showSuccess("Rule Set is deleted successfully.");
              var obj: any = {
                item: {
                  id: this.validationRuleSet.template.id,
                  name: this.validationRuleSet.template.name
                }
              };
              this.onRuleSetLoadByTemplateChanged(obj);
            } else {
              var msg: string = "Rule Set is using";
              if(res.body.jidList){
                msg += " by " + res.body.jidList.length.toString() + " journal(s)!";
              }
              this.handlerLoaderService.notificationHandlerService.showWarning(msg);
            }
          }
          this.isLoading = false;
          this.isDeletingRuleset = false;
        }, err => {
          this.isLoading = false;
          this.handlerLoaderService.errorHandlerService.handleError(err);
        });
      }else{
        this.isDeletingRuleset = false;
      }
    }
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadValidationRules();
    }
  }

  onPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadValidationRules();
    }
  }
}
