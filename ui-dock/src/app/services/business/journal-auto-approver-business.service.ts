import { Injectable } from '@angular/core';
import { JournalAutoApproverRuleModel, JournalAutoApproverRuleCondition, JournalAutoApproverRuleActionType, JournalAutoApproverRuleException } from 'src/app/models/journalAutoApproverRule.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { DataService } from '../data.service';
import { JournalAutoApproverDataService } from '../data/journal-auto-approver-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';

@Injectable({
  providedIn: 'root'
})
export class JournalAutoApproverBusinessService {

  constructor(private constantLoaderService: ConstantLoaderService,
    private enumLoaderService: EnumLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private dataService: DataService,
    private journalAutoApproverData: JournalAutoApproverDataService) { }

  private getRequestBuild(ruleModel: JournalAutoApproverRuleModel): any{
    var request: any = {};
    request.comments = "Conditions: ";
    request.id = ruleModel.id;
    request.category = (ruleModel.category.length > 0) ? ruleModel.category : "standard";
    request.template = ruleModel.template;
    request.conditions = [];
    if(ruleModel.conditions && ruleModel.conditions.length > 0){
      for(var index=0; index<ruleModel.conditions.length; index++){
        var cond: any = {};
        cond.columnName = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.COLUMN) ? 
          ruleModel.conditions[index].columnName : "";
        cond.operator = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.COLUMN) ? 
          ruleModel.conditions[index].operator : "";
        cond.value = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.COLUMN) ? 
          ruleModel.conditions[index].value : "";
        cond.andOr = ruleModel.conditions[index].andOr;
        cond.typ = ruleModel.conditions[index].typ;
        cond.startWorkday = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.WORKDAY) ? 
          parseInt(ruleModel.conditions[index].startWorkday.replace(this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH, "").trim()) : 0;
        cond.endWorkday = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.WORKDAY) ? 
          parseInt(ruleModel.conditions[index].endWorkday.replace(this.constantLoaderService.defaultValuesService.WORKDAY_START_WITH, "").trim()) : 0;
        cond.reviewer = (ruleModel.conditions[index].typ === this.enumLoaderService.journalAutoApproverConditionTypes.REVIEWER) ? 
          ruleModel.conditions[index].reviewer : null;
        request.conditions.push(cond);
        request.comments += " " + cond.andOr;
        if(cond.typ === this.enumLoaderService.journalAutoApproverConditionTypes.COLUMN){
          request.comments += " [" + cond.columnName + "] " + cond.operator + " " + cond.value;
        } else if(cond.typ === this.enumLoaderService.journalAutoApproverConditionTypes.REVIEWER){
          request.comments += " " + cond.reviewer;
        } else if(cond.typ === this.enumLoaderService.journalAutoApproverConditionTypes.WORKDAY){
          request.comments += " " + ruleModel.conditions[index].startWorkday + " to " + 
            ruleModel.conditions[index].endWorkday;
        }
      }
    }
    request.action = {
      code: ruleModel.action.code,
      value: ruleModel.action.value
    };
    request.actionReviewer2 = ruleModel.actionReviewer2;
    request.comments += " | Action: " + ruleModel.action.value;
    request.isException = ruleModel.isException;
    if(ruleModel.isException){
      request.exception = ruleModel.exception;
      request.exception.action = {
        code: ruleModel.exception.action.code,
        value: ruleModel.exception.action.value
      };
    } else {
      request.exception = null;
    }
    if(ruleModel.isException){
      if(ruleModel.exception.group1){
        request.comments += " | Exception: (#)" + ruleModel.exception.group1.groupName + " = " + ruleModel.exception.group1.element + "; ";
      }
      if(ruleModel.exception.group2){
        request.comments += " | Exception: (#)" + ruleModel.exception.group2.groupName + " = " + ruleModel.exception.group2.element;
      }
    }
    request.createdOn = this.handlerLoaderService.momentDateHandlerService.getCurrentTimestamp();
    request.createdBy = this.dataService.user.id;
    request.updatedOn = (ruleModel.id>0) ? this.handlerLoaderService.momentDateHandlerService.getCurrentTimestamp() : null;
    request.updatedBy = (ruleModel.id>0) ? this.dataService.user.id : null;
    request.isBlocked = false;
    return request;
  }

  public getRuleListAsync(): Observable<HttpResponse<any>> {
    return this.journalAutoApproverData.getRuleListAsync();
  }

  public getRuleList(response: any): Array<JournalAutoApproverRuleModel>{
    var result: Array<JournalAutoApproverRuleModel> = new Array<JournalAutoApproverRuleModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var rule: JournalAutoApproverRuleModel = new JournalAutoApproverRuleModel();
        rule.id = response[index].id;
        rule.category = response[index].category ? response[index].category : "";
        rule.template = response[index].template ? response[index].template : new TemplateMasterPartialModel();
        rule.conditions = response[index].conditions ? response[index].conditions : new Array<JournalAutoApproverRuleCondition>();
        rule.action = response[index].action ? response[index].action : new JournalAutoApproverRuleActionType();
        rule.exception = response[index].exception ? response[index].exception : new JournalAutoApproverRuleException();
        rule.isException = response[index].isException ? response[index].isException : false;
        rule.createdOn = response[index].createdOn ? response[index].createdOn : null;
        rule.createdBy = response[index].createdBy ? response[index].createdBy : null;
        rule.updatedOn = response[index].updatedOn ? response[index].updatedOn : null;
        rule.updatedBy = response[index].updatedBy ? response[index].updatedBy : null;
        rule.comments = response[index].comments ? response[index].comments : "";
        rule.isBlocked = response[index].isBlocked ? response[index].isBlocked : true;
        rule.condText = "";
        for(var cnt=0; cnt<rule.conditions.length; cnt++){
          if(rule.conditions[cnt].andOr.length > 0){
            rule.condText += " " + rule.conditions[cnt].andOr + " ";
          }
          rule.condText += "(";
          if(rule.conditions[cnt].typ === this.enumLoaderService.journalAutoApproverConditionTypes.COLUMN){
            rule.condText += "[" + rule.conditions[cnt].columnName + "] " + rule.conditions[cnt].operator + " " + rule.conditions[cnt].value;
          } else if(rule.conditions[cnt].typ === this.enumLoaderService.journalAutoApproverConditionTypes.REVIEWER){
            rule.condText += " " + rule.conditions[cnt].reviewer;
          } else if(rule.conditions[cnt].typ === this.enumLoaderService.journalAutoApproverConditionTypes.WORKDAY){
            rule.condText += " " + rule.conditions[cnt].startWorkday + " to " + 
              rule.conditions[cnt].endWorkday;
          }
          rule.condText += ")";
        }

        result.push(rule);
      }
    }
    return result;
  }

  public saveRuleAsync(ruleModel: JournalAutoApproverRuleModel): Observable<HttpResponse<any>> {
    if(ruleModel === null || ruleModel === undefined){
      return;
    }
    if(ruleModel.id>0){
      return this.journalAutoApproverData.updateRuleAsync(this.getRequestBuild(ruleModel));
    }
    return this.journalAutoApproverData.saveRuleAsync(this.getRequestBuild(ruleModel));
  }

  public deleteRuleAsync(ruleId: number): Observable<HttpResponse<any>> {
    var request: any = {
      id: ruleId
    };
    return this.journalAutoApproverData.deleteRuleAsync(request);
  }

  public saveRuleStatusAsync(ruleId: number, isBlocked: boolean): Observable<HttpResponse<any>> {
    var request: any = {
      id: ruleId,
      isBlocked: isBlocked
    };
    return this.journalAutoApproverData.saveRuleStatusAsync(request);
  }
}
