/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { UserPartialModel } from './user.model';
import { CompanyModel } from './company.model';
import { Deserialize } from '../services/interfaces/deserialize';

export class CommentModel implements Deserialize{
    deserialize(serverResp: any): this {
        this.id = serverResp.commentSequenceNumber ? serverResp.commentSequenceNumber : null;
        this.comment = serverResp.commentText ? serverResp.commentText : "";
        this.commentedOn = serverResp.createdDateTime ? serverResp.createdDateTime : null;
        this.action = serverResp.commentSource ? serverResp.commentSource : "";
        this.user = serverResp.userId ? new UserPartialModel(serverResp.userId, 
            serverResp.firstName + " " + serverResp.lastName + " (" + serverResp.email + ")") : new UserPartialModel();
        this.commentedOn = serverResp.createdDateTime ? serverResp.createdDateTime : null;
            this.company = serverResp.companyId ? new CompanyModel(serverResp.companyId, "") : new CompanyModel();
        return this;
    }
    id: number;
    comment: string = "";
    action: string;
    user: UserPartialModel; 
    company: CompanyModel;  
    commentedOn: number;

    constructor(id: number = 0, comment: string = "", action: string = "", user: UserPartialModel = new UserPartialModel(),
        commentedOn: number = 0, company: CompanyModel = new CompanyModel()) {
        this.id = id;
        this.comment = comment;
        this.action = action;
        this.user = user;
        this.company = company;
        this.commentedOn = commentedOn;
    }
}