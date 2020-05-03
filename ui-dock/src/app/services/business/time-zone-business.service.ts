/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { UiJsonDataService } from '../../services/data/ui-json-data.service';
import { TimeZoneModel } from 'src/app/models/timeZone.model';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneBusinessService {

  constructor(private uiJsonDataService: UiJsonDataService) { }

  private jsonTemplate = this.uiJsonDataService.getTimeZones();

  getTimeZoneList(): Array<TimeZoneModel> {
    var result: Array<TimeZoneModel> = new Array<TimeZoneModel>();
    if(this.jsonTemplate){
      for(var index=0; index<this.jsonTemplate.length; index++){
        if(this.jsonTemplate[index].isActive){
          var timeZone = new TimeZoneModel();
          timeZone.id = this.jsonTemplate[index].id;
          timeZone.name = this.jsonTemplate[index].name;
          timeZone.isActive = this.jsonTemplate[index].isActive;
          result.push(timeZone);
        }
      }
    }
    return result;
  }
}
