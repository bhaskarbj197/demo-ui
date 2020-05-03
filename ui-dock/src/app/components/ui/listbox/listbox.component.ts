/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent implements OnInit {

  @Input() ctrlId: string = "";
  @Input() list: Array<object> = [];
  @Input() key: string = "";
  @Input() val: string = "";
  @Input() maxSelected: number = 1;
  @Input() selectedItems: Array<object> = [];
  @Input() autoNoSelectionAfterInSec: number = 0.5;
  @Input() helpText: string = "";

  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();
  
  constructor() { }

  ngOnInit() {
  }

  onItemclick(item: object){
    if(this.selectedItems.findIndex(i => i[this.key] === item[this.key]) > -1){
      this.selectedItems.splice(this.selectedItems.findIndex(i => i[this.key] === item[this.key]), 1);
    }else{
      if(this.selectedItems.length >= this.maxSelected){
        this.selectedItems.splice(0, 1);
      }
      this.selectedItems.push(item);
    }
    this.valueChange.emit({
      items: this.selectedItems
    });
    if(this.autoNoSelectionAfterInSec > 0){
      setTimeout(() => {
        this.selectedItems = [];
      }, this.autoNoSelectionAfterInSec * 1000);
    }
  }

  isActive(item: object): boolean{
    return (this.selectedItems.findIndex(i => i[this.key] === item[this.key]) > -1);
  }
}
