/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  public CREATE_JOURNAL_SUCCESS: string = "Journal is created successfully";
  public CREATE_JOURNAL_FAIL: string = "Journal is not created successfully";
  public SAVE_SUCCESS: string = "{data} is updated successfully";
  public LOG_PROCESS_STEP_CREATE: any = {
    "init" : "Process step creation initiated",
    "success" : "Process step '{text}' created successfully.",
    "failure" : "Process step '{text}' creation failed."
  };
  public LOG_PROCESS_STEP_EDIT: any = {
    "init" : "Process step edit initiated",
    "success" : "Process step '{text}' edited successfully.",
    "failure" : "Process step '{text}' edit failed."
  };
}
