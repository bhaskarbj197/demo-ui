/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class RoleModel {
    id: number;
    roleName: string;
    keycloakRoleCode: string;
    isBusinessAdmin?: boolean;
    isPlatformAdmin?: boolean;
    menu: {
        jcc: boolean;
        jeva: boolean;
        advisor: boolean;
        jevan: boolean;
        report: boolean;
        admin: boolean;
    };
    workflowAction: {
        journalStatus:{
            submitForApproval: boolean;
            pendingApproval: boolean;
        };
        runStatus: {
            submitForReview: boolean;
            pendingSignOff: boolean;
        };
    };
    jevan: {
        uploadData: {
            view: boolean;
        };
        newAdhocJournal: {
            view: boolean;
        };
        adhocJournalList: {
            view: boolean;
        };
        bulkInputFileUpload: {
            view: boolean;
        };
    };
    jcc: {
        homeAction: {
            journalAdd: boolean;
            journalEdit: boolean;
            journalCopy: boolean;
            journalDownload: boolean;
            journalDelete: boolean;
        };
        inputSource: {
            view: boolean;
            fileUpload: boolean;
            fileDelete: boolean;
            dataCleanUp: boolean;
        };
        processSteps: {
            view: boolean;
            add: boolean;
            edit: boolean;
            copy: boolean;
            delete: boolean;
        };
        outputMapping: {
            view: boolean;
            add: boolean;
            delete: boolean;
        };
        supportingDocs: {
            view: boolean;
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
        advisorConfig: {
            view: boolean;
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
        validationRules: {
            view: boolean;
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
    };
    admin?: {
        templateMaster?: {
            view?: boolean;
        };
        groupMaster?: {
            view?: boolean;
        };
        validationRulesMaster?: {
            view?: boolean;
        };
        userMaster?: {
            view?: boolean;
        };
        financialMonthMaster?: {
            view?: boolean;
        };
        calendarMaster?: {
            view?: boolean;
        };
        activityLog?: {
            view?: boolean;
        };
        companyMaster?: {
            view?: boolean;
        };
        frequencyMaster?: {
            view?: boolean;
        };
        roleMaster?: {
            view?: boolean;
        };
        outputFormat?: {
            view?: boolean;
        };
        bulkUpload?: {
            view?: boolean;
        };
        journalAutoApprover?: {
            view?: boolean;
        };
    }
    boto: boolean;
}

export class RolePartialModel {
    id: number;
    name: string;
    keycloakRoleCode?: string;
    isBusinessAdmin?: boolean;
    isPlatformAdmin?: boolean;

    constructor(_id: number = 0, _name: string = "", _keycloakRoleCode: string = "", 
        _isBusinessAdmin: boolean = false, _isPlatformAdmin: boolean = false) {
        this.id = _id;
        this.name = _name;
        this.keycloakRoleCode = _keycloakRoleCode;
        this.isBusinessAdmin = _isBusinessAdmin;
        this.isPlatformAdmin = _isPlatformAdmin;
    }
}