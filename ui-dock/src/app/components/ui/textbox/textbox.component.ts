/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { EnumLoaderService } from '../../../loaders/enum-loader.service';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit, DoCheck {

  @Input() ctrlId: string = "";
  @Input() label: string = "";
  @Input() backLabel: string = "";
  @Input() backLabelIcon: string = "";
  @Input() isBackLabelInfoOnly: boolean = false;
  @Input() placeholder: string = "";
  @Input() size: string = this.enumLoaderService.buttonSizes.Small;
  @Input() endSuccessBtnText: string = "";
  @Input() endFailBtnText: string = "";
  @Input() endSuccessBtnIcon: string = ""; // full name like glyphicon glyphicon-user
  @Input() endFailBtnIcon: string = ""; // full name like glyphicon glyphicon-user
  @Input() endSuccessBtnIconAreaLabel: string = "";
  @Input() endFailBtnIconAreaLabel: string = "";
  @Input() endSuccessBtnIconToolTip: string = "";
  @Input() endFailBtnIconToolTip: string = "";
  @Input() model: string; // bind with ngModel two way
  @Input() isHide: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isSubmit: boolean = false;
  @Input() maxLength: number = 5000;
  @Input() minLength: number = 0;
  @Input() pattern: string = "";
  @Input() minLabelLen: string = "0px";
  @Input() fixedLen: string = "0px";
  @Input() backLabelMinLabelLen: string = "0px";
  @Input() fixedHeight: string = "0px";
  @Input() ariaLabel: string = "";

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  @Output() endSuccessBtnClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() endFailBtnClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxBlur: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxFocus: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxKeydown: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxKeyup: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxKeypress: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxMousedown: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxMouseup: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxMouseenter: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxMouseleave: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxMouseover: EventEmitter<object> = new EventEmitter<object>();
  @Output() textboxDblClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() backLabelClick: EventEmitter<object> = new EventEmitter<object>();

  isValueChng: boolean = false;
  messageShow: string = Messages.Required;
  
  constructor(private enumLoaderService: EnumLoaderService) { }

  ngOnInit() {
  }

  ngDoCheck(){
    this.modelChange.next(this.model);
  }

  isValidInput(){
    if((this.isValueChng || this.isSubmit) && this.model.length > 0 && this.pattern.length > 0){
      var patt = new RegExp(this.pattern);
      this.messageShow = Messages.pattern;
      return !patt.test(this.model);
    }
    this.messageShow = Messages.Required;
    return (this.isSubmit && this.isValueChng && this.isRequired && this.model.length === 0) ||
      (this.isSubmit && this.isRequired && this.model.length === 0);
  }

  isValidMinimumInput(){
    return (this.isSubmit && this.minLength > 0 && this.model.length < this.minLength);
  }

  onValueChange(newValue: string) {
    this.model = newValue;
    this.modelChange.emit(newValue);
    this.isValueChng= true;
  }

  onTextboxClick(event: any){
    this.textboxClick.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxBlur(event: any){
    this.textboxBlur.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxFocus(event: any){
    this.textboxFocus.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxKeydown(event: any){
    this.textboxKeydown.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxKeyup(event: any){
    this.textboxKeyup.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxKeypress(event: any){
    this.textboxKeypress.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxMousedown(event: any){
    this.textboxMousedown.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxMouseup(event: any){
    this.textboxMouseup.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxMouseenter(event: any){
    this.textboxMouseenter.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxMouseleave(event: any){
    this.textboxMouseleave.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxMouseover(event: any){
    this.textboxMouseover.emit({
      value: this.model,
      event: event
    });
  }

  onTextboxDblClick(event: any){
    this.textboxDblClick.emit({
      value: this.model,
      event: event
    });
  }

  onEndSuccessBtnClick(): void {
    this.endSuccessBtnClick.emit({
      value: this.model
    });
  }

  onEndFailBtnClick(): void {
    this.endFailBtnClick.emit({
      value: this.model
    });
  }

  onBackLabelClick(): void {
    if(this.isReadOnly){
      return;
    }
    this.backLabelClick.emit({
      value: this.model
    });
  }

  getFixedWidth(){
    if(this.fixedLen === '0px'){
      return 'auto';
    }
    return this.fixedLen;
  }

  getFixedHeight(){
    if(this.fixedHeight === '0px'){
      return 'auto';
    }
    return this.fixedHeight;
  }
}

export enum Messages {
  Required = "Required field",
  pattern = "Invalid value"
}


