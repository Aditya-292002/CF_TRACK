import { Injectable } from '@angular/core';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {


  constructor() { }

  GetMenuItems: string =  "/Login/GetMenuItems";
  GetUserDetail: string = '/Login/GetUserDetail';
  GetEmployeeDetail: string = "/Employee/GetEmployeeDetail";
  GetEmpCommonList: string = "/Employee/GetEmpCommonList";
  GetEmployeeList: string = '/Employee/GetEmployeeList';
  SaveEmployeeDetail: string = '/Employee/SaveEmployeeDetail';
  Check_EmpNo_Email: string = '/Employee/Check_EmpNo_Email';
  SaveFile: string = '/File/SaveFile';
  GetFile: string = '/File/GetFile';
  GetSalesOrderFile: string = '/File/GetSalesOrderFile';
  GetCustCommonList: string = '/Customer/GetCustCommonList';
  GetCustomerList: string = '/Customer/GetCustomerList';
  GetCustomerDetail: string = '/Customer/GetCustomerDetail';
  SaveCustomerDetail: string = '/Customer/SaveCustomerDetail';
  GetProjCommonList: string = '/Project/GetProjCommonList';
  GetProjectList: string = '/Project/GetProjectList';
  GetProjectDetail: string = '/Project/GetProjectDetail';
  SaveProjectDetail: string = '/Project/SaveProjectDetail';
  GetTaskCommonList: string = '/Task/GetTaskCommonList';
  GetTaskList: string = '/Task/GetTaskList';
  GetTaskDetail: string = '/Task/GetTaskDetail';
  GetTaskDetailSummery: string = '/Task/GetTaskDetailSummery';
  SaveTaskDetail: string = '/Task/SaveTaskDetail';
  GetEmployeeTaskList: string = '/Task/GetEmployeeTaskList';
  UpdateTaskEmployeeDetails: string = '/Task/UpdateTaskEmployeeDetails';
  SendOTP_ForgotPassword: string = '/Forgot/SendOTP_ForgotPassword';
  CheckOTP_ForgotPassword: string = '/Forgot/CheckOTP_ForgotPassword';
  Check_Attendance: string = '/Attendance/Check_Attendance';
  Save_Attendance: string = '/Attendance/Save_Attendance';
  GetTimeSheetCommonList: string  = '/TimeSheet/GetTimeSheetCommonList';
  GetTimeSheetDetail: string = '/TimeSheet/GetTimeSheetDetail';
  SaveTimeSheet: string ='/TimeSheet/SaveTimeSheet';
  GetPendingAttendanceList:string = '/Timesheet/GetPendingAttendanceList';
  GetPendingTimesheetList: string = '/Timesheet/GetPendingTimesheetList';
  Approve_Reject_Timesheet: string = '/Timesheet/Approve_Reject_Timesheet';
  Get_Min_Timesheet_Date: string = '/Timesheet/Get_Min_Timesheet_Date';
  GetInvoiceCommonList: string = '/Invoice/GetInvoiceCommonList';
  SaveInvoiceRequest: string = '/Invoice/SaveInvoiceRequest';
  GetInvoiceList: string = '/Invoice/GetInvoiceList';
  GetCreditNoteList: string = '/Invoice/GetCreditNoteList';
  SaveCreditNote: string = '/Invoice/SaveCreditNote';
  
  GetIvoiceDetail: string = '/Invoice/GetIvoiceDetail';
  SaveInvoice: string = '/Invoice/SaveInvoice';
  GetGstRate: string = '/Invoice/GetGstRate';
  PrintInvoice: string = '/Invoice/PrintInvoice';
  GetExpenseCommonList: string = '/Expense/GetExpenseCommonList';
  GetFyearList: string = '/Login/GetFyearList';
  SaveExpense: string = '/Expense/SaveExpense';
  GetExpenseList: string = '/Expense/GetExpenseList';
  GetExpenseDetail: string = '/Expense/GetExpenseDetail';
  GetReimbursementCommonList: string = '/Reimbursement/GetReimbursementCommonList';
  SaveReimbursement: string = '/Reimbursement/SaveReimbursement';
  GetReimbursementList: string = '/Reimbursement/GetReimbursementList';
  GetReimbursementDetail: string = '/Reimbursement/GetReimbursementDetail';
  GetBankCommonList: string = '/Bank/GetBankCommonList';
  GetJVCommonList: string = '/JV/GetJVCommonList';
  SaveJV: string = '/JV/SaveJV';
  GetBankReceiptDetail : string = '/Bank/GetBankReceiptDetail';
  GetBankReceiptList : string = '/Bank/GetBankReceiptList';
  ViewBankReceiptPdfBase64 : string = '/Bank/ViewBankReceiptPdfBase64';
  GetEditInvoiceDetail : string = '/Invoice/GetEditInvoiceDetail';
  UpdateEditInvoice : string = '/Invoice/UpdateEditInvoice';
  GetJVList : string = '/JV/GetJVList';
  GetJVDetail : string = '/JV/GetJVDetail';
  SaveBankReceipt: string = '/Bank/SaveBankReceipt';
  SaveBankPayment: string = '/Bank/SaveBankPayment';
  GetReportList: string = '/Report/GetReportList';
  GetReportFilterList: string = '/Report/GetReportFilterList';
  GetFetchReportData: string = '/Report/GetFetchReportData';
  GetFetchDrillReportData: string = '/Report/GetFetchDrillReportData';
  SaveUserFyear: string = '/Login/SaveUserFyear';
  ChangePassword: string = '/Login/ChangePassword';
  DownloadInExcelFromJSON: string = '/Report/DownloadInExcelFromJSON';
  PrintExpenseVoucher: string = '/Expense/PrintExpenseVoucher';
  PrintReceiptVoucher: string = '/Bank/PrintReceiptVoucher';
  GetBankMultiPay_DocWithDetail: string = '/Bank/GetBankMultiPay_DocWithDetail';
  SaveBankMultiPayment: string = '/Bank/SaveBankMultiPayment';
  SaveLeave: string = '/Leave/SaveLeave';
  CheckValidationForLeaveRequest: string = '/Leave/CheckValidationForLeaveRequest';
  GetLeaveCommonList: string = '/Leave/GetLeaveCommonList';
  GetLeaveList: string = '/Leave/GetLeaveList';
  GetEmployeeFixDetailList: string = '/EmployeeFix/GetEmployeeFixDetailList';
  GetEmployeeFixCommonList: string = '/EmployeeFix/GetEmployeeFixCommonList';
  SaveEmployeeFix: string = '/EmployeeFix/SaveEmployeeFix';
  GetSearchLeaveList: string ='/Leave/GetSearchLeaveList';
  ApproveRejectLeave: string ='/Leave/ApproveRejectLeave';
  GetHRApprovaldata: string ='/Leave/GetHRApprovaldata';
  SaveHrApprovedLeave: string ='/Leave/SaveHrApprovedLeave';
  GetPendingLeave_Employee_List_Detail: string='/Leave/GetPendingLeave_Employee_List_Detail';
  GetEmployeeFixSalHeadDetail: string = '/EmployeeFix/GetEmployeeFixSalHeadDetail';
  GetEmployeeMonthCommonList: string = '/EmployeeMonth/GetEmployeeMonthCommonList';
  GetEmployeeMonth_EMPDetail: string = '/EmployeeMonth/GetEmployeeMonth_EMPDetail';
  SaveEmployeeMonth: string = '/EmployeeMonth/SaveEmployeeMonth  ';
  GetExpensePrintList: string = '/Expense/GetExpensePrintList';
  GetClashLeave_EmployeeList: string = '/Leave/GetClashLeave_EmployeeList';
  GetAttendanceProcessDetail: string = '/AttendanceProcess/GetAttendanceProcessDetail';
  SaveAttendanceProcess: string = '/AttendanceProcess/SaveAttendanceProcess';
  GetAttendanceNTSDetailForEMP: string = '/AttendanceProcess/GetAttendanceNTSDetailForEMP';
  GetApproveAttendanceProcessDetail: string = '/AttendanceProcess/GetApproveAttendanceProcessDetail';
  SaveApproveAttendanceProcess: string = '/AttendanceProcess/SaveApproveAttendanceProcess';
  GetSalaryProcessDetail: string = '/SalaryProcess/GetSalaryProcessDetail';
  SaveSalaryProcess : string = '/SalaryProcess/SaveSalaryProcess';

  GetApproveSalaryProcessDetail : string = '/SalaryProcess/GetApproveSalaryProcessDetail';
  SaveApproveSalaryProcess : string = '/SalaryProcess/SaveApproveSalaryProcess';
  GetLeaveBalance : string = '/Leave/GetLeaveBalance';
  GetSalaryInformationforEMP : string = '/Employee/GetSalaryInformationforEMP';
  GetSalaryInfoCommonList : string = '/SalaryProcess/GetSalaryInfoCommonList';
  GetVendorDetails : string = '/Vendor/GetVendorDetails';
  GetVendorCommonList : string = '/Vendor/GetVendorCommonList';
  SaveVendor : string = '/Vendor/SaveVendor';
  GetLeaveDetailsforheader : string = '/Leave/GetLeaveDetailsforheader';
  ApproveDetails: string = '/Leave/GetApprovedDetails';
  EmployeeHistory: string='/Leave/GetEmployeeHistory';
  PERIODWISE_LEAVE_DETAILS='/Leave/GetPeriodwiseLeaveDetails';
  GetLeaveBalanceDetails='/Leave/GetLeaveBalanceDetails';
  SaveSoDetails : string = '/SO/SaveSoDetails';
  GetSOCommonList : string = '/SO/GetSOCommonList';
  GetSODetail : string = '/SO/GetSODetail';
  GetSOList : string = '/SO/GetSOList';
  GetSoProjectList : string = '/SO/GetSoProjectList';
  GetSOReleaseList : string = '/SO/GetSOReleaseList';
  SaveSalesOrderRelease : string = '/SO/SaveSalesOrderRelease';
  GetSalesOrderReleaseDetail : string = '/SO/GetSalesOrderReleaseDetail';
  SaveInvoiceRequestApprove : string = '/SO/SaveInvoiceRequestApprove';
  
  GetInvoiceViewList : string = '/SO/GetViewInvoice';
  GetViewInvoiceReq :string = '/SO/GetViewInvoiceReq';
  
  SaveOpportunityMaster:string='/Marketing/SaveOpportunityMaster';
  GetOpportunityLogCommonList:string='/Marketing/GetOpportunityLogCommonList';
  GetOpportunityCommonList: string='/Marketing/GetOpportunityCommonList';
  GetOpportunityMasterDetails: string='/Marketing/GetOpportunityMasterDetails';
  GetOpportunityList: string='/Marketing/GetOpportunityList';
  GetLogDetailsView: string='/Marketing/GetLogDetailsView';
  GetOpportunityMasterLogDetails: string='/Marketing/GetOpportunityMasterLogDetails';
  SaveSalesOpportunityLog:string='/Marketing/SaveSalesOpportunityLog';
//   GetFetchReportData: string = '/Report/GetFetchReportData';
// GetFetchDrillReportData: string = '/Report/GetFetchDrillReportData';
GetTaxDeclarationCommonList: string='/TaxDeclaration/GetTaxDeclarationCommonList';
SaveTaxDeclaration: string='/TaxDeclaration/SaveTaxDeclaration';
GetTaxDeclrationDetailList: string='/TaxDeclaration/GetTaxDeclrationDetailList';
SaveTaxDeclarationApproval: string='/TaxDeclarationApproval/SaveTaxDeclarationApproval';
GetTaxDeclrationApprovalDetailList: string='/TaxDeclarationApproval/GetTaxDeclrationApprovalDetailList';
GetTaxDecalarationEmployeeList: string='/TaxDeclarationApproval/GetEmployeeList';

GetE_Invoice: string = '/Invoice/GetE_Invoice';
GetGenerateQRCode: string = '/Invoice/GetGenerateQRCode';
PrintE_Invoice: string = '/Invoice/PrintE_Invoice';
GETJSONFILE: string = '/Invoice/GETJSONFILE';
SaveInvoiceDetails: string='/SO/SaveInvoiceDetails';  
GetRoleRightsMasterList: string='/Setting/GetRoleRightsMasterList';  
GetUserRoleCommonList: string='/Setting/GetUserRoleCommonList';  
GetUserRoleDetails: string='/Setting/GetUserRoleDetails';  
UpdateUserRoleDetails: string='/Setting/UpdateUserRoleDetails';  
GetMasterRoleCommonList: string='/Setting/GetMasterRoleCommonList';  
GETROLELIST: string='/Setting/GetRoleRightList';  
SaveEmployeeRoleRights: string='/Setting/SaveEmployeeRoleRights';  
GetCalendarData : string = '/Dashboard/GetCalendarData';
GetDashboardDetailsList: string='/Dashboard/GetDashboardDetailsList';
GetAppriasalDetails: string='/Setting/GetAppriasalDetails';  
SaveAppriasalDetailsByUserId: string='/Setting/SaveAppriasalDetailsByUserId';  
GetSaveAppriasalList: string='/Setting/GetSaveAppriasalList';  
GetAppriasalDetailsByUserId: string='/Setting/GetAppriasalDetailsByUserId';  


}
