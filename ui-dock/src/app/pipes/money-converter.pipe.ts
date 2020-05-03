/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import { ConstantLoaderService } from '../loaders/constant-loader.service';

@Pipe({
  name: 'moneyConverter'
})
export class MoneyConverterPipe implements PipeTransform {

  constructor(private constantLoaderService: ConstantLoaderService){}

  transform(value: number): string {
    if(!value){
      return "";
    }
    if(isNaN(value)){
      return "";
    }
    if(value > 0){
      return this.constantLoaderService.defaultValuesService.MONEY_SYMBOL + value.toFixed(2);
    }
    return "";
  }

}
