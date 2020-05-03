/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { Broadcaster } from '../utility/broadcaster';
import { ConstantLoaderService } from '../loaders/constant-loader.service';
import { EnumLoaderService } from '../loaders/enum-loader.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationHandlerService {

  constructor(private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService,
    private enumLoaderService: EnumLoaderService) { }

  private show(msg: string, notificationType: string = this.enumLoaderService.notificationTypes.DANGER){
    let data: any = {
      msg: msg,
      typ: notificationType
    }
    this.broadcaster.send(this.constantLoaderService.broadcastNamesService.SHOW_NOTIFICATION, data);
  }

  public showError(msg: string){
    this.show(msg);
  }

  public showSuccess(msg: string){
    this.show(msg, this.enumLoaderService.notificationTypes.SUCCESS);
  }

  public showWarning(msg: string){
    this.show(msg, this.enumLoaderService.notificationTypes.WARNING);
  }
}
