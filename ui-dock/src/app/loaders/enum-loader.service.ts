/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';
import { NotificationTypes } from '../enums/notificationTypes';
import { StepListViewModes } from '../enums/stepListViewModes';
import { PositionTypes } from '../enums/positionTypes';
import { FolderTypes } from '../enums/folderTypes';
import { ChartColors } from '../enums/chartColors';
import { ChartSizes } from '../enums/chartSizes';
import { FinancialImpactRiskTypes } from '../enums/financialImpactRiskTypes';
import { BadgeTypes } from '../enums/badgeTypes';
import { ButtonTypes } from '../enums/buttonTypes';
import { DetailGraphs } from '../enums/detailGraphs';
import { DownloadFileTypes, FileContentTypes, AllowedFormats } from '../enums/downloadFileTypes';
import { CheckboxCategories} from '../enums/checkboxCategories';
import { JournalStatusByWorkday, JournalAnomalyStatuses, JournalStatuses, 
  JournalStatusRoleAction, JournalStatusByWorkdayRoleAction, JournalPostingStatus, DocumentIdStatus } from '../enums/journalStatuses';
import { NotificationPositions } from '../enums/notificationPositions';
import { ButtonSizes } from '../enums/buttonSizes';
import { ExtractResultTypes } from '../enums/extractResultTypes';
import { CommentTypes } from '../enums/commentTypes';
import { AdhocDataEntryTypes } from '../enums/adhocDataEntryTypes';
import { SortTypes } from '../enums/sortTypes';
import { OutputReqColTypes } from '../enums/outputReqColTypes';
import { KeyCodes } from '../enums/keyCodes';
import { BulkTemplateTypes, BulkTemplateFileNames } from '../enums/bulkTemplateTypes';
import { JournalAutoApproverConditionTypes } from '../enums/journalAutoApproverConditionTypes';

@Injectable({
  providedIn: 'root'
})
export class EnumLoaderService {

  constructor() { }

  public notificationTypes = NotificationTypes;
  public notificationPositions = NotificationPositions;
  public stepListViewModes = StepListViewModes;
  public positionTypes = PositionTypes;
  public folderTypes = FolderTypes;
  public chartColors = ChartColors;
  public chartSizes = ChartSizes;
  public financialImpactRiskTypes = FinancialImpactRiskTypes;
  public badgeTypes = BadgeTypes;
  public buttonTypes = ButtonTypes;
  public detailGraphs = DetailGraphs;
  public journalStatusByWorkday = JournalStatusByWorkday;
  public downloadFileTypes = DownloadFileTypes;
  public journalAnomalyStatuses = JournalAnomalyStatuses;
  public journalStatuses = JournalStatuses;
  public checkboxCategries = CheckboxCategories;
  public fileContentTypes = FileContentTypes;
  public journalStatusRoleAction = JournalStatusRoleAction;
  public journalStatusByWorkdayRoleAction = JournalStatusByWorkdayRoleAction;
  public buttonSizes = ButtonSizes;
  public extractResultTypes = ExtractResultTypes;
  public commentTypes = CommentTypes;
  public adhocDataEntryTypes = AdhocDataEntryTypes;
  public sortTypes = SortTypes;
  public outputReqColTypes = OutputReqColTypes;
  public allowedFormats = AllowedFormats;
  public keyCodes = KeyCodes;
  public bulkTemplateTypes = BulkTemplateTypes;
  public bulkTemplateFileNames = BulkTemplateFileNames;
  public journalAutoApproverConditionTypes = JournalAutoApproverConditionTypes;
  public journalPostingStatus = JournalPostingStatus;
  public documentIdStatus = DocumentIdStatus;
}
