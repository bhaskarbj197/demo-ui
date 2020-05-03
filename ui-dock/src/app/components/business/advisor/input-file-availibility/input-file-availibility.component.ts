/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { InputFileAvailableModel } from '../../../../models/inputFileAvailable.model';
import { DataService } from 'src/app/services/data.service';
import { DateConverterPipe } from 'src/app/pipes/date-converter.pipe';
import { Router } from '@angular/router';
import { ConstantLoaderService } from '../../../../loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-input-file-availibility',
  templateUrl: './input-file-availibility.component.html',
  styleUrls: ['./input-file-availibility.component.scss']
})
export class InputFileAvailibilityComponent implements OnInit {

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private dateConverterPipe: DateConverterPipe,
    private router: Router,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  tabList: Array<string> = [this.constantLoaderService.tabListTextsService.ADVR_INPUT_FILE_AVLB_0];
  activeTab: string = this.tabList[0];
  isLoading: boolean = false;
  inputFiles: Array<InputFileAvailableModel> = new Array<InputFileAvailableModel>();

  ngOnInit() {
    this.loadInputFileAvailableList();
  }

  private loadInputFileAvailableList(){
    this.isLoading = true;
    this.businessLoaderService.advisorDetailGraphBusinessService.getInputFileAvailibilityAsync().subscribe(res => {
      if(res.body){
        this.inputFiles = this.businessLoaderService.advisorDetailGraphBusinessService.getInputFileAvailibility(res.body);
        this.isLoading = false;
      }
    }, err =>{
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onInputFileItemClick(selectedItem: InputFileAvailableModel, segment: string) {
    this.dataService.journalId = selectedItem.journalId;
    this.dataService.advisorSegment = segment;
    this.dataService.journalRunDate = this.dateConverterPipe.transform(selectedItem.runDate, false, true);
    this.router.navigate(["advisor"]);
  }
}
