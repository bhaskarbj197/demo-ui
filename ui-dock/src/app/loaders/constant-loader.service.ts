/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { DefaultValuesService } from '../constants/default-values.service';
import { RelativeUrlsService } from '../constants/relative-urls.service';
import { ViewModesService } from '../constants/view-modes.service';
import { FolderTypesService } from '../constants/folder-types.service';
import { BroadcastNamesService } from '../constants/broadcast-names.service';
import { MessagesService } from '../constants/messages.service';
import { QueryBuilderBoxTypes } from '../constants/queryBuilderBoxTypes.service';
import { RegexPatternService } from '../constants/regex-pattern.service';
import { TabListTextsService } from '../constants/tab-list-texts.service';
import { CookieKeyService } from '../constants/cookie-key.service';
import { TableCodesService } from '../constants/table-codes.service';
import { UserTypesService } from '../constants/user-types.service';
import { ConfigValuesService } from '../constants/config-values.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantLoaderService {

  constructor(private _defaultValuesService: DefaultValuesService,
    private _relativeUrlsService: RelativeUrlsService,
    private _viewModesService: ViewModesService,
    private _folderTypesService: FolderTypesService,
    private _broadcastNamesService: BroadcastNamesService,
    private _messagesService: MessagesService,
    private _queryBuilderBoxTypes: QueryBuilderBoxTypes,
    private _regexPatternService: RegexPatternService,
    private _tabListTextsService: TabListTextsService,
    private _cookieKeyService: CookieKeyService,
    private _tableCodesService: TableCodesService,
    private _userTypesService: UserTypesService,
    private _configValuesService: ConfigValuesService) { }

  public defaultValuesService = this._defaultValuesService;
  public relativeUrlsService = this._relativeUrlsService;
  public viewModesService = this._viewModesService;
  public folderTypesService = this._folderTypesService;
  public broadcastNamesService = this._broadcastNamesService;
  public messagesService = this._messagesService;
  public queryBuilderBoxTypes = this._queryBuilderBoxTypes;
  public regexPatternService = this._regexPatternService;
  public tabListTextsService = this._tabListTextsService;
  public cookieKeyService = this._cookieKeyService;
  public tableCodesService = this._tableCodesService;
  public userTypesService = this._userTypesService;
  public configValuesService = this._configValuesService;
}
