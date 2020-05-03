/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';

@Component({
  selector: 'app-header-action',
  templateUrl: './header-action.component.html',
  styleUrls: ['./header-action.component.scss']
})
export class HeaderActionComponent implements OnInit {

  @Input() isBackShow: boolean = false;
  @Input() isRunHide: boolean = false;
  @Input() isSaveHide: boolean = false;
  @Output() runClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() backClick: EventEmitter<object> = new EventEmitter<object>();
  @Output() saveClick: EventEmitter<object> = new EventEmitter<object>();

  constructor(private dataService: DataService,
    private constantLoaderService: ConstantLoaderService) { }
  
  isHeaderActionLoading: boolean = false;
  isViewOnly: boolean = (this.dataService.journalViewMode === this.constantLoaderService.viewModesService.VIEW);

  ngOnInit() {
  }

  onRunClick(){
    this.runClick.emit();
  }

  onBackClick(){
    this.isHeaderActionLoading = true;
    this.backClick.emit();
    this.isHeaderActionLoading = false;
  }

  onSaveClick(){
    this.isHeaderActionLoading = true;
    this.saveClick.emit();
    this.isHeaderActionLoading = false;
  }
}
