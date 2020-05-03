/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { ReprtJournalPostingSmryModel } from 'src/app/models/reprtJournalPostingSmry.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { JournalPostingRprtFilterPropertyModel } from 'src/app/models/journalPostingRprtFilterProperty.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-not-to-post-journal',
  templateUrl: './not-to-post-journal.component.html',
  styleUrls: ['./not-to-post-journal.component.scss']
})
export class NotToPostJournalComponent implements OnInit {

  @Input() heading: string = "";
  @Input() pageCode: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private generalUtility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  monthList: Array<object> = []; 
  journalSmryList: Array<ReprtJournalPostingSmryModel> = new Array<ReprtJournalPostingSmryModel>();
  searchByOptions: JournalPostingRprtFilterPropertyModel = 
    new JournalPostingRprtFilterPropertyModel(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO);
  searchByOptionsForAPI: JournalPostingRprtFilterPropertyModel = 
    new JournalPostingRprtFilterPropertyModel(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO);
  totalCount: number = 0;
  tableConfigModel: TableConfigModel = new TableConfigModel();
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.RPRT_NOT_TO_POSTING_JOURNAL);

  ngOnInit() {
    this.initPageConfig();
    this.reset();
  }

  private initPageConfig() {    
    this.totalCount = 0;
    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.RPRT_NOT_TO_POSTING_JOURNAL);
    this.tableConfigModel.pageIndex = 0;
  }

  private reset(){
    this.monthList = this.constantLoaderService.defaultValuesService.JOURNAL_MONTH_LIST;
    if(this.monthList.findIndex(m => m["key"] < 0) >= 0){
      this.monthList.splice(this.monthList.findIndex(m => m["key"] < 0), 1);
    }
    this.journalSmryList = new Array<ReprtJournalPostingSmryModel>();
    this.searchByOptions = new JournalPostingRprtFilterPropertyModel(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO);
    this.searchByOptionsForAPI = new JournalPostingRprtFilterPropertyModel(this.constantLoaderService.defaultValuesService.ALL_OPTION_FOR_COMBO);
  }

  private validSearchItem(): boolean {
    if(this.searchByOptions.month > 0 && (this.searchByOptions.startDate || this.searchByOptions.endDate)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select either Month or Dates!");
      return false;
    } else if(this.searchByOptions.month === 0 && !this.searchByOptions.startDate && !this.searchByOptions.endDate){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select either Month or Dates!");
      return false;
    } else if((this.searchByOptions.startDate && !this.searchByOptions.endDate) || (!this.searchByOptions.startDate && this.searchByOptions.endDate)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Please select both the Dates!");
      return false;
    }
    return true;
  }

  private loadList(){
    if(!this.validSearchItem()){
      return;
    }
    this.isLoading = true;
    this.searchByOptionsForAPI = JSON.parse(JSON.stringify(this.searchByOptions));
    this.searchByOptionsForAPI.runStatus = this.enumLoaderService.journalStatusByWorkday.NOT_TO_POST;
    this.businessLoaderService.reportBusinessService.getJournalSummaryReportAsync(this.searchByOptionsForAPI, 
      this.tableConfigModel, this.heading, this.pageCode).subscribe(res => {
      if(res.body.data){
        this.journalSmryList = this.businessLoaderService.reportBusinessService.convertResponseToModel(res.body.data);
        this.totalCount = res.body.totalCount;
        this.isLoading = false;
      }
      if(res.body.totalCount){
        this.totalCount = res.body.totalCount;
      }
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onSearhClick(){
    this.loadList();
  }

  onResetClick(){
    this.initPageConfig();
    this.reset();
    this.journalSmryList = new Array<ReprtJournalPostingSmryModel>();
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadList();
    }
  }

  onPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadList();
    }
  }

  onSearchMonthChanged(obj: any){
    if(obj){
      this.searchByOptions.startDate = null;
      this.searchByOptions.endDate = null;
    }
  }

  onSearchStartDateValueChanged(obj: any){
    if(obj){
      this.searchByOptions.month = 0;
    }
  }

  onDownloadClick(){
    this.isLoading = true;
    this.businessLoaderService.reportBusinessService.downloadReportAsync(this.searchByOptionsForAPI, 
      this.tableConfigModel, this.heading, this.pageCode, this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_BLOB).subscribe(res => {
      let fileName: string = this.heading.trim().replace(/\s/g, "") + ".pdf";
      this.generalUtility.download(res.body, fileName, this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_PDF);
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
}
