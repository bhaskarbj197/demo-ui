/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { CompanyModel } from './company.model';
import { Deserialize } from '../services/interfaces/deserialize';
import { PopOverMsgKeyValue } from '../components/ui/popover/popover.component';

export class FinancialMonthModel {
    year: number;
    company: CompanyModel;
    months: Array<MonthModel>;

    constructor(year: number = 0, company: CompanyModel = new CompanyModel(), months: Array<MonthModel> = new Array<MonthModel>()) {
        this.year = year;
        this.company = company;
        this.months = months;
    }
}

export class MonthModel {
    id: number;
    name: string;
    monthNumber: number;
    startDate: object|string;
    endDate: object|string;

    constructor(id: number = 0, name: string = "", startDate: object = {}, endDate: object = {}, monthNumber: number = 0) {
        this.id = id;
        this.name = name;
        this.monthNumber = monthNumber;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export class MonthPartialModel {
    name: string;
    monthNumber: number;
    monthNoAsString: string;

    constructor(name: string = "", monthNumber: number = 0, monthNoAsString: string = "") {
        this.name = name;
        this.monthNumber = monthNumber;
        this.monthNoAsString = monthNoAsString;
    }
}

export class BulkFinancialMonthMasterModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        this.isValid = this.validationStatus === "Failed" ? false : true;
        this.failedReasons = this.findValidationMessages(this.validationFailReason);
        return this;
    }

    private findValidationMessages(failedReasons: Array<Object>) {
        var messages: Array<PopOverMsgKeyValue> = [];
        var keys = Object.keys(this);
        var rIndex: number = -1;
        for(var index=0; index < keys.length ; index++) {          
          rIndex = failedReasons.findIndex(data => data[keys[index]]);
          if(rIndex >= 0) {
            messages.push(new PopOverMsgKeyValue(keys[index], failedReasons[rIndex][keys[index]]));
          }
        }
        return messages;
    }

    companyName: string;
    month: string;
    validationFailReason: Array<Object>;
    failedReasons: Array<PopOverMsgKeyValue>;
    isValid: boolean;
    validationStatus: string;
    endDateYyyyMmDd: number;
    startDateYyyyMmDd: number;
    year: number;
    serialId: number;                                                       
}

export class WeekPartialModel {
    name: string;
    weekNumber: number;
    weekNoAsString: string;

    constructor(name: string = "", weekNumber: number = 0, weekNoAsString: string = "") {
        this.name = name;
        this.weekNumber = weekNumber;
        this.weekNoAsString = weekNoAsString;
    }
}