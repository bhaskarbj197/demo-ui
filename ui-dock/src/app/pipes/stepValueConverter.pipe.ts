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
  name: 'stepValueConverter'
})
export class StepValueConverterPipe implements PipeTransform {

  constructor(private constantLoaderService: ConstantLoaderService){}

  transform(value: string): string {
    if(value){
      return value.replace(this.constantLoaderService.defaultValuesService.OPERATOR_BIND_STRING, "");
    }
    return value;
  }

}
