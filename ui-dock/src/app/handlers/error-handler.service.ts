/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { NotificationHandlerService } from './notification-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private notificationHandlerService: NotificationHandlerService) { }

  public handleError(error: any, isShowNotification: boolean = true){
    if(error && error.error){
      if(isShowNotification){
        if(error.error.errorType){
          this.notificationHandlerService.showError(error.error.errorType + ": " + error.error.errorOn);
        } else {
          this.notificationHandlerService.showError("Error: Server issue. Please Contact with support desk!");
        }
      }
    }
  }
}
