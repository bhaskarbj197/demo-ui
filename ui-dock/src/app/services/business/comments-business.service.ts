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
import { CommentsDataService } from '../data/comments-data.service';
import { CommentModel } from 'src/app/models/comment.model';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataService } from '../data.service';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommentsBusinessService {

  constructor(private commentsData: CommentsDataService,
    private constantLoader: ConstantLoaderService,
    private dataService: DataService,
    private enumLoader: EnumLoaderService) { }

  createRequestBody(newComment: CommentModel, isAdvisor: boolean) {
    var req = {};
    req[this.constantLoader.defaultValuesService.PARAM_JID] = isAdvisor ? this.dataService.journalShortInfo.id : this.dataService.journalId;
    req[this.constantLoader.defaultValuesService.PARAM_COMMENT_TEXT] = newComment.comment;
    req[this.constantLoader.defaultValuesService.PARAM_COMMENT_SOURCE] = newComment.action;
    return req;
  }

  addCommentAsyc(request: any, isAdvisor: boolean = false): Observable<HttpResponse<any>> {
    request = this.createRequestBody(request, isAdvisor);
    return this.commentsData.addCommentAsync(request);
  }

  getCommentsByJidAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.commentsData.getCommentsByJidAsync(journalId);
  }
}
