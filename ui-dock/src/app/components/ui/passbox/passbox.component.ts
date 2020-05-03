/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { EnumLoaderService } from '../../../loaders/enum-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Component({
  selector: 'app-passbox',
  templateUrl: './passbox.component.html',
  styleUrls: ['./passbox.component.scss']
})
export class PassboxComponent implements OnInit, DoCheck {

  @Input() ctrlId: string = "";
  @Input() label: string = "";
  @Input() backLabel: string = "";
  @Input() placeholder: string = "";
  @Input() size: string = this.enumLoaderService.buttonSizes.Small;
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
  @Input() isSummaryBox: boolean = false;
  @Input() ariaLabel: string = "";

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
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
  @Output() boxSmryUpdate: EventEmitter<object> = new EventEmitter<object>();

  isValueChng: boolean = false;
  messageShow: string = Messages.Required;
  isPassView: boolean = false;
  summaryBoxValidation: any = {
    hasUpperCase: false,
    hasSmallCase: false,
    hasNumber: false,
    hasMinLen: false,
    hasNotSpcChar: true
  };

  constructor(private enumLoaderService: EnumLoaderService,
    private constantLoaderService: ConstantLoaderService) { }

  ngOnInit() {
  }

  ngDoCheck(){
    this.modelChange.next(this.model);
  }

  private hasSpecialChar(): boolean{
    var chars: Array<string> = this.constantLoaderService.regexPatternService.SPECIAL_CHAR.split('');
    for(var index=0; index<chars.length; index++){
      if(this.model.indexOf(chars[index]) >= 0){
        return true;
      }
    }
    return false;
  }

  private setSummary(){
    if(this.minLength === 0){
      this.minLength = 8;
    }
    this.summaryBoxValidation.hasUpperCase = (new RegExp(this.constantLoaderService.regexPatternService.UPPER_CASE_CHARACTER)).test(this.model);
    this.summaryBoxValidation.hasSmallCase = (new RegExp(this.constantLoaderService.regexPatternService.SMALL_CASE_CHARACTER)).test(this.model);
    this.summaryBoxValidation.hasNumber = (new RegExp(this.constantLoaderService.regexPatternService.NUMBER)).test(this.model);
    this.summaryBoxValidation.hasNotSpcChar = !this.hasSpecialChar();
    this.summaryBoxValidation.hasMinLen = this.model.length >= this.minLength;

    this.boxSmryUpdate.emit({
      isBoxValid: this.summaryBoxValidation.hasUpperCase && this.summaryBoxValidation.hasSmallCase 
        && this.summaryBoxValidation.hasNumber && this.summaryBoxValidation.hasMinLen && this.summaryBoxValidation.hasNotSpcChar
    });
  }

  getSummaryBoxCss(isValid: boolean): string{
    return (isValid ? "valid-text" : "invalid-text");
  }

  getSummaryBoxIcon(isValid: boolean): string{
    return (isValid ? "fa-check" : "fa-times");
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
    this.isValueChng = true;
    if(this.isSummaryBox){
      this.setSummary();
    }
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

  onBackLabelClick(): void {
    if(this.isReadOnly){
      return;
    }
    this.isPassView = !this.isPassView;
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
}

export enum Messages {
  Required = "Required field",
  pattern = "Invalid value"
}