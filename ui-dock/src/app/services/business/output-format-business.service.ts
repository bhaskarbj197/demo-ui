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
import { OutputFormatDataService } from '../data/output-format-data.service';
import { OutputFormatModel } from 'src/app/models/outputFormat.model';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Injectable({
  providedIn: 'root'
})
export class OutputFormatBusinessService {

  constructor(private outputFormatData: OutputFormatDataService,
    private constantLoaderService: ConstantLoaderService) { }

  getOutputFormatListAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.outputFormatData.getOutputFormatListAsync(templateId);
  }

  getOutputFormatList(response: any): Array<OutputFormatModel> {
    var result: Array<OutputFormatModel> = new Array<OutputFormatModel>();
    var types: Array<object> = this.constantLoaderService.defaultValuesService.OUTPUT_FORMAT_TYPES;
    if(response.config && response.config.output){
      for(var index=0; index<response.config.output.length; index++){
        var frmt: OutputFormatModel = new OutputFormatModel();
        frmt.id = index+1;
        frmt.colName = response.config.output[index].colName;
        frmt.formatType = response.config.output[index].formatType;
        frmt.isPrefix = response.config.output[index].isPrefix;
        frmt.char = response.config.output[index].char;
        frmt.minLength = response.config.output[index].minLength;
        frmt.decimalPlace = response.config.output[index].decimalPlace;
        frmt.isError = false;
        if(types.findIndex(t => t["key"]===frmt.formatType)>=0){
          frmt.isCharShow = types.find(t => t["key"]===frmt.formatType)["chr"];
          frmt.isDecPlcShow = types.find(t => t["key"]===frmt.formatType)["dPlc"];
          frmt.isMinLenShow = types.find(t => t["key"]===frmt.formatType)["mLen"];
          frmt.isPrefixShow = types.find(t => t["key"]===frmt.formatType)["prfx"];
        } else {
          frmt.isCharShow = false;
          frmt.isDecPlcShow = false;
          frmt.isMinLenShow = false;
          frmt.isPrefixShow = false;
        }
        result.push(frmt);
      }
    }
    return result;
  }

  saveOutputFormatListAsync(outputFormatList: Array<OutputFormatModel>, 
    template: TemplateMasterPartialModel): Observable<HttpResponse<any>> {
    var request: any = {
      templateId: template.id,
      templateName: template.name,
      config: {
        output: []
      }
    };
    if(outputFormatList){
      for(var index=0; index<outputFormatList.length; index++){
        var otpt: any = {
          colName: outputFormatList[index].colName,
          formatType: outputFormatList[index].formatType,
          isPrefix: outputFormatList[index].isPrefix,
          char: outputFormatList[index].char,
          minLength: outputFormatList[index].minLength,
          decimalPlace: outputFormatList[index].decimalPlace
        };
        request.config.output.push(otpt);
      }
    }
    return this.outputFormatData.saveOutputFormatListAsync(request);
  }
}
