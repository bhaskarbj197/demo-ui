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
  name: 'defaultConstantValueConverter'
})
export class DefaultConstantValueConverterPipe implements PipeTransform {

  constructor(private constantLoaderService: ConstantLoaderService){}

  transform(value: string = '', constService: string = "defaultValuesService"): string {
    if (value === undefined || value === "") { 
      return value; 
    }
    
    return this.constantLoaderService[constService][value];
  }
}
