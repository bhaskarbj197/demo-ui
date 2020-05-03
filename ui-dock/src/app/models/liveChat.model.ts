/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class LivechatModel {
    userTyping: boolean;
    watsonTyping: boolean;
    user: string;
    watson: string;
    nextActor: string;
    errorResponse: boolean = false;
    action: string = "";

    constructor(_userTyping: boolean, _watsonTyping: boolean, _user: string, _watson: string, _nextActor: string, _action: string = "") {
        this.userTyping = _userTyping;
        this.watsonTyping = _watsonTyping;
        this.user = _user;
        this.watson = _watson;
        this.nextActor = _nextActor;
        this.action = _action;
    }
}
