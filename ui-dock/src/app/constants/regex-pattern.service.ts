/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegexPatternService {

  constructor() { }

  public URL_PATTERN: string = "(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$";
  public EMAIL: string = "[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+";
  public UPPER_CASE_CHARACTER: string = "[A-Z]";
  public SMALL_CASE_CHARACTER: string = "[a-z]";
  public NUMBER: string = "\\d";
  public SPECIAL_CHAR: string = "%^&*(),.'`?/\\\":{}|<>[]=+-;~";
}
