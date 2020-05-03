/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './app.config';
import { environment } from '../environments/environment';
import { ConstantLoaderService } from './loaders/constant-loader.service';
import { HandlerLoaderService } from './loaders/handler-loader.service';
import { AuthService } from './services/auth/auth.service';

@Injectable()
export class AppConfigService {
  static settings: IAppConfig;
  constructor(private http: HttpClient,
    private handlerService: HandlerLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private authService: AuthService) { }

  load() {
    const jsonFile = `assets/config/config.${environment.env}.json`;
    const nodeConfigJsonFile = `assets/nodeConfig.json`;
    return new Promise<IAppConfig>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response : IAppConfig) => {
        AppConfigService.settings = <IAppConfig>response;
        this.http.get(nodeConfigJsonFile).toPromise().then((resp: any) => {
          this.loadEnviromentalContents(resp);
          if(AppConfigService.settings.isConnectToOrct) {
            this.authService.getConfigFromServer().subscribe(res => {
              if(res.body && res.body.data) {
                this.setConfiguration(JSON.parse(this.handlerService.encryptionHandlerService.get(res.body.data)));
                this.loadEnviromentalContents();
              }             
              resolve(AppConfigService.settings);
            }, err => {
              this.handlerService.errorHandlerService.handleError(err);
              resolve(AppConfigService.settings);
            });
          } else {
            resolve(AppConfigService.settings); 
          }
        }).catch((err: any) => {
          reject(`Could not load node config!`);
       });
      }).catch((response: any) => {
         reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

  setConfiguration(config: any) {
    AppConfigService.settings.keyCloak.url = config.kcUrl;
    AppConfigService.settings.keyCloak.realm = config.kcRealm;
    AppConfigService.settings.keyCloak.clientId = config.kcClientId;
    AppConfigService.settings.keyCloak.credentials.secret = config.kcCredSecret;
    AppConfigService.settings.keycloakAccName = config.kcAccountName;
    if(config.kcEnabled){
      AppConfigService.settings.isKeyCloakUse = (config.kcEnabled === "T");
    }
    if(config.clientName){
      AppConfigService.settings.envDisplayName = config.clientName;
    }
    AppConfigService.settings.helpUrl = config.helpUrl;
  }

  private loadEnviromentalContents(nodeConfig: any = null){
    this.constantLoaderService.configValuesService.IS_ENV_NAME_SHOW = (AppConfigService.settings.isEnvNameShow !== undefined ||
      AppConfigService.settings.isEnvNameShow !== null) ? AppConfigService.settings.isEnvNameShow : true;    
    this.constantLoaderService.configValuesService.ENV_DISPLAY_NAME = (AppConfigService.settings.envDisplayName !== undefined ||
      AppConfigService.settings.envDisplayName !== null) ? AppConfigService.settings.envDisplayName : "";
    this.constantLoaderService.configValuesService.IS_ADVISOR_HARDCODED_SETTING =
      (AppConfigService.settings.advisorHardcodeSetting !== undefined || AppConfigService.settings.advisorHardcodeSetting !== null)
        ? AppConfigService.settings.advisorHardcodeSetting : true;
    this.constantLoaderService.configValuesService.BASE_URL = AppConfigService.settings.apiBaseUrl;
    this.constantLoaderService.configValuesService.HELP_URL = (AppConfigService.settings.helpUrl !== undefined ||
      AppConfigService.settings.helpUrl !== null) ? AppConfigService.settings.helpUrl : "";
    this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE = (AppConfigService.settings.isKeyCloakUse !== undefined ||
      AppConfigService.settings.isKeyCloakUse !== null) ? AppConfigService.settings.isKeyCloakUse : false;
    this.constantLoaderService.configValuesService.KEYCLOAK_ACC_NAME = AppConfigService.settings.keycloakAccName;
    if (AppConfigService.settings.encrpKey) {
      this.constantLoaderService.configValuesService.ENCRYPT_KEY = AppConfigService.settings.encrpKey;
    }
    this.constantLoaderService.configValuesService.IS_CONNECT_TO_ORCT = AppConfigService.settings.isConnectToOrct;
    if (AppConfigService.settings.encrpPlusReplaceKey) {
      this.constantLoaderService.configValuesService.ENCRYPT_PLUS_REPLACE_KEY = AppConfigService.settings.encrpPlusReplaceKey;
    }
    if (AppConfigService.settings.orctBaseUrl && nodeConfig && nodeConfig.orctBaseUrl) {
      if((nodeConfig.orctBaseUrl.length > 0) && (nodeConfig.orctBaseUrl.indexOf("$") < 0)){
        this.constantLoaderService.configValuesService.ORCT_BASE_URL = nodeConfig.orctBaseUrl;
      } else {
        this.constantLoaderService.configValuesService.ORCT_BASE_URL = AppConfigService.settings.orctBaseUrl;
      }
    }
    this.constantLoaderService.configValuesService.IS_ORCT_URL_ENCRP = AppConfigService.settings.isOrctUrlEncrp;
    if (AppConfigService.settings.orctGetUrl) {
      this.constantLoaderService.configValuesService.ORCT_GET_URL = AppConfigService.settings.orctGetUrl;
    }
    if (AppConfigService.settings.orctPostUrl) {
      this.constantLoaderService.configValuesService.ORCT_POST_URL = AppConfigService.settings.orctPostUrl;
    }
    if (AppConfigService.settings.orctPostFormUrl) {
      this.constantLoaderService.configValuesService.ORCT_POST_FORM_URL = AppConfigService.settings.orctPostFormUrl;
    }
    if (AppConfigService.settings.orctPutUrl) {
      this.constantLoaderService.configValuesService.ORCT_PUT_URL = AppConfigService.settings.orctPutUrl;
    }
    if (AppConfigService.settings.orctDeleteUrl) {
      this.constantLoaderService.configValuesService.ORCT_DELETE_URL = AppConfigService.settings.orctDeleteUrl;
    }
  }
}
