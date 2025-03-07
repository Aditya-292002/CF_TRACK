import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { CalendarComponent } from './Common/calendar/calendar.component';
import { ChangePasswordComponent } from './Common/change-password/change-password.component';
import { CompanyFyearComponent } from './Common/company-fyear/company-fyear.component';
import { DashboardComponent } from './Common/dashboard/dashboard.component';
import { LayoutComponent } from './Common/layout/layout.component';
import { LoginComponent } from './Common/login/login.component';
import { NotificationComponent } from './Common/notification/notification.component';
import { Pnf400Component } from './Common/pnf400/pnf400.component';
import { ResetPasswordComponent } from './Common/reset-password/reset-password.component';
import { EmployeeComponent } from './HR/employee/employee.component';
import { LeaveApprovalComponent } from './HR/leave-approval/leave-approval.component';
import { LeaveRequestComponent } from './HR/leave-request/leave-request.component';
import { ManagerApprovalComponent } from './HR/manager-approval/manager-approval.component';
import { SalaryInformationComponent } from './HR/salary-information/salary-information.component';
import { TeamAssignComponent } from './HR/team-assign/team-assign.component';
import { TimeSheetAttendanceComponent } from './HR/time-sheet-attendance/time-sheet-attendance.component';
import { TimeSheetExtendComponent } from './HR/time-sheet-extend/time-sheet-extend.component';
import { BankMultiPaymentComponent } from './Invoice/bank-multi-payment/bank-multi-payment.component';
import { BankPaymentComponent } from './Invoice/bank-payment/bank-payment.component';
import { BankReceiptComponent } from './Invoice/bank-receipt/bank-receipt.component';
import { ExpenseApproveComponent } from './Invoice/expense-approve/expense-approve.component';
import { ExpensesComponent } from './Invoice/expenses/expenses.component';
import { InvoiceApprovalComponent } from './Invoice/invoice-approval/invoice-approval.component';
import { InvoiceRequestComponent } from './Invoice/invoice-request/invoice-request.component';
import { InvoiceComponent } from './Invoice/invoice/invoice.component';
import { JournalVoucherComponent } from './Invoice/journal-voucher/journal-voucher.component';
import { PurchaseOrderRequestComponent } from './Invoice/purchase-order-request/purchase-order-request.component';
import { SalesOrderComponent } from './Invoice/sales-order/sales-order.component';
import { VendorComponent } from './Invoice/vendor/vendor.component';
import { CustomerComponent } from './Marketing/customer/customer.component';
import { OpportunityMasterComponent } from './Marketing/opportunity-master/opportunity-master.component';
import { ProjectComponent } from './Marketing/project/project.component';
import { SalesOpportunityLogComponent } from './Marketing/sales-opportunity-log/sales-opportunity-log.component';
import { AttendanceProcessApproveComponent } from './Payroll/attendance-process-approve/attendance-process-approve.component';
import { AttendanceProcessComponent } from './Payroll/attendance-process/attendance-process.component';
import { EmployeeFixedComponent } from './Payroll/employee-fixed/employee-fixed.component';
import { EmployeeMonthComponent } from './Payroll/employee-month/employee-month.component';
import { LeaveBalanceComponent } from './Payroll/leave-balance/leave-balance.component';
import { SalaryProcessApproveComponent } from './Payroll/salary-process-approve/salary-process-approve.component';
import { SalaryProcessComponent } from './Payroll/salary-process/salary-process.component';
import { ExpensePrintComponent } from './Print/expense-print/expense-print.component';
import { TaskAssignComponent } from './Project/task-assign/task-assign.component';
import { TaskComponent } from './Project/task/task.component';
import { TimeSheetApproveComponent } from './Project/time-sheet-approve/time-sheet-approve.component';
import { TimeSheetComponent } from './Project/time-sheet/time-sheet.component';
import { ReportComponent } from './Report/report.component';
// import { ReportComponent } from './Report/report/report.component';
import { AuthGuard } from './services/auth.guard';
import { TaxDeclarationComponent } from './HR/tax-declaration/tax-declaration.component';
import { TaxDeclarationApprovalComponent } from './Payroll/tax-declaration-approval/tax-declaration-approval.component';
import { InvoiceRequestChangeComponent } from './Project/invoice-request-change/invoice-request-change.component';
import { pathFormat } from '@angular-devkit/schematics/src/formats';
import { EInvoiceComponent } from './Invoice/e-invoice/e-invoice.component';
import { InvoiceCancleComponent } from './Invoice/invoice-cancle/invoice-cancle.component';
import { LayoutNewComponent } from './Common/layout-new/layout-new.component';
import { ReimbursementsComponent } from './Invoice/reimbursements/reimbursements.component';
import { ReimbursementsapprovalComponent } from './Invoice/reimbursementsapproval/reimbursementsapproval.component';
import { UserRoleChangeComponent } from './Setting/user-role-change/user-role-change.component';
import { SalesOrderReleaseComponent } from './Invoice/sales-order-release/sales-order-release.component';
import { SalesOrderCreateComponent } from './Invoice/sales-order-create/sales-order-create.component';
import { RoleRightsComponent } from './Setting/role-rights/role-rights.component';
import { OldInvoiceComponent } from './Invoice/old-invoice/old-invoice.component';
import { PendingTaskComponent } from './Project/pending-task/pending-task.component';
import { BankReceiptListComponent } from './Invoice/bank-receipt-list/bank-receipt-list.component';




const routes: Routes = [
  {path: 'ForgotPasswordReset', component: ResetPasswordComponent },
  { path: 'login',component: LoginComponent },
  {path: 'companyfyear', component:CompanyFyearComponent},
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutNewComponent,
    loadChildren:'',
    children: [
      // {path: '', component:DashboardComponent },
      // {path: '', component:CalendarComponent},
      {path: 'dashboard', component:DashboardComponent },
      {path: 'calendar', component:CalendarComponent},
      {path: 'employeeinfo', component:EmployeeComponent },
      {path: 'customer', component:CustomerComponent },
      {path: 'project', component:ProjectComponent },
      {path: 'task', component:TaskComponent },
      {path: 'taskassign', component:TaskAssignComponent },
      {path: 'timesheet', component:TimeSheetComponent },
      {path: 'timesheetapprove', component:TimeSheetApproveComponent },
      {path: 'attendancebyadmin', component:TimeSheetAttendanceComponent },
      {path: 'timesheetallowextend', component:TimeSheetExtendComponent },
      {path: 'newinvoice', component:InvoiceComponent },
      {path: 'invoice', component:OldInvoiceComponent },
      {path: 'invoiceapprove', component:InvoiceApprovalComponent },
      {path: 'invoicerequest', component:InvoiceRequestComponent },
      {path: 'leaverequest', component:LeaveRequestComponent },
      {path: 'leaveapproval', component:LeaveApprovalComponent },
      {path: 'notification', component:NotificationComponent },
      {path: 'vendor', component:VendorComponent },
      {path: 'po', component:PurchaseOrderRequestComponent },
      {path: 'expense', component:ExpensesComponent },
      {path: 'bankreceipt', component:BankReceiptComponent },
      {path: 'bankpayment', component:BankPaymentComponent },
      {path: 'jv' , component:JournalVoucherComponent},
      {path: 'teamassign' , component:TeamAssignComponent},
      {path: 'expenseapprove', component:ExpenseApproveComponent},
      {path: 'reports', component:ReportComponent },
      {path: 'changepassword', component:ChangePasswordComponent},
      {path: 'empfixed', component:EmployeeFixedComponent},
      {path: 'empmonth', component:EmployeeMonthComponent},
      {path: 'leavebalance', component:LeaveBalanceComponent},
      {path: 'attendanceprocess', component:AttendanceProcessComponent},
      {path: 'salaryprocess', component:SalaryProcessComponent},
      {path: 'bankmultipayment', component:BankMultiPaymentComponent},
      {path : 'managerapproval', component:ManagerApprovalComponent},
      {path: 'expenseprint', component:ExpensePrintComponent},
      {path: 'attendanceprocessapprove', component:AttendanceProcessApproveComponent},
      {path: 'salaryprocessapprove', component:SalaryProcessApproveComponent},
      {path: 'salesorder', component:SalesOrderComponent},
      {path: 'salaryinformation', component:SalaryInformationComponent},
      {path: 'salesopportunitylog', component:SalesOpportunityLogComponent},
      {path: 'opportunitymaster', component:OpportunityMasterComponent},
      {path:'taxdeclaration',component:TaxDeclarationComponent},
      {path:'taxdeclarationapproval',component:TaxDeclarationApprovalComponent},
      {path:"invoicerequestchange",component:InvoiceRequestChangeComponent},
      {path:"e-invoice",component:EInvoiceComponent},
      {path:"invoicecancel",component:InvoiceCancleComponent},
      {path:"reimbursements",component:ReimbursementsComponent},
      {path:"reimbursementsapproval",component:ReimbursementsapprovalComponent},
      {path:"userroleupdate",component:UserRoleChangeComponent},
      {path:"salesorderrelease",component:SalesOrderReleaseComponent},
      {path:"salesorderapprove",component:SalesOrderCreateComponent},
      {path:"rolerights",component:RoleRightsComponent},
      {path:"pendingtask",component:PendingTaskComponent},
      {path:"bankreceiptlist",component:BankReceiptListComponent},
      {path: '**', component:Pnf400Component }
    ]
  },

  { path: '**',redirectTo:'', pathMatch:'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

