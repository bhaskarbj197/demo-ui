/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { FieldModel } from './field.model';

export class TreeNodeModel {
    id: number;
    name: string;
    code: string;
    isExpanded: boolean;
    children: Array<TreeNodeModel>;
    actionBtnIcon: string;
    isSelected: boolean;
    isVisible: boolean;
    isDisabled:boolean;
    seq: number;
    openIn: string;
    isChildrenOpenInDifferent: boolean;
    folderType?: string;
    isCountShow?: boolean;
    isWithoutJournalId?: boolean;
    fields?: Array<FieldModel>;
    isMasterFile?: boolean;
    isAllChildrenOpenInSamePage?: boolean;
    dangerCount?: number;
    roleCode?: string;
    countPropertyName?: string;
    anomalyCount?: number;
    isOnlyForJeh?: boolean;
}
