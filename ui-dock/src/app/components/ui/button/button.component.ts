/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumLoaderService } from '../../../loaders/enum-loader.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() value: string = "";
  @Input() faIcon: string = "";
  @Input() type: string = "";
  @Input() marginBottom: string = "0px";
  @Input() marginTop: string = "0px";
  @Input() marginRight: string = "0px";
  @Input() isDisabled: boolean = false;
  @Input() isHide: boolean = false;
  @Input() isFloatRight: boolean = false;
  @Input() isSmall: boolean = false;
  @Input() isBlocked: boolean = false;
  @Input() ariaLabel: string = "";
  @Input() isSimpleBtn: boolean = false;

  @Output() btnClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private enumLoaderService: EnumLoaderService) { }

  btnType: string = this.enumLoaderService.buttonTypes.DROPBOX;

  ngOnInit() {
    if(this.type && this.type.trim().length > 0){
      this.isSimpleBtn = (this.type.indexOf("SMPL_")>-1);
      if(this.enumLoaderService.buttonTypes[this.type] && this.enumLoaderService.buttonTypes[this.type].length > 0){
        this.btnType = this.enumLoaderService.buttonTypes[this.type];
      }
    } 
  }

  getDynamicClasses(): string{
    var result: string = "";
    result = this.btnType;
    if(this.isFloatRight){
      result += " float-right";
    }
    if(this.isDisabled){
      result += " disable-btn";
    }
    return result;
  }

  onButtonClick(){
    this.btnClick.emit();
  }
}
