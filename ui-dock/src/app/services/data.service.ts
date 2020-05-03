/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Injectable } from '@angular/core';
import { ProcessStepModel } from '../models/processStep.model';
import { StepColumnsSelectedModel } from '../models/stepColumnsSelected.model';
import { TreeNodeModel } from '../models/treeNode.model';
import { HeaderMenuModel } from '../models/headerMenu.model';
import { InputSourceModel } from '../models/inputSource.model';
import { LogsModel } from '../models/logs.model';
import { UserModel, UserRequestObj } from '../models/user.model';
import { TemplateMasterModel } from '../models/templateMaster.model';
import { AboutModel } from '../models/about.model';
import { JournalInfoPartial } from '../models/journalInfo.model';
import { journalIdType } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  journalId: journalIdType = 0;
  adhocJournalId: journalIdType = 0;
  isNewAdhocJournal: boolean = false;
  processStepsDetails: Array<ProcessStepModel>;
  inputSourceDetail: Array<InputSourceModel>;
  aboutDetails: AboutModel = new AboutModel();
  inputSources: Array<TreeNodeModel> = [];
  stepIdForData: number;
  journalViewMode: string;
  runDate: string;
  stepColumnsSelected: Array<StepColumnsSelectedModel>;
  headerMenu: Array<HeaderMenuModel> = new Array<HeaderMenuModel>();
  processData: Array<TreeNodeModel>;
  saveInProcess: boolean = false;
  masterJson: any;
  logs: Array<LogsModel> = [];
  allLogs: Array<LogsModel> = [];
  outputMapping: any = {};
  selectedRunHistoryDate: string = "";
  advisorSegment: string = "";
  docEvidenceFolderTypeMap: Map<string, string>;
  journalRunDate: string;
  mainWindowForAdvisorGraph: string = "";
  selectedItemOfMainWindowForAdvisorGraph: string = "";
  liveChatConvId: string = "";
  journalStatus: string = "";
  journalRunStatus: string = "";
  isUserLoggedIn: boolean = false;
  user: UserModel = new UserModel();
  userReqObj: UserRequestObj = new UserRequestObj();
  templateMasterList: Array<TemplateMasterModel> = [];
  uploadedTemplateMaster: TemplateMasterModel = new TemplateMasterModel();
  journalShortInfo: JournalInfoPartial = new JournalInfoPartial();
  userInfoCode: string = "";
}
