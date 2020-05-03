/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { CommentModel } from 'src/app/models/comment.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-detail-main-area-header',
  templateUrl: './detail-main-area-header.component.html',
  styleUrls: ['./detail-main-area-header.component.scss']
})
export class DetailMainAreaHeaderComponent implements OnInit {

  @Input() headerName: string = "";

  constructor(private dataService: DataService,
    private enumLoaderService: EnumLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  newComment: CommentModel = new CommentModel();
  isStatusActionShow: boolean = false;
  isActiveStatusClicked: boolean = false;
  isFormSubmitted: boolean = false;
  isLoading: boolean = false;

  ngOnInit() {
  }

  
  private updateJournalRunStatus(status: string){
    this.isLoading = true;
    if(this.dataService.journalShortInfo.id && this.dataService.journalShortInfo.runDateSelected && status){
      this.businessLoaderService.advisorHomeBusinessService.updateWorkflowStatusAsync(this.dataService.journalShortInfo.id, 
        this.dataService.journalShortInfo.runDateSelected, status).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.dataService.journalRunStatus = status;
          this.isStatusActionShow = false;
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
    }
  }

  private isFormValid() {
    var valid: boolean = true;
    if(!this.newComment.comment || this.newComment.comment == "" || this.newComment.comment == undefined) {
      valid = false;
    }
    return valid;
  }

  private submitNewComment(status: string){
    this.isFormSubmitted = true;
    if(!this.isFormValid()) {
      return;
    }
    this.isLoading = true;
    this.newComment.action = this.enumLoaderService.journalStatusByWorkday[status];
    this.businessLoaderService.commentsBusinessService.addCommentAsyc(this.newComment, true).subscribe(res => {
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onClickedOutsideOfStatusAction(){
    if(this.isStatusActionShow && !this.isActiveStatusClicked){
      this.isStatusActionShow = false;
    }
    this.isActiveStatusClicked = false;
  }

  onActiveStatusClick(){
    this.isStatusActionShow = !this.isStatusActionShow;
    this.isActiveStatusClicked = true;
  }

  isStatusActionButtonShow(status: string): boolean{
    return (this.enumLoaderService.journalStatusByWorkday[status] === this.dataService.journalRunStatus)
  }

  onSubmitForReviewClick(changeToStatus: string){
    this.submitNewComment(changeToStatus);
    this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
    // this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
  }

  onApprovedClick(changeToStatus: string){
    this.submitNewComment(changeToStatus);
    this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
    // this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
  }

  onRejectClick(changeToStatus: string){
    this.submitNewComment(changeToStatus);
    this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
    // this.updateJournalRunStatus(this.enumLoaderService.journalStatusByWorkday[changeToStatus]);
  }
}
