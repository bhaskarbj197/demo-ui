/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { ComboboxOptions } from '../combobox/combobox-options';

@Component({
  selector: 'app-expression-builder',
  templateUrl: './expression-builder.component.html',
  styleUrls: ['./expression-builder.component.scss']
})
export class ExpressionBuilderComponent implements OnInit, DoCheck {

  @Input() andOrWhereOptions: ComboboxOptions;
  @Input() andOrWhereModel: string;
  @Output() andOrWhereChange = new EventEmitter<Object>();
  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  constructor() { }

  

  ngOnInit() {
  }

  omItemChange(event: any) {
    this.andOrWhereChange.emit(event);
  }

  ngDoCheck(){
    this.modelChange.next(this.andOrWhereModel);
  }
  
}
