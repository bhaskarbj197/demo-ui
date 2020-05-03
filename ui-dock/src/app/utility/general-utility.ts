/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { TableConfigModel } from '../models/tableConfig.model';

export class GeneralUtility {

  constructor() { }

  getRandomColorCodeInRgb(): string{
    var res = 300;
    var alpha = 1;
    var red = (Math.random() * 1000) % 255;
    var green = (Math.random() * 1000) % 255;
    var blue = (Math.random() * 1000) % 255;
    res = Math.floor((red * 299 + green * 587 + blue * 114) / 1000);
    if(res < 100){
      alpha = 0.2;
    } else if( res < 150){
      alpha = 0.4;
    } else if (res < 170){
      alpha = 0.5
    } else if (res < 200){
      alpha = 0.6;
    } else if (res < 240){
      alpha = 0.7
    } else if (res < 280){
      alpha = 0.8;
    }
    return "rgb(" + Math.floor(red) + "," + Math.floor(green) + "," + Math.floor(blue) + "," + alpha + ")";
  }

  checkIfAlreadyExists(searchList, value, propertyName?) {
    let isExist = false;
    if(searchList && searchList.length > 0) {
      if(propertyName) {
        isExist = searchList.findIndex(item => item[propertyName] === value) >= 0 ? true: false;
      } else {
        isExist = searchList.findIndex(item => item === value) >= 0 ? true : false;
      }
    }
    return isExist;
  }

  download(fileData, filename, fileContentType, apilink?: string) {
    let blob = new Blob([fileData], { 
      type: fileContentType
    });
    let url = apilink? apilink : URL.createObjectURL(blob);
    var downlodLink = document.createElement("a"); 
    downlodLink.setAttribute("href", url);
    downlodLink.setAttribute("download", filename);
    downlodLink.style.visibility = "hidden"; 
    document.body.appendChild(downlodLink); 
    downlodLink.click();
    document.body.removeChild(downlodLink);
  }

  getTableConfigRequest(tableConfig: TableConfigModel): any {
    var request: any = {};
    if(tableConfig !== null){
      request = {
        tableInfo: {
          paging: {
            index: tableConfig.pageIndex,
            count: tableConfig.pageCount
          },
          sorting: {
            field: tableConfig.sortBy,
            direction: tableConfig.sortDirection
          }
        }
      };
      return request;
    }
    return request = {
      tableInfo: {
        paging: {
          index: 0,
          count: 0
        },
        sorting: {
          field: "",
          direction: ""
        }
      }
    };
  }

  isRegexValid(pattern: string, value: any): boolean{
    var patt = new RegExp(pattern);
    return patt.test(value);
  }

  isEmptyOrUndefined(input: string) {
    let isEmpty: boolean = false;
    if(!input || input === undefined || input === null || input === "") {
      isEmpty = true;
    }
    return isEmpty;
  }

  getConcatenatedString(list: Array<number | string>, symbol: string): string{
    if(list === null || list === undefined || list.length === 0){
      return "";
    }
    return list.join(", ");
  }

  getHourlyBasedTimeListIn12HoursFormat(): Array<object>{
    var list: Array<{code: number, value: string}> = [];
    var pmIndex: number = 12;
    for(var index=0; index<12; index++){
      list.push({code: index, value: (index.toString() + " am")});
    } 
    list.push({code: pmIndex, value: "12 pm"});
    for(var index=1; index<12; index++){
      list.push({code: ++pmIndex, value: (index.toString() + " pm")});
    }
    return list;
  }
}
