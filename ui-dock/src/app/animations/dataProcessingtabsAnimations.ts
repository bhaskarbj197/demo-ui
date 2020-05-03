/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { trigger, state, style, animate, transition } from '@angular/animations';

export const ChangeDataProcessingTabsView = trigger('changeDataProcessingTabsView', [
    state('hide', style({
      height: '0vh',
      'min-height': '0vh'
    })),
    state('show', style({
      height: '39vh',
      'min-height': '35vh'
    })),
    transition('hide=>show', animate('300ms')),
    transition('show=>hide', animate('300ms'))
  ]
);
