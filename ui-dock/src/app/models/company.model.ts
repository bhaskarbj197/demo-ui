/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { companyIdType } from '../services/types';

export class CompanyModel {
    id: companyIdType;
    name: string;
    logoPath: string;
    isActive: boolean;

    constructor(_id: companyIdType = null, _name: string = "", _logoPath: string = "", _isActive: boolean = true) {
        this.id = _id;
        this.name = _name;
        this.logoPath = _logoPath;
        this.isActive = _isActive;
    }
}