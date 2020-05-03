/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuModel } from '../../../../models/headerMenu.model';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { DataService } from '../../../../services/data.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  @Input() isHeaderMenuShow: boolean = true;
  
  constructor(private router: Router,
    private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private constantLoaderService: ConstantLoaderService) { }

  menuItems: Array<HeaderMenuModel> = [];

  ngOnInit() {
    this.getHeaderMenu();
  }

  private getHeaderMenu(){
    this.menuItems = this.businessLoaderService.uiJsonBusinessService.getHeaderMenuJson();
    this.dataService.headerMenu = this.menuItems;
  }

  onMenuItemClick(item: HeaderMenuModel){
    if(!item.isClickable){
      return;
    }
    this.businessLoaderService.uiJsonBusinessService.setHeaderMenuSelectedItemByCode(item.code);
    if(item.code === this.constantLoaderService.defaultValuesService.HEADER_MENU_ITEM_JCC_CODE){
      this.dataService.journalViewMode = this.constantLoaderService.viewModesService.NEW;
    }
    this.router.navigate([item.route]);
  }

  isMenuItemShow(menuItem: HeaderMenuModel): boolean {
    if(this.dataService.user.role.menu[menuItem.code] === undefined){
      return true;
    }
    return this.dataService.user.role.menu[menuItem.code];
  }
}
