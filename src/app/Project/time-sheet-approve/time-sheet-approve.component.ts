import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
declare var $: any;
@Component({
  selector: 'app-time-sheet-approve',
  templateUrl: './time-sheet-approve.component.html',
  styleUrls: ['./time-sheet-approve.component.css']
})
export class TimeSheetApproveComponent implements OnInit {

  @ViewChild('timesheetpopup', { static: false }) timesheetpopup: ElementRef;

  spinner: boolean = false;
  form: FormGroup

  DATE: string = '';

  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datePipe: DatePipe) { }

  isNewAdd: boolean = false;
  isRejectEmployee: boolean = false;
  row = [{}];
  EMP_CODE: string = '';
  ngOnInit() {
    this.sharedService.formName = "Time Sheet Approve"
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }


  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  isAdd: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      }
      this.getEmployee();
    }, 150);
  }

  onClickEmployee() {
    this.isNewAdd = !this.isNewAdd;
  }
  onClickReject() {
    this.isRejectEmployee = !this.isRejectEmployee;
  }
  employee_list: Array<any> = [];
  getEmployee() {
    this.spinner = true;
    let data = {
      LISTTYPE: "timesheetapproval"
    }

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(res => {
      if (res.flag) {
        this.employee_list = res.employee_list;

        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);

        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  pending_attendance_list: Array<any> = [];
  GetPendingAttendanceList() {
    this.spinner = true;
    let data = {
      EMP_CODE: this.EMP_CODE,
      DATE: "",
      TYPE: 'pending_attendance'
    }

    this.http.PostRequest(this.apiUrl.GetPendingAttendanceList, data).then(res => {
      if (res.flag) {
        this.pending_attendance_list = res.pending_attendance_list
        this.spinner = false;
      } else {
        this.pending_attendance_list = [];
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  ATTN_DATE: string = '';
  f_openDetail(data: any = '', index: number = null) {
    this.ATTN_DATE = data.ATTN_DATE;
    $(this.timesheetpopup.nativeElement).modal('show');

    this.GetPendingTimesheetList();
  }

  pending_timesheet_list: Array<any> = [];
  GetPendingTimesheetList() {
    this.spinner = true;
    let data = {
      EMP_CODE: this.EMP_CODE,
      DATE: this.ATTN_DATE,
      TYPE: 'pending_timesheet'
    }

    this.http.PostRequest(this.apiUrl.GetPendingTimesheetList, data).then(res => {

      if (res.flag) {
        this.pending_timesheet_list = res.pending_timesheet_list;
        for (let data of this.pending_timesheet_list) {
          data.HOURS = this.f_M_H(data.TOTAL_MIN)
        }
        this.spinner = false;
      } else {
        this.pending_timesheet_list = [];
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  f_M_H(minutes: any = null): any {
    let hour = null;
    const H = Math.floor(minutes / 60);
    const M = minutes % 60;
    hour = ("00" + H.toString()).slice(-2) + ':' + ("00" + M.toString()).slice(-2);

    return hour;
  }

  _appr_data: any = null;
  f_Approve(_data: any = '', index: number = null) {
    this._appr_data = {
      EMP_CODE: this.EMP_CODE,
      ATTN_DATE: _data.ATTN_DATE,
      SRNO: _data.SRNO,
      REJECT_REASON: _data.REJECT_REASON,
      index: index
    }
  }
  approveRejectTimesheet(_data: any = '', index: number, type: string = '') {

    if (type == 'R') {
      if (_data.REJECT_REASON == undefined || _data.REJECT_REASON == null || _data.REJECT_REASON == '') {
        this.toast.warning('Please enter rejection remark');
        return;
      }
    }
    this.spinner = true;
    let data = {
      EMP_CODE: this.EMP_CODE,
      DATE: _data.ATTN_DATE,
      SRNO: _data.SRNO,
      REJECT_REASON: _data.REJECT_REASON,
      TYPE: type
    }

    this.http.PostRequest(this.apiUrl.Approve_Reject_Timesheet, data).then(res => {
      if (res.flag) {
        this.pending_timesheet_list.splice(index, 1)
        if (this.pending_timesheet_list.length == 0) {
          $(this.timesheetpopup.nativeElement).modal('hide');
          this.GetPendingAttendanceList();
        }
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_clearForm() {
    this.pending_attendance_list = [];
    this.pending_timesheet_list = [];
    this.EMP_CODE = '';
  }
}
