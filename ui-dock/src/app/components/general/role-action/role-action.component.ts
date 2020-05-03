/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { RoleModel } from 'src/app/models/role.model';

@Component({
  selector: 'app-role-action',
  templateUrl: './role-action.component.html',
  styleUrls: ['./role-action.component.scss']
})
export class RoleActionComponent implements OnInit {

  @Input() roleDetails: RoleModel = new RoleModel();

  constructor() { }

  ngOnInit() {
  }

  getIcon(hasRole: boolean = false): string{
    if(!hasRole) {
      return "fa-square-o";
    }
    return "fa-check-square-o has-role";
  }
}
