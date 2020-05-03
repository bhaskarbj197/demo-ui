/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { FrequencyModel } from 'src/app/models/frequency.model';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FrequencyDataService } from '../data/frequency-data.service';

@Injectable({
  providedIn: 'root'
})
export class FrequencyBusinessService {

  constructor(private frequencyData: FrequencyDataService) { }

  getFrequencyListAsync(): Observable<HttpResponse<any>> {
    return this.frequencyData.getFrequencyListAsync();
  }

  getFrequencyList(response: any): Array<FrequencyModel> {
    var result: Array<FrequencyModel> = new Array<FrequencyModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var freq: FrequencyModel = new FrequencyModel();
        freq.id = response[index].frequencyid;
        freq.isActive = response[index].isactive;
        freq.name = response[index].runfrequency;
        result.push(freq);
      }
    }
    return result;
  }
}
