/*! *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { DataService } from '../data.service';
import { IAppConfig } from 'src/app/app.config';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';


declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})

export class KeycloakService{
  private keycloakAuth: any;
  private kcConfig: any;
  
  constructor(private authService: AuthService,
    private dataService: DataService,
    private handlerLoaderService: HandlerLoaderService) {
  }

  init(config: IAppConfig): Promise<any> {
    return new Promise((resolve, reject) => {      
      this.kcConfig = config;
      this.kcConfig.url = this.kcConfig.url + '/auth';
      this.keycloakAuth = new Keycloak(config);
      this.keycloakAuth
        .init({ onLoad: 'login-required',"checkLoginIframe" : false })
        .success((res) => {
          resolve();
          this.getDecodedToken();
          if(!this.dataService.isUserLoggedIn) {
            this.logout();
          }
        })
        .error((err) => {
          this.handlerLoaderService.errorHandlerService.handleError(err, false);
          reject(err);
        });
    });    
  }

  getToken(): string {
    return this.keycloakAuth ? this.keycloakAuth.token : '';
  }

  getDecodedToken(): string {
    const decodeHelper = new JwtHelperService();
    const token = this.getToken();
    const decoded = decodeHelper.decodeToken(token);
    if (decoded['realm_access']['roles'].includes('service-desk')) {
      window.location.href = `${this.kcConfig.url}/admin/${this.kcConfig.realm}/console`;
    } else {
      this.authService.setUser(decoded);
    }
    return decoded;
  }

  logout() {
    const period = localStorage.getItem('period');
    localStorage.clear();
    localStorage.setItem('period', period);

    const url =
      this.kcConfig.url +
      '/realms/' +
      this.kcConfig.realm +
      '/protocol/openid-connect/logout?client_id=' +
      this.kcConfig.clientId +
      '&redirect_uri=' +
      encodeURIComponent(location.protocol + '//' + window.location.host);
    location.href = url;
  }
}
