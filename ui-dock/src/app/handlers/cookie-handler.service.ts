/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { EncryptionHandlerService } from './encryption-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CookieHandlerService {

  constructor(private encryptionHandlerService: EncryptionHandlerService) { }

  expireDays: number = 365;

  private getCookie(name: string) {
    name = this.encryptionHandlerService.set(name);
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
            return this.encryptionHandlerService.get(c.substring(cookieName.length, c.length));
        }
    }
    return '';
  }

  private setCookiewithExpireDays(name: string, value: string, expireDays: number, path: string = '') {
    name = this.encryptionHandlerService.set(name);
    value = this.encryptionHandlerService.set(value);
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    let cpath:string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  getCookieByKey(key: string){
    return this.getCookie(key);
  }

  setCookie(key: string, value: string){
    this.setCookiewithExpireDays(key, value, this.expireDays);
  }

  deleteCookieByKey(key: string){
    this.setCookiewithExpireDays(key, '', -1);
  }
}
