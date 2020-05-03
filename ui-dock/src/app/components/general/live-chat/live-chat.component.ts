/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { DataService } from 'src/app/services/data.service';
import { ChatRequestModel } from 'src/app/models/chatRequest.model';
import { LivechatModel } from 'src/app/models/liveChat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit {

  @Input() isLiveChatShow: boolean = false;

  watsonChat: Array<LivechatModel> = [];
  typing: string = "...";
  userInput: string = "";
  userInputDisabled: boolean = false;

  constructor(private businessLoaderService: BusinessLoaderService,
    private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    this.setChatData(true, "watson");
    this.sendMessage();
  }

  private scrollToBottom(){
    setTimeout(() => {
      var chatContainer = document.getElementById('divChatContainer');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }

  private setChatData(isWatsonThinking: boolean, actor: string){
    var chat = new LivechatModel(false, isWatsonThinking, "", "", actor);
    this.watsonChat.push(chat);
    this.scrollToBottom();
  }

  private setChatProperty(propertyName: string, value: any, index?: number){
    if(this.watsonChat.length > 0){
      var idx = this.watsonChat.length - 1;
      if(index >= 0){
          idx = index;
      }
      this.watsonChat[idx][propertyName] = value;
      this.scrollToBottom();
    }
  }

  private callBoto(postData) {
    this.businessLoaderService.botoBusinessService.sendMessage(postData).subscribe(res => {
      this.setChatProperty("watson", res.body.msg);
      this.setChatProperty("user", "");
      this.setChatProperty("watsonTyping", false);
      this.setChatProperty("userTyping", false);
      this.setChatProperty("nextActor", "user")
      this.setChatProperty("action", res.body.action)
      if(this.dataService.liveChatConvId === "") {
        this.dataService.liveChatConvId = res.body.conversationId;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      }
    }, err => {
      this.setChatProperty("errorResponse", true, this.watsonChat.length - 2);
      this.setChatProperty("watsonTyping", false);
      this.setChatProperty("nextActor", "")
    })
  }

  onUserInputChange(changeEventData: any) {
    if(changeEventData !== "") {
      this.setChatProperty("userTyping", true);
    } else {
      this.setChatProperty("userTyping", false);
    }
    this.setChatProperty("watsonTyping", false);
  }

  submitUserInput() {
    if(this.userInput !== "") {
      this.setChatProperty("user", this.userInput);
      this.setChatProperty("userTyping", false);
      this.userInput = "";
      
      let postData = new ChatRequestModel();
      postData.input = this.watsonChat[this.watsonChat.length - 1].user;
      postData.conversationId = this.dataService.liveChatConvId;
      this.setChatData(true, "watson");
      this.callBoto(postData);
    }
  }

  sendMessage() {
    let reqObj = new ChatRequestModel();
    this.callBoto(reqObj);
  }

  onLiveChatClick(isShow: boolean){
    this.isLiveChatShow = isShow;
  }

  onClickedOutside(){
    this.isLiveChatShow = false;
  }

  onUserInputKeydown(obj: any){
    if(obj.keyCode === 13){
      this.submitUserInput();
      return false;
    }
  }

  onNewAdhocJournalClick(){
    this.dataService.isNewAdhocJournal = true;
    this.router.navigate(["jevan"]);
  }
}
