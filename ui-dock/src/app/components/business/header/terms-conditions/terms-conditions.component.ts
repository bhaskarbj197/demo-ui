/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsConditionsComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService) { }

  headerText: string = "";
  bodyHtml: string = "";

  ngOnInit() {
    this.loadTermsConditions();
  }

  private loadTermsConditions(){
    this.headerText = this.businessLoaderService.uiJsonBusinessService.getTermsConditions().heading;
    this.bodyHtml = this.businessLoaderService.uiJsonBusinessService.getTermsConditions().details;
  }
}
