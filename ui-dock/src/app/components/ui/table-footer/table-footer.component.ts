/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.scss']
})
export class TableFooterComponent implements OnInit {

  @Input() totalRecords: number = 0;
  @Input() itemPerPage: number = 0;
  @Input() currentPageIndex: number = 0;
  @Input() mBtnLabel: string = "";
  @Input() mBtnIcon: string = "";
  @Input() mBtnType: string = "";
  @Input() mBtnAreaLabel: string = "";
  @Input() isMBtnShow: boolean = true;

  @Output() nextClicked: EventEmitter<object> = new EventEmitter<object>();
  @Output() prevClicked: EventEmitter<object> = new EventEmitter<object>();
  @Output() mBtnClick: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

  getTotalPageCount(): number{
    return Math.ceil(this.totalRecords/this.itemPerPage);
  }

  onNextClick(){
    if((this.currentPageIndex+1) >= this.getTotalPageCount()){
      return;
    }
    this.currentPageIndex += 1;
    this.nextClicked.emit({
      pageIndex: this.currentPageIndex
    });
  }

  onLastPageClick(){
    if((this.currentPageIndex+1) >= this.getTotalPageCount()){
      return;
    }
    this.currentPageIndex = this.getTotalPageCount() - 1;
    this.nextClicked.emit({
      pageIndex: this.currentPageIndex
    });
  }

  onPreviousClick(){
    if(this.currentPageIndex <= 0){
      return;
    }
    this.currentPageIndex -= 1;
    this.prevClicked.emit({
      pageIndex: this.currentPageIndex
    });
  }

  onFirstPageClick(){
    if(this.currentPageIndex <= 0){
      return;
    }
    this.currentPageIndex = 0;
    this.prevClicked.emit({
      pageIndex: this.currentPageIndex
    });
  }

  getStartRecordNumber(): number{
    if(this.totalRecords === 0){
      return 0;
    }
    return ((this.currentPageIndex * this.itemPerPage) + 1);
  }

  getLastRecordNumber(): number{
    if(((this.currentPageIndex+1) * this.itemPerPage) >= this.totalRecords){
      return this.totalRecords;
    }
    return ((this.currentPageIndex+1) * this.itemPerPage);
  }

  getFirstPageNumber(): number{
    if(this.totalRecords === 0){
      return 0;
    }
    return (this.currentPageIndex+1);
  }

  onMBtnClick(){
    this.mBtnClick.emit();
  }
}
