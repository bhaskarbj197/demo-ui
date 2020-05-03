/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { CompanyModel } from 'src/app/models/company.model';
import { companyIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss']
})
export class CompanyMasterComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private constantLoaderService: ConstantLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.COMPANY_MASTER_0, 
    this.constantLoaderService.tabListTextsService.COMPANY_MASTER_1];
  activeTab: string = this.tabList[0];
  isSubmit: boolean = false;
  companyList: Array<CompanyModel> = new Array<CompanyModel>();
  newCompany: CompanyModel = new CompanyModel();
  deletingCompanyId: companyIdType = null;

  ngOnInit() {
    this.loadCompanyList();
  }

  private loadCompanyList(){
    this.isLoading = true;
    this.businessLoaderService.companyBusinessService.getCompanyDetailListAsync().subscribe(res => {
      if(res.body){
        this.companyList = this.businessLoaderService.companyBusinessService.getCompanyDetailList(res.body);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private updateCompany(comapny: CompanyModel, isActiveUpdate: boolean = false){
    this.businessLoaderService.companyBusinessService.updateCompanyAsync(comapny).subscribe(res => {
      if(res.body && res.body.isSuccess){
        if(!isActiveUpdate){
          this.handlerLoaderService.notificationHandlerService.showSuccess("Company is updated successfully.");
          this.loadCompanyList();
          this.onResetCompany();
          this.activeTab = this.tabList[0];
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onResetCompany(){
    this.newCompany = new CompanyModel();
  }

  onSubmitCompany(){
    this.isSubmit = true;
    if(!this.newCompany || this.newCompany.name.trim() === ""){
      return;
    }
    this.isLoading = true;
    if(this.newCompany.id === null){
      this.businessLoaderService.companyBusinessService.addCompanyAsync(this.newCompany).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.handlerLoaderService.notificationHandlerService.showSuccess("New company is created successfully.");
          this.loadCompanyList();
          this.onResetCompany();
          this.activeTab = this.tabList[0];
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else {
      this.updateCompany(this.newCompany);
    }
  }

  onChangedActiveTab(obj: any){
    if(obj){
      this.activeTab = obj.activeTab;
      this.onResetCompany();
    }
  }

  onEditCompany(company: CompanyModel){
    if(company){
      this.isLoading = true;
      this.businessLoaderService.companyBusinessService.getCompanyDetailsByIdAsync(company.id).subscribe(res => {
        if(res.body){
          this.newCompany = this.businessLoaderService.companyBusinessService.getCompanyDetailsById(res.body);
          this.activeTab = this.tabList[1];
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  getLockIcon(company: CompanyModel){
    if(company.isActive){
      return "fa fa-unlock-alt";
    }
    return "fa-lock";
  }

  onUpdateCompany(company: CompanyModel){
    company.isActive = !company.isActive;
    this.updateCompany(company);
  }

  onSetActiveClick() {
    this.newCompany.isActive = !this.newCompany.isActive;
  }

  onDeleteCompany(companyId: companyIdType, isConfirm: boolean = undefined){
    if(isConfirm === undefined){
      this.deletingCompanyId = companyId;
      return;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.companyBusinessService.deleteCompanyAsync(companyId).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.deletingCompanyId = null;
          this.loadCompanyList();
          this.handlerLoaderService.notificationHandlerService.showSuccess("Company is deleted successfully.");
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    } else{
      this.deletingCompanyId = null;
    }
  }
}
