/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Component({
  selector: 'app-top-header-action-panel',
  templateUrl: './top-header-action-panel.component.html',
  styleUrls: ['./top-header-action-panel.component.scss']
})
export class TopHeaderActionPanelComponent implements OnInit {

  constructor(private dataService: DataService,
    private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService) { }

  roleText: string = "";
  userFullName: string = "";
  companyName: string = "";
  isUserInfoShow: boolean = false;
  isUserInfoJustOpen: boolean = false;
  isUserLoggedIn: boolean = false;

  ngOnInit() {
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.USER_ROLE_SHOW){
        if(this.dataService.isUserLoggedIn){
          this.roleText =  " [" + this.dataService.user.role.roleName + "]";
          this.userFullName = this.dataService.user.fName;
          this.companyName = " (" + this.dataService.user.company.name + ")";
          this.isUserLoggedIn = this.dataService.isUserLoggedIn;
        } else{
          this.isUserInfoShow = false;
          this.roleText = "";
          this.userFullName = "";
          this.companyName = "";
          this.isUserLoggedIn = false;
        }
      }
    });
  }

  onUserIconClick(){
    this.isUserInfoShow = !this.isUserInfoShow;
    this.isUserInfoJustOpen = true;
  }

  onClickedOutside(){
    if(!this.isUserInfoJustOpen && this.isUserInfoShow){
      this.isUserInfoShow = false;
    }
    if(this.isUserInfoJustOpen){
      this.isUserInfoJustOpen = false;
    }
  }

  onHelpClick(){
    if(this.constantLoaderService.configValuesService.HELP_URL.length > 0){
      window.open(this.constantLoaderService.configValuesService.HELP_URL, "_blank");
    }
  }
}
