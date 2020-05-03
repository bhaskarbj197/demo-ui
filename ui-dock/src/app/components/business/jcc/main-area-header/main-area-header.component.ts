/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { CommentModel } from 'src/app/models/comment.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-main-area-header',
  templateUrl: './main-area-header.component.html',
  styleUrls: ['./main-area-header.component.scss']
})
export class MainAreaHeaderComponent implements OnInit {

  @Input() headerName: string = "";
  @Input() isRunHide: boolean = false;
  @Input() isSaveHide: boolean = false;
  @Input() isBackShow: boolean = false;
  @Input() isHeaderActionShow: boolean = true;

  @Output() headerActionSaveClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() headerActionBackClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() headerActionRunClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private dataService: DataService,
    private enumLoaderService: EnumLoaderService,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isStatusActionShow: boolean = false;
  isActiveStatusClicked: boolean = false;
  isLoading: boolean = false;
  newComment: CommentModel = new CommentModel();
  isFormSubmitted: boolean = false;

  ngOnInit() {
  }

  private updateJournalStatus(status: string){
    this.isLoading = true;
    if(this.dataService.journalId && status){
      this.businessLoaderService.journalActionBusinessService.updateJournalStatusAsync(this.dataService.journalId, status).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.dataService.journalStatus = status;
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
    this.newComment.action = this.enumLoaderService.journalStatuses[status];
    this.businessLoaderService.commentsBusinessService.addCommentAsyc(this.newComment).subscribe(res => {
      this.isLoading = false;
      // this.resetForm();
    })
  }

  onHeaderActionSaveClick(){
    this.headerActionSaveClick.emit();
  }

  onHeaderActionBackClick(){
    this.headerActionBackClick.emit();
  }

  onHeaderActionRunClick(){
    this.headerActionRunClick.emit();
  }

  onActiveStatusClick(){
    this.isStatusActionShow = !this.isStatusActionShow;
    this.isActiveStatusClicked = true;
  }

  onClickedOutsideOfStatusAction(){
    if(this.isStatusActionShow && !this.isActiveStatusClicked){
      this.isStatusActionShow = false;
    }
    this.isActiveStatusClicked = false;
  }

  isStatusActionButtonShow(status: string): boolean{
    return (this.enumLoaderService.journalStatuses[status] === this.dataService.journalStatus)
  }

  onApprovedClick(status: string){
    this.submitNewComment(status);
    this.updateJournalStatus(this.enumLoaderService.journalStatuses[status]);
  }

  onReturnClick(status: string){
    this.submitNewComment(status);
    this.updateJournalStatus(this.enumLoaderService.journalStatuses[status]);
  }

  onSubmitForApprovalClick(status: string){
    this.submitNewComment(status);
    this.updateJournalStatus(this.enumLoaderService.journalStatuses[status]);
  }
}
