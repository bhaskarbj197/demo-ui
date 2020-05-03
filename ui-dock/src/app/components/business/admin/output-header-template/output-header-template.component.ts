import { Component, OnInit, Input } from '@angular/core';
import { BusinessLoaderService } from 'src/app/loaders/business-loader.service';
import { ConstantLoaderService } from 'src/app/loaders/constant-loader.service';
import { HandlerLoaderService } from 'src/app/loaders/handler-loader.service';
import { TemplateMasterPartialModel } from 'src/app/models/templateMaster.model';
import { OutputHeaderTemplateModel, OutputHeaderTemplateTypeModel, OutputHeaderMappingColumnmsModel } from 'src/app/models/outputHeaderTemplate.model';
import { GeneralUtility } from 'src/app/utility/general-utility';
import { templateIdType } from 'src/app/services/types';

@Component({
  selector: 'app-output-header-template',
  templateUrl: './output-header-template.component.html',
  styleUrls: ['./output-header-template.component.scss']
})
export class OutputHeaderTemplateComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor(private businessLoaderService: BusinessLoaderService,
    private utility: GeneralUtility,
    private handlerLoaderService: HandlerLoaderService) { }

  isLoading: boolean = false;
  templateList: Array<TemplateMasterPartialModel> = new Array<TemplateMasterPartialModel>();
  outputHeaders: Array<OutputHeaderTemplateModel> = new Array<OutputHeaderTemplateModel>();
  mappingTypes: Array<OutputHeaderTemplateTypeModel> = new Array<OutputHeaderTemplateTypeModel>();
  allMappingColumns: Array<OutputHeaderMappingColumnmsModel> = new Array<OutputHeaderMappingColumnmsModel>();
  mappingColumns: Array<OutputHeaderMappingColumnmsModel> = new Array<OutputHeaderMappingColumnmsModel>();
  templateId: templateIdType = 0;
  deletingIndex: number = -1;

  ngOnInit() {
    this.loadHeaderTypes();
    this.loadTemplateList();
  }

  private loadHeaderTypes(){
    var mappingType = new OutputHeaderTemplateTypeModel();
    this.mappingTypes = [];
    this.businessLoaderService.outputHeaderTemplateBusinessService.getHeaderMappingListAsync().subscribe(res => {
      if(res.body.mappingColumns && res.body.mappingColumns.length > 0) {
        this.allMappingColumns = res.body.mappingColumns.map(data => new OutputHeaderMappingColumnmsModel(data.colLabel, data.mappingCol, data.mappingType));        
      }
      if(res.body && res.body.mappingTypes && res.body.mappingTypes.length > 0) {
        this.mappingTypes = res.body.mappingTypes.map(item => {
          let tmpMappingColumns: Array<any> =[];
          if(this.allMappingColumns && this.allMappingColumns.length > 0) {
            tmpMappingColumns = this.allMappingColumns.filter(data => data.mappingType === item);
          }          
          mappingType = new OutputHeaderTemplateTypeModel(item.replace(/\s+/g,''), item, tmpMappingColumns);
          return mappingType;
        });
      }      
    })
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
    this.isLoading = true;
    this.businessLoaderService.outputHeaderTemplateBusinessService.getHeaderTemplateByTemplateIdAsync(this.templateId).subscribe(res => {
      this.isLoading = false;
      this.outputHeaders = this.businessLoaderService.outputHeaderTemplateBusinessService.transformResponseToModel(res);
      console.log(this.outputHeaders);
    }, err => {
      this.isLoading = false;
      this.handlerLoaderService.errorHandlerService.handleError(err);
    })
  }

  onTemplateChanged(obj: any){
    if(obj){
      this.templateId = obj.item.id;
      this.loadOutputHeaderTemplate();
    }
  }

  getMappingColumns(mappingType: string) {
    let tmpMappingType: OutputHeaderTemplateTypeModel;
    let returnData: Array<any> = [];
    if(this.mappingTypes && this.mappingTypes.length > 0) {
      tmpMappingType = this.mappingTypes.find(data => data.value === mappingType);
      if(tmpMappingType && tmpMappingType.mappingColumns && tmpMappingType.mappingColumns.length > 0) {
        return this.mappingTypes.find(data => data.value === mappingType).mappingColumns;
      } else {
        return returnData;
      }
    } else {
      return returnData;
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
    this.isLoading = true;
    this.businessLoaderService.outputHeaderTemplateBusinessService.saveHeaderTemplateAsync(this.templateId, this.outputHeaders).subscribe(res => {
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    })
  }

  onResetAll(){

  }

  onMappingTypeChanged(event: any, item: OutputHeaderTemplateModel){
    
  }

  onMappingColumnChanged(event: any, item: OutputHeaderTemplateModel){
    if(event.item) {
      item.mappingCol = event.item.mappingCol;
    }
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

  onSequenceChangedClick(currentIndex: number, updateSeq: number){
    if(this.outputHeaders && this.outputHeaders.length > 1 && updateSeq !== null){
        this.utility.move(this.outputHeaders, currentIndex, updateSeq, "seq");
      }
    }
}
