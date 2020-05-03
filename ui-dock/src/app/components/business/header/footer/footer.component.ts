/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  isTmOpen: boolean = false;
  istmJustOpen: boolean = false;

  ngOnInit() {
  }

  onTermsConditionsClick(){
    this.isTmOpen = !this.isTmOpen;
    this.istmJustOpen = true;
  }

  onTmOutsideClicked(){
    if(!this.istmJustOpen && this.isTmOpen){
      this.isTmOpen = false;
    }
    if(this.istmJustOpen){
      this.istmJustOpen = false;
    }
  }
}
