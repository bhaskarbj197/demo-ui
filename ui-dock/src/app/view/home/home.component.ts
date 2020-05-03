/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../loaders/business-loader.service';
import { ConstantLoaderService} from '../../loaders/constant-loader.service';
import { JournalInfoModel } from 'src/app/models/journalInfo.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EnumLoaderService } from '../../loaders/enum-loader.service';
import { TemplateMasterReqResModel, TemplateMasterModel } from 'src/app/models/templateMaster.model';
import { AdhocJournalModel } from 'src/app/models/adhocJournal.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { journalIdType } from 'src/app/services/types';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService, 
    private router: Router, 
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService,
    private enumLoaderService: EnumLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }
  
  journalList: JournalInfoModel[] = new Array<JournalInfoModel>();
  journalAdhocList: Array<AdhocJournalModel> = new Array<AdhocJournalModel>();
  isLoading: boolean = false;
  isAdhocLoading = false;
  journalDeletingId: journalIdType = 0;
  journalCopyingId: journalIdType = 0;
  journalRunningId: journalIdType = 0;
  activeStatus: {status: string, typ: string} = {status: "", typ: ""};
  journalCatList: Array<object> = this.constantLoaderService.defaultValuesService.JOURNAL_CAT_LIST;
  journalTypeCatList: Array<object> = this.constantLoaderService.defaultValuesService.JOURNAL_TYPE_CAT_LIST;
  journalListCategory: string = this.journalCatList[0]["key"];
  journalTypeCategory: string = this.journalTypeCatList[0]["key"];
  journalMonthList: Array<object> = this.constantLoaderService.defaultValuesService.JOURNAL_MONTH_LIST;
  journalListMonth: string = this.journalMonthList[0]["key"];
  adhocPageConfig: TableConfigModel = new TableConfigModel();
  homePageConfig: TableConfigModel = new TableConfigModel();
  totalJournalCount: number = 0;
  totalAdhocCount: number = 0;
  homeTableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.JOURNAL_HOME_LIST);
  adhocTableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ADHOC_HOME_LIST);
  
  ngOnInit() {
    this.initPageConfig();
    this.getAllJournals();
    this.getAllAdhocJournal();
    this.loadAllTemplatesFromDB();
    this.dataService.templateMasterList = [];
    this.dataService.journalStatus = "";
    this.dataService.journalId = 0;
    this.dataService.journalViewMode = this.constantLoaderService.viewModesService.NONE;
    this.dataService.isJournalCopy = false;
  }

  private initPageConfig() {
    this.adhocPageConfig.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.ADHOC_HOME_LIST);
    this.adhocPageConfig.pageIndex = 0;
    this.homePageConfig.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.JOURNAL_HOME_LIST);
    this.homePageConfig.pageIndex = 0;
  }

  private loadAllTemplatesFromDB() {    
    let resArray: Array<TemplateMasterReqResModel> = [];
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body && res.body.length > 0) {
        resArray = res.body.filter(data => data.isActive);
        this.dataService.templateMasterList = resArray.map(tmp => new TemplateMasterModel().deserialize(tmp));
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private getAllJournals(){
    this.isLoading = true;
    var journalStatus = (this.activeStatus.typ === this.journalCatList[1]["key"]) ? this.activeStatus.status : "";
    var runStatus = (this.activeStatus.typ === this.journalCatList[2]["key"]) ? this.activeStatus.status : "";
    this.businessLoaderService.homeBusinessService.getJournalListAsync(this.homePageConfig, journalStatus, 
      runStatus, this.journalListCategory, parseInt(this.journalListMonth)-1).pipe(
      map((res : any) => {
        if(res.body.totalCount){
          this.totalJournalCount = res.body.totalCount;
        }
        return res.body.data.map((journal:JournalInfoModel) => new JournalInfoModel().deserialize(journal))
      })
    ).subscribe(result => {
      this.journalList = result;
      for(var index=0; index<this.journalList.length; index++){
        if(!this.journalList[index].runDate){
          this.journalList[index].runDate = "";
        }
      }
      
      this.isLoading = false;
      this.dataService.logs = [];
    },
    err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  getAllAdhocJournal(){
    this.isAdhocLoading = true;
    this.journalAdhocList = new Array<AdhocJournalModel>();
    this.businessLoaderService.adhocJournalBusinessService.getAllAdhocJournalsAsync(this.adhocPageConfig).subscribe(res => {
      if(res.body) {
        if(res.body.data && res.body.data.length > 0){
          this.journalAdhocList = this.businessLoaderService.adhocJournalBusinessService.getAllAdhocJournal(res.body.data);
        }
        if(res.body.totalCount){
          this.totalAdhocCount = res.body.totalCount;
        }
      }
      this.isAdhocLoading = false;
    }, err => {
      this.isAdhocLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onViewJournalClick(journalId: journalIdType, status: string) {
    this.dataService.logs = [];
    this.dataService.journalId = journalId;
    this.dataService.journalStatus = status;
    this.dataService.runDate = "";
    this.dataService.selectedRunHistoryDate = "";
    this.dataService.journalViewMode = this.constantLoaderService.viewModesService.VIEW;
    this.router.navigate(["jcc"]);
  }

  onEditJournalClick(journalId: journalIdType, status: string) {
    this.dataService.logs = [];
    this.dataService.journalId = journalId;
    this.dataService.journalStatus = status;
    this.dataService.runDate = "";
    this.dataService.selectedRunHistoryDate = "";
    this.dataService.journalViewMode = this.constantLoaderService.viewModesService.EDIT;
    this.router.navigate(["jcc"]);
  }

  onNewJournalClick(){
    this.dataService.logs = [];
    this.dataService.runDate = "";
    this.dataService.selectedRunHistoryDate = "";
    this.dataService.journalViewMode = this.constantLoaderService.viewModesService.NEW;
    this.router.navigate(["jcc"]);
  }

  onDownloadStepsClick(journalId: journalIdType) {
    this.generalUtility.download(null, null, null, this.constantLoaderService.configValuesService.BASE_URL 
      + this.constantLoaderService.relativeUrlsService.GET_DOWNLOAD_JOURNAL_STEPS + journalId as string);
  }

  onRunDateJournalClick(journalId: journalIdType, status: string){
    this.dataService.logs = [];
    this.dataService.journalId = journalId;
    this.dataService.journalStatus = status;
    this.dataService.runDate = "";
    this.dataService.selectedRunHistoryDate = "";
    this.dataService.journalViewMode = this.constantLoaderService.viewModesService.VIEW;
    this.router.navigate(["jeva"]);
  }

  onDeleteJournalClick(journalId: journalIdType, isConfirm: boolean){
    if(isConfirm === null){
      this.journalDeletingId = journalId;
    } else if(isConfirm){
      this.isLoading = true;
      this.businessLoaderService.homeBusinessService.deleteJournalById(journalId)
        .subscribe(res => { 
          this.journalDeletingId = 0;
          this.handlerLoaderService.notificationHandlerService.showSuccess(res.body.message);
          this.getAllJournals();
        }, err => {
          this.journalDeletingId = 0;
          this.isLoading = false;
          this.handlerLoaderService.errorHandlerService.handleError(err);
        });
    } else{
      this.journalDeletingId = 0;
    }
  }

  onCopyJournalClick(journalId: journalIdType, isConfirm: boolean){
    var requestBody = {};
    if(isConfirm === null){
      this.journalCopyingId = journalId;
    } else if(isConfirm){
        this.isLoading = true;
        requestBody[this.constantLoaderService.defaultValuesService.PARAM_JID] = journalId;
        this.businessLoaderService.homeBusinessService.copyToNewJournalAsync(requestBody).subscribe(res => {
          if(res.body && res.body.newJid) {
            this.dataService.isJournalCopy = true;
            this.onEditJournalClick(res.body.newJid, this.enumLoaderService.journalStatuses.IN_PROGRESS);
          }
          this.journalCopyingId = 0;
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this.handlerLoaderService.errorHandlerService.handleError(err);
        });
    } else{
      this.journalCopyingId = 0;
    }
  }

  onJournalStatusClick(obj: any){
    if(obj && obj.status){
      this.activeStatus = {status: obj.status, typ: this.journalCatList[1]["key"]};
      this.getAllJournals();
    }
  }

  onJournalRunStatusClick(obj: any){
    if(obj && obj.status){
      this.activeStatus = {status: obj.status, typ: this.journalCatList[2]["key"]};
      this.getAllJournals();
    }
  }

  onCloseFilterStatus(){
    this.activeStatus = {status: "", typ: ""};
    this.getAllJournals();
  }

  getStatusBoxCss(status: string){
    if(status){
      switch(status){
        case this.enumLoaderService.journalStatuses.APPROVED:
          return "inner-div-bck-jstatus-apprv";
        case this.enumLoaderService.journalStatuses.IN_PROGRESS:
          return "inner-div-bck-jstatus-inproc";
        case this.enumLoaderService.journalStatuses.PENDING_APPROVAL:
          return "inner-div-bck-jstatus-penapr";
        case this.enumLoaderService.journalStatuses.RETURNED:
          return "inner-div-bck-jstatus-rtrn";
        case this.enumLoaderService.journalStatusByWorkday.SUBMIT_FOR_REVIEW:
          return "inner-div-bck-jstatus-sbrvw";
        case this.enumLoaderService.journalStatusByWorkday.RUN_ERROR:
          return "inner-div-bck-jstatus-rnerr";
        case this.enumLoaderService.journalStatusByWorkday.PENDING:
          return "inner-div-bck-jstatus-pndsgnof";
        case this.enumLoaderService.journalStatusByWorkday.REJECTED:
          return "inner-div-bck-jstatus-rjtd";
        case this.enumLoaderService.journalStatusByWorkday.APPROVED:
          return "inner-div-bck-jstatus-rtp";
      }
    }
    return "";
  }

  onJournalListCatChanged(obj: any){
    if(obj && obj.item){
      this.journalListCategory = obj.item.key;
      this.getAllJournals();
    }
  }

  onJournalListMonthChanged(obj: any){
    if(obj && obj.item){
      this.journalListMonth = obj.item.key;
      this.getAllJournals();
    }
  }

  onJournalTypeCatChanged(obj: any){
    if(obj && obj.item){
      this.journalTypeCategory = obj.item.key;
      if(this.journalTypeCategory.trim().toLocaleLowerCase() === 'adhoc'){
        this.getAllAdhocJournal();
      }else{
        this.getAllJournals();
      }
    }
  }

  onViewAdhocJournalClick(journalId: journalIdType){
    if(journalId){
      this.dataService.adhocJournalId = journalId;
      this.router.navigate(["jevan"]);
    }
  }

  onSortingClick(obj: any, listType: string){
    if(obj){
      if(listType === "adhoc") {
        this.adhocPageConfig.sortBy = obj.sortBy;
        this.adhocPageConfig.sortDirection = obj.dir;
        this.getAllAdhocJournal();
      } else if(listType === "journal") {
        this.homePageConfig.sortBy = obj.sortBy;
        this.homePageConfig.sortDirection = obj.dir;
        this.getAllJournals();
      }
      
    }
  }

  onPageChangeClicked(obj: any, listType: string){
    if(obj){
      if(listType === "adhoc") {
        this.adhocPageConfig.pageIndex = obj.pageIndex;
        this.getAllAdhocJournal();
      } else if(listType === "journal") {
        this.homePageConfig.pageIndex = obj.pageIndex;
        this.getAllJournals();
      }
    }
  }

  isEditBtnDisabled(journal:JournalInfoModel): boolean {
    return !(journal && journal.journalStatus === this.enumLoaderService.journalStatuses.IN_PROGRESS);
  }
}