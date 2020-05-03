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
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  constructor(){}

  transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { 
      return value; 
    }
    if (!column || column === '') { 
      return _.sortBy(value); 
    }
    if (value.length <= 1) { 
      return value; 
    }
    return _.orderBy(value, [column], [order]);
  }
}
