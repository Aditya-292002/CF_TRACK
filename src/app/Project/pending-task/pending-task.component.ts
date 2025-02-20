import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

declare var $: any;

@Component({
  selector: 'app-pending-task',
  templateUrl: './pending-task.component.html',
  styleUrls: ['./pending-task.component.css']
})
export class PendingTaskComponent implements OnInit {

  PROJ_CODE:any;
  EMP_CODE:any;
  TASK_STATUS:any = "A";
  employee_list:any = [];
  project_list:any = [];
  spinner:boolean = false;
  task_list:any = [];
  employee_task_list:any = [];
  task_status_list:any = [
    {
        "TASK_STATUS": "A",
        "TASK_STATUS_DESC": "ALL"
    },
    {
        "TASK_STATUS": "P",
        "TASK_STATUS_DESC": "PENDING"
    },
    {
        "TASK_STATUS": "W",
        "TASK_STATUS_DESC": "WIP"
    },
    {
        "TASK_STATUS": "C",
        "TASK_STATUS_DESC": "CLOSED"
    }
]
  sampel_employee_task_list:any = [];
  ROLE_ID:any;

  constructor(public sharedService: SharedServiceService,
      private apiUrl: ApiUrlService,
      private http: HttpRequestServiceService,
      private formBuilder: FormBuilder,
      private route: RoutingService,
      private toast: ToastrService,
      private validationService: ValidationService,
      private router:Router,
      private datepipe:DatePipe) { }

  ngOnInit() {
        this.sharedService.formName = "Pending task Dashboard";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ROLE_ID = this.sharedService.loginUser[0].ROLE_ID;
      this.EMP_CODE = this.sharedService.loginUser[0].EMP_CODE;
      this.GetTaskCommonList();
      this.GetEmployeeTaskList();
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 150);
  }

  GetTaskCommonList() {
    this.http.PostRequest(this.apiUrl.GetTaskCommonList, {}).then(
      (res) => {
        if (res.flag) {
          this.project_list = res.project_list;
          this.employee_list = res.employee_list;
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

  GetEmployeeTaskList(){
    // if(!this.sharedService.isValid(this.EMP_CODE)){
    //   this.toast.error('Select a Employee');
    //   return
    // }
    this.employee_task_list = [];
    this.sampel_employee_task_list = [];
    let data = {
      EMP_CODE: this.EMP_CODE
    }
    // console.log('data ->' , JSON.stringify(data))
    this.http.PostRequest(this.apiUrl.GetEmployeeTaskList, data).then(
      (res) => {
        if (res.flag) {
          this.employee_task_list = res.employee_task_list;
          this.employee_task_list.forEach((element:any)=>{
            element.PLANNED_START_DATE = this.datepipe.transform(element.PLANNED_START_DATE, 'dd-MMM-yyyy');
            element.COMPLETION_DATE = this.datepipe.transform(element.COMPLETION_DATE, 'dd-MMM-yyyy');
            element.ACTUAL_COMPLETION_DATE = this.datepipe.transform(element.ACTUAL_COMPLETION_DATE, 'dd-MMM-yyyy');
          })
          // this.f_M_H(this.employee_task_list);
          this.sampel_employee_task_list = this.employee_task_list;
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
      const H = Math.floor(data.TIME_HRS / 60);
      const M = data.TIME_HRS % 60;
      data.TIME_HRS = `${H}:${M.toString().padStart(2, "0")}`;
    }
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  GetChangeStatus(){
   let task = [];
   this.sampel_employee_task_list.forEach((element:any)=>{
    if(this.TASK_STATUS == 'A' || this.TASK_STATUS == '' ){
      task = this.sampel_employee_task_list
    }
    if(element.TASK_STATUS == this.TASK_STATUS){
       task.push(element)
    }
   })
   this.employee_task_list = [];
   this.employee_task_list = task;
  }

}
