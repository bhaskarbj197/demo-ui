/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { RoleModel } from 'src/app/models/role.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.scss']
})
export class RoleViewComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private dataService: DataService) { }

  roleDetails: RoleModel = null;

  ngOnInit() {
    this.getRoleDetails();
  }

  private getRoleDetails(){
    if(this.dataService.user && this.dataService.user.role){
      this.roleDetails = this.dataService.user.role;
    }
  }
}
