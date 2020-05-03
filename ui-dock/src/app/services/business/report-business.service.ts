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
import { ReportDataService } from '../data/report-data.service';
import { ReprtJournalPostingSmryModel } from 'src/app/models/reprtJournalPostingSmry.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { JournalPostingRprtFilterPropertyModel } from 'src/app/models/journalPostingRprtFilterProperty.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ReportBusinessService {

  constructor(private reportData: ReportDataService,
    private generalUtility: GeneralUtility,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  private createRequestBody(searchByOptions: JournalPostingRprtFilterPropertyModel,
    tableConfig: TableConfigModel, heading: string, code: string): any {
      var request : any = this.generalUtility.getTableConfigRequest(tableConfig);
      if(searchByOptions.month > 0){
        request.currentMonth = searchByOptions.month - 1;
      } else {
        request.currentMonth = null;
      }
      if(searchByOptions.startDate && searchByOptions.endDate){
        request.startDate = this.handlerLoaderService.momentDateHandlerService.getStringFromDateObject(searchByOptions.startDate);
        request.endDate = this.handlerLoaderService.momentDateHandlerService.getStringFromDateObject(searchByOptions.endDate);
      } else {
        request.startDate = null;
        request.endDate = null;
      }
      request.runStatus = searchByOptions.runStatus.replace(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO, "");
      request.postingStatus = searchByOptions.postingStatus.replace(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO, "");
      request.documentIdCheck = searchByOptions.documentIdCheck.replace(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO, "");
      request.reportInfo = {
        code: code,
        name: heading + " Report"
      };
      return request;
  }

  convertResponseToModel(response: any): Array<ReprtJournalPostingSmryModel> {
    var result: Array<ReprtJournalPostingSmryModel> = new Array<ReprtJournalPostingSmryModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var smry: ReprtJournalPostingSmryModel = new ReprtJournalPostingSmryModel();
        smry.documentId = response[index].documentId ? response[index].documentId : null;
        smry.journalId = response[index].jId ? response[index].jId : 0;
        smry.journalName = response[index].journalName ? response[index].journalName : "";
        smry.message = response[index].message ? response[index].message : null;
        smry.postingDate = response[index].postingDateErp ? response[index].postingDateErp : null;
        smry.postingStatus = response[index].postingStatus ? response[index].postingStatus : null;
        smry.runDate = response[index].runDate ? response[index].runDate : null;
        smry.runStatus = response[index].runStatus ? response[index].runStatus : "";
        smry.frequency = response[index].runType ? response[index].runType : "";
        smry.message = response[index].message ? response[index].message : "";
        result.push(smry);
      }
    }
    return result;
  }

  getJournalSummaryReportAsync(searchByOptions: JournalPostingRprtFilterPropertyModel,
                                      tableConfig: TableConfigModel, heading: string, 
                                      code: string): Observable<HttpResponse<any>> {
    var request : any = this.createRequestBody(searchByOptions, tableConfig, heading, code);
    return this.reportData.getJournalSummaryReportAsync(request);
  }

  
  downloadReportAsync(searchByOptions: JournalPostingRprtFilterPropertyModel,
                      tableConfig: TableConfigModel, heading: string, 
                      code: string, responseType: any): Observable<HttpResponse<any>> {
      var request : any = this.createRequestBody(searchByOptions, tableConfig, heading, code);
    return this.reportData.downloadReportAsync(request, responseType);
  }
}
