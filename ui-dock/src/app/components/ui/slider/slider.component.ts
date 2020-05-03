/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, DoCheck } from '@angular/core';
import { Options, LabelType, CustomStepDefinition, ChangeContext, PointerType } from 'ng5-slider'; 

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, DoCheck {

  @Input() isRangeValue: boolean = false; // Single point slider or double points slider
  @Input() minValue: number = 0; // minimum slider value
  @Input() maxValue: number = 100; // maximum slider value
  @Input() step: number = 0; // steps in slider
  @Input() isShowStepTick: boolean = false; // step tick show or not
  @Input() isShowTicksValues: boolean = false; // step tick values show or not
  @Input() ticksArray: Array<number> = []; // ticks array
  @Input() stepsLegendValues: Array<CustomStepDefinition> = []; // object: {value: 1, legend: 'Very poor'} | depends on isShowTicksValues=true
  @Input() minLimit: number = 0; // minimum value limit
  @Input() maxLimit: number = 0; // maximum value limit
  @Input() minRange: number = 0; // minimum range difference in double point slider
  @Input() maxRange: number = 0; // maximum range difference in double point slider
  @Input() noSwitching: boolean = true; // value and high value will not switch or overlap
  @Input() pushRange: boolean = true; // values each other or not
  @Input() isDraggableRange: boolean = false; // range is draggable or not without changing the value
  @Input() isDraggableRangeOnly: boolean = false; // range is draggable or not
  @Input() showSelectionBarFromStart: boolean = true; // show selection bar from start for single point slider
  @Input() showSelectionBarFromEnd: boolean = false; // show selection bar from end for single point slider
  @Input() showSelectionBarFromValue: number = -1; // show selection bar from a specific value
  @Input() isShowSelectionBarGradient: boolean = false; // gradient color for selection bar
  @Input() selectionBarGradientFromColor: string = ""; // gradient color from and working with isShowSelectionBarGradient=true
  @Input() selectionBarGradientToColor: string = ""; // gradient color to and working with isShowSelectionBarGradient=true
  @Input() rightToLeft: boolean = false; // slider right to left
  @Input() valuePrefix: string = ""; // prefix character for slider min, max and pointer values
  @Input() minValuePrefixLabel: string = ""; // min pointer value label
  @Input() maxValuePrefixLabel: string = ""; // max pointer value label
  @Input() isVertical: boolean = false; // slider is vertical or not
  @Input() isReadOnly: boolean = false; // slider is readonly or not
  @Input() isDisabled: boolean = false; // slider is disable or not
  @Input() stepValueTooltipText: string = ""; // tooltip text for step value | <tooltip text> + step text
  @Input() stepTickTooltipText: string = ""; // tooltip text for step tick | <tooltip text> + step text
  @Input() sliderBarColors: Array<string> = []; // ["red", "orange", "yellow", "#2AE02A"]
  @Input() pointerColors: Array<string> = ["red", "orange", "yellow", "#2AE02A"]; // ["red", "orange", "yellow", "#2AE02A"]
  @Input() isHours: boolean = false;

  @Input() isFocusMinValue: boolean = false;
  @Input() isFocusMaxValue: boolean = false;

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  @Output() userChangeStarted: EventEmitter<object> = new EventEmitter<object>();
  @Output() userChangeEnded: EventEmitter<object> = new EventEmitter<object>();
  @Output() userChanged: EventEmitter<object> = new EventEmitter<object>();
  @Output() getChangedContextString: EventEmitter<object> = new EventEmitter<object>();

  @Input() model: number;
  ngModelHigh: number = 20;

  options: Options = {};

  triggerFocus: EventEmitter<PointerType> = new EventEmitter<PointerType>();

  constructor() { }

  ngOnChanges(changes: SimpleChange){
    if(typeof changes['isFocusMinValue'] !== "undefined"){
      var minValueChange = changes['isFocusMinValue'];
      if(minValueChange.currentValue){
        this.triggerFocus.emit(PointerType.Min);
      }
    }
    if(typeof changes['isFocusMaxValue'] !== "undefined"){
      var maxValueChange = changes['isFocusMaxValue'];
      if(maxValueChange.currentValue){
        this.triggerFocus.emit(PointerType.Max);
      }
    }
  }

  ngDoCheck(){
    this.modelChange.next(this.model);
  }

  ngOnInit() {
    this.options = {
      floor: this.minValue,
      ceil: this.maxValue,
      step: this.step,
      showTicks: this.isShowStepTick,
      showTicksValues: this.isShowTicksValues,
      noSwitching: this.noSwitching,
      pushRange: this.pushRange,
      showSelectionBar: this.showSelectionBarFromStart,
      showSelectionBarEnd: this.showSelectionBarFromEnd,
      rightToLeft: this.rightToLeft,
      draggableRange: this.isDraggableRange,
      draggableRangeOnly: this.isDraggableRangeOnly,
      translate: (value: number, label: LabelType): string => {
        if(this.isHours){
          if(value <= 12){
            return value + ((value === 12) ? ' pm' : ' am');
          } else {
            return (value-12) + ((value === 24) ? ' am' : ' pm');
          }
        } else{
          if(this.minValuePrefixLabel.length > 0 && this.maxValuePrefixLabel.length > 0){
            switch (label) {
              case LabelType.Low:
                return '<b>' + this.minValuePrefixLabel + ':</b> ' + this.valuePrefix + value;
              case LabelType.High:
                return '<b>' + this.maxValuePrefixLabel + ':</b> ' + this.valuePrefix + value;
              default:
                return this.valuePrefix + value;
            }
          }else{
            return this.valuePrefix + value;
          }
        }
      },
      vertical: this.isVertical,
      readOnly: this.isReadOnly,
      disabled: this.isDisabled
    };

    if(this.minLimit > 0){
      this.options.minLimit = this.minLimit;
    }

    if(this.maxLimit > 0){
      if(this.maxLimit > this.maxValue){
        this.options.maxLimit = this.maxValue;
      }else{
        this.options.maxLimit = this.maxLimit;
      }
    }

    if(this.isRangeValue){
      if(this.minRange > 0){
        this.options.minRange = this.minRange;
      }
      if(this.maxRange > 0){
        this.options.maxRange = this.maxRange;
      }
    }

    if(this.showSelectionBarFromValue > -1){
      this.options.showSelectionBarFromValue = this.showSelectionBarFromValue;
    }

    if(this.showSelectionBarFromStart || this.showSelectionBarFromEnd || this.showSelectionBarFromValue > -1){
      if(this.isShowSelectionBarGradient){
        this.options.selectionBarGradient = {
          from: this.selectionBarGradientFromColor,
          to: this.selectionBarGradientToColor
        };
      }
    }

    if(this.ticksArray.length > 0){
      this.options.ticksArray = this.ticksArray;
    }

    if(this.stepsLegendValues.length > 0){
      this.options.stepsArray = this.stepsLegendValues;
    }

    if(this.isShowTicksValues){
      if(this.stepValueTooltipText.length > 0){
        this.options.ticksValuesTooltip = (val: number): string => {
          return this.stepValueTooltipText + val;
        }
      }
      if(this.stepTickTooltipText.length > 0){
        this.options.ticksTooltip = (val: number): string => {
          return this.stepTickTooltipText + val;
        }
      }
    }

    if(this.sliderBarColors !== null && this.sliderBarColors.length > 0){
      this.options.getSelectionBarColor = this.getBarColors();
    }
    
    if(this.pointerColors !== null && this.pointerColors.length > 0){
      this.options.getPointerColor = this.getPointerColors();
    }
  }

  onUserChangeStart(changeContext: ChangeContext): void {
    this.userChangeStarted.emit({
      pointerType: changeContext.pointerType,
      value: changeContext.value,
      highValue: changeContext.highValue
    });
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    this.userChangeEnded.emit({
      pointerType: changeContext.pointerType,
      value: changeContext.value,
      highValue: changeContext.highValue
    });
  }

  onUserChange(changeContext: ChangeContext): void {
    this.userChangeEnded.emit({
      pointerType: changeContext.pointerType,
      value: changeContext.value,
      highValue: changeContext.highValue
    });
  }

  getChangeContextString(changeContext: ChangeContext): void {
    this.getChangedContextString.emit({
      pointerType: changeContext.pointerType,
      value: changeContext.value,
      highValue: changeContext.highValue
    });
  }

  getBarColors(): any{
    return (value: number): string => {
      for(var index=0; index<this.sliderBarColors.length; index++){
        if(value <= ((this.maxValue/this.sliderBarColors.length)*(index+1))){
          return this.sliderBarColors[index];
        }
      }
    }
  }

  getPointerColors(): any{
    return (value: number): string => {
      for(var index=0; index<this.pointerColors.length; index++){
        if(value <= ((this.maxValue/this.pointerColors.length)*(index+1))){
          return this.pointerColors[index];
        }
      }
    }
  }
}
