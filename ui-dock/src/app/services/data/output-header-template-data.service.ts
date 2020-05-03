import { Injectable } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OutputHeaderTemplateDataService {

  constructor(private constantLoaderService: ConstantLoaderService, 
    private dataService: DataAccessService) { }

  getHeaderTemplateByTemplateIdAsync(templateId: number): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(
      this.constantLoaderService.relativeUrlsService.GET_HEADER_TEMPLATE_BY_TEMPLATEID.replace("{templateId}", templateId.toString()));
  }

  getHeaderMappingListAsync(): Observable<HttpResponse<any>> {
    return this.dataService.getAsync(this.constantLoaderService.relativeUrlsService.GET_HEADER_MAPPING_LIST);
  }

  saveHeaderTemplateAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataService.postAsync(this.constantLoaderService.relativeUrlsService.POST_ADD_HEADER_TEMPLATE, request);
  }
}
