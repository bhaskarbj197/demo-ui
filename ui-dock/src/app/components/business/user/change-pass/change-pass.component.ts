/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private handlerLoaderService: HandlerLoaderService,
    private constantLoaderService: ConstantLoaderService) { }
  
  isLoading: boolean = false;
  currentPass: string = "";
  newPass: string = "";
  confirmPass: string = "";
  isSubmit: boolean = false;
  errorMsg: string = "";
  isNewPassValid: boolean = false;
  isPassChanged: boolean = false;
  minimumPassLength = this.constantLoaderService.defaultValuesService.USER_MIN_PASS_LENGTH;

  ngOnInit() {
  }

  private validForm(): boolean{
    if(this.currentPass === "" || this.newPass === "" || this.confirmPass === ""){
      return false;
    }
    if(this.currentPass === this.newPass){
      this.errorMsg = "Current password and new password should not be equal!";
      return false;
    }
    if(this.confirmPass !== this.newPass){
      this.errorMsg = "New password and confirm password should be equal!";
      return false;
    }
    if(this.newPass.length < this.minimumPassLength){
      this.errorMsg = "Minimum length of new password is " + this.minimumPassLength.toString() + "!";
    }
    if(!this.isNewPassValid){
      this.errorMsg = "New password is not following the password rules!";
    }
    return this.isNewPassValid;
  }

  onSaveClick(){
    this.isPassChanged = true;
    this.isLoading = true;
    this.errorMsg = "";
    this.isSubmit = true;
    if(!this.validForm()){
      this.isLoading = false;
      return;
    }
    this.businessLoaderService.userBusinessService.changePasswordAsync(
      this.handlerLoaderService.encryptionHandlerService.set(this.currentPass),
      this.handlerLoaderService.encryptionHandlerService.set(this.newPass)).subscribe(res => {
      if(res.body){
        if(!res.body.isSuccess){
          this.errorMsg = "Current password which you entered is not matching. Try again!";
        }else{
          this.handlerLoaderService.notificationHandlerService.showSuccess("Password changed successfully. You are redirecting to Login page.");
          setTimeout(() => {
            this.businessLoaderService.userBusinessService.logoutUser();
          }, 2500);
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  onBoxSummaryUpdate(obj: any){
    if(obj){
      this.isNewPassValid = obj.isBoxValid
    }
  }
}
