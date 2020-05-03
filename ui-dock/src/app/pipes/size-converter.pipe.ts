/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeConverter'
})
export class SizeConverterPipe implements PipeTransform {

  transform(value: number): string {
    if(!value){
      return "";
    }
    if(isNaN(value)){
      return "";
    }
    if(value < 1024){
      return value.toString() + " byte";
    }else{
      var val = value/1024;
      if(val < 1024){
        return Math.round(val).toString() + " kb";
      }else{
        return Math.round(val/1024).toString() + " mb";
      }
    }
    return "";
  }

}
