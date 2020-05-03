/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'storedValueConverter'
})
export class StoredValueConverterPipe implements PipeTransform {

  constructor(private dataService: DataService){}

  transform(value: string = ''): any {
    if (value === undefined || value === "" || value === null) { 
      return value; 
    }
    
    return this.dataService[value];
  }
}
