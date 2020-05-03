import { Injectable } from '@angular/core';
import { OutputHeaderTemplateDataService } from '../data/output-header-template-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { OutputHeaderMappingColumnmsModel, OutputHeaderTemplateModel } from 'src/app/models/outputHeaderTemplate.model';
import { templateIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class OutputHeaderTemplateBusinessService {

  constructor(private headerTemplateDataService: OutputHeaderTemplateDataService) { }

  private createRequestObject(templateId: templateIdType, outputHeaders: Array<OutputHeaderTemplateModel>) {
    var request: any = {};
    var tmpOutputHeaderItem: any = {};
    request.templateId = templateId;
    request.mappingColumns = [];

    if(outputHeaders && outputHeaders.length > 0) {
      for(var index = 0; index < outputHeaders.length; index++) {
        tmpOutputHeaderItem = {};
        tmpOutputHeaderItem.sequene = outputHeaders[index].seq;
        tmpOutputHeaderItem.label = outputHeaders[index].label;
        tmpOutputHeaderItem.mappingType = outputHeaders[index].typ;
        tmpOutputHeaderItem.mappingCol = outputHeaders[index].mappingCol;
        tmpOutputHeaderItem.colLabel = outputHeaders[index].colLabel;
        request.mappingColumns.push(tmpOutputHeaderItem);
      }
    }
    return request;
  }

  transformResponseToModel(response: any): Array<OutputHeaderTemplateModel> {
    let tmpHeaderModel: OutputHeaderTemplateModel = new OutputHeaderTemplateModel();
    let transformedArray: Array<OutputHeaderTemplateModel> = [];
    if(response.body && response.body.mappingColumns && response.body.mappingColumns.length > 0) {
      var mappingColumns = response.body.mappingColumns;
      for(var index = 0 ; index < mappingColumns.length; index++) {
        tmpHeaderModel = new OutputHeaderTemplateModel();
        tmpHeaderModel.seq = mappingColumns[index].sequene;
        tmpHeaderModel.label = mappingColumns[index].label;
        tmpHeaderModel.mappingCol = mappingColumns[index].mappingCol;
        tmpHeaderModel.typ = mappingColumns[index].mappingType;
        tmpHeaderModel.colLabel = mappingColumns[index].colLabel;
        transformedArray.push(tmpHeaderModel);
      }
    }
    return transformedArray;
  }

  getHeaderTemplateByTemplateIdAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.headerTemplateDataService.getHeaderTemplateByTemplateIdAsync(templateId);
  }

  getHeaderMappingListAsync(): Observable<HttpResponse<any>> {
    return this.headerTemplateDataService.getHeaderMappingListAsync();
  }

  saveHeaderTemplateAsync(templateId: templateIdType, outputHeaders: Array<OutputHeaderTemplateModel>): Observable<HttpResponse<any>> {
    var request = this.createRequestObject(templateId, outputHeaders);
    console.log(request);
    return this.headerTemplateDataService.saveHeaderTemplateAsync(request);
  }
}
