/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { RoleModel } from './role.model';
import { CompanyModel } from './company.model';
import { Deserialize } from '../services/interfaces/deserialize';
import { userIdType, companyIdType } from '../services/types';

export class UserModel {
    id: userIdType;
    userName: string;
    password: string;
    fName: string;
    lName: string;
    email: string;
    role: RoleModel;
    isActive: boolean;
    company: CompanyModel;
    journalIdsAsApprover: Array<number>;
    journalIdsAsPreparer: Array<number>;
    journalIdsAsReviewer: Array<number>;
    createdOn: number;
    updatedOn?: number;

    constructor(_id: userIdType = null, _userName: string = "", _password: string = "", _fName: string = "", _lName: string = "", 
        _email: string = "", _role: RoleModel = new RoleModel(), _isActive: boolean = true, _company: CompanyModel = new CompanyModel(),
        _journalIdsAsApprover = new Array<number>(), _journalIdsAsPreparer = new Array<number>(), _journalIdsAsReviewer = new Array<number>(),
        _createdOn: number = 0, _updatedOn: number = 0) {
        this.id = _id;
        this.userName = _userName;
        this.password = _password;
        this.fName = _fName;
        this.lName = _lName;
        this.email = _email;
        this.role = _role;
        this.isActive = _isActive;
        this.company = _company;
        this.journalIdsAsApprover = _journalIdsAsApprover;
        this.journalIdsAsPreparer = _journalIdsAsPreparer;
        this.journalIdsAsReviewer = _journalIdsAsReviewer;
        this.createdOn = _createdOn;
        this.updatedOn = _updatedOn;
    }
}

export class UserPartialModel implements Deserialize{
    deserialize(user: UserModel): this {
        this.id = user.id;
        this.nameEmail = user.fName + " " + user.lName + " (" + user.email + ")";
        return this;
    }
    id: userIdType;
    nameEmail: string;

    constructor(id: userIdType = null, nameEmail: string = "") {
        this.id = id;
        this.nameEmail = nameEmail;
    }
}

export class UserRequestObj implements Deserialize{
    deserialize(user: UserModel): this {
        this.userId = user.id;
        this.roleId = user.role.id;
        this.roleName = user.role.roleName;
        this.companyId = user.company.id;
        this.companyName = user.company.name;
        return this;
    }
    userId: userIdType;
    roleId: number;
    roleName: string;
    companyId: companyIdType;
    companyName: string;
}