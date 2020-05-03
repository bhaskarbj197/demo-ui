/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substrConverter'
})
export class SubstrConverterPipe implements PipeTransform {

  constructor(){}

  transform(value: string, start: number, len: number): string {
    if(value === undefined){
      return "";
    }
    if(value.length === 0){
      return "";
    }
    return value.substr(start, len);
  }

}
