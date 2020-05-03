/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterListWithColumn'
})
export class FilterListWithColumnPipe implements PipeTransform {

  constructor(){}

  transform(list: any[], column: string = '', value: any, isExact: boolean = true): any[] {
    if (!value || column === '' || !list) { 
      return list; 
    }
    if(isExact){
      return list.filter(l => l[column] === value);
    }
    var val: string = value.toString();
    return list.filter(l => (l[column] as string).toLowerCase().startsWith(val.toLowerCase()));
  }
}
