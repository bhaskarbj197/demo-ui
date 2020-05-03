/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { bulkInputFilesModel } from 'src/app/models/inputSource.model';
import { MonthPartialModel, WeekPartialModel } from 'src/app/models/financialMonth.model';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { FrequencyModel } from 'src/app/models/frequency.model';
import { GeneralUtility } from 'src/app/utility/general-utility';

@Component({
  selector: 'app-bulk-file-upload',
  templateUrl: './bulk-inputFile-upload.component.html',
  styleUrls: ['./bulk-inputFile-upload.component.scss']
})
export class BulkInputFileUploadComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private generalUtility: GeneralUtility) { }

  isLoading: boolean = false;
  activeStep: number = 1;
  fileToUpload: File;
  isFileUploaded: boolean = false;
  bulkInputFiles: Array<bulkInputFilesModel> = new Array<bulkInputFilesModel>();
  savedFile: string = "";
  formData: FormData = new FormData();
  yearList: Array<number> = [];
  monthList: Array<MonthPartialModel> = new Array<MonthPartialModel>();
  weekList: Array<WeekPartialModel> = new Array<WeekPartialModel>();
  frequencyList: Array<FrequencyModel> = new Array<FrequencyModel>();
  selectedFrequency: number = 0;
  selectedYear: number = 0;
  selectedMonth: number = 0;
  selectedWeek: number = 0;
  validateReqBody: any = {};
  excludeFromFrequencyList: Array<string> = ["Daily", "Manual"];

  ngOnInit() {
    this.loadFrequenceList();
    this.loadYears();
    this.loadMonths();
    this.loadWeeks();
  }

  private reset() {
    this.formData = new FormData();
    this.bulkInputFiles = new Array<bulkInputFilesModel>();
    this.selectedFrequency = 0;
    this.selectedYear = 0;
    this.selectedMonth = 0;
    this.selectedWeek = 0;
    this.savedFile = "";
    this.isFileUploaded = false;
  }

  private loadYears(){
    this.yearList = [];
    var currentYear = (new Date()).getFullYear();
    for(var index= currentYear; index<= currentYear+5; index++){
      this.yearList.push(index);
    }
  }

  private loadMonths(){
    this.monthList = [];
    var months: Array<string> = this.handlerLoaderService.momentDateHandlerService.getFullMonthNameList();
    for(var index=0; index<months.length; index++){
      var mnth = new MonthPartialModel();
      mnth.name = months[index];
      mnth.monthNumber = index + 1;
      mnth.monthNoAsString = ("0" + mnth.monthNumber).slice(-2);
      this.monthList.push(mnth);
    }
  }

  private loadWeeks(){
    this.weekList = [];
    for(var index=0; index<52; index++){
      var week: WeekPartialModel = new WeekPartialModel();
      week.name = "Week # " + (index+1).toString();
      week.weekNumber = index+1;
      week.weekNoAsString = ("0" + week.weekNumber).slice(-2);
      this.weekList.push(week);
    }
  }

  private loadFrequenceList(){
    this.businessLoaderService.frequencyBusinessService.getFrequencyListAsync().subscribe(res => {
      if(res.body){
        this.frequencyList = this.businessLoaderService.frequencyBusinessService.getFrequencyList(res.body);
        for(var index=this.frequencyList.length-1; index>=0; index--){
          if(this.excludeFromFrequencyList.findIndex(f => f===this.frequencyList[index].name)>=0){
            this.frequencyList.splice(index, 1);
          }
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  isValidateBtnEnable(): boolean{
    return ((this.selectedFrequency > 0) && (this.selectedYear > 0) && 
      ((this.getMonthListShow() && (this.selectedMonth > 0)) || (!this.getMonthListShow() && (this.selectedWeek > 0)))
      && !this.generalUtility.isEmptyOrUndefined(this.savedFile));
  }

  onResetClick() {
    this.reset();
  }

  getStepCss(step: number): string{
    if(step === this.activeStep){
      return "cur-step";
    } else if(step < this.activeStep){
      return "pas-step";
    } else if(step > this.activeStep){
      return "fut-step";
    }
    return "";
  }

  onUploadData(fileInfo: any){
    if(!fileInfo || fileInfo.file === undefined || fileInfo.file.size.length === 0 || this.isLoading){
      return;
    }
    this.fileToUpload = fileInfo.file;
    if(fileInfo.file.size > (5120*1024)){
      this.handlerLoaderService.notificationHandlerService.showWarning("Uploaded zip file should be under 5MB!");
      return;
    }
    this.isLoading = true;
    this.formData.append('file', fileInfo.file, this.fileToUpload.name);
    this.businessLoaderService.bulkUploadBusinessService.uploadBulkInputZipAsync(this.formData).subscribe(res => {
      this.isLoading = false;
      this.isFileUploaded = true;
      this.savedFile = res.body.fileName;
      this.validateReqBody.fileName = this.savedFile;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  onValidateNextClick(){
    this.isLoading = true;
    this.businessLoaderService.bulkUploadBusinessService.validateBulkInputZipAsync(this.validateReqBody).subscribe(res => {
      if(res.body){
        this.bulkInputFiles = this.businessLoaderService.bulkUploadBusinessService.validateBulkInputZip(res.body);
      }
      this.isLoading = false;
      this.activeStep = this.activeStep + 1;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  onBackClick(){
    if(this.activeStep > 1){
      this.activeStep -= 1;
      this.reset();
    }
  }

  onFrequencyChanged(obj: any){
    if(obj){
      this.selectedFrequency = obj.item.id;
      this.validateReqBody.frequencyType = obj.item.name;
    }
  }

  onMonthChanged(obj: any){
    if(obj){
      this.selectedMonth = obj.item.monthNumber;
      this.validateReqBody.frequencyValue = obj.item.monthNoAsString;
    }
  }

  onWeekChanged(obj: any){
    if(obj){
      this.selectedWeek = obj.item.weekNumber;
      this.validateReqBody.frequencyValue = obj.item.weekNoAsString;
    }
  }

  onYearChanged(obj: any){
    if(obj){
      this.selectedYear = obj.item.key;
      this.validateReqBody.year  = this.selectedYear;
    }
  }

  getMonthListShow(): boolean{
    if(this.selectedFrequency === 0){
      return true;
    }
    return (this.frequencyList.find(f => f.id === this.selectedFrequency).name !== "Weekly");
  }
}
