/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table-no-records',
  templateUrl: './table-no-records.component.html',
  styleUrls: ['./table-no-records.component.scss']
})
export class TableNoRecordsComponent implements OnInit {

  @Input() list: Array<object> = new Array<object>();
  
  constructor() { }

  ngOnInit() {
  }

}
