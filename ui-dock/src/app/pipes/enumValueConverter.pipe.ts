/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import { EnumLoaderService } from '../loaders/enum-loader.service';

@Pipe({
  name: 'enumValueConverter'
})
export class EnumValueConverterPipe implements PipeTransform {

  constructor(private enumLoaderService: EnumLoaderService){}

  transform(value: string = '', enumService: string): string {
    if (value === undefined || value === "" || enumService === undefined || enumService === "") { 
      return value; 
    }
    
    return this.enumLoaderService[enumService][value];
  }
}
