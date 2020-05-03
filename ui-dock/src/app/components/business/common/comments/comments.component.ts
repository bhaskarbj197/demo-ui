/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { CommentModel } from 'src/app/models/comment.model';
import { DataService } from 'src/app/services/data.service';
import { UserPartialModel } from 'src/app/models/user.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { journalIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() isAdvisor: boolean = false;
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private enumLoader: EnumLoaderService,
    private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  isFormSubmitted: boolean = false;
  newComment: CommentModel = new CommentModel();
  commentList: Array<CommentModel> = new Array<CommentModel>();
  journalId: journalIdType = 0;

  ngOnInit() {
    this.init();
    this.journalId = this.isAdvisor ? this.dataService.journalShortInfo.id : this.dataService.journalId;
    this.loadComments();
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_COMMENTS_VIEW){
        this.journalId = obj.data.id;
        this.loadComments();
      }
    });
  }

  private resetForm() {
    this.isFormSubmitted = false;
    this.newComment = new CommentModel();
    this.init();
  }

  private init() {
    var user: UserPartialModel = new UserPartialModel();
    if(this.dataService.isUserLoggedIn) {
      user = new UserPartialModel().deserialize(this.dataService.user);
    }
    this.newComment.user = user;
  }

  private loadComments() {
    this.isLoading = true;
    this.commentList = [];
    this.businessLoaderService.commentsBusinessService.getCommentsByJidAsync(this.journalId).subscribe(res => {
      if(res.body && res.body.length) {
        this.commentList = res.body.map(data => new CommentModel().deserialize(data));
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
  
  private isFormValid() {
    var valid: boolean = true;
    if(!this.newComment.comment || this.newComment.comment == "" || this.newComment.comment == undefined) {
      valid = false;
    }
    return valid;
  }

  onSubmitNewCommentClick(){
    this.isFormSubmitted = true;
    if(!this.isFormValid()) {
      return;
    }
    this.isLoading = true;
    this.newComment.action = this.enumLoader.commentTypes.MANUAL;
    this.businessLoaderService.commentsBusinessService.addCommentAsyc(this.newComment).subscribe(res => {
      this.isLoading = false;
      this.isFormSubmitted = false;
      this.loadComments();
      this.resetForm();
    }, err => {
      this.isFormSubmitted = false;
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onResetNewCommentClick(){
    this.resetForm();
  }
}
