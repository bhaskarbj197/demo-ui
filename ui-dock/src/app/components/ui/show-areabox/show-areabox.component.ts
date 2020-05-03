/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, EventEmitter, Output, DoCheck } from '@angular/core';

@Component({
  selector: 'app-show-areabox',
  templateUrl: './show-areabox.component.html',
  styleUrls: ['./show-areabox.component.scss']
})
export class ShowAreaboxComponent implements OnInit, DoCheck {

  @Input() label: string = "";
  @Input() value: string = "";
  @Input() isHide: boolean = false;
  @Input() minLabelLen: string = "0px";
  @Input() fixedLen: string = "0px";
  @Input() ariaLabel: string = "";

  @Output() valueChange: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck(){
    this.valueChange.next(this.value);
  }

  getFixedWidth(){
    if(this.fixedLen === '0px'){
      return 'auto';
    }
    return this.fixedLen;
  }

}
