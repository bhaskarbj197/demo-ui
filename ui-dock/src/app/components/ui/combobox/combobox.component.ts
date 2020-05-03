/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss']
})
export class ComboboxComponent implements OnInit, DoCheck {

  @Input() ctrlId: string = "";
  @Input() label: string = "";
  @Input() backLabel: string = "";
  @Input() backLabelIcon: string = "";
  @Input() isBackLabelInfoOnly: boolean = false;
  @Input() placeholder: string = "";
  @Input() list: Array<object> = [];
  @Input() key: string = "";
  @Input() value: string = "";
  @Input() markedText: string = "*";
  @Input() size: Sizes = Sizes.Small;
  @Input() isHide: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isValid: boolean = true;
  @Input() errorMessageType: string = "";
  @Input() isSubmit: boolean = false;
  @Input() model: string;
  @Input() minLabelLen: string = "0px";
  @Input() fixedLen: string = "0px";
  @Input() markedKeyList: Array<string> = [];
  @Input() isNoBorder: boolean = false;
  @Input() itemDisabledKey: string = "";
  @Input() keyInNumber: boolean = false;
  @Input() keyCustomType: boolean = false;
  @Input() backLabelMinLabelLen: string = "0px";
  @Input() isFloatRight: boolean = false;
  @Input() ariaLabel: string = "";

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();
  @Output() backLabelClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() keyPress: EventEmitter<object> = new EventEmitter<object>();

  messageShow: string = Messages.Required;

  constructor() { }

  ngOnInit() {
    if(!this.key){
      var items = JSON.parse(JSON.stringify(this.list));
      this.list = [];
      for(var index=0; index<items.length; index++){
        this.list.push({
          key: items[index],
          value: items[index]
        });
      }
      this.key = "key";
      this.value = "value";
    }
  }

  isInValidInput(){    
    this.messageShow = Messages.Required;
    if(this.isSubmit && !this.isValid) {
      this.messageShow = Messages[this.errorMessageType];
      return true;
    }
    if(this.keyInNumber){
      return (this.isSubmit && this.isRequired && parseInt(this.model) === 0);
    }
    return (this.isSubmit && this.isRequired && (!this.model || this.model.length === 0));
  }

  ngDoCheck(){
    this.modelChange.next(this.model);
  }

  onItemChange(){
    this.valueChange.emit({
      item: this.list.find(l => l[this.key] === this.model)
    });
  }

  onBackLabelClick(): void {
    if(this.isDisabled){
      return;
    }
    this.backLabelClick.emit({
      value: this.model
    });
  }

  onKeypress(obj: any): void {
    if(this.isDisabled){
      return;
    }
    this.keyPress.emit({
      key: String.fromCharCode(obj.keyCode)
    });
  }

  getFixedWidth(){
    if(this.fixedLen === '0px'){
      return 'auto';
    }
    return this.fixedLen;
  }

  isMarkedItemKey(itemKey: string|number): boolean{
    if(itemKey !== undefined){
      var iKey: string = itemKey.toString();
      if(this.markedKeyList.length > 0){
        return (this.markedKeyList.findIndex(k => k.trim() === iKey.trim()) > -1);
      }
    }
    return false;
  }

  getDynamicClasses(): string{
    var result: string = "";
    result = this.size;
    if(this.isFloatRight){
      result += " float-right";
    }
    return result;
  }
}

export enum Sizes {
  Small = "input-group-sm",
  Normal = "",
  Large = "input-group-lg"
}

export enum Messages {
  Required = "Required field",
  Select = "Please select a value first",
  pattern = "Invalid value"
}