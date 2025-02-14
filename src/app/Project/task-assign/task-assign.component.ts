
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
import { element } from 'protractor';

declare var $: any;

@Component({
  selector: "app-task-assign",
  templateUrl: "./task-assign.component.html",
  styleUrls: ["./task-assign.component.css"],
})
export class TaskAssignComponent implements OnInit {
  @ViewChild("warn_popup", { static: false }) warn_popup: ElementRef;
  @ViewChild('UpdateTaskassignEmployee', { static: false }) modal: ElementRef;

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
  TASK_STATUS:any;
  project_assign_emp_detail:any = [];
  TASK_ID:any;
  selected_emp: any = "";
  search_task_id:any;
  all_emp_list:any = [];
  IS_VIEW:any = 0;
  IS_ADD:any;

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
    localStorage.removeItem('IS_VIEW')
    localStorage.removeItem('IS_ADD')
    // localStorage.removeItem('PROJ_CODE')
    this.sharedService.formName = "Project Dashboard";
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
      this.form.get("PROJ_CODE").setValue(localStorage.getItem('PROJ_CODE'));
      this.form.get("TASK_STATUS").setValue("");
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      this.GetTaskCommonList();
    }, 150);
  }

  setCompany() {
    for (let data of this.project_list) {
      if (data.PROJ_CODE == this.form.getRawValue().PROJ_CODE) {
        this.form.get("COMPANY").setValue(data.COMPANY_NAME);
        this.form.get("CUSTOMER").setValue(data.CUST_NAME);
        this.GetTaskList(0);
        // this.form.get("TASK_STATUS").setValue("");
        // this.form.get("TASKTYPE_CODE").setValue("");
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
          this.GetTaskList(0);
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
          this.task_status_list.push( {
            "TASK_STATUS": "A",
            "TASK_STATUS_DESC": "ALL"
          })
          this.task_type_list = res.task_type_list;
          this.setCompany();
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

  onShowTask(status:any) {
    if (this.form.controls["PROJ_CODE"].invalid) {
      this.toast.warning("Select a Project");
      return
    }
    this.TASK_STATUS = status;
    this.GetTaskCommonList();
    this.GetTaskList(1);
  }

  GetTaskList(val:any) {
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
            element.ACTUAL_COMPLETION_DATE = this.datepipe.transform(element.ACTUAL_COMPLETION_DATE, 'dd-MMM-yyyy');
          })
          this.f_M_H(this.task_list);
          if(val == 1){
            if(this.TASK_STATUS == 'A'){
              setTimeout(() => {
                this.task_list = this.task_list;
                  $(".selectpicker").selectpicker("refresh").trigger("change");
                }, 100);
            }else {
              let tasklist = [];
              this.task_list.forEach((element:any)=>{
                if(element.TASK_STATUS == this.TASK_STATUS){
                    tasklist.push(element)
                }
              })
              setTimeout(() => {
                this.task_list = [];
                this.task_list = tasklist;
                  $(".selectpicker").selectpicker("refresh").trigger("change");
                }, 100);
            }
          }
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
  
  getEmployee() {
    let data = {
      LISTTYPE: "",
    };

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(
      (res) => {
        if (res.flag) {
          this.all_emp_list = res.employee_list;
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
      const H = Math.floor(data.TOTAL_MIN / 60);
      const M = data.TOTAL_MIN % 60;
      data.TOTAL_MIN = `${H}:${M.toString().padStart(2, "0")}`;
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

  f_OpenTask(TASKID: string = "",val:any) {
    if (TASKID != null && TASKID != "" && TASKID != undefined) {
      // this.sharedService.commonData = [];
      // this.sharedService.commonData.push({ TASKID: TASKID });
      if(val == 1){
        this.IS_VIEW = 1;
        this.IS_ADD = 3
      }else if(val == 0){
        this.IS_VIEW = 0;
        this.IS_ADD = 2
      }
      localStorage.setItem('IS_ADD',this.IS_ADD)
      localStorage.setItem('IS_VIEW',this.IS_VIEW)
      localStorage.setItem('TASKID',TASKID)
      localStorage.setItem('PROJ_CODE',this.form.controls["PROJ_CODE"].value)
      this.router.navigate(['/task'])
    }
  }

  AddTask(){
    if (this.form.controls["PROJ_CODE"].invalid) {
      this.toast.warning("Select a Project");
      return
    }
    this.IS_ADD = 1
    this.IS_VIEW = 0;
    localStorage.removeItem('TASKID')
    localStorage.setItem('IS_ADD',this.IS_ADD)
    localStorage.setItem('PROJ_CODE',this.form.controls["PROJ_CODE"].value)
    this.router.navigate(['/task'])
  }

  GetTaskDetail(id:any) {
    this.TASK_ID = id
    let data = {
      TASKID: this.TASK_ID 
    };
    this.http.PostRequest(this.apiUrl.GetTaskDetail, data).then(
      (res:any) => {
        if (res.flag) {
          this.project_assign_emp_detail = res.project_assign_emp_detail;
          this.getEmployee();
          const modalElement = this.modal.nativeElement;
          $(modalElement).modal('show'); 
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

  UpdateTaskEmployeeDetails(){
    let data = {
        TASK_ID: this.TASK_ID,
        TASK_DETAILS: this.project_assign_emp_detail,
    };
    // console.log('data ->' , JSON.stringify(data))
    // return
    this.http.PostRequest(this.apiUrl.UpdateTaskEmployeeDetails, data).then(
      (res:any) => {
        if (res.flag) {
          this.toast.success(res.msg);
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

  addRow() {
    if(!this.sharedService.isValid(this.selected_emp)){
        this.toast.error('Select a Employee');
        return
    }
    let data = JSON.parse(this.selected_emp)
    for (let i = 0; i < this.project_assign_emp_detail.length; i++) {
      const user = this.project_assign_emp_detail[i];
      if(user.EMP_NO == data.EMP_CODE) {
        this.toast.error('This user already added');
        return; 
      }
    }
    this.selected_emp = "";
    let emp_details = {};
      emp_details = {
        ACTIVE: true,
        EMP_NO: data.EMP_CODE,
        FULL_NAME: data.USER_NAME,
        TASKID: this.TASK_ID,
      }
    this.project_assign_emp_detail.push(emp_details)
    $("#emp").selectpicker("refresh").trigger("change");
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  removeRow(data:any) {
    this.selected_emp = "";
    this.project_assign_emp_detail.forEach((element:any,index:any)=>{
      if(element.EMP_NO == data.EMP_NO){
         this.project_assign_emp_detail.splice(index,1)
      } 
    })
    $("#emp").selectpicker("refresh").trigger("change");
  }


}
