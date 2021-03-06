/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class UserInfoListItemModel {
    id: number;
    name: string;
    code: string;
    userInfoListIcon: string;
    isKeyCloakAccess: boolean;

    constructor(id: number = 0, name: string = "", code: string = "", userInfoListIcon: string = "",
        isKeyCloakAccess: boolean = false) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.userInfoListIcon = userInfoListIcon;
        this.isKeyCloakAccess = isKeyCloakAccess;
    }
}