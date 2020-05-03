/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { AdhocJournalModel, AdhocJournalDetailModel } from 'src/app/models/adhocJournal.model';
import { DataService } from 'src/app/services/data.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { journalIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-adhoc-list',
  templateUrl: './adhoc-list.component.html',
  styleUrls: ['./adhoc-list.component.scss']
})
export class AdhocListComponent implements OnInit {

  @Input() heading: string = "";

  constructor(private dataService: DataService,
    private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  journalList: Array<AdhocJournalModel> = new Array<AdhocJournalModel>();
  adhocJournal: AdhocJournalDetailModel = new AdhocJournalDetailModel();
  isViewOnly: boolean = false;
  isLoading: boolean = false;
  isDetailLoading: boolean = false;
  tableConfigModel: TableConfigModel = new TableConfigModel();
  totalJournalCount: number = 0;
  tableHeaders: Array<TableColumnModel> = 
    this.businessLoaderService.commonBusinessService.getTableHeadersByCode(this.constantLoaderService.tableCodesService.ADHOC_LIST);

  ngOnInit() {
    this.tableConfigModel.pageCount = 
      this.businessLoaderService.commonBusinessService.getTableITemPerPageByCode(this.constantLoaderService.tableCodesService.ADHOC_LIST);
    this.tableConfigModel.pageIndex = 0;
    this.loadJournalList();
  }

  private loadJournalList(){
    this.isLoading = true;
    this.journalList = new Array<AdhocJournalModel>();
    this.businessLoaderService.adhocJournalBusinessService.getAllAdhocJournalsAsync(this.tableConfigModel).subscribe(res => {
      if(res.body) {
        if(res.body.data && res.body.data.length > 0){
          this.journalList = this.businessLoaderService.adhocJournalBusinessService.getAllAdhocJournal(res.body.data);
          if(this.dataService.adhocJournalId && this.dataService.adhocJournalId !== 0){
            this.onViewJournal(this.dataService.adhocJournalId);
            this.dataService.adhocJournalId = 0;
          }
        }
        if(res.body.totalCount){
          this.totalJournalCount = res.body.totalCount;
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  private loadAdhocJournalDetails(journalId: journalIdType){
    this.isDetailLoading = true;
    this.adhocJournal = new AdhocJournalDetailModel();
    this.businessLoaderService.adhocJournalBusinessService.getAdhocJournalDetailsAsync(journalId).subscribe(res => {
      if(res.body){
        this.adhocJournal = this.businessLoaderService.adhocJournalBusinessService.getAdhocJournalDetails(res.body, journalId);
      }
      this.isDetailLoading = false;
    }, err => {
      this.isDetailLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onViewJournal(journalId: journalIdType){
    if(journalId !== undefined) {
      this.isViewOnly = true;
      this.loadAdhocJournalDetails(journalId);
    }
  }

  onSortingClick(obj: any){
    if(obj){
      this.tableConfigModel.sortBy = obj.sortBy;
      this.tableConfigModel.sortDirection = obj.dir;
      this.loadJournalList();
    }
  }

  onJournalListPageChangeClicked(obj: any){
    if(obj){
      this.tableConfigModel.pageIndex = obj.pageIndex;
      this.loadJournalList();
    }
  }
}
