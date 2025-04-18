import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, finance, invoice, marketing, payroll, print, projectMngt, purchase, selfMarketing, settings } from './app.component';
import { AuthGuard } from './services/auth.guard';
import { SharedServiceService } from './services/shared-service.service';
import { HttpRequestServiceService } from './services/http-request-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CostFilterPipe, FilterPipe, KeysPipe } from './resources/filter.pipe';
import { LayoutComponent } from './Common/layout/layout.component';
import { LoginComponent } from './Common/login/login.component';
import { Pnf400Component } from './Common/pnf400/pnf400.component';
import { Ise500Component } from './Common/ise500/ise500.component';
import { DashboardComponent } from './Common/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { DatePickerComponent } from './date-picker/date-picker.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { EmployeeComponent } from './HR/employee/employee.component';
import { ProjectComponent } from './Marketing/project/project.component';
import { CustomerComponent } from './Marketing/customer/customer.component';
import { InputType, OnlyNumber, TimeDirective, LengthToDirective, MaxValueToDirective, DecimalDigitDirective, UppercaseDirective, CurrencyInputDirective } from './resources/inputs.directive';
import { TaskComponent } from './Project/task/task.component';
import { TaskAssignComponent } from './Project/task-assign/task-assign.component';
import { TimeSheetComponent } from './Project/time-sheet/time-sheet.component';
import { TimeSheetApproveComponent } from './Project/time-sheet-approve/time-sheet-approve.component';
import { ResetPasswordComponent } from './Common/reset-password/reset-password.component';
import { DatePipe } from '@angular/common';
import { InvoiceComponent } from './Invoice/invoice/invoice.component';
import { OldInvoiceComponent } from './Invoice/old-invoice/old-invoice.component';
import { TimeSheetAttendanceComponent } from './HR/time-sheet-attendance/time-sheet-attendance.component';
import { TimeSheetExtendComponent } from './HR/time-sheet-extend/time-sheet-extend.component';
import { EncryptionService } from './services/encryption.service';
import { ValidationService } from './services/validation.service';
import { AuthServiceService } from './services/auth-service.service';
import { ApiUrlService } from './services/api-url.service';
import { RoutingService } from './services/routing.service';
import { KeyService } from './services/key.service';
import { InvoiceApprovalComponent } from './Invoice/invoice-approval/invoice-approval.component';
import { InvoiceRequestComponent } from './Invoice/invoice-request/invoice-request.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeaveApprovalComponent } from './HR/leave-approval/leave-approval.component';
import { LeaveRequestComponent } from './HR/leave-request/leave-request.component';

import { CommonModule } from '@angular/common';
import { CalendarComponent } from './Common/calendar/calendar.component';
import { FullCalComponent } from './Common/full-cal/full-cal.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGrigPlugin from '@fullcalendar/timegrid';
import { NotificationComponent } from './Common/notification/notification.component';
import { ExpensesComponent } from './Invoice/expenses/expenses.component';
import { VendorComponent } from './Invoice/vendor/vendor.component';
import { PurchaseOrderRequestComponent } from './Invoice/purchase-order-request/purchase-order-request.component';
import { BankReceiptComponent } from './Invoice/bank-receipt/bank-receipt.component';
import { BankPaymentComponent } from './Invoice/bank-payment/bank-payment.component';
import { JournalVoucherComponent } from './Invoice/journal-voucher/journal-voucher.component';
import { TeamAssignComponent } from './HR/team-assign/team-assign.component';
import { ExpenseApproveComponent } from './Invoice/expense-approve/expense-approve.component';

import { PipeService } from './services/pipe.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CompanyFyearComponent } from './Common/company-fyear/company-fyear.component';

import { ChangePasswordComponent } from './Common/change-password/change-password.component';
import { SalaryProcessComponent } from './Payroll/salary-process/salary-process.component';
import { AttendanceProcessComponent } from './Payroll/attendance-process/attendance-process.component';
import { LeaveBalanceComponent } from './Payroll/leave-balance/leave-balance.component';
import { EmployeeFixedComponent } from './Payroll/employee-fixed/employee-fixed.component';
import { EmployeeMonthComponent } from './Payroll/employee-month/employee-month.component';
import { BankMultiPaymentComponent } from './Invoice/bank-multi-payment/bank-multi-payment.component';
import { ManagerApprovalComponent } from './HR/manager-approval/manager-approval.component';
import { ExpensePrintComponent } from './Print/expense-print/expense-print.component';
import { AttendanceProcessApproveComponent } from './Payroll/attendance-process-approve/attendance-process-approve.component';
import { SalaryProcessApproveComponent } from './Payroll/salary-process-approve/salary-process-approve.component';
import { SalaryInformationComponent } from './HR/salary-information/salary-information.component';
import { SalesOrderComponent } from './Invoice/sales-order/sales-order.component';
import { SalesOpportunityLogComponent } from './Marketing/sales-opportunity-log/sales-opportunity-log.component';
import { OpportunityMasterComponent } from './Marketing/opportunity-master/opportunity-master.component';
import {  NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {TabMenuModule} from 'primeng/tabmenu';
import { ReportComponent } from './Report/report.component';
import { TaxDeclarationComponent } from './HR/tax-declaration/tax-declaration.component';
import { TaxDeclarationApprovalComponent } from './Payroll/tax-declaration-approval/tax-declaration-approval.component';
import {TableModule} from 'primeng/table';
import { FilterService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import { InvoiceRequestChangeComponent } from './Project/invoice-request-change/invoice-request-change.component';
import { EInvoiceComponent } from './Invoice/e-invoice/e-invoice.component';
import { InvoiceCancleComponent } from './Invoice/invoice-cancle/invoice-cancle.component';
import { LayoutNewComponent } from './Common/layout-new/layout-new.component';
import { TreeTableModule } from 'primeng/treetable';
import { RoleRightsComponent } from './Setting/role-rights/role-rights.component';
import { ReimbursementsComponent } from './Invoice/reimbursements/reimbursements.component';
import { ReimbursementsapprovalComponent } from './Invoice/reimbursementsapproval/reimbursementsapproval.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserRoleChangeComponent } from './Setting/user-role-change/user-role-change.component';
import { SalesOrderReleaseComponent } from './Invoice/sales-order-release/sales-order-release.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SalesOrderCreateComponent } from './Invoice/sales-order-create/sales-order-create.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { PendingTaskComponent } from './Project/pending-task/pending-task.component';
import { BankReceiptListComponent } from './Invoice/bank-receipt-list/bank-receipt-list.component';
import { SelfAppraisalComponent } from './self-appraisal/self-appraisal.component';
import { PanelModule } from 'primeng/panel';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  timeGrigPlugin,
  dayGridPlugin,
  interactionPlugin
]);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LayoutNewComponent,
    LoginComponent,
    Pnf400Component,
    Ise500Component,
    DashboardComponent,
    SpinnerComponent,
    DatePickerComponent,
    EmployeeComponent,
    ProjectComponent,
    CustomerComponent,
    FilterPipe,
    CostFilterPipe,
    InputType,
    OnlyNumber,
    MaxValueToDirective,
    LengthToDirective,
    DecimalDigitDirective,
    TaskComponent,
    TaskAssignComponent,
    TimeSheetComponent,
    TimeDirective,
    UppercaseDirective,
    CurrencyInputDirective,
    TimeSheetApproveComponent,
    ResetPasswordComponent,
    InvoiceComponent,
    TimeSheetAttendanceComponent,
    TimeSheetExtendComponent,
    InvoiceApprovalComponent,
    InvoiceRequestComponent,
    projectMngt,
    selfMarketing,
    finance,
    marketing,
    LeaveApprovalComponent,
    LeaveRequestComponent,
    CalendarComponent,
    FullCalComponent,
    NotificationComponent,
    ExpensesComponent,
    VendorComponent,
    PurchaseOrderRequestComponent,
    BankReceiptComponent,
    BankPaymentComponent,
    JournalVoucherComponent,
    TeamAssignComponent,
    ExpenseApproveComponent,
    CompanyFyearComponent,
    ReportComponent,
    KeysPipe,
    ChangePasswordComponent,
    SalaryProcessComponent,
    AttendanceProcessComponent,
    LeaveBalanceComponent,
    EmployeeFixedComponent,
    EmployeeMonthComponent,
    BankMultiPaymentComponent,
    payroll,
    ManagerApprovalComponent,
    ExpensePrintComponent,
    print,
    settings,
    invoice,
    purchase,
    AttendanceProcessApproveComponent,
    SalaryProcessApproveComponent,
    SalaryInformationComponent,
    SalesOrderComponent,
    SalesOpportunityLogComponent,
    OpportunityMasterComponent,
    TaxDeclarationComponent,
    TaxDeclarationApprovalComponent,
    InvoiceRequestChangeComponent,
    EInvoiceComponent,
    InvoiceCancleComponent,
    RoleRightsComponent,
    ReimbursementsComponent,
    ReimbursementsapprovalComponent,
    UserRoleChangeComponent,
    SalesOrderReleaseComponent,
    SalesOrderCreateComponent,
    OldInvoiceComponent,
    PendingTaskComponent,
    BankReceiptListComponent,
    SelfAppraisalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
   // NgbModule,
    NgbNavModule,
    //NgbNavConfig,
    TabMenuModule,
    DialogModule,
    TreeTableModule,  
    ToastrModule.forRoot({
      closeButton: true,
      tapToDismiss: true,
      timeOut: 10000,
      preventDuplicates: true,
      enableHtml: true,
      progressBar:true,
      progressAnimation: 'decreasing'
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    NgSelectModule,
    CommonModule,
    PdfViewerModule,
    FullCalendarModule,
    TableModule,
    TreeTableModule,
    NgApexchartsModule,
    CheckboxModule,
    ToggleButtonModule, 
    TooltipModule,
    PdfViewerModule,
    PanelModule
  ],
  providers: [
    AuthGuard,
    SharedServiceService,
    HttpRequestServiceService,
    EncryptionService,
    ValidationService,
    AuthServiceService,
    ApiUrlService,
    RoutingService,
    KeyService,
    PipeService,
    NgxSpinnerService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    FilterPipe,
    CostFilterPipe,
    FilterService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
