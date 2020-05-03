/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from '../../../../loaders/business-loader.service';
import { ValidationResultModel } from '../../../../models/validationResult.model';
import { EnumLoaderService } from '../../../../loaders/enum-loader.service';
import { GeneralUtility } from '../../../../utility/general-utility';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { JournalInfoPartial } from 'src/app/models/journalInfo.model';
import { Broadcaster } from 'src/app/utility/broadcaster';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';

@Component({
  selector: 'app-validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.scss']
})
export class ValidationResultsComponent implements OnInit {

  @Input() heading: string = "";
  @Input() journalInfo: JournalInfoPartial = new JournalInfoPartial();
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private enumLoaderService: EnumLoaderService,
    private generalUtility: GeneralUtility,
    private broadcaster: Broadcaster,
    private handlerLoaderService: HandlerLoaderService) { }

  
  validationResults: Array<ValidationResultModel> = [];
  isLoading: boolean = false;
  journalGraphs: any = { 
    validationStatus: { data: [], labels: [], colors: []},
    validationCategory: { dataSet: [], labels: [], colors: []}
  };

  ngOnInit() {
    this.broadcaster.receive().subscribe(obj => {
      if(obj.name === this.constantLoaderService.broadcastNamesService.REFRESH_ADVISOR_VALIDATION_VIEW){
        this.journalInfo = obj.data;
        this.getValidationResults();
      }
    });
    this.getValidationResults();
  }

  private getValidationResults(){
    this.isLoading = true;
    this.businessLoaderService.advisorValidationResultBusinessService.getValidationResultAsync(this.journalInfo.id, this.journalInfo.runDateSelected).subscribe(response => {
      if(response.body){
        this.validationResults = this.generalUtility.getSortedArray(
          this.businessLoaderService.advisorValidationResultBusinessService.getValidationResult(response.body), "validationNo");
        if(this.validationResults && this.validationResults.length > 0){
          this.journalGraphs.validationStatus.labels = ["OK", "Error"];
          this.journalGraphs.validationStatus.data.push(this.validationResults.filter(v => v.isSuccess).length);
          this.journalGraphs.validationStatus.data.push(this.validationResults.filter(v => !v.isSuccess).length);
          this.journalGraphs.validationStatus.colors.push(this.enumLoaderService.chartColors.PIE_GREEN);
          this.journalGraphs.validationStatus.colors.push(this.enumLoaderService.chartColors.PIE_RED);

          var statuses: Array<{label: string, data: Array<number>}> = [];
          for(var index=0; index<this.validationResults.length; index++){
            if(this.journalGraphs.validationCategory.labels.findIndex(vl => vl === this.validationResults[index].category) < 0){
              this.journalGraphs.validationCategory.labels.push(this.validationResults[index].category);
            }
            if(statuses.findIndex(s => s.label === this.validationResults[index].statusText) < 0){
              statuses.push({label: this.validationResults[index].statusText, data: []});
            }
          }
          for(var cnt=0; cnt<this.journalGraphs.validationCategory.labels.length; cnt++){
            for(var idx=0; idx<statuses.length; idx++){
              statuses[idx].data.push(this.validationResults.filter(v => v.category === this.journalGraphs.validationCategory.labels[cnt] 
                && v.statusText === statuses[idx].label).length);
            }
          }
          this.journalGraphs.validationCategory.dataSet = statuses;
          for(var index=0; index<statuses.length; index++){
            var color = this.generalUtility.getRandomColorCodeInRgb();
            if(index === 0){
              color = this.enumLoaderService.chartColors.BAR_RED_1;
            } else if(index === 1){
              color = this.enumLoaderService.chartColors.BAR_GREEN_1;
            }
            this.journalGraphs.validationCategory.colors.push(color);
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onDownloadValidationResult(){
    this.isLoading = true;
    var reqJson = {};
    let file = "validated_output";
    let responseType: string = this.constantLoaderService.defaultValuesService.RESPONSE_TYPE_CSV;
    let fileContentType = this.constantLoaderService.defaultValuesService.FILE_CONTENT_TYPE_CSV;
    let downloadFilename: string = "";
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_JID] = this.journalInfo.id;
    reqJson[this.constantLoaderService.defaultValuesService.PARAM_DATE] = this.journalInfo.runDateSelected;
    reqJson["fileType"] = this.enumLoaderService.downloadFileTypes.VALIDATION;
    downloadFilename = file + ".csv";
    this.businessLoaderService.commonBusinessService.downloadEvidenceAsync(reqJson, responseType).subscribe(res => {
      this.isLoading = false;
      this.generalUtility.download(res.body, downloadFilename, fileContentType);
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }
}