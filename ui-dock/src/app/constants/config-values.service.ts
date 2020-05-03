/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigValuesService {
    constructor() { }
    
    public ENV_DISPLAY_NAME: string = "";
    public IS_ENV_NAME_SHOW: boolean = true;
    
    public BASE_URL: string = "";
    public HELP_URL: string = "";
    public IS_ADVISOR_HARDCODED_SETTING: boolean = false;

    public KEYCLOAK_ACC_NAME: string = "";
    public IS_KEYCLOAK_USE: boolean = false;

    public ENCRYPT_KEY: string = "123456$#@$^@1ERF";
    public ENCRYPT_PLUS_REPLACE_KEY: string = "AAAB000WERDF";

    public IS_CONNECT_TO_ORCT: boolean = false;
    public ORCT_BASE_URL: string = "https://localhost:3000";
    public IS_ORCT_URL_ENCRP: boolean = true;
    public ORCT_GET_URL: string = "/getServices?url=";
    public ORCT_POST_URL: string = "/postServices?url=";
    public ORCT_POST_FORM_URL: string = "/postFormServices?url=";
    public ORCT_PUT_URL: string = "/putServices?url=";
    public ORCT_DELETE_URL: string = "/deleteServices?url=";
}