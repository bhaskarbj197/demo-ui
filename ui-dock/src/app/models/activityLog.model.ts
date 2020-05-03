/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { UserModel } from './user.model';

export class ActivityLogModel {
    activityType: string;
    actionType: string;
    actionSubType: string;
    newValue: string;
    objectDesc: string;
    paramKey: string;
    user: UserModel;
    activityOn: number

    constructor(activityType: string = "", actionType: string = "", actionSubType: string = "", newValue: string = "",
        objectDesc: string = "", paramKey: string = "", user: UserModel = new UserModel(), activityOn: number = 0) {
        this.activityType = activityType;
        this.actionType = actionType;
        this.actionSubType = actionSubType;
        this.newValue = newValue;
        this.objectDesc = objectDesc;
        this.paramKey = paramKey;
        this.user = user;
        this.activityOn = activityOn;
    }
}