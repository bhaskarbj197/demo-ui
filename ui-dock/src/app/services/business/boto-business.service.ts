/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { BotoDataService } from '../data/boto-data.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BotoBusinessService {

  constructor(private botoDataService: BotoDataService) { }

  sendMessage(request: any): Observable<HttpResponse<any>>{
    return this.botoDataService.sendMessage(request);
  }
}
