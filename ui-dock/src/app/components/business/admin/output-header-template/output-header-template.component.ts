import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { OutputHeaderTemplateModel, OutputHeaderTemplateTypeModel } from 'src/app/models/outputHeaderTemplate.model';

@Component({
  selector: 'app-output-header-template',
  templateUrl: './output-header-template.component.html',
  styleUrls: ['./output-header-template.component.scss']
})
export class OutputHeaderTemplateComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private constantLoaderService: ConstantLoaderService,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  outputHeaders: Array<OutputHeaderTemplateModel> = new Array<OutputHeaderTemplateModel>();
  headerTypes: Array<OutputHeaderTemplateTypeModel> = new Array<OutputHeaderTemplateTypeModel>();
  templateId: number = 0;
  deletingIndex: number = -1;

  ngOnInit() {
    this.loadHeaderTypes();
    this.loadTemplateList();
  }

  private loadHeaderTypes(){

  }

  private loadTemplateList(){
    this.isLoading = true;
    this.businessLoaderService.templateMasterBusinessService.getAllTemplatesAsync().subscribe(res => {
      if(res.body && res.body.length > 0) {
        var templates = res.body.filter(t => t.isActive);
        for(var index=0; index<templates.length; index++){
          this.templateList.push(new TemplateMasterPartialModel(templates[index].templateId, templates[index].templateName));
        }
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    });
  }

  private loadOutputHeaderTemplate(){

  }

  onTemplateChanged(obj: any){
    if(obj){
      this.templateId = obj.item.id;
      this.loadOutputHeaderTemplate();
    }
  }

  getMaxSequence(): number{
    return this.outputHeaders.reduce((prev, cur) => (prev.seq > cur.seq) ? prev : cur).seq;
  }

  onAddNewHeaderItem(){
    var seq = this.outputHeaders.length === 0 ? 1 : (this.getMaxSequence() + 1);
    this.outputHeaders.push(new OutputHeaderTemplateModel(seq));
  }

  onSubmitHeaderTemplate(){

  }

  onResetAll(){

  }

  onHeaderItemTypeChanged(obj: any, item: OutputHeaderTemplateModel){

  }

  onDeleteFormatClick(item: OutputHeaderTemplateModel, isConfirm: boolean, index: number){
    if(isConfirm === null){
      this.deletingIndex = index;
    } else if(isConfirm){
      this.outputHeaders.splice(this.deletingIndex, 1);
      this.deletingIndex = -1;
    } else {
      this.deletingIndex = -1;
    }
  }

  onSequenceChangedClick(item: OutputHeaderTemplateModel, updateSeq: number){
    if(item && updateSeq !== null){
      if(item.seq === 1 && updateSeq < 0){
        return;
      } else if(item.seq === this.getMaxSequence() && updateSeq > 0){
        return;
      } else {
        //seq logic
      }
    }
  }
}
