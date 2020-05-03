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
import { ActivityLogDataService } from '../data/activity-log-data.service';
import { ActivityLogModel } from 'src/app/models/activityLog.model';
import { UserModel } from 'src/app/models/user.model';
import { TableConfigModel } from 'src/app/models/tableConfig.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { userIdType, journalIdType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogBusinessService {
  dataService: any;

  constructor(private activityLogData: ActivityLogDataService,
    private generalUtility: GeneralUtility) { }

  getActivityLogListAsync(tableConfig: TableConfigModel, jid: journalIdType = 0, userId: userIdType = null): Observable<HttpResponse<any>> {
    var request: any = this.generalUtility.getTableConfigRequest(tableConfig);
    
    if(jid && jid > 0){
      request.jid = jid;
    }
    if(userId){
      request["uid"] = userId;
    }
    return this.activityLogData.getActivityLogListAsync(request);
  }

  getActivityLogList(response: any): Array<ActivityLogModel> {
    var result: Array<ActivityLogModel> = new Array<ActivityLogModel>();
    if(response){
      for(var index=0; index<response.length; index++){
        var log = new ActivityLogModel();
        log.actionSubType = response[index].actionSubType;
        log.actionType = response[index].actionType;
        log.activityType = response[index].activityType;
        log.newValue = response[index].newValue;
        log.objectDesc = response[index].objectDesc;
        log.paramKey = response[index].paramKey;
        log.activityOn = response[index].activityOn;
        if(response[index].userId){
          var user = new UserModel();
          user.id = response[index].userId;
        }
        log.user = user;
        result.push(log);
      }
    }
    return result;
  }
}
