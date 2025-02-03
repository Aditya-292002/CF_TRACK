import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

declare var $: any;
@Component({
  selector: "app-time-sheet",
  templateUrl: "./time-sheet.component.html",
  styleUrls: ["./time-sheet.component.css"],
})
export class TimeSheetComponent implements OnInit {
  @ViewChild("attendance", { static: false }) attendance: ElementRef;

  spinner: boolean = false;
  form: FormGroup;

  DATE: string = "";

  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datePipe: DatePipe
  ) {}

  minutes: Array<any> = ["00", "15", "30", "45"];
  hours: Array<any> = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  EMP_NAME: string = "";

  REMARK: string = "";
  SYS_TIME: any = "";
  SYS_DATE_TIME: any = "";
  maxdate: any = "";
  attendance_type: string = "TIME_IN";
  ATT_REMARK: string = "";
  TOTAL_ALLOW_TIME: any = "";

  ngOnInit() {
    this.sharedService.formName = "Time Sheet";
    this.SYS_DATE_TIME = this.datePipe.transform(
      new Date(),
      "dd-MMM-yyyy hh:mm:ss"
    );
    this.DATE = this.sharedService.getFormatedDate();
    this.SYS_TIME = this.getTimeAMPM(new Date());
    this.maxdate = new Date();
    $(".selectpicker").selectpicker("refresh").trigger("change");
    $('[data-toggle="popover"]').popover();
  }

  getTimeAMPM(date): any {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  isAdd: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }

      this.EMP_NAME =
        this.sharedService.loginUser[0].EMP_CODE +
        " - " +
        this.sharedService.loginUser[0].USER_NAME;
      this.GetTimeSheetCommonList();

      if (this.sharedService.timesheet_date != "") {
        this.DATE = this.sharedService.timesheet_date;
        this.onChangeDate();
      } else {
        this.f_getDate();
        this.onChangeDate(1);
      }
      $('[data-toggle="popover"]').popover();
    }, 150);
  }
  project_list: Array<any> = [];
  task_list: Array<any> = [];
  task_type_list: Array<any> = [];
  timesheet_detail: Array<any> = [];

  GetTimeSheetCommonList() {
    this.spinner = true;
    let data = {
      LISTTYPE: "timesheet",
    };
    this.http.PostRequest(this.apiUrl.GetTimeSheetCommonList, data).then(
      (res) => {
        if (res.flag) {
          this.project_list = res.project_list;
          this.task_list = res.task_list;
          this._task_list = res.task_list;
          this.task_type_list = res.task_type_list;
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 150);
          this.spinner = false;
        } else {
          this.toast.warning(res.msg);
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  f_changeProject(projcode: string = "", index: number = null) {
    this.timesheet_detail[index].TASKS = [];
    this.task_list.forEach((element) => {
      if (element.PROJ_CODE == projcode) {
        this.timesheet_detail[index].TASKS.push(element);
      }
    });

    this.timesheet_detail[index].TASKID = this.timesheet_detail[index].TASKS
      .length
      ? this.timesheet_detail[index].TASKS[0].TASKID
      : "";
    this.timesheet_detail[index].ACTIVITY_TYPE = this.task_type_list.length
      ? this.task_type_list[0].TASKTYPE_CODE
      : "";
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 150);
  }

  filterTasks() {
    this.new_data.TASK = "";
    this._task_list = [];
    let proj_code = JSON.parse(this.new_data.PROJECT).PROJ_CODE;
    this.task_list.forEach((element) => {
      if (element.PROJ_CODE == proj_code) {
        this._task_list.push(element);
      }
    });
    this.new_data.TASK_ID = this._task_list.length
      ? this._task_list[0].TASKID
      : "";
    this.new_data.TASKTYPE_CODE = this.task_type_list.length
      ? this.task_type_list[0].TASKTYPE_CODE
      : "";

    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 150);
  }
  _DATE: any = "";
  parseDate(para: any = 0) {
    if (para == 1) {
      this.DATE = this.datePipe.transform(new Date(this._DATE), "dd-MMM-yyyy");
      setTimeout(() => {
        this.onChangeDate();
      }, 100);
    }
  }

  f_getDate() {
    let data = {};
    this.http.PostRequest(this.apiUrl.Get_Min_Timesheet_Date, data).then(
      (res) => {
        if (res.flag) {
          this._DATE = res.MinDate;
          this.DATE = res.MinDate;
          this.spinner = false;
        } else {
          this.spinner = false;
        }
        this.onChangeDate();
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  H_TIME_IN: string = "";
  H_TIME_OUT: string = "";
  save_allow: boolean = true;
  ATT_STATUS: string = "";
  isAddRowVisible: boolean = false;
  onChangeDate(para: number = null) {
    this.spinner = true;
    let data = {
      DATE: this.DATE,
    };
    this.http.PostRequest(this.apiUrl.GetTimeSheetDetail, data).then(
      (res) => {
        if (res.flag) {
          this.H_TIME_IN = res.timesheet_header[0].TIME_IN;
          this.H_TIME_OUT = res.timesheet_header[0].TIME_OUT;
          this.TOTAL_ALLOW_TIME = res.timesheet_header[0].TOTAL_ALLOW_TIME;
          this.timesheet_detail = res.timesheet_detail;
          this.ATT_STATUS = res.timesheet_header[0].ATTN_STATUS;
          let cur_total_min = 0;
          for (let data of this.timesheet_detail) {
            cur_total_min = cur_total_min + data.TOTAL_MIN;
            data.TOTAL_TIME = this.f_M_H(data.TOTAL_MIN);
            data.HH = data.TOTAL_TIME.split(":")[0];
            data.MM = data.TOTAL_TIME.split(":")[1];
          }
          this.isAddRow = false;

          this.calculateTotalTime();
          this.spinner = false;
          if (
            cur_total_min >=
            (this.TOTAL_ALLOW_TIME > 0 ? this.TOTAL_ALLOW_TIME : 720)
          ) {
            this.save_allow = false;
            this.isAddRow = true;
          } else {
            this.save_allow = true;
            // this.save_allow = this.timesheet_detail.length >0?true: false;
          }
        } else {
          this.f_clearForm();

          this.H_TIME_IN = res.timesheet_header.length
            ? res.timesheet_header[0].TIME_IN
            : "";
          this.H_TIME_OUT = res.timesheet_header.length
            ? res.timesheet_header[0].TIME_OUT
            : "";
          this.TOTAL_ALLOW_TIME = res.timesheet_header.length
            ? res.timesheet_header[0].TOTAL_ALLOW_TIME
            : "";
          this.timesheet_detail = res.timesheet_detail;

          this.ATT_STATUS = res.timesheet_header.length
            ? res.timesheet_header[0].ATTN_STATUS
            : "";
          let cur_total_min = 0;
          for (let data of this.timesheet_detail) {
            cur_total_min = cur_total_min + data.TOTAL_MIN;
            data.TOTAL_TIME = this.f_M_H(data.TOTAL_MIN);
            data.HH = data.TOTAL_TIME.split(":")[0];
            data.MM = data.TOTAL_TIME.split(":")[1];
          }

          this.calculateTotalTime();

          if (para == null)
            // this.toast.warning(res.msg)

            this.spinner = false;
          this.isAddRow = true;
          this.save_allow = false;
        }

        this.timesheet_detail.forEach((element) => {
          element.TASKS = [];
          this.task_list.forEach((tsk) => {
            if (element.PROJ_CODE == tsk.PROJ_CODE) {
              element.TASKS.push(tsk);
            }
          });
        });
        if (this.timesheet_detail.length) {
          this.isAddRowVisible = false;
        }
        setTimeout(() => {
          $(".selectpicker").selectpicker("refresh").trigger("change");
          $('[data-toggle="popover"]').popover();
        }, 100);
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  new_data: any = {
    TIME_MINUTE: "",
    PROJECT: "",
    TASK: "",
    TASK_ID: "",
    TYPE: "",
    TASKTYPE_CODE: "",
    TIME: "",
    HH: "00",
    MM: "00",
    REMARK: "",
  };
  f_addRow() {
    if (!this.isAddRowVisible) {
      this.isAddRowVisible = true;
      this.new_data = {
        TIME_MINUTE: "",
        PROJECT: "",
        TASK: "",
        TASK_ID: "",
        TYPE: "",
        TASKTYPE_CODE: "",
        TIME: "",
        HH: "00",
        MM: "00",
        REMARK: "",
      };

      setTimeout(() => {
        $(".selectpicker").selectpicker("refresh").trigger("change");
      }, 100);
      return false;
    }
    if (this.new_data.PROJECT == "") {
      this.toast.warning("Please Select Project ");
      return false;
    } else if (this.new_data.TASK_ID == "") {
      this.toast.warning("Please Select Task ");
      return false;
    } else if (this.new_data.TASKTYPE_CODE == "") {
      this.toast.warning("Please Select Type ");
      return false;
    } else if (this.new_data.HH == "" || this.new_data.HH == undefined) {
      this.toast.warning("Please Enter Time ");
      return false;
    }
    this.new_data.TASK = this._task_list.find(
      (e) => e.TASKID == this.new_data.TASK_ID
    );
    this.new_data.TYPE = this.task_type_list.find(
      (e) => e.TASKTYPE_CODE == this.new_data.TASKTYPE_CODE
    );

    let tm = this.new_data.TIME.split(":");
    this.new_data.TIME =
      ("00" + tm[0].toString()).slice(-2) +
      ":" +
      (tm.length > 1 ? ("00" + tm[1].toString()).slice(-2) : "00");

    this.new_data.TIME_MINUTE = this.f_H_M(this.new_data.TIME);

    if (this.validateTime()) {
      this.timesheet_detail.push({
        SRNO: 0,
        PROJ_NAME:
          this.new_data.PROJECT == ""
            ? ""
            : typeof this.new_data.PROJECT == "string"
            ? JSON.parse(this.new_data.PROJECT).PROJ_NAME
            : this.new_data.PROJECT.PROJ_NAME,
        PROJ_CODE:
          this.new_data.PROJECT == ""
            ? ""
            : typeof this.new_data.PROJECT == "string"
            ? JSON.parse(this.new_data.PROJECT).PROJ_CODE
            : this.new_data.PROJECT.PROJ_CODE,
        TASKID:
          this.new_data.TASK == ""
            ? ""
            : typeof this.new_data.TASK == "string"
            ? JSON.parse(this.new_data.TASK).TASKID
            : this.new_data.TASK.TASKID,
        TASK_ID:
          this.new_data.TASK == ""
            ? ""
            : typeof this.new_data.TASK == "string"
            ? JSON.parse(this.new_data.TASK).TASKID
            : this.new_data.TASK.TASKID,
        TASK_DESC:
          this.new_data.TASK == ""
            ? ""
            : typeof this.new_data.TASK == "string"
            ? JSON.parse(this.new_data.TASK).TASK_DESC
            : this.new_data.TASK.TASK_DESC,
        ACTIVITY_TYPE:
          this.new_data.TYPE == ""
            ? ""
            : typeof this.new_data.TYPE == "string"
            ? JSON.parse(this.new_data.TYPE).TASKTYPE_CODE
            : this.new_data.TYPE.TASKTYPE_CODE,
        TASKTYPE_DESC:
          this.new_data.TYPE == ""
            ? ""
            : typeof this.new_data.TYPE == "string"
            ? JSON.parse(this.new_data.TYPE).TASKTYPE_DESC
            : this.new_data.TYPE.TASKTYPE_DESC,
        TOTAL_TIME: this.new_data.TIME,
        TOTAL_MIN: this.new_data.TIME_MINUTE,
        REMARKS: this.new_data.REMARK,
        HH: this.new_data.HH || "00",
        MM: this.new_data.MM || "00",
        APPROVAL_STATUS: "P",
        ISDELETED: 0,
        TASKS: this._task_list,
      });

      this.new_data = {
        TIME_MINUTE: "",
        PROJECT: "",
        TASK: "",
        TASK_ID: "",
        TYPE: "",
        TASKTYPE_CODE: "",
        TIME: "",
        HH: "00",
        MM: "00",
        REMARK: "",
      };
      this._task_list = this.task_list;
      this.save_allow = true;

      setTimeout(() => {
        $(".selectpicker").selectpicker("refresh").trigger("change");
      }, 100);
      this.calculateTotalTime();
      return true;
    } else {
      return false;
      this.new_data[0].TIME = "";
    }
  }
  _task_list: Array<any> = [];
  f_filterDropDown() {
    this._task_list = [];
    let isAdded: boolean = false;
    for (let task of this.task_list) {
      for (let data of this.timesheet_detail) {
        if (data.TASK_ID == task.TASKID) {
          isAdded = true;
          break;
        } else {
          isAdded = false;
        }
      }
      if (!isAdded) {
        this._task_list.push(task);
      }
    }

    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }
  f_H_M(hours: string = ""): any {
    let col = [];
    let H = 0;
    let M = 0;

    let time: any = 0;
    if (hours != "" && hours != undefined && hours != null) {
      col = hours.split(":");
      H = +col[0];
      M = +col[1];

      time = H * 60 + M;
    }

    return time;
  }
  f_M_H(minutes: any = null): any {
    let hour = null;
    const H = Math.floor(minutes / 60);
    const M = minutes % 60;
    hour =
      ("00" + H.toString()).slice(-2) + ":" + ("00" + M.toString()).slice(-2);

    return hour;
  }
  total_hrs_time: string = "";
  total_minutes: any = "";
  isAddRow: boolean = false;
  calculateTotalTime() {
    this.total_minutes = 0;
    for (let data of this.timesheet_detail) {
      if (
        data.TOTAL_MIN != null &&
        data.TOTAL_MIN != "" &&
        data.ISDELETED != 1
      ) {
        this.total_minutes = this.total_minutes + data.TOTAL_MIN;
      }
    }
    this.total_hrs_time = this.f_M_H(this.total_minutes);
    if (
      this.total_minutes >=
      (this.TOTAL_ALLOW_TIME > 0 ? this.TOTAL_ALLOW_TIME : 720)
    ) {
      this.isAddRow = true;
      return;
    }
    this.isAddRow = false;
  }

  add_time() {
    if (this.new_data.TIME != "") {
      this.total_minutes = 0;
      for (let data of this.timesheet_detail) {
        if (
          data.TOTAL_MIN != null &&
          data.TOTAL_MIN != "" &&
          data.ISDELETED != 1
        ) {
          this.total_minutes = this.total_minutes + data.TOTAL_MIN;
        }
      }
      this.total_hrs_time = this.f_M_H(this.total_minutes);

      let _time = this.total_hrs_time.split(":");
      let _new_Hr = Number(_time[0]) + Number(this.new_data.HH);
      let _new_Mn = Number(_time[1]) + Number(this.new_data.MM);
      this.total_hrs_time = String(_new_Hr) + ":" + String(_new_Mn);
    }
  }

  deleteDetail(index: number = null) {
    if (this.timesheet_detail[index].SRNO > 0) {
      this.timesheet_detail[index].ISDELETED = 1;
    } else if (this.timesheet_detail[index].SRNO == 0) {
      this.timesheet_detail.splice(index, 1);
    }
    this.calculateTotalTime();
    this.save_allow = this.timesheet_detail.length > 0 ? true : false;
    if (this.timesheet_detail.length) {
      this.timesheet_detail.forEach((element) => {
        if (element.ISDELETED != 1) {
          this.isAddRowVisible = false;
        }
      });
    } else {
      this.isAddRowVisible = true;
    }
  }
  onChangeDetail() {
    this.save_allow = true;
  }
  validateTime(index: number = null): boolean {
    let current_total_min: any = null;
    if (index != null && index >= 0) {
      if (
        this.timesheet_detail[index].TOTAL_TIME != "" &&
        this.timesheet_detail[index].TOTAL_TIME != null
      ) {
        current_total_min =
          this.total_minutes + this.timesheet_detail[index].TOTAL_MIN;
      }
    } else {
      if (this.new_data.TIME != "" && this.new_data.TIME != null) {
        current_total_min = this.total_minutes + this.f_H_M(this.new_data.TIME);
      }
    }

    if (
      current_total_min >
      (this.TOTAL_ALLOW_TIME > 0 ? this.TOTAL_ALLOW_TIME : 720)
    ) {
      if (index != null) {
        this.timesheet_detail[index].TOTAL_TIME = "";
      } else {
        this.new_data.TIME = "";
      }
      this.toast.warning(
        "Your time exceed than working hour TIME IN to TIME OUT hours"
      );
      return false;
    } else {
      return true;
    }
  }
  onSubmitTimeSheet() {
    if (
      this.new_data.PROJECT ||
      this.new_data.TASK ||
      this.new_data.TYPE ||
      this.new_data.TIME
    ) {
      if (!this.f_addRow()) {
        return;
      }
    }
    if (
      this.timesheet_detail.length == undefined ||
      this.timesheet_detail.length == 0
    ) {
      this.toast.warning("No task available, Please add task.");
      return;
    }
    for (let i = 0; i < this.timesheet_detail.length; i++) {
      this.timesheet_detail[i].TOTAL_MIN = this.f_H_M(
        this.timesheet_detail[i].TOTAL_TIME
      );
    }
    this.spinner = true;
    let data = {
      DATE: this.DATE,
      timesheet_detail: this.timesheet_detail,
    };
    this.http.PostRequest(this.apiUrl.SaveTimeSheet, data).then(
      (res) => {
        if (res.flag) {
          this.toast.success(res.msg);
          this.onChangeDate();
          this.spinner = false;
        } else {
          this.toast.warning(res.msg);
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  f_clearForm() {
    this.timesheet_detail = [];
    this.H_TIME_IN = "";
    this.H_TIME_OUT = "";
    this.new_data = {
      TIME_MINUTE: "",
      PROJECT: "",
      TASK: "",
      TASK_ID: "",
      TYPE: "",
      TASKTYPE_CODE: "",
      TIME: "",
      HH: "00",
      MM: "00",
      REMARK: "",
    };

    this.save_allow = false;
    this.isAddRow = true;

    if (this.timesheet_detail.length) {
      this.isAddRowVisible = false;
    }
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }
  ngOnDestroy() {
    this.sharedService.timesheet_date = "";
  }
}
