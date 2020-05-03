/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableColumnModel } from 'src/app/models/tableColumn.model';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  @Input() columns: Array<TableColumnModel> = new Array<TableColumnModel>();

  @Output() sortingClicked: EventEmitter<object> = new EventEmitter<object>();

  constructor(private enumLoaderService: EnumLoaderService) { }

  ngOnInit() {
  }

  getCssClass(col: TableColumnModel): string {
    var result: string = "";
    result = "cu-th w-" + (col.width ? col.width : 0).toString() + " no-border " + 
      (col.isCenter ? "text-center center-icon " : "") + " " + col.css;
    return result;
  }

  onSortClick(col: TableColumnModel){
    if(col && col.isAbleToSort){
      if(!col.isSorted){
        this.columns.filter(c => c.sortDirection = "");
      }
      col.sortDirection = (col.sortDirection === this.enumLoaderService.sortTypes.ASC) ? 
        this.enumLoaderService.sortTypes.DESC : this.enumLoaderService.sortTypes.ASC;
      this.columns.filter(c => c.isSorted = false);
      col.isSorted = true;

      this.sortingClicked.emit({
        sortBy: col.linkedProperty,
        dir: col.sortDirection
      });
    }
  }
}
