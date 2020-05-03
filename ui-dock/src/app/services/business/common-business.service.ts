/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { CommonDataService } from '../data/common-data.service';
import { UiJsonDataService } from '../data/ui-json-data.service';
import { TableColumnModel } from 'src/app/models/tableColumn.model';

@Injectable({
  providedIn: 'root'
})
export class CommonBusinessService {

  constructor(private commonDataService: CommonDataService,
    private uiJsonDataService: UiJsonDataService) { }

  private generateRequestBody(requestParams: any ): any {
    var requestBody = {};
    requestBody = Object.assign(requestParams);
    requestBody["folder"] = requestParams.folder ? requestParams.folder : "";
    requestBody["file"] = requestParams.file ? requestParams.file : "";
    requestBody["evidenceType"] = requestParams.evidenceType ? requestParams.evidenceType : "";
    return requestBody;
  }

  downloadEvidenceAsync(requestParams: any, responseType: string) {
    let requestBody: any;
    requestBody = this.generateRequestBody(requestParams);
    return this.commonDataService.downloadEvidenceAsync(requestBody, responseType);
  }

  getQuickHelps(){
    return this.uiJsonDataService.getQuickHelps();
  }

  getTableHeadersByCode(code: string): Array<TableColumnModel>{
    var headers = this.uiJsonDataService.getTableHeaders();
    var result: Array<TableColumnModel> = new Array<TableColumnModel>();
    if(code){
      if(headers.findIndex(h => h.code === code) >= 0){
        var cols = headers.find(h => h.code === code).columns;
        for(var index=0; index<cols.length; index++){
          var col: TableColumnModel = new TableColumnModel();
          col.value = cols[index].value;
          col.css = cols[index].css;
          col.isCenter = cols[index].isCenter;
          col.width = cols[index].width;
          col.isAbleToSort = cols[index].isAbleToSort;
          col.linkedProperty = cols[index].linkedProperty;
          result.push(col);
        }
      }
    }
    return result;
  }

  getTableITemPerPageByCode(code: string): number {
    var headers = this.uiJsonDataService.getTableHeaders();
    var result: number = 0;
    if(code){
      if(headers.findIndex(h => h.code === code) >= 0){
        result = headers.find(h => h.code === code).itemPerPage;
      }
    }
    return result;
  }
}
