/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ClickOutsideModule } from 'ng-click-outside';
import { Ng5SliderModule } from 'ng5-slider';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfigService } from './app.config.service';

import { JccComponent } from './view/jcc/jcc.component';
import { HomeComponent } from './view/home/home.component';
import { AdvisorHomeComponent } from './view/advisor-home/advisor-home.component';
import { AdvisorComponent } from './view/advisor/advisor.component';
import { AdvisorGraphComponent } from './view/advisor-graph/advisor-graph.component';
import { LoginComponent } from './view/login/login.component';
import { AdminComponent } from './view/admin/admin.component';
import { ReportComponent } from './view/report/report.component';
import { UserComponent } from './view/user/user.component';

import { AboutComponent } from './components/business/jcc/about/about.component';
import { InputSourceComponent } from './components/business/jcc/input-source/input-source.component';
import { ProcessStepsComponent } from './components/business/jcc/process-steps/process-steps.component';
import { DataProcessingComponent } from './components/business/jcc/data-processing/data-processing.component';
import { ResultSetComponent } from './components/business/jcc/result-set/result-set.component';
import { HeaderActionComponent } from './components/business/jcc/header-action/header-action.component';
import { OutputTemplateComponent } from './components/business/jcc/output-template/output-template.component';
import { RunHistoryLogsComponent } from './components/business/jcc/run-history-logs/run-history-logs.component';
import { LogsComponent } from './components/business/jcc/logs/logs.component';
import { ValidationRulesComponent } from './components/business/jcc/validation-rules/validation-rules.component';
import { AdvisorConfigComponent } from './components/business/jcc/advisor-config/advisor-config.component';
import { StatusActionComponent } from './components/business/jcc/status-action/status-action.component';
import { MainAreaHeaderComponent } from './components/business/jcc/main-area-header/main-area-header.component';
import { AuditTrialComponent } from './components/business/jcc/audit-trial/audit-trial.component';

import { SupportingDocsComponent } from './components/business/common/supporting-docs/supporting-docs.component';
import { CommentsComponent } from './components/business/common/comments/comments.component';

import { UserInfoComponent } from './components/business/header/user-info/user-info.component';
import { TopHeaderActionPanelComponent } from './components/business/header/top-header-action-panel/top-header-action-panel.component';
import { HeaderMenuComponent } from './components/business/header/header-menu/header-menu.component';
import { FooterComponent } from './components/business/header/footer/footer.component';
import { TermsConditionsComponent } from './components/business/header/terms-conditions/terms-conditions.component';

import { ValidationResultsComponent } from './components/business/advisor/validation-results/validation-results.component';
import { DataAnomaliesInputLogsComponent } from './components/business/advisor/data-anomalies-input-logs/data-anomalies-input-logs.component';
import { DocEvidenceComponent } from './components/business/advisor/doc-evidence/doc-evidence.component';
import { ProfitAndLossComponent } from './components/business/advisor/profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './components/business/advisor/balance-sheet/balance-sheet.component';
import { DataAnomaliesInputFilesComponent } from './components/business/advisor/data-anomalies-input-files/data-anomalies-input-files.component';
import { DataAnomaliesProcessedLogsComponent } from './components/business/advisor/data-anomalies-processed-logs/data-anomalies-processed-logs.component';
import { JournalMasterGraphsComponent } from './components/business/advisor/journal-master-graphs/journal-master-graphs.component';
import { JournalMasterListComponent } from './components/business/advisor/journal-master-list/journal-master-list.component';
import { JournalStatusByWorkdayComponent } from './components/business/advisor/journal-status-by-workday/journal-status-by-workday.component';
import { JournalValidationStatusComponent } from './components/business/advisor/journal-validation-status/journal-validation-status.component';
import { DataAnomaliesComponent } from './components/business/advisor/data-anomalies/data-anomalies.component';
import { InputFileAvailibilityComponent } from './components/business/advisor/input-file-availibility/input-file-availibility.component';
import { RunStatusActionComponent } from './components/business/advisor/run-status-action/run-status-action.component';
import { DetailMainAreaHeaderComponent } from './components/business/advisor/detail-main-area-header/detail-main-area-header.component';
import { OutputResultComponent } from './components/business/advisor/output-result/output-result.component';

import { TemplateMasterComponent } from './components/business/admin/template-master/template-master.component';
import { GroupMasterComponent } from './components/business/admin/group-master/group-master.component';
import { UserMasterComponent } from './components/business/admin/user-master/user-master.component';
import { FinancialMonthMasterComponent } from './components/business/admin/financial-month-master/financial-month-master.component';
import { CalendarMasterComponent } from './components/business/admin/calendar-master/calendar-master.component';
import { CompanyMasterComponent } from './components/business/admin/company-master/company-master.component';
import { ActivityLogComponent } from './components/business/admin/activity-log/activity-log.component';
import { ValidationRulesMasterComponent } from './components/business/admin/validation-rules-master/validation-rules-master.component';
import { FrequencyMasterComponent } from './components/business/admin/frequency-master/frequency-master.component';
import { RoleMasterComponent } from './components/business/admin/role-master/role-master.component';
import { BulkJournalUploadComponent } from './components/business/admin/bulk-journal-upload/bulk-journal-upload.component';
import { OutputFormatComponent } from './components/business/admin/output-format/output-format.component';
import { BulkFinancialMonthUploadComponent } from './components/business/admin/bulk-financial-month-upload/bulk-financial-month-upload.component';
import { BulkCalendarUploadComponent } from './components/business/admin/bulk-calendar-upload/bulk-calendar-upload.component';
import { JournalAutoApproverComponent } from './components/business/admin/journal-auto-approver/journal-auto-approver.component';

import { UploadDataComponent } from './components/business/jeva/upload-data/upload-data.component';
import { AdhocComponent } from './components/business/jeva/adhoc/adhoc.component';
import { AdhocListComponent } from './components/business/jeva/adhoc-list/adhoc-list.component';
import { BulkInputFileUploadComponent } from './components/business/jeva/bulk-inputfile-upload/bulk-inputFile-upload.component';

import { NotToPostJournalComponent } from './components/business/reports/not-to-post-journal/not-to-post-journal.component';
import { JournalPostingSummaryRprtComponent } from './components/business/reports/journal-posting-summary-rprt/journal-posting-summary-rprt.component';

import { TreeViewComponent } from './components/general/tree-view/tree-view.component';
import { LiveChatComponent } from './components/general/live-chat/live-chat.component';
import { RoleActionComponent } from './components/general/role-action/role-action.component';

import { TextboxComponent } from './components/ui/textbox/textbox.component';
import { DatePickerComponent } from './components/ui/date-picker/date-picker.component';
import { CheckboxComponent } from './components/ui/checkbox/checkbox.component';
import { FileUploaderComponent } from './components/ui/file-uploader/file-uploader.component';
import { ComboboxComponent } from './components/ui/combobox/combobox.component';
import { ListboxComponent } from './components/ui/listbox/listbox.component';
import { TextareaComponent } from './components/ui/textarea/textarea.component';
import { BadgeComponent } from './components/ui/badge/badge.component';
import { IconButtonComponent } from './components/ui/icon-button/icon-button.component';
import { NotificationComponent } from './components/ui/notification/notification.component';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { NumberTextboxComponent } from './components/ui/number-textbox/number-textbox.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { ShowboxComponent } from './components/ui/showbox/showbox.component';
import { PassboxComponent } from './components/ui/passbox/passbox.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { SliderComponent } from './components/ui/slider/slider.component';
import { QuickHelpComponent } from './components/ui/quick-help/quick-help.component';
import { TableHeaderComponent } from './components/ui/table-header/table-header.component';
import { TableFooterComponent } from './components/ui/table-footer/table-footer.component';
import { ShowAreaboxComponent } from './components/ui/show-areabox/show-areabox.component';
import { ExcelTextboxComponent } from './components/ui/excel-textbox/excel-textbox.component';
import { ExpressionBuilderComponent } from './components/ui/expression-builder/expression-builder.component';
import { PopoverComponent } from './components/ui/popover/popover.component';
import { IconOnlyComponent } from './components/ui/icon-only/icon-only.component';
import { TableNoRecordsComponent } from './components/ui/table-no-records/table-no-records.component';

import { PieChartComponent } from './components/ui/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/ui/charts/bar-chart/bar-chart.component';
import { HBarChartComponent } from './components/ui/charts/h-bar-chart/h-bar-chart.component';
import { DoughnutChartComponent } from './components/ui/charts/doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './components/ui/charts/line-chart/line-chart.component';
import { PolarAreaComponent } from './components/ui/charts/polar-area-chart/polar-area-chart.component';

import { SizeConverterPipe } from './pipes/size-converter.pipe';
import { OrderByPipe } from './pipes/orderBy.pipe';
import { DefaultConstantValueConverterPipe } from './pipes/defaultConstantValueConverter.pipe';
import { EnumValueConverterPipe } from './pipes/enumValueConverter.pipe';
import { DateConverterPipe } from './pipes/date-converter.pipe';
import { SubstrConverterPipe } from './pipes/substr-converter.pipe';
import { StepValueConverterPipe } from './pipes/stepValueConverter.pipe';
import { MoneyConverterPipe } from './pipes/money-converter.pipe';
import { FilterListWithColumnPipe } from './pipes/filterListWithColumn.pipe';
import { RoleActionConverterPipe } from './pipes/role-action-converter.pipe';
import { StoredValueConverterPipe } from './pipes/storedValueConverter.pipe';

import { BusinessLoaderService } from './loaders/business-loader.service';
import { ConstantLoaderService } from './loaders/constant-loader.service';
import { EnumLoaderService } from './loaders/enum-loader.service';

import { Broadcaster } from './utility/broadcaster';
import { GeneralUtility } from './utility/general-utility';

import { DataAccessService } from './services/data-access.service';
import { UiJsonDataService } from './services/data/ui-json-data.service';
import { HomeDataService } from './services/data/home-data.service';
import { JournalDetailsDataService } from './services/data/journal-details-data.service';

import { KeycloakService } from './services/auth/keycloak.service';
import { AuthService } from './services/auth/auth.service';

import { JournalStatusGraphsComponent } from './components/business/home/journal-status-graphs/journal-status-graphs.component';
import { JevaComponent } from './view/jeva/jeva.component';

import { ChangePassComponent } from './components/business/user/change-pass/change-pass.component';
import { UserProfileComponent } from './components/business/user/user-profile/user-profile.component';
import { RoleViewComponent } from './components/business/user/role-view/role-view.component';
import { OutputHeaderTemplateComponent } from './components/business/admin/output-header-template/output-header-template.component';
import { SchedulerRunHistoryComponent } from './components/business/admin/scheduler-run-history/scheduler-run-history.component';

const routes: Routes = [
  { path: '', component: LoginComponent, data: { title: 'Login' } },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'jcc', component: JccComponent, data: { title: 'JCCC' } },
  { path: 'jeva', component: JccComponent, data: { title: 'JEH' } },
  { path: 'advisor-home', component: AdvisorHomeComponent, data: { title: 'Advisor Home' } },
  { path: 'advisor', component: AdvisorComponent, data: { title: 'Advisor' } }, 
  { path: 'advisor-graph', component: AdvisorGraphComponent, data: { title: 'Advisor Graph' } },
  { path: 'admin', component: AdminComponent, data: { title: 'Admin' } },
  { path: 'jevan', component: JevaComponent, data: { title: 'JEVA' } },
  { path: 'user', component: UserComponent, data: { title: 'User' } },
  { path: 'report', component: ReportComponent, data: { title: 'Report' } }
];

export function configFactory(keycloakService: KeycloakService, appConfig: AppConfigService) {
  return () => appConfig.load().then((config) => {
    if(config.isKeyCloakUse){
      return keycloakService.init(config.keyCloak);
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    JccComponent,
    TreeViewComponent,
    TextboxComponent,
    AboutComponent,
    InputSourceComponent,
    ProcessStepsComponent,
    DataProcessingComponent,
    HomeComponent,
    HeaderMenuComponent,
    LogsComponent,
    ResultSetComponent,
    UploadDataComponent,
    DatePickerComponent,
    CheckboxComponent,
    FileUploaderComponent,
    LoaderComponent,
    ComboboxComponent,
    ListboxComponent,
    HeaderActionComponent,
    SizeConverterPipe,
    OrderByPipe,
    DefaultConstantValueConverterPipe,
    EnumValueConverterPipe,
    DateConverterPipe,
    SubstrConverterPipe,
    TextareaComponent,
    BadgeComponent,
    IconButtonComponent,
    NotificationComponent,
    OutputTemplateComponent,
    RunHistoryLogsComponent,
    AdvisorHomeComponent,
    AdvisorComponent,
    ValidationResultsComponent,
    DataAnomaliesInputLogsComponent,
    DocEvidenceComponent,
    NumberTextboxComponent,
    ProfitAndLossComponent,
    BalanceSheetComponent,
    JournalMasterListComponent,
    PieChartComponent,
    BarChartComponent,
    HBarChartComponent,
    LineChartComponent,
    DoughnutChartComponent,
    AdvisorConfigComponent,
    JournalMasterGraphsComponent,
    DataAnomaliesProcessedLogsComponent,
    StepValueConverterPipe,
    MoneyConverterPipe,
    FilterListWithColumnPipe,
    RoleActionConverterPipe,
    StoredValueConverterPipe,
    ValidationRulesComponent,
    PolarAreaComponent,
    DataAnomaliesInputFilesComponent,
    ButtonComponent,
    SupportingDocsComponent,
    JournalValidationStatusComponent,
    AdvisorGraphComponent,
    JournalStatusByWorkdayComponent,
    DataAnomaliesComponent,
    NavbarComponent,
    InputFileAvailibilityComponent,
    LiveChatComponent,
    JournalStatusGraphsComponent,
    StatusActionComponent,
    MainAreaHeaderComponent,
    RunStatusActionComponent,
    DetailMainAreaHeaderComponent,
    OutputResultComponent,
    LoginComponent,
    AdminComponent,
    TemplateMasterComponent,
    GroupMasterComponent,
    UserInfoComponent,
    TopHeaderActionPanelComponent,
    JevaComponent,
    AdhocComponent,
    SliderComponent,
    ValidationRulesMasterComponent,
    ShowboxComponent,
    UserMasterComponent,
    PassboxComponent,
    FinancialMonthMasterComponent,
    CalendarMasterComponent,
    CompanyMasterComponent,
    AdhocListComponent,
    ActivityLogComponent,
    QuickHelpComponent,
    AuditTrialComponent,
    CommentsComponent,
    TableHeaderComponent,
    TableFooterComponent,
    FrequencyMasterComponent,
    RoleMasterComponent,
    ShowAreaboxComponent,
    ExcelTextboxComponent,
    ExpressionBuilderComponent,
    ChangePassComponent,
    UserProfileComponent,
    RoleViewComponent,
    UserComponent,
    RoleActionComponent,
    BulkJournalUploadComponent,
    OutputFormatComponent,
    PopoverComponent,
    IconOnlyComponent,
    ReportComponent,
    JournalPostingSummaryRprtComponent,
    FooterComponent,
    TermsConditionsComponent,
    BulkFinancialMonthUploadComponent,
    BulkCalendarUploadComponent,
    BulkInputFileUploadComponent,
    JournalAutoApproverComponent,
    NotToPostJournalComponent,
    TableNoRecordsComponent,
    OutputHeaderTemplateComponent,
    SchedulerRunHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ChartsModule,
    TooltipModule,
    ClickOutsideModule,
    Ng5SliderModule,
    AngularFontAwesomeModule,
    JwtModule
  ],
  providers: [
    DataAccessService,
    UiJsonDataService,
    HomeDataService,
    JournalDetailsDataService,
    BusinessLoaderService,
    ConstantLoaderService,
    EnumLoaderService,
    Broadcaster,
    GeneralUtility,
    DatePipe,
    DateConverterPipe,
    RoleActionConverterPipe,
    FilterListWithColumnPipe,
    AuthService,
    AppConfigService,
    { 
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [KeycloakService, AppConfigService, AuthService], 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
