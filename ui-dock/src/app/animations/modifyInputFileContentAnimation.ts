/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { trigger, state, style, animate, transition } from '@angular/animations';

export const ModifyInputFileContentView = trigger('modifyInputFileContentView', [
    state('hide', style({
      height: '0px',
      'min-height': '0px'
    })),
    state('show', style({
      height: '90px',
      'min-height': '75px'
    })),
    transition('hide=>show', animate('100ms')),
    transition('show=>hide', animate('100ms'))
  ]
);
