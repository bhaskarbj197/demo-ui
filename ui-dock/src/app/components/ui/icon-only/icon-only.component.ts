/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-only',
  templateUrl: './icon-only.component.html',
  styleUrls: ['./icon-only.component.scss']
})
export class IconOnlyComponent implements OnInit {

  @Input() faIcon: string = "";
  @Input() dynamicClass: string = "";
  @Input() tooltipText: string = "";
  @Input() isFloatRight: boolean = false;
  @Input() size: string = "inherit";
  @Input() color: string = "inherit";
  
  constructor() { }

  ngOnInit() {
  }

  getDynamicClass(): string{
    return this.faIcon + " " + this.dynamicClass + (this.isFloatRight ? " float-right" : "");
  }
}
