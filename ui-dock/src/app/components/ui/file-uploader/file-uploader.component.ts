/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnumLoaderService } from 'src/app/loaders/enum-loader.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  @Input() uploadedFileInfo: string = "Upload new file";
  @Input() isDisabled: boolean = false;
  @Input() ctrlId: string = "";
  @Input() fixedLen: string = "0px";
  @Input() acceptedFormat: string = ".csv,.xlsx,.xls";
  @Input() label: string = "";
  @Input() isRequired: boolean = false;
  @Input() minLabelLen: string = "0px";
  @Input() uploadBtnLabel: string = "Upload";
  @Input() uploadBtnType: string = "";
  @Input() uploadBtnLeftMargin: string = "0px";
  @Output() uploadFile: EventEmitter<object> = new EventEmitter<object>();
  
  constructor(private formBuilder: FormBuilder,
    private enumLoaderService: EnumLoaderService) { }

  uploadedFile: any;
  uploadForm: FormGroup;
  messageShow: string = Messages.Required;
  isSubmit: boolean = false;
  files:any;
  inputEvent: any;

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
  }

  handleFileInput(event: any) {
    this.inputEvent = event;
    this.files = event.target.files;
    let formdata : FormData = new FormData();
    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
    if(this.files && this.files.length > 0) {
      this.uploadForm.get('file').setValue(this.files.item(0));
      this.uploadedFileInfo = this.files.item(0).name;
      this.uploadedFile = this.files.item(0);
      formdata.append('file', this.files.item(0), this.files.item(0).name);
    }
  }

  isFormInValid() {
    return this.isSubmit && (this.uploadForm.value == null || 
      this.uploadForm.value.file == null || this.uploadForm.value.file == "");
  }

  onUploadClick() {
    this.isSubmit = true;
    if(!this.isFormInValid()) {
      this.uploadFile.emit({
        file: this.uploadedFile
      });
      this.resetFields();
    }
  }

  private resetFields() {
    this.inputEvent.srcElement.value = null;
    this.uploadForm.get('file').setValue(null);
    this.uploadedFileInfo = "Upload new file";
    this.isSubmit = false;
    if(this.isDisabled){
      return;
    }
    this.uploadFile.emit({
      file: this.uploadedFile
    })
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file').value);
    this.uploadFile.emit({
      file: this.uploadForm.get('file').value
    })
  }
  
  getFixedWidth(){
    if(this.fixedLen === '0px'){
      return 'auto';
    }
    return this.fixedLen;
  }

  getUploadBtnType(): string {
    if(this.uploadBtnType.length>0){
      if(this.enumLoaderService.buttonTypes[this.uploadBtnType]){
        return this.enumLoaderService.buttonTypes[this.uploadBtnType];
      }
    }
    return "";
  }
}

export enum Messages {
  Required = "Required field",
  pattern = "Invalid value"
  
}
