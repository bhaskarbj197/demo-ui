/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../../services/data/ui-json-data.service';
import { RuleModel, RuleParamModel } from '../../models/rule.model';
import { ExcelFunctionListModel } from 'src/app/models/function.model';

@Injectable({
  providedIn: 'root'
})
export class RuleJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService) { }

  private jsonTemplate = this.uiJsonDataService.getRulesUiJson();

  public getRuleList(): Array<RuleModel>{
    let ruleList = new Array<RuleModel>();
    for(var index=0; index<this.jsonTemplate.length; index++){
      if(this.jsonTemplate[index].isVisible){
        let rule = new RuleModel();
        rule.id = this.jsonTemplate[index].id;
        rule.code = this.jsonTemplate[index].code;
        rule.name = this.jsonTemplate[index].name;
        rule.params = new Array<RuleParamModel>();
        rule.helpText = "";
        for(var cnt=0; cnt<this.jsonTemplate[index].params.length; cnt++){
          let param = new RuleParamModel();
          param.seq = this.jsonTemplate[index].params[cnt].seq;
          param.typ = this.jsonTemplate[index].params[cnt].typ;
          param.value = this.jsonTemplate[index].params[cnt].value;
          param.isUserEntry = this.jsonTemplate[index].params[cnt].isUserEntry;
          param.isActive = false;
          rule.params.push(param);
          if(this.jsonTemplate[index].params[cnt].typ !== "func"){
            rule.helpText += this.jsonTemplate[index].params[cnt].value + " ";
          }
        }
        ruleList.push(rule);
      }
    }
    return ruleList;
  }

  public getRuleListForExcel(): Array<ExcelFunctionListModel>{
    let ruleList = new Array<ExcelFunctionListModel>();
    for(var index=0; index<this.jsonTemplate.length; index++){
      if(this.jsonTemplate[index].isVisible){
        let rule = new ExcelFunctionListModel();
        rule.name = this.jsonTemplate[index].name;
        rule.value = this.jsonTemplate[index].name;
        rule.isSelected = false;
        for(var cnt=0; cnt<this.jsonTemplate[index].params.length; cnt++){
          if(this.jsonTemplate[index].params[cnt].typ !== "func"){
            rule.value += this.jsonTemplate[index].params[cnt].value;
          } else {
            rule.typ = this.jsonTemplate[index].params[cnt].typ;
          }
        }
        ruleList.push(rule);
      }
    }
    return ruleList;
  }
}
