/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserModel } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { UserInfoListItemModel } from 'src/app/models/userInfoListItem.model';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @Output() closeUserInfoEvent: EventEmitter<object> = new EventEmitter<object>();
  constructor(private dataService: DataService,
    private businessLoaderService: BusinessLoaderService,
    private router: Router) { }

  userInfo: UserModel = this.dataService.user;
  infoList: Array<UserInfoListItemModel> = new Array<UserInfoListItemModel>();
  

  ngOnInit() {
    this.loadInfoList();
  }

  private loadInfoList(){
    this.infoList = this.businessLoaderService.userUiJsonBusinessService.getUserInfoList();
  }

  onLogoutClick(){
    this.businessLoaderService.userBusinessService.logoutUser();
  }

  onInfoItemClick(item: UserInfoListItemModel){
    if(item){
      this.dataService.userInfoCode = item.code;
      this.closeUserInfoEvent.emit();
      this.router.navigate(["user"]);
    }
  }
}
