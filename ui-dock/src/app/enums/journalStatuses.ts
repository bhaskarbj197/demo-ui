/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export enum JournalStatusByWorkday {
  APPROVED = "Ready to Post",
  REJECTED = "Rejected",
  PENDING = "Pending Sign Off",
  RUN_ERROR = "Run Error",
  SUBMIT_FOR_REVIEW = "Submit For Review",
  NOT_TO_POST = "Not to Post"
}

export enum JournalStatuses {
  CREATED = "Creation",
  IN_PROGRESS = "In Progress",
  APPROVED = "Approved",
  PENDING_APPROVAL = "Pending Approval",
  RETURNED = "Returned"
}

export enum JournalAnomalyStatuses {
  PASS = "Pass",
  FAIL = "Fail"
}

export enum JournalStatusRoleAction {
  IN_PROGRESS = "submitForApproval",
  PENDING_APPROVAL = "pendingApproval",
  RETURNED = "returned"
}

export enum JournalStatusByWorkdayRoleAction {
  SUBMIT_FOR_REVIEW = "submitForReview",
  PENDING = "pendingSignOff"
}

export enum JournalPostingStatus {
  POSTED = "Posted",
  FAILED = "Failed"
}

export enum DocumentIdStatus {
  WITH = "With",
  WITHOUT = "Without"
}