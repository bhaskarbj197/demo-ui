/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ConstantLoaderService } from '../loaders/constant-loader.service';

@Injectable({
  providedIn: 'root'
})
export class EncryptionHandlerService {

  constructor(private constantLoaderService: ConstantLoaderService) { }

  private key: string = this.constantLoaderService.configValuesService.ENCRYPT_KEY;

  set(value: string, isPlusReplace: boolean = false): string{
    var key = CryptoJS.enc.Utf8.parse(this.key);
    var iv = CryptoJS.enc.Utf8.parse(this.key);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    if(isPlusReplace){
      return encrypted.toString().split("+").join(this.constantLoaderService.configValuesService.ENCRYPT_PLUS_REPLACE_KEY);
    }
    return encrypted.toString();
  }

  get(value: string, isPlusReplace: boolean = false): string{
    var key = CryptoJS.enc.Utf8.parse(this.key);
    var iv = CryptoJS.enc.Utf8.parse(this.key);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    if(isPlusReplace){
      return decrypted.toString(CryptoJS.enc.Utf8).split("+").join(this.constantLoaderService.configValuesService.ENCRYPT_PLUS_REPLACE_KEY);
    }
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
