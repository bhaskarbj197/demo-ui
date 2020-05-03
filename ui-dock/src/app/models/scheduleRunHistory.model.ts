/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class ScheduleRunHistoryModel {
    jobId: number;
    journalId: journalIdType;
    rundate: number;
    startTime: number;
    endTime: number;
    status: string;

    constructor(journalId: journalIdType = null, rundate: number = 0, startTime: number = 0, 
        endTime: number = 0, status: string = "", jobId: number = 0){
        this.jobId = jobId;
        this.journalId = journalId;
        this.rundate = rundate;
        this.startTime = startTime;
        this.status = status;
        this.endTime = endTime;
    }
}

export class ScheduleRunHistoryDetailModel extends ScheduleRunHistoryModel {
    stepList: Array<ScheduleRunHistoryStepModel>;

    constructor(journalId: journalIdType = null, rundate: number = 0, startTime: number = 0, 
        endTime: number = 0, status: string = "", jobId: number = 0,
        stepList: Array<ScheduleRunHistoryStepModel> = new Array<ScheduleRunHistoryStepModel>()) {
        super(journalId, rundate, startTime, endTime, status, jobId);
        this.stepList = stepList;
    }
}

export class ScheduleRunHistoryStepModel {
    seq: number;
    stepCode: string;
    stepValue: string;
    startTime: number;
    endTime: number;
    status: string;

    constructor(seq: number = 0, stepCode: string = "", stepValue: string = "", startTime: number = 0, 
        endTime: number = 0, status: string = "") {
        this.seq = seq;
        this.stepCode = stepCode;
        this.stepValue = stepValue;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }
}

export class ScheduleRunStepModel {
    seq: number;
    name: string;
    code: string;

    constructor(seq: number = 0, name: string = "", code: string = "") {
        this.seq = seq;
        this.name = name;
        this.code = code;
    }
}

export class ScheduleRunGraphDataModel {
    countDetails: ScheduleRunStatusCountGraphModel;
    wdWiseCountDetails: Array<ScheduleRunWorkdayCountGraphModel>;

    constructor() {
        this.countDetails = new ScheduleRunStatusCountGraphModel();
        this.wdWiseCountDetails = new Array<ScheduleRunWorkdayCountGraphModel>();
    }
}

export class ScheduleRunStatusCountGraphModel {
    passCount: number;
    failCount: number;
    inProgressCount: number

    constructor(passCount: number = 0, failCount: number = 0, inProgressCount: number = 0) {
        this.passCount = passCount;
        this.failCount = failCount;
        this.inProgressCount = inProgressCount;
    }
}

export class ScheduleRunWorkdayCountGraphModel {
    workDay: string;
    passCount: number;
    failCount: number;
    inProgressCount: number

    constructor(workDay: string = "", passCount: number = 0, failCount: number = 0, inProgressCount: number = 0) {
        this.workDay = workDay;
        this.passCount = passCount;
        this.failCount = failCount;
        this.inProgressCount = inProgressCount;
    }
}

export class SchedulerRunHistoryFilterModel {
    monthNumber: number;
    journalId: journalIdType;
    status: string;

    constructor() {
        this.monthNumber = 0;
        this.journalId = null;
        this.status = "";
    }
}