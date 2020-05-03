/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../../services/data/ui-json-data.service';
import { OperatorModel } from '../../models/operator.model';

@Injectable({
  providedIn: 'root'
})
export class OperatorJsonBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService) { }

  private jsonTemplate = this.uiJsonDataService.getOperatorJson();

  private getOperatorList(): Array<OperatorModel>{
    let operatorList = new Array<OperatorModel>();
    for(var index=0; index<this.jsonTemplate.length; index++){
      let oprt = new OperatorModel();
      oprt.code = this.jsonTemplate[index].code;
      oprt.value = this.jsonTemplate[index].value;
      oprt.typ = this.jsonTemplate[index].typ;
      oprt.help = this.jsonTemplate[index].help;
      oprt.isValueCoded = this.jsonTemplate[index].isValueCoded;
      oprt.isApplyInValidationRule = this.jsonTemplate[index].isApplyInValidationRule;
      oprt.isApplyInStepCreation = this.jsonTemplate[index].isApplyInStepCreation;
      oprt.isApplyInAutoApproverRule = this.jsonTemplate[index].isApplyInAutoApproverRule;
      oprt.functionsApplicable = this.jsonTemplate[index].functionsApplicable ? this.jsonTemplate[index].functionsApplicable:[];
      operatorList.push(oprt);
    }
    return operatorList;
  }

  public getOperatorListForValidationRule(): Array<OperatorModel> {
    return this.getOperatorList().filter(o => o.isApplyInValidationRule);
  }

  public getOperatorListForStepCreation(): Array<OperatorModel> {
    return this.getOperatorList().filter(o => o.isApplyInStepCreation);
  }

  public getOperatorListForAutoApproverRule(): Array<OperatorModel> {
    return this.getOperatorList().filter(o => o.isApplyInAutoApproverRule);
  }
}
