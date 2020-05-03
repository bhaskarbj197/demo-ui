/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() ctrlId: string = "";
  @Input() tabList: Array<string> = [];
  @Input() disableTabs: Array<string> = [];
  @Input() activeTab: string = "";
  @Input() comboLable: string = "";
  @Input() comboList: Array<string> = [];
  @Input() comboModel: string = "";
  @Input() isComboHidden: boolean = false;
  @Input() isBtnBoxShow: boolean = false;
  @Input() successBtnLabel: string = "";
  @Input() failBtnLabel: string = "";
  @Input() successBtnType: string = "";
  @Input() failBtnType: string = "";
  @Input() successBtnIcon: string = "";
  @Input() failBtnIcon: string = "";
  @Input() isFailBtnHide: boolean = false;
  @Input() isSuccessBtnHide: boolean = false;
  @Input() isSuccessBtnDisabled: boolean = false;
  @Input() isFailBtnDisabled: boolean = false;
  @Input() successBtnAreaLabel: string = "";
  @Input() failBtnAreaLabel: string = "";
  @Input() comboAreaLabel: string = "";

  @Output() activeTabChanged: EventEmitter<Object> = new EventEmitter();
  @Output() comboValueChanged: EventEmitter<Object> = new EventEmitter();
  @Output() successBtnClicked: EventEmitter<Object> = new EventEmitter();
  @Output() failBtnClicked: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if(this.tabList.length > 0 && this.activeTab === ""){
      this.activeTab = this.tabList[0];
    }
  }

  isDisableTab(tab: string) {
    return (this.disableTabs && this.disableTabs.length > 0 && this.disableTabs.indexOf(tab) >= 0);
  }

  onTabClick(tab: string){
    this.activeTab = tab;
    this.activeTabChanged.emit({
      activeTab: this.activeTab
    });
  }

  onComboValueChanged(obj: any){
    this.comboValueChanged.emit(obj);
  }

  onSuccessBtnClick(){
    this.successBtnClicked.emit();
  }

  onFailBtnClick(){
    this.failBtnClicked.emit();
  }
}
