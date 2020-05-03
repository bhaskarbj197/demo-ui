/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  @Input() popMessages: Array<PopOverMsgKeyValue> = [];
  @Input() message: string = "";
  @Input() titleText: string = "Validation Error";
  @Input() tooltipText: string = "";
  @Input() faIcon: string = "";
  @Input() lable: string = "";
  @Input() position: string = "";
  @Input() btnAriaLabel: string = "";

  constructor() { }

  ngOnInit() {
  }

}

export class PopOverMsgKeyValue {
  key: string;
  value: string;

  constructor(_key: string = "", _value: string = "") {
    this.key = _key;
    this.value = _value;
  }
}
