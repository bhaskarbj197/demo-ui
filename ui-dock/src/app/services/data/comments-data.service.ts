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
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { DataAccessService } from '../data-access.service';
import { journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommentsDataService {

  constructor(private constantLoader: ConstantLoaderService,
    private dataAccess: DataAccessService) { }

  addCommentAsync(request: any): Observable<HttpResponse<any>> {
    return this.dataAccess.postAsync(this.constantLoader.relativeUrlsService.POST_COMMENT, request);
  }

  getCommentsByJidAsync(journalId: journalIdType): Observable<HttpResponse<any>> {
    return this.dataAccess.getAsync(this.constantLoader.relativeUrlsService.GET_COMMENTS 
      + "/" + journalId.toString());;
  }
}
