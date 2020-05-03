/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../../services/data/ui-json-data.service';
import { FunctionModel, FunctionTabModel } from '../../models/function.model';

@Injectable({
  providedIn: 'root'
})
export class FunctionsUiJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService) { }

  private jsonTemplate = this.uiJsonDataService.getFunctionsUiJson();

  public getfunctionList(): Array<FunctionModel>{
    let functionList = new Array<FunctionModel>();
    for(var index=0; index<this.jsonTemplate.length; index++){
      let fnctn = new FunctionModel();
      fnctn.id = this.jsonTemplate[index].id;
      fnctn.code = this.jsonTemplate[index].code;
      fnctn.name = this.jsonTemplate[index].name;
      fnctn.isVisible = this.jsonTemplate[index].isVisible;
      fnctn.isInputTableDisabled = this.jsonTemplate[index].isInputTableDisabled ? this.jsonTemplate[index].isInputTableDisabled : false;
      fnctn.isNoCommand = this.jsonTemplate[index].isNoCommand ? this.jsonTemplate[index].isNoCommand : false;
      fnctn.isManualEntryBox = this.jsonTemplate[index]["isManualEntryBox"] ? this.jsonTemplate[index]["isManualEntryBox"] : false;
      fnctn.isExcelFunction = this.jsonTemplate[index].isExcelFunction ? this.jsonTemplate[index].isExcelFunction : false;
      fnctn.tabs = new Array<FunctionTabModel>();
      for(var cnt=0; cnt<this.jsonTemplate[index].tabs.length; cnt++){
        let fTab = new FunctionTabModel();
        fTab.id = this.jsonTemplate[index].tabs[cnt].id;
        fTab.name = this.jsonTemplate[index].tabs[cnt].name;
        fTab.typ = this.jsonTemplate[index].tabs[cnt].typ;
        fTab.isFunctionBox = this.jsonTemplate[index].tabs[cnt].isFunctionBox;
        fTab.isColumnBox = this.jsonTemplate[index].tabs[cnt].isColumnBox;
        fTab.isTableBox = this.jsonTemplate[index].tabs[cnt].isTableBox ? this.jsonTemplate[index].tabs[cnt].isTableBox : false;
        fTab.isOperatorBox = this.jsonTemplate[index].tabs[cnt].isOperatorBox;
        fTab.isValueBox = this.jsonTemplate[index].tabs[cnt].isValueBox;
        fTab.displayStatus = this.jsonTemplate[index].tabs[cnt].displayStatus;
        fTab.isNewColumnMandatory = this.jsonTemplate[index].tabs[cnt]["isNewColumnMandatory"] ? this.jsonTemplate[index].tabs[cnt]["isNewColumnMandatory"] : false;
        fTab.isNewColumnDisabled = this.jsonTemplate[index].tabs[cnt]["isNewColumnDisabled"] ? this.jsonTemplate[index].tabs[cnt]["isNewColumnDisabled"] : false;
        fTab.stepDataList = [];
        fnctn.tabs.push(fTab);
      }
      functionList.push(fnctn);
    }
    return functionList.filter(f => f.isVisible);
  }
}
