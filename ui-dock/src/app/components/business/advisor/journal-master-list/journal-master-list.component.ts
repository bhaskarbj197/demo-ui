/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { JournalForAdvisorModel } from '../../../../models/journalForAdvisor.model';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { DateConverterPipe } from '../../../../pipes/date-converter.pipe';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { AdhocJournalForAdvisorModel } from 'src/app/models/adhocJournal.model';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-master-list',
  templateUrl: './journal-master-list.component.html',
  styleUrls: ['./journal-master-list.component.scss']
})
export class JournalMasterListComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private router: Router,
    private dataService: DataService,
    private dateConverterPipe: DateConverterPipe,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  totalJournalCount: number = 0;
  totalAdhocCount: number = 0;
  journalList: Array<JournalForAdvisorModel> = new Array<JournalForAdvisorModel>();
  homePageConfig: TableConfigModel = new TableConfigModel();
  homeTableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ADVISOR_JOURNAL_LIST);
  isDataLoading: boolean = false;
  isAdhocLoading: boolean = false;
  journalTypeCatList: Array<object> = this.constantLoaderService.defaultValuesService.JOURNAL_TYPE_CAT_LIST;
  journalTypeCategory: string = this.journalTypeCatList[0]["key"];
  adhocPageConfig: TableConfigModel = new TableConfigModel();
  adhocTableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ADVISOR_ADHOC_LIST);
  journalAdhocList: Array<AdhocJournalForAdvisorModel> = new Array<AdhocJournalForAdvisorModel>();

  ngOnInit() {
    this.initPageConfig();
    this.loadJournalDataList();
  }

  private initPageConfig() {
    this.homePageConfig.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.ADVISOR_JOURNAL_LIST);
    this.homePageConfig.pageIndex = 0;
    this.adhocPageConfig.pageCount =
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.ADVISOR_ADHOC_LIST);
    this.adhocPageConfig.pageIndex = 0;
  }

  private loadJournalDataList(){
    this.isDataLoading = true;
    this.businessLoaderService.advisorHomeBusinessService.getJournalDataListAsync(this.homePageConfig).subscribe(res => {
      if(res.body.totalCount){
        this.totalJournalCount = res.body.totalCount;
      }
      if(res.body && res.body.data){
        this.journalList = this.businessLoaderService.advisorHomeBusinessService.getProcessedJournalDataList(res.body.data);
        this.isDataLoading = false;
      }
    }, err => {
      this.isDataLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadAdhocJournalList(){
    this.isAdhocLoading = true;
    this.businessLoaderService.adhocJournalBusinessService.getAdvisoryAdhocJournalsAsync(this.adhocPageConfig).subscribe(res => {
      if(res.body.totalCount){
        this.totalAdhocCount = res.body.totalCount;
      }
      if(res.body && res.body.data){
        this.journalAdhocList = this.businessLoaderService.adhocJournalBusinessService.getAdvisoryAdhocJournals(res.body.data);
      }
      this.isAdhocLoading = false;
    }, err => {
      this.isAdhocLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onJournalItemClick(journal: JournalForAdvisorModel, segment: string, isAdhoc: boolean = false){
    var journalShortInfo: JournalInfoPartial = new JournalInfoPartial();
    journalShortInfo.id = journal.id;
    journalShortInfo.name = journal.name;
    journalShortInfo.advisorSegmentSelected = segment;
    journalShortInfo.runDateSelected = this.dateConverterPipe.transform(journal.runDate, false, true);
    journalShortInfo.isAdhoc = isAdhoc;
    this.dataService.journalShortInfo = journalShortInfo;
    this.router.navigate(["advisor"]);
  }

  onSortingClick(obj: any, isAdhoc: boolean = false){
    if(obj){
      if(!isAdhoc){
        this.homePageConfig.sortBy = obj.sortBy;
        this.homePageConfig.sortDirection = obj.dir;
        this.loadJournalDataList();
      }else{
        this.adhocPageConfig.sortBy = obj.sortBy;
        this.adhocPageConfig.sortDirection = obj.dir;
        this.loadAdhocJournalList();
      }
    }
  }

  onPageChangeClicked(obj: any, isAdhoc: boolean = false){
    if(obj){
      if(isAdhoc){
        this.adhocPageConfig.pageIndex = obj.pageIndex;
        this.loadAdhocJournalList();
      }else{
        this.homePageConfig.pageIndex = obj.pageIndex;
        this.loadJournalDataList();
      }
    }
  }

  onJournalTypeCatChanged(obj: any){
    if(obj && obj.item){
      this.journalTypeCategory = obj.item.key;
      if(this.journalTypeCategory === "adhoc"){
        this.loadAdhocJournalList();
      }else{
        this.loadJournalDataList();
      }
    }
  }
}
