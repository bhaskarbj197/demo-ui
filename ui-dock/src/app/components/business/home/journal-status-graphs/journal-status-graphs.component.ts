/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GraphDataModel } from '../../../../models/graphData.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-journal-status-graphs',
  templateUrl: './journal-status-graphs.component.html',
  styleUrls: ['./journal-status-graphs.component.scss']
})
export class JournalStatusGraphsComponent implements OnInit {

  @Output() statusClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() runStatusClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private businessLoaderService: BusinessLoaderService,
    private enumLoaderService: EnumLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isStatusLoading: boolean = false;
  journalStatusGraph: GraphDataModel = new GraphDataModel();
  journalRunStatusGraph: GraphDataModel = new GraphDataModel();
  journalStatusesCount = {
    inProgressCount: 0,
    approvedCount: 0,
    pendingApprovalCount: 0,
    returnedCount: 0
  };
  journalRunStatusesCount = {
    submitForReviewCount: 0,
    runErrorCount: 0,
    pendingSignOffCount: 0,
    rejectedCount: 0,
    readyToPostCount: 0
  };
  isSummaryShow: boolean = false;
  activeStatus: string = "";

  ngOnInit() {
    this.getGraphs();
  }

  private getColor(index: number): string {
    if(index !== null){
      return ((index % 2 === 0) ? this.enumLoaderService.chartColors.GENERIC_RED : 
        this.enumLoaderService.chartColors.GENERIC_YELLOW);
    }
    return "";
  }

  private getGraphs(){
    this.isStatusLoading = true;
    this.journalStatusGraph.labels = [];
    this.journalRunStatusGraph.labels = [];
    this.businessLoaderService.homeBusinessService.getJournalStatusCountListAsync({}).subscribe(
      response => {
        if(response.body){
          if(response.body.journalStatusStat && response.body.journalStatusStat.journalStatusDetailCount){
            var journalStatusDetailCount = response.body.journalStatusStat.journalStatusDetailCount;
            for(var index=0; index<journalStatusDetailCount.length; index++){
              this.isSummaryShow = true;
              if(journalStatusDetailCount[index].journalStatus === this.enumLoaderService.journalStatuses.APPROVED){
                this.journalStatusesCount.approvedCount = journalStatusDetailCount[index].journalStatusCount;
                this.journalStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatuses.APPROVED, 
                  data:[this.journalStatusesCount.approvedCount]
                });
                this.journalStatusGraph.colors.push(this.getColor(index));
              } else if(journalStatusDetailCount[index].journalStatus === this.enumLoaderService.journalStatuses.IN_PROGRESS){
                this.journalStatusesCount.inProgressCount = journalStatusDetailCount[index].journalStatusCount;
                this.journalStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatuses.IN_PROGRESS, 
                  data:[this.journalStatusesCount.inProgressCount]
                });
                this.journalStatusGraph.colors.push(this.getColor(index));
              } else if(journalStatusDetailCount[index].journalStatus === this.enumLoaderService.journalStatuses.PENDING_APPROVAL){
                this.journalStatusesCount.pendingApprovalCount = journalStatusDetailCount[index].journalStatusCount;
                this.journalStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatuses.PENDING_APPROVAL, 
                  data:[this.journalStatusesCount.pendingApprovalCount]
                });
                this.journalStatusGraph.colors.push(this.getColor(index));
              } else if(journalStatusDetailCount[index].journalStatus === this.enumLoaderService.journalStatuses.RETURNED){
                this.journalStatusesCount.returnedCount = journalStatusDetailCount[index].journalStatusCount;
                this.journalStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatuses.RETURNED, 
                  data:[this.journalStatusesCount.returnedCount]
                });
                this.journalStatusGraph.colors.push(this.getColor(index));
              }
            }
          }
          if(response.body.runStatusStat && response.body.runStatusStat.runStatusDetailCount){
            var runStatusDetailCount = response.body.runStatusStat.runStatusDetailCount;
            for(var index=0; index<runStatusDetailCount.length; index++){
              if(runStatusDetailCount[index].runStatus === this.enumLoaderService.journalStatusByWorkday.SUBMIT_FOR_REVIEW){
                this.journalRunStatusesCount.submitForReviewCount = runStatusDetailCount[index].runStatusCount;
                this.journalRunStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatusByWorkday.SUBMIT_FOR_REVIEW, 
                  data:[this.journalRunStatusesCount.submitForReviewCount]
                });
                this.journalRunStatusGraph.colors.push(this.getColor(index));
              } else if(runStatusDetailCount[index].runStatus === this.enumLoaderService.journalStatusByWorkday.RUN_ERROR){
                this.journalRunStatusesCount.runErrorCount = runStatusDetailCount[index].runStatusCount;
                this.journalRunStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatusByWorkday.RUN_ERROR, 
                  data:[this.journalRunStatusesCount.runErrorCount]
                });
                this.journalRunStatusGraph.colors.push(this.getColor(index));
              } else if(runStatusDetailCount[index].runStatus === this.enumLoaderService.journalStatusByWorkday.PENDING){
                this.journalRunStatusesCount.pendingSignOffCount = runStatusDetailCount[index].runStatusCount;
                this.journalRunStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatusByWorkday.PENDING, 
                  data:[this.journalRunStatusesCount.pendingSignOffCount]
                });
                this.journalRunStatusGraph.colors.push(this.getColor(index));
              } else if(runStatusDetailCount[index].runStatus === this.enumLoaderService.journalStatusByWorkday.REJECTED){
                this.journalRunStatusesCount.rejectedCount = runStatusDetailCount[index].runStatusCount;
                this.journalRunStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatusByWorkday.REJECTED, 
                  data:[this.journalRunStatusesCount.rejectedCount]
                });
                this.journalRunStatusGraph.colors.push(this.getColor(index));
              } else if(runStatusDetailCount[index].runStatus === this.enumLoaderService.journalStatusByWorkday.APPROVED){
                this.journalRunStatusesCount.readyToPostCount = runStatusDetailCount[index].runStatusCount;
                this.journalRunStatusGraph.data.push({
                  label: this.enumLoaderService.journalStatusByWorkday.APPROVED, 
                  data:[this.journalRunStatusesCount.readyToPostCount]
                });
                this.journalRunStatusGraph.colors.push(this.getColor(index));
              }
            }
          }
        }
        this.isStatusLoading = false;
      }, err => {
        this.isStatusLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      }
    );
  }
  
  onJournalStatusClick(status: string){
    this.statusClick.emit({
      status: this.enumLoaderService.journalStatuses[status]
    });
    this.activeStatus = this.enumLoaderService.journalStatuses[status];
  }

  onJournalRunStatusClick(status: string){
    this.runStatusClick.emit({
      status: this.enumLoaderService.journalStatusByWorkday[status]
    });
    this.activeStatus = this.enumLoaderService.journalStatusByWorkday[status];
  }
}
