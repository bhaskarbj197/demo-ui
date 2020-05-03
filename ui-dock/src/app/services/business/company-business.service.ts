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
import { CompanyDataService } from '../data/company-data.service';
import { CompanyModel } from 'src/app/models/company.model';
import { companyIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CompanyBusinessService {

  constructor(private companyData: CompanyDataService) { }

  getCompanyListAsync(): Observable<HttpResponse<any>> {
    return this.companyData.getCompanyListAsync();
  }

  getCompanyList(response: any): Array<CompanyModel> {
    var result: Array<CompanyModel> = new Array<CompanyModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var company = new CompanyModel();
        company.id = response[index].companyId;
        company.name = response[index].name;
        company.isActive = response[index].isActive;
        result.push(company);
      }
    }
    return result;
  }

  getCompanyDetailListAsync(): Observable<HttpResponse<any>> {
    return this.companyData.getCompanyDetailListAsync();
  }

  getCompanyDetailList(response: any): Array<CompanyModel> {
    var result: Array<CompanyModel> = new Array<CompanyModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var company: CompanyModel = new CompanyModel();
        company.id = response[index].companyid;
        company.name = response[index].name;
        company.logoPath = response[index].logo;
        company.isActive = response[index].isactive;
        result.push(company);
      }
    }
    return result;
  }

  addCompanyAsync(company: CompanyModel): Observable<HttpResponse<any>> {
    var request: any = {};
    if(company){
      request = {
        companyName: company.name,
        isActive: company.isActive,
        region: "",
        logo: company.logoPath,
        configFile: ""
      };
    }
    return this.companyData.addCompanyAsync(request);
  }

  getCompanyDetailsByIdAsync(companyId: companyIdType): Observable<HttpResponse<any>> {
    return this.companyData.getCompanyDetailsByIdAsync(companyId);
  }

  getCompanyDetailsById(response: any): CompanyModel {
    var result: CompanyModel = new CompanyModel();
    if(response && response.length>0){
      result.id = response[0].companyid;
      result.name = response[0].name;
      result.logoPath = response[0].logo;
      result.isActive = response[0].isactive;
    }
    return result;
  }

  updateCompanyAsync(company: CompanyModel): Observable<HttpResponse<any>> {
    var request: any = {};
    if(company){
      request = {
        companyId: company.id,
        companyName: company.name,
        isActive: company.isActive
      };
    }
    return this.companyData.updateCompanyAsync(request);
  }

  deleteCompanyAsync(companyId: companyIdType): Observable<HttpResponse<any>> {
    var request: any = {
      companyId: companyId
    };
    return this.companyData.deleteCompanyAsync(request);
  }
}
