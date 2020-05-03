/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { FrequencyModel } from 'src/app/models/frequency.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-frequency-master',
  templateUrl: './frequency-master.component.html',
  styleUrls: ['./frequency-master.component.scss']
})
export class FrequencyMasterComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  frequencyList: Array<FrequencyModel> = new Array<FrequencyModel>();

  ngOnInit() {
    this.getFrequencyList();
  }

  private getFrequencyList(){
    this.isLoading = true;
    this.businessLoaderService.frequencyBusinessService.getFrequencyListAsync().subscribe(res => {
      if(res.body){
        this.frequencyList = this.businessLoaderService.frequencyBusinessService.getFrequencyList(res.body);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
}
