/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Broadcaster } from '../../utility/broadcaster';
import { ConstantLoaderService} from '../../loaders/constant-loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessLoaderService } from '../../loaders/business-loader.service';
import { HandlerLoaderService } from '../../loaders/handler-loader.service';
import { UserRequestObj } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private dataService: DataService,
    private router: Router,
    private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService,
    private formBuilder: FormBuilder,
    private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  loginForm: FormGroup;
  isSubmitClicked: boolean = false;
  userName: string = "";
  password: string = "";
  loginErrorMsg: string = "";
  isLoading: boolean = false;
  isRememberMe: boolean = false;

  ngOnInit() {
    if(this.constantLoaderService.configValuesService.IS_KEYCLOAK_USE && this.dataService.isUserLoggedIn) {
      this.routeToHome();
    } else {
      if(this.handlerLoaderService.cookieHandlerService.getCookieByKey(this.constantLoaderService.cookieKeyService.UID) && 
        this.handlerLoaderService.cookieHandlerService.getCookieByKey(this.constantLoaderService.cookieKeyService.PASSWORD)){
        this.isRememberMe = true;
        this.userName = this.handlerLoaderService.cookieHandlerService.getCookieByKey(this.constantLoaderService.cookieKeyService.UID);
        this.password = this.handlerLoaderService.cookieHandlerService.getCookieByKey(this.constantLoaderService.cookieKeyService.PASSWORD);
      }      
    }
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private routeToHome() {    
      this.broadcaster.send(this.constantLoaderService.broadcastNamesService.LOGIN_HEADER_MENU_SHOW);
      this.dataService.user.userName = this.userName;
      this.broadcaster.send(this.constantLoaderService.broadcastNamesService.USER_ROLE_SHOW);
      this.router.navigate(["home"]);
      this.dataService.userReqObj = new UserRequestObj().deserialize(this.dataService.user);      
  }

  onLoginClick(){
    this.loginErrorMsg = "";
    this.isSubmitClicked = true;
    if(this.loginForm.invalid){
      return;
    }
    this.isLoading = true;

    if(this.isRememberMe){
      this.handlerLoaderService.cookieHandlerService.setCookie(this.constantLoaderService.cookieKeyService.UID, this.userName);
      this.handlerLoaderService.cookieHandlerService.setCookie(this.constantLoaderService.cookieKeyService.PASSWORD, this.password);
    } else {
      this.handlerLoaderService.cookieHandlerService.deleteCookieByKey(this.constantLoaderService.cookieKeyService.UID);
      this.handlerLoaderService.cookieHandlerService.deleteCookieByKey(this.constantLoaderService.cookieKeyService.PASSWORD);
    }

    this.businessLoaderService.userBusinessService.getUserLoginAsync(this.userName, 
      this.handlerLoaderService.encryptionHandlerService.set(this.password)).subscribe(res => {
      if(res.body && res.body.status && res.body.data){
        this.dataService.user.id = res.body.data.userId;
        this.dataService.user.fName = res.body.data.firstName;
        this.dataService.user.lName = res.body.data.lastName;
        this.dataService.user.email = this.userName;
        this.dataService.user.userName = this.userName;
        this.dataService.user.company.id = res.body.data.companyId;
        this.dataService.user.company.name = res.body.data.companyName;
        var isAuthorizationValid: boolean = false;
        if(res.body.data.roleId){
          this.dataService.user.role = this.businessLoaderService.userBusinessService.getRoleActionForUserByRoleId(res.body.data.roleId);
          if(this.dataService.user.role){
            isAuthorizationValid = true;
          }
        }
        if(isAuthorizationValid){
          this.dataService.isUserLoggedIn = true;
          this.broadcaster.send(this.constantLoaderService.broadcastNamesService.LOGIN_HEADER_MENU_SHOW);
          this.dataService.user.userName = this.userName;
          this.broadcaster.send(this.constantLoaderService.broadcastNamesService.USER_ROLE_SHOW);
          this.router.navigate(["home"]);
          this.dataService.userReqObj = new UserRequestObj().deserialize(this.dataService.user);
        } else {
          this.loginErrorMsg = "User authorization is not valid. Please try again!";
        }
        this.isLoading = false;
      }
    }, err => {
      this.handlerLoaderService.errorHandlerService.handleError(err, false);
      this.loginErrorMsg = "Authentication error. Please try again!"
      this.isLoading = false;
    });
  }

  onRememberMeClick(){
    this.isRememberMe = !this.isRememberMe;
  }
}