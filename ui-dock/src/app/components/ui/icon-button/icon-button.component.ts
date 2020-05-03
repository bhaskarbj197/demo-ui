/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {

  @Input() ctrlId: string = "";
  @Input() faIcon: string = "";
  @Input() isDisabled: boolean = false;
  @Input() isHide: boolean = false;
  @Input() tooltipText: string = "";
  @Input() isBlocked: boolean = false;
  @Input() isFloatRight: boolean = false;
  @Input() dynamicClass: string = "";
  @Input() ariaLabel: string = "";

  @Output() btnClick: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

  getDynamicCss(): string{
    if(this.isFloatRight){
      return "right";
    }
    return "none";
  }

  onButtonClick(obj: any){
    this.btnClick.emit(obj);
  }

  getDynamicClass(): string{
    return this.faIcon + " " + this.dynamicClass;
  }
}
