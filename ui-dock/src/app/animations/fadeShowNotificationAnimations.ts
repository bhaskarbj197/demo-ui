/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { trigger, state, style, animate, transition, AUTO_STYLE } from '@angular/animations';

export const FadeShowNotificationAnimation = trigger('fadeShowNotification', [
    state('hide', style({
      height: '0vh',
      'min-height': '0vh'
    })),
    state('show', style({
      height: AUTO_STYLE,
      'min-height': 'auto'
    })),
    transition('hide=>show', animate('400ms')),
    transition('show=>hide', animate('400ms'))
  ]
);
