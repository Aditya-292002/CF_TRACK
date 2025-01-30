import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

declare var $: any;
@Component({
  selector: 'app-time-sheet-attendance',
  templateUrl: './time-sheet-attendance.component.html',
  styleUrls: ['./time-sheet-attendance.component.css']
})
export class TimeSheetAttendanceComponent implements OnInit {

  @ViewChild('timesheetpopup', { static: false }) timesheetpopup: ElementRef;

  spinner: boolean = false;
  form: FormGroup

  DATE: string = '';
  SYS_DATE_TIME: string = ''
  files:any=[ {
    key: '0',
    label: 'Documents',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    children: [
        {
            key: '0-0',
            label: 'Work',
            data: 'Work Folder',
            icon: 'pi pi-fw pi-cog',
            children: [
                { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
            ]
        },
        {
            key: '0-1',
            label: 'Home',
            data: 'Home Folder',
            icon: 'pi pi-fw pi-home',
            children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
        }
    ]
},]
  userData: any;

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datePipe: DatePipe) { }

  EMP_CODE: string = '';
  maxdate: any = '';
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.sharedService.formName="Attendance By Admin"
    this.maxdate = new Date();
    this.DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
    $('.selectpicker').selectpicker('refresh').trigger('change');
    //console.log('user_detail',this.userData);
    //console.log('ADD_RIGHTS',this.ADD_RIGHTS,this.sharedService.form_rights);
  

    
    
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

      // console.log('ADD_RIGHTS',this.ADD_RIGHTS,this.sharedService.form_rights);
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
  changeTime() {
    if (this.TIME_OUT != "" && this.TIME_IN != "") {
      this.isAllowSave = true;
    } else {
      this.isAllowSave = false;
    }
  }
  changeDays() {
    if (this.DAYS >= 0) {
      this.isAllowSave = true;
    } else {
      this.isAllowSave = false;
    }
  }
  attendance_type: string = '';
  user_msg: string = '';
  isAttExt: boolean = false;
  isAllowSave: boolean = false;
  TIME_OUT: string = '';
  TIME_IN: string = '';
  DAYS: number = null;
  REMARKS: string = '';
  WORK_LOC: string = 'O';

  CheckAttendance() {
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
        this.REMARKS = res.v_attendance_detail.length?res.v_attendance_detail[0].REMARKS:'';
        this.WORK_LOC = res.v_attendance_detail.length?res.v_attendance_detail[0].WORK_LOC:'P';
        this.spinner = false;
      } else {
        this.isAttExt = true;
        this.isAllowSave = false;
        this.user_msg = '';
        this.toast.warning(res.msg)

        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  saveAttendanceTimeSheet() {
    // if (this.isAttExt) {
      if (this.TIME_OUT == "" && this.TIME_IN == "") {
        this.toast.warning("Please enter Time IN and Time OUT")
        return;
      }
    // }
    
      if(this.REMARKS == '' || this.REMARKS  == null || this.REMARKS == undefined){
      this.toast.warning("Please enter remarks")
      return;
      }
  

    let data = {
      EMP_CODE: this.EMP_CODE,
      DATE: this.DATE,
      TYPE: "ADMIN",
      attendance_type: "ALLOW_ATTN",
      IN_TIME: this.TIME_IN,
      OUT_TIME: this.TIME_OUT,
      REMARKS: this.REMARKS,
      WORK_LOC:this.WORK_LOC
    }
    this.http.PostRequest(this.apiUrl.Save_Attendance, data).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
       this.f_clearForm()//
        this.spinner = false;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });

  }
  f_clearForm() {
    this.TIME_OUT = '';
    this.TIME_IN = '';
    this.DAYS = null;
    this.user_msg = '';
    this.REMARKS = '';
    this.attendance_type = '';
    this.EMP_CODE = ''
    this.isAttExt = false;
    // this.DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
  }
}
