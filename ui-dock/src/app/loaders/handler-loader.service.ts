/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { CookieHandlerService } from '../handlers/cookie-handler.service';
import { MomentDateHandlerService } from '../handlers/moment-date-handler.service';
import { EncryptionHandlerService } from '../handlers/encryption-handler.service';
import { NotificationHandlerService } from '../handlers/notification-handler.service';
import { ErrorHandlerService } from '../handlers/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HandlerLoaderService {

  constructor(private _cookieHandlerService: CookieHandlerService,
    private _momentDateHandlerService: MomentDateHandlerService,
    private _encryptionHandlerService: EncryptionHandlerService,
    private _notificationHandlerService: NotificationHandlerService,
    private _errorHandlerService: ErrorHandlerService) { }

  public cookieHandlerService = this._cookieHandlerService;
  public momentDateHandlerService = this._momentDateHandlerService;
  public encryptionHandlerService = this._encryptionHandlerService;
  public notificationHandlerService = this._notificationHandlerService;
  public errorHandlerService = this._errorHandlerService;
}
