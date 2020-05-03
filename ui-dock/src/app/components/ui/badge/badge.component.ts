/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumLoaderService } from '../../../loaders/enum-loader.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input() value: string = "";
  @Input() type: string = this.enumLoaderService.badgeTypes.LIGHT;
  @Input() isExtraRoundedBadge: boolean = false;
  @Input() isLink: boolean = false;
  @Input() isClickable: boolean = false;

  @Output() badgeClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private enumLoaderService: EnumLoaderService) { }

  ngOnInit() {
  }

  getClass(){
    return (this.isExtraRoundedBadge ? "badge-pill " : "") + this.type; 
  }

  onBadgeClick(event: any){
    this.badgeClick.emit({
      event: event
    });
  }
}