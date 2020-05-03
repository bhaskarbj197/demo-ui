/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { Router } from '@angular/router';
import { EnumLoaderService } from './loaders/enum-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private dataService: DataService,
    private broadcaster: Broadcaster,
    private constantLoaderService: ConstantLoaderService,
    private router: Router,
    private enumLoaderService: EnumLoaderService) { }

  isHeaderMenuShow: boolean = true;
  env: string = "";
  isNotificationAlrtClose: boolean = true;
  notificationMessage: string = "";
  notificationType: string = this.enumLoaderService.notificationTypes.SUCCESS;
  
  ngOnInit() {
    if(this.constantLoaderService.configValuesService.IS_ENV_NAME_SHOW){
      this.env = this.constantLoaderService.configValuesService.ENV_DISPLAY_NAME;
    }
    if(!this.dataService.isUserLoggedIn || this.dataService.user.userName === ""){
      this.router.navigate([""]);
    }
    this.isHeaderMenuShow = this.dataService.isUserLoggedIn;
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.LOGIN_HEADER_MENU_SHOW){
        this.isHeaderMenuShow = this.dataService.isUserLoggedIn;
      }
      if(obj.name === this.constantLoaderService.broadcastNamesService.SHOW_NOTIFICATION){
        this.showNotification(obj.data);
      }
    });
  }

  private showNotification(data: any){
    if(data.msg){
      this.notificationMessage = data.msg;
    } else{
      this.notificationMessage = "No Message!";
    }

    if(data.typ){
      this.notificationType = data.typ;
    }

    this.isNotificationAlrtClose = false;
  }

  onNotificationClose(){
    this.isNotificationAlrtClose = true;
  }
}
