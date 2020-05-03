/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { FadeShowNotificationAnimation } from '../../../animations/fadeShowNotificationAnimations';
import { EnumLoaderService } from '../../../loaders/enum-loader.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [FadeShowNotificationAnimation]
})
export class NotificationComponent implements OnInit, AfterViewInit {

  @Input() type: string = this.enumLoaderService.notificationTypes.SUCCESS;
  @Input() message: string = "";
  @Input() position: string = this.enumLoaderService.notificationPositions.TOP;
  @Input() autoCloseInSecond: number = 9;
  @Input() isAlertClose: boolean = true;

  @Output() closeNotificationClick: EventEmitter<object> = new EventEmitter<object>();

  private autoCloseSubscription: Subscription;
  appearanceState: string = 'fade';

  constructor(private enumLoaderService: EnumLoaderService) { }

  ngOnInit() {
    if(this.autoCloseInSecond > 0){
      this.autoCloseSubscription = interval(this.autoCloseInSecond*1000).subscribe(
        (val) => { this.onCloseAlertClick()}
      );
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.appearanceState = "show";
    }, 1);
  }

  onCloseAlertClick(event: any = null){
    if(event === null && this.type === this.enumLoaderService.notificationTypes.DANGER){
      return;
    }
    this.closeNotificationClick.emit({
      event: event
    });
    this.appearanceState = "fade";
    this.isAlertClose = true;
  }
}