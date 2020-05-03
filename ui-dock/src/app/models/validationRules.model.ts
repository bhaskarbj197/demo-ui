/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { TemplateMasterPartialModel } from './templateMaster.model';

export class ValidationRulesModel {
    id: number;
    name: string;
    category: string;
    description: string;
    ruleCommand: string;
    isActive: boolean;
    isMaster?: boolean;
    isCondition?: boolean;
    masterId?: number;
    templates: Array<TemplateMasterPartialModel>;
    ruleProperties: Array<ValidationRulePropertyModel>;
    conditionProperties: Array<ValidationRulePropertyModel>;
    combinedQueries: Array<CombinedQueryModel>;
    disabledInMasterSelection?: boolean;

    constructor(id: number = 0, name: string = "", category: string = "", description: string = "", 
        rule: string = "", isActive: boolean = true, isMaster: boolean = true, isCondition: boolean = false,
        ruleProperties: Array<ValidationRulePropertyModel> = new Array<ValidationRulePropertyModel>(),
        conditionProperties: Array<ValidationRulePropertyModel> = new Array<ValidationRulePropertyModel>(),
        combinedQueries: Array<CombinedQueryModel> = new Array<CombinedQueryModel>()){
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.ruleCommand = rule;
        this.isActive = isActive;
        this.isCondition = isCondition;
        this.isMaster = isMaster;
        this.ruleProperties = ruleProperties;
        this.conditionProperties = conditionProperties;
        this.disabledInMasterSelection = false;
        this.combinedQueries = combinedQueries;
    }
}

export class CombinedQueryModel {
    ruleProperties: Array<ValidationRulePropertyModel>;
    conditionProperties: Array<ValidationRulePropertyModel>;
    operator: string = "";
    queryString: string = "";

    constructor(ruleProperties: Array<ValidationRulePropertyModel> = new Array<ValidationRulePropertyModel>(),
        conditionProperties: Array<ValidationRulePropertyModel> = new Array<ValidationRulePropertyModel>(),
        operator: string = "", queryString: string = "") {
            this.ruleProperties = ruleProperties;
            this.conditionProperties = conditionProperties;
            this.operator = operator;
            this.queryString = queryString;
    }
}

export class ValidationRulePropertyModel {
    columnName: string;
    operation: string;
    operationObj: any;
    operationValue: string;
    destColumn: string;
    value: string;
    isValueNumeric: boolean;
    valueTypeText: string;
    andOr: string;
    isConditionalProperty: boolean;
    valueControlHidden: boolean

    constructor(columnName: string = "", operation: string = "", operationValue: string = "", 
        destColumn: string = "", value: string = "", andOr: string = "", isValueNumeric: boolean = false,
        valueTypeText: string = "Abc", isConditionalProperty: boolean = false, valueHidden: boolean = false,
        operationObj: any = new Object()){
        this.columnName = columnName;
        this.operation = operation;
        this.operationValue = operationValue;
        this.destColumn = destColumn;
        this.value = value;
        this.andOr = andOr;
        this.isValueNumeric = isValueNumeric;
        this.valueTypeText = (valueTypeText && valueTypeText!=="") ? valueTypeText : 
                                (isValueNumeric ? "123" : "Abc");
        this.isConditionalProperty = isConditionalProperty;
        this.valueControlHidden = valueHidden;
        this.operationObj = operationObj;
    }
}

export class ColumnListModel {
    code: string;
    name: string;
    
    constructor(code: string = "", name: string = ""){
        this.code = code;
        this.name = name;
    }
}

export class RuleSetModel {
    id: number;
    name: string;
    template: TemplateMasterPartialModel;
    rules: Array<ValidationRulesModel>;
    
    constructor(id: number = 0, name: string = "", template: TemplateMasterPartialModel = new TemplateMasterPartialModel(),
        rules: Array<ValidationRulesModel> = new Array<ValidationRulesModel>()){
        this.id = id;
        this.name = name;
        this.template = template;
        this.rules = rules;
    }
}

export class ValidationRulesByTemplateModel extends ValidationRulesModel {
    isSelected: boolean;

    constructor(id: number = 0, name: string = "", category: string = "", description: string = "", 
        rule: string = "", isActive: boolean = true, isMaster: boolean = true, isCondition: boolean = false,
        ruleProperties: Array<ValidationRulePropertyModel> = new Array<ValidationRulePropertyModel>(), 
        isSelected: boolean = false) {
        super(id, name, category, description, rule, isActive, isCondition, isMaster, ruleProperties);
        this.isSelected = isSelected;
    }
}