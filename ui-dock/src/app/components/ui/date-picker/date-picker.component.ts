/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit, DoCheck {

  @Input() model: object = {};
  @Input() label: string = "";
  @Input() minLabelLen: string = "0px";
  @Input() isDisabled: boolean = false;
  @Input() isInvalid: boolean = false;
  @Input() ariaLabel: string = "";

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  @Output() datePickerClosed: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck(){
    this.modelChange.next(this.model);
  }

  onDatePickerClosed(){
    this.datePickerClosed.emit({
      date: this.model
    });
  }

}
