/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { QuickHelpModel } from 'src/app/models/quickHelp.model';

@Component({
  selector: 'app-quick-help',
  templateUrl: './quick-help.component.html',
  styleUrls: ['./quick-help.component.scss']
})
export class QuickHelpComponent implements OnInit {

  @Input() headerName: string = "";
  @Input() helpList: Array<QuickHelpModel> = [];
  @Input() listItemValue: string = "";
  @Input() isHelpIconHidden: boolean = true;

  constructor() { }

  isHelpWindowShow: boolean = false;

  ngOnInit() {
  }

  getQuickHelp(code: string): string{
    if(this.helpList){
      if(this.helpList.findIndex(h => h.code === code) >= 0){
        return this.helpList.find(h => h.code === code).html;
      }
    }
    return "";
  }

  onClickedOutsideOfHelp(){
    this.isHelpWindowShow = false;
  }

  onHelpOpenClick(){
    this.isHelpWindowShow = !this.isHelpWindowShow;
  }
}
