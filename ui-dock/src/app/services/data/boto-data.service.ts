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
import { DataAccessService } from '../data-access.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Injectable({
  providedIn: 'root'
})
export class BotoDataService {

  constructor(private dataService: DataAccessService,
    private constantLoaderService: ConstantLoaderService) { }

  sendMessage(request: any): Observable<HttpResponse<any>>{
    return this.dataService.putAsync(this.constantLoaderService.relativeUrlsService.SEND_MESSAGE, request);
  }
}
