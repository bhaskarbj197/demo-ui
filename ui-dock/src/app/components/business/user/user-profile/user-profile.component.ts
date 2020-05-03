/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { UserModel, UserRequestObj } from 'src/app/models/user.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { Router } from '@angular/router';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { userIdType } from 'src/app/services/types';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private dataService: DataService,
    private router: Router,
    private broadcaster: Broadcaster,
    private businessLoaderService: BusinessLoaderService,
    private generalUtility: GeneralUtility,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  isEdit: boolean = false;
  isSubmit: boolean = false;
  userInfo: UserModel = new UserModel();
  journalsAsApprover: string = "";
  journalsAsReviewer: string = "";
  journalsAsPreparor: string = "";

  ngOnInit() {
    if(this.dataService.user && this.dataService.user.id) {
      this.loadUserDetails(this.dataService.user.id);
    }
  }

  private loadUserDetails(userId: userIdType){
    this.isLoading = true;
    this.businessLoaderService.userBusinessService.getUserDetailsAsync(userId).subscribe(res => {
      if(res.body){
        this.userInfo = this.businessLoaderService.userBusinessService.getUserDetails(res.body);
        this.journalsAsApprover = this.generalUtility.getConcatenatedString(
                                  this.userInfo.journalIdsAsApprover, 
                                  this.constantLoaderService.defaultValuesService.COMMA_SYMBOL);
        this.journalsAsPreparor = this.generalUtility.getConcatenatedString(
                                  this.userInfo.journalIdsAsPreparer, 
                                  this.constantLoaderService.defaultValuesService.COMMA_SYMBOL);
        this.journalsAsReviewer = this.generalUtility.getConcatenatedString(
                                  this.userInfo.journalIdsAsReviewer, 
                                  this.constantLoaderService.defaultValuesService.COMMA_SYMBOL);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private updateUserInSession() {
    this.dataService.user = this.userInfo;
    if(this.userInfo.role.id){
      this.dataService.user.role = this.businessLoaderService.userBusinessService.getRoleActionForUserByRoleId(this.userInfo.role.id);      
    }
    this.broadcaster.send(this.constantLoaderService.broadcastNamesService.USER_ROLE_SHOW);
    this.router.navigate(["home"]);
    this.dataService.userReqObj = new UserRequestObj().deserialize(this.dataService.user);    
  }

  onSaveClick() {
      this.isSubmit = true;
      if(this.userInfo.fName.length === 0 || this.userInfo.lName.length === 0 ||
        this.userInfo.role.id === 0 || this.userInfo.company.id === null) {
        return;
      }
      this.isLoading = true;
      this.businessLoaderService.userBusinessService.updateUserAsync(this.userInfo).subscribe(res => {
        if(res.body && res.body.isSuccess){
          this.isSubmit = false;
        }
        this.loadUserDetails(this.userInfo.id);
        this.updateUserInSession();
        this.handlerLoaderService.notificationHandlerService.showSuccess(
          this.constantLoaderService.messagesService.SAVE_SUCCESS.replace("{data}", "UserInfo"));
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.isSubmit = false;
        this.handlerLoaderService.errorHandlerService.handleError(err);
      });
  }
}
