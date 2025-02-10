
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: "app-task-assign",
  templateUrl: "./task-assign.component.html",
  styleUrls: ["./task-assign.component.css"],
})
export class TaskAssignComponent implements OnInit {
  @ViewChild("warn_popup", { static: false }) warn_popup: ElementRef;

  spinner: boolean = false;
  form: FormGroup; 
  project_list: Array<any> = [];
  task_status_list: Array<any> = [];
  task_list: Array<any> = [];
  isSubmited: boolean = false;
  old_task_list: Array<any> = [];
  task_type_list: Array<any> = [];
  _taskid:any;
  _status: string = '';
  _selected_index:any;

  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private route: RoutingService,
    private toast: ToastrService,
    private validationService: ValidationService,
    private router:Router,
    private datepipe:DatePipe
  ) {}

  ngOnInit() {
    localStorage.removeItem('TASKID')
    this.sharedService.formName = "Task Status Change";
    this.form = this.formBuilder.group({
      COMPANY: [{ value: "", disabled: true }],
      CUSTOMER: [{ value: "", disabled: true }],
      PROJ_CODE: ["", Validators.required],
      TASKTYPE_CODE: ["", Validators.required],
      TASK_STATUS: ["", Validators.required],
    });
    $(".selectpicker").selectpicker("refresh").trigger("change");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      this.GetTaskCommonList();
      this.GetTaskList();
    }, 150);
  }

  setCompany() {
    for (let data of this.project_list) {
      if (data.PROJ_CODE == this.form.getRawValue().PROJ_CODE) {
        this.form.get("COMPANY").setValue(data.COMPANY_NAME);
        this.form.get("CUSTOMER").setValue(data.CUST_NAME);
        this.GetTaskList();
        this.form.get("TASK_STATUS").setValue("");
        this.form.get("TASKTYPE_CODE").setValue("");
        break;
      }
    }
  }

  UpdateTaskStatus(TASKID:any, TASK_STATUS:any) {
    let data = {
      task_detail: {
        TASKID: TASKID,
        TASK_STATUS: TASK_STATUS,
        STATUS_UPDATE: 1,
      },
    };
    this.http.PostRequest(this.apiUrl.SaveTaskDetail, data).then(
      (res) => {
        if (res.flag) {
          this.toast.success(res.msg);
          this._taskid = null;
          this._status = null;
          $(this.warn_popup.nativeElement).modal("hide");
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

  GetTaskCommonList() {
    this.http.PostRequest(this.apiUrl.GetTaskCommonList, {}).then(
      (res) => {
        if (res.flag) {
          this.project_list = res.project_list;
          this.task_status_list = res.task_status_list;
          this.task_type_list = res.task_type_list;
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  onShowTask() {
    this.GetTaskList();
  }

  GetTaskList() {
    let data = {
      LISTTYPE: "",
      PROJ_CODE: this.form.getRawValue().PROJ_CODE,
      STATUS: this.form.getRawValue().TASK_STATUS,
      TASK_TYPE: this.form.getRawValue().TASKTYPE_CODE,
    };
    this.http.PostRequest(this.apiUrl.GetTaskList, data).then(
      (res) => {
        if (res.flag) {
          this.task_list = res.task_list;
          // console.log(' this.task_list ->' , this.task_list)
          this.task_list.forEach((element:any)=>{
            element.PLANNED_START_DATE = this.datepipe.transform(element.PLANNED_START_DATE, 'dd-MMM-yyyy');
            element.COMPLETION_DATE = this.datepipe.transform(element.COMPLETION_DATE, 'dd-MMM-yyyy');
          })
          this.f_M_H(this.task_list);
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  f_M_H(array: any = []): any {
    for (let data of array) {
      const H = Math.floor(data.ESTIMATED_HOURS / 60);
      const M = data.ESTIMATED_HOURS % 60;
      data.ESTIMATED_HOURS =
        ("0000" + H.toString()).slice(-4) +
        ":" +
        ("00" + M.toString()).slice(-2);
    }

    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }
  
  f_openWarning(index:any,id:any,status:any) {
    this._selected_index = index;
    this._taskid = id;
    this._status = status;
    $(this.warn_popup.nativeElement).modal("show");
  }

  f_reverseStatus() {
    this.task_list[this._selected_index].TASK_STATUS =
      this.old_task_list[this._selected_index].TASK_STATUS;
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
    this._selected_index = null;
  }

  f_OpenTask(TASKID: string = "") {
    if (TASKID != null && TASKID != "" && TASKID != undefined) {
      // this.sharedService.commonData = [];
      // this.sharedService.commonData.push({ TASKID: TASKID });
      localStorage.setItem('TASKID',TASKID)
      this.route.changeRoute("task");
    }
  }

  f_formValidation() {
    if (this.form.controls["PROJ_CODE"].invalid) {
      this.toast.warning("Please enter Project");
    }
  }

  AddTask(){
  localStorage.removeItem('TASKID')
  this.router.navigate(['/task'])
  }

}
