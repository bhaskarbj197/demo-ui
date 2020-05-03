/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExcelFunctionListModel } from 'src/app/models/function.model';
import { FilterListWithColumnPipe } from 'src/app/pipes/filterListWithColumn.pipe';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';

@Component({
  selector: 'app-excel-textbox',
  templateUrl: './excel-textbox.component.html',
  styleUrls: ['./excel-textbox.component.scss']
})
export class ExcelTextboxComponent implements OnInit {

  @Input() columnFunctionList: Array<ExcelFunctionListModel> = new Array<ExcelFunctionListModel>();
  @Input() model: string = "";
  @Input() inputTable: string = "";

  @Output() modelChange: EventEmitter<Object> = new EventEmitter();
  @Output() excelBoxBlur: EventEmitter<object> = new EventEmitter<object>();

  constructor(private filterListWithColumnPipe: FilterListWithColumnPipe,
    private enumLoaderService: EnumLoaderService) { }

  list: Array<ExcelFunctionListModel> = new Array<ExcelFunctionListModel>();
  isDivShow: boolean = false;
  searchText: string = "";

  ngOnInit() {
  }

  onValueChange(newValue: string) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }

  onExcelBoxKeyup(obj: any){
    var charsToOpen: string[] = [" ", "+", "-", "=", "(", "*", "/", "!", ";"];
    if(obj.event.keyCode === this.enumLoaderService.keyCodes.DOWN_ARROW){
      if(this.list.length > 0 && this.isDivShow && this.searchText.length>0){
        for(var index=0; index<this.list.length; index++){
          if(this.list[index].isSelected){
            if(index+1 < this.list.length){
              this.list[index].isSelected = false;
              this.list[index+1].isSelected = true;
              return;
            }
          }
        }
      }
      return;
    }
    if(obj.event.keyCode === this.enumLoaderService.keyCodes.UP_ARROW){
      if(this.list.length > 0 && this.isDivShow && this.searchText.length>0){
        for(var index=0; index<this.list.length; index++){
          if(this.list[index].isSelected){
            if(index > 0){
              this.list[index].isSelected = false;
              this.list[index-1].isSelected = true;
              return;
            }
          }
        }
      }
      return;
    }
    if(obj.event.keyCode === this.enumLoaderService.keyCodes.ENTER){
      if(this.list.length > 0 && this.isDivShow && this.searchText.length>0){
        if(this.list.findIndex(l => l.isSelected) >= 0){
          this.model = this.model.substr(0, (this.model.length - this.searchText.length)) + 
            ((this.list.find(l => l.isSelected).typ === "func") ? this.list.find(l => l.isSelected).name : 
              (this.inputTable + "[" + this.list.find(l => l.isSelected).name + "]"));
          this.searchText = "";
          if(this.list.find(l => l.isSelected).typ === "func"){
            this.model += "(";
          } else {
            this.isDivShow = false;
          }
        }
      }
    }
    if((this.model.length > 0) && 
      charsToOpen.findIndex(c => c.toLowerCase()===this.model.substr((this.model.length - 1), 1).toLowerCase()) >= 0){
      this.isDivShow = true;
      this.searchText = "";
    }
    if(this.model.trim().length === 0){
      this.isDivShow = false;
    }
    if(this.isDivShow && this.model.trim() !== "="){
      if(obj.event.key.length === 1){
        this.searchText += obj.event.key.trim();
      } else if(obj.event.keyCode === this.enumLoaderService.keyCodes.BACKSPACE){
        this.searchText = this.searchText.substr(0, this.searchText.length-1);
      }
    }

    if(!this.isDivShow){
      this.searchText = "";
    }

    this.columnFunctionList.find(l => l.isSelected = false);
    this.list = this.filterListWithColumnPipe.transform(this.columnFunctionList, "name", this.searchText, false);
    if(this.isDivShow && this.searchText.length>0 && this.list.length>0){
      this.list[0].isSelected = true;
    }

    if(this.list.length === 0){
      this.isDivShow = false;
    }
  }

  onExcelBoxKeydown(obj: any){
    if((obj.event.keyCode === this.enumLoaderService.keyCodes.UP_ARROW) || 
      (obj.event.keyCode === this.enumLoaderService.keyCodes.DOWN_ARROW)){
      obj.event.preventDefault();
    }
  }

  onListItemClick(item: ExcelFunctionListModel){
    if(this.list.length > 0 && this.isDivShow){
      this.model = this.model.substr(0, (this.model.length - this.searchText.length)) + 
        ((item.typ === "func") ? item.name : (this.inputTable + "[" + item.name + "]"));
      this.searchText = "";
      if(item.typ === "func"){
        this.model += "(";
      } else {
        this.isDivShow = false;
      }
    }
  }

  onExcelBoxBlur(obj: any){
    this.excelBoxBlur.emit({event: obj});
  }
}
