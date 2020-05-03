/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { ConstantLoaderService } from '../loaders/constant-loader.service';
import { HandlerLoaderService } from '../loaders/handler-loader.service';

let header = {};

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private http: HttpClient,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  private createRequestObject() {
    var reqInfo = {};
    reqInfo["userId"] = this.dataService.user.id.toString();
    reqInfo["roleId"] = this.dataService.user.role.id;
    reqInfo["roleName"] = this.dataService.user.role.roleName;
    reqInfo["companyId"] = this.dataService.user.company.id;
    reqInfo["companyName"] = this.dataService.user.company.name;
    return reqInfo;
  }

  private addAdditionalInfoToRequest(data: any): any {
    var reqInfo = {};
    if(this.dataService.isUserLoggedIn) {
      reqInfo = this.createRequestObject();

      data["reqInfo"] = reqInfo;
    }
    return data;
  }

  private addAdditionalInfoToFormData(formData: any): any {
    var reqInfo = {};
    if(this.dataService.isUserLoggedIn) {
      reqInfo = this.createRequestObject();
      
      formData.append("reqInfo", JSON.stringify(reqInfo));
    }
    return formData;
  }

  private getUrl(relativeUrl: string, orctMethodUrl: string = ""): string{
    if(this.constantLoaderService.configValuesService.IS_CONNECT_TO_ORCT){
      return (this.constantLoaderService.configValuesService.ORCT_BASE_URL + orctMethodUrl + 
        (this.constantLoaderService.configValuesService.IS_ORCT_URL_ENCRP ?
          this.handlerLoaderService.encryptionHandlerService.set(relativeUrl, true) : relativeUrl));
    }
    return (this.constantLoaderService.configValuesService.BASE_URL + relativeUrl);
  }

  private getRequestObject(data: any): any{
    if(this.constantLoaderService.configValuesService.IS_CONNECT_TO_ORCT){
      if(this.constantLoaderService.configValuesService.IS_ORCT_URL_ENCRP){
        var stringifyData = JSON.stringify(data);
        var result: {data: string;} = {
          data: this.handlerLoaderService.encryptionHandlerService.set(stringifyData)
        };
        return result;
      }
    }
    return data;
  }

  public getAsync(url:string): Observable<HttpResponse<any>> {
    return this.http.get(this.getUrl(url, this.constantLoaderService.configValuesService.ORCT_GET_URL), {
        headers: header,
        responseType: 'json',
        observe: 'response'
    });
  }

  public getInitInfoAsync(url:string): Observable<HttpResponse<any>> {
    return this.http.get(this.constantLoaderService.configValuesService.ORCT_BASE_URL + url, {
        headers: header,
        responseType: 'json',
        observe: 'response'
    });
  }

  public postAsync(url:string, data: any, resTYpe?: any): Observable<HttpResponse<any>> {
    data = this.addAdditionalInfoToRequest(data);
    data = this.getRequestObject(data);
    return this.http.post(this.getUrl(url, this.constantLoaderService.configValuesService.ORCT_POST_URL), data, {
        headers: header,
        responseType: resTYpe ? resTYpe: 'json',
        observe: 'response'
    });
  }

  public postFormAsync(url:string, data: any): Observable<HttpResponse<any>> {
    data = this.addAdditionalInfoToFormData(data);
    return this.http.post(this.getUrl(url, this.constantLoaderService.configValuesService.ORCT_POST_FORM_URL), data, {
        headers: header,
        responseType: 'json',
        observe: 'response'
    });
  }

  public putAsync(url:string, data: any): Observable<HttpResponse<any>> {
    data = this.addAdditionalInfoToRequest(data);
    data = this.getRequestObject(data);
    return this.http.put(this.getUrl(url, this.constantLoaderService.configValuesService.ORCT_PUT_URL), data, {
        headers: header,
        responseType: 'json',
        observe: 'response'
    });
  }

  public deleteAsync(url:string): Observable<HttpResponse<any>> {
    return this.http.delete(this.getUrl(url, this.constantLoaderService.configValuesService.ORCT_DELETE_URL), {
        headers: header,
        responseType: 'json',
        observe: 'response'
    });
  }
}
