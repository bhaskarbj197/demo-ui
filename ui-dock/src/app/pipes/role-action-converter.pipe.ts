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
  name: 'roleAction'
})
export class RoleActionConverterPipe implements PipeTransform {

  constructor(private dataService: DataService){}

  transform(param1: string = "", param2: string = "", param3: string = ""): boolean {
    var data: any|boolean;
    if(param1 !== null && param1.length > 0){
      data = this.dataService.user.role[param1];
    }
    if(param2 !== null && param2.length > 0){
      data = this.dataService.user.role[param1][param2];
    }
    if(param3 !== null && param3.length > 0){
      data = this.dataService.user.role[param1][param2][param3];
    }
    if(typeof data === 'boolean'){
      return !data;
    }
    return false;
  }

}
