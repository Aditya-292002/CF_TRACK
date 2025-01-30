import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

declare var $: any;
@Component({
  selector: 'app-time-sheet-extend',
  templateUrl: './time-sheet-extend.component.html',
  styleUrls: ['./time-sheet-extend.component.css']
})
export class TimeSheetExtendComponent implements OnInit {

  @ViewChild('timesheetpopup', { static: false }) timesheetpopup: ElementRef;

  spinner: boolean = false;
  form: FormGroup

  DATE: string = '';
  SYS_DATE_TIME: string = ''

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datePipe: DatePipe) { }

  EMP_CODE: string = '';
  maxdate: any = '';
  user_msg: string = '';
  ngOnInit() {
    this.sharedService.formName="Time Sheet Allow Extend"
    this.maxdate = new Date();
    this.DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }
  isUpdate: boolean = false;
  isAdd: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      this.getEmployee();
    }, 150);
  }
  employee_list: Array<any> = [];
  getEmployee() {
    this.spinner = true;
    let data = {
      LISTTYPE: ""
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
  _DATE: any = ''
  parseDate(para: any = 0) {

    this.DATE = this.datePipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')
    setTimeout(() => {
      this.CheckAttendance();
    }, 100);

  }

  attendance_type: string = '';
  isAttExt: boolean = false;
  isAllowSave: boolean = false;
  TIME_OUT: string = '';
  TIME_IN: string = '';
  DAYS: number = null;
  REMARKS: string = '';
  ALLOW_TS: string = '';
  EXT_DATE: string = '';
  CheckAttendance() {
    this.f_clearForm();
    this.spinner = true;
    this.TIME_IN = '';
    this.TIME_OUT = '';
    this.REMARKS = '';
    this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
    let data = {
      EMP_CODE: this.EMP_CODE,
      TYPE: "ADMIN",
      DATE: this.DATE
    }
    this.http.PostRequest(this.apiUrl.Check_Attendance, data).then(res => {
      if (res.flag) {
        this.attendance_type = res.attendance_type;
        if (res.attendance_type == 'ALLOW_ATTN') {
          this.isAttExt = true;
          this.user_msg = res.msg;
        } else if (res.attendance_type == 'EXT_ALLOW_TS') {
          this.isAttExt = false;
          this.isAllowSave = true;
          this.user_msg = res.msg;
        }
        this.TIME_IN = res.v_attendance_detail.length?res.v_attendance_detail[0].TIME_IN:'';
        this.TIME_OUT = res.v_attendance_detail.length?res.v_attendance_detail[0].TIME_OUT:'';
        this.ALLOW_TS = res.v_attendance_detail.length?res.v_attendance_detail[0].ALLOW_TS:'';
        this.REMARKS = res.v_attendance_detail.length?res.v_attendance_detail[0].REMARKS:'';

        this.spinner = false;
      } else {
        this.isAttExt = false;
        this.isAllowSave = false;
        this.user_msg = '';
        this.toast.warning(res.msg)

        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  saveExtendTimeSheet(){
    if(this.EXT_DATE == '' || this.EXT_DATE  == null || this.EXT_DATE == undefined){
      this.toast.warning("Please select Extend date")
      return;
      }
    if(this.REMARKS == '' || this.REMARKS  == null || this.REMARKS == undefined){
      this.toast.warning("Please enter remarks")
      return;
      }
  

    let data = {
      EMP_CODE: this.EMP_CODE,
      DATE: this.DATE,
      TYPE: "ADMIN",
      attendance_type: "EXT_ALLOW_TS",
      IN_TIME: this.TIME_IN,
      OUT_TIME: this.TIME_OUT,
      ALLOW_TS: this.ALLOW_TS,
      EXT_DATE: this.EXT_DATE,
      REMARKS: this.REMARKS
    }
    this.http.PostRequest(this.apiUrl.Save_Attendance, data).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        // this.f_clearForm()
        this.spinner = false;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_clearForm(){
    // this.DATE = ''
    this.TIME_IN = ''
     this.TIME_OUT = ''
     this.EXT_DATE = '';
     this.ALLOW_TS = '';
    this.REMARKS = '';
    this.user_msg = '';
  }


}
