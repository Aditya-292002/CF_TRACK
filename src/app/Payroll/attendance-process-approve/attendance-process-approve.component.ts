import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-attendance-process-approve',
  templateUrl: './attendance-process-approve.component.html',
  styleUrls: ['./attendance-process-approve.component.css']
})
export class AttendanceProcessApproveComponent implements OnInit {

  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }

    spinner: boolean = false;
    isSubmited: boolean = false;
    form: FormGroup;
    company_list: Array<any> = [];
    fyear_list: Array<any> = [];
    month_list: Array<any> = [];
    _month_list: Array<any> = [];
    location_list: Array<any> = [];
    _location_list: Array<any> = [];
    attendance_proccess_detail:Array<any> = [];
    attendance_n_ts_detail:Array<any> = [];

  ngOnInit() {
    this.sharedService.formName = "Attendance Process"
    this.form = this.formBuilder.group({
      COMPANY_CODE: ["",Validators.required],
      LOCATION_CODE: ["",Validators.required],
      PYEAR: ["",Validators.required],
      PERIOD_NO: ["",Validators.required],
      CALANDER_DAYS: ["",Validators.required],
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }

  ngAfterViewInit(){    
    setTimeout(() => {
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE );
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE );
      this.GetEmployeeMonthCommonList();
    },150)
  }


  GetEmployeeMonthCommonList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetEmployeeMonthCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.fyear_list = res.fyear_list;
        this.month_list = res.month_list;
        this._month_list = res.month_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
       
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



  filterLocations(){
    if(this.form.getRawValue().COMPANY_CODE != "" && this.form.getRawValue().COMPANY_CODE != null){
      this._location_list = [];
      this.location_list.forEach(element => {
        if(Number(element.COMPANY_CODE) == Number(this.form.getRawValue().COMPANY_CODE)){
          this._location_list.push(element)
        }
      });
    } else {
      this._location_list = this.location_list
    }
    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  } 

  filterMonth(){
    if(this.form.getRawValue().PYEAR != "" && this.form.getRawValue().PYEAR != null){
      this._month_list = [];
      this.month_list.forEach(element => {
        if(Number(element.FYEAR) == Number(this.form.getRawValue().PYEAR)){
          this._month_list.push(element)
        }
      });
    } else {
      this._month_list = this.month_list
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  _CALANDER_DAYS;
  CALANDER_DAYS:any;
  filterCalDays(){
    if(this.form.getRawValue().PERIOD_NO != "" && this.form.getRawValue().PERIOD_NO != null){
     // this._month_list = [];
      this.month_list.forEach(element => {
        if(Number(element.PERIOD_NO) == Number(this.form.getRawValue().PERIOD_NO)){
        this.form.get('CALANDER_DAYS').setValue(element.CALANDER_DAYS);
        }
      });
    } else {
      this._month_list = this.month_list;
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  } 


  
 
  GetApproveAttendanceProcessDetail(){
    this.spinner = true;
    let data = {
      COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
      PYEAR:this.form.getRawValue().PYEAR,
      PERIOD_NO:this.form.getRawValue().PERIOD_NO,
      LOCATION_CODE:this.form.getRawValue().LOCATION_CODE,
    }
    this.http.PostRequest(this.apiUrl.GetApproveAttendanceProcessDetail, data).then(res => {
      if (res.flag == 0) {
        this.toast.warning(res.msg)
        this.attendance_proccess_detail = res.attendance_proccess_detail;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else if(res.flag == 1){
        this.attendance_proccess_detail = res.attendance_proccess_detail;
        this.spinner = false;
      }else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }


  onProcessChange(){
    this.GetApproveAttendanceProcessDetail();
  }

  onSaveAttendance(){
    this.SaveApproveAttendanceProcess();
  }

  _attendance_n_ts_detail:Array<any> = [];
  emp_name:any;
  emp_no:any;
  employeeSelect(empcode: string = '',empname: string = ''){
    this.emp_name = empname;
    this.emp_no = empcode;
    this.attendance_n_ts_detail= [];
    this._attendance_n_ts_detail.forEach(element => {
      if(element.EMP_NO == empcode){
        this._attendance_n_ts_detail.push(element)
        
      }
    });
    this.GetAttendanceNTSDetailForEMP();
  }
  //  saving API
  SaveApproveAttendanceProcess(){
    this.isSubmited = true;
    if(this.form.valid){
      this.spinner = true;
      
        let data = {
          Attendance_process_header:this.form.value,
          Attendance_process_detail:this.attendance_proccess_detail
        }
        console.log(data)
        this.http.PostRequest(this.apiUrl.SaveApproveAttendanceProcess, data).then(res => {
          if (res.flag) {
            this.toast.success(res.msg)
            this.isSubmited = false;
            this.f_clearForm();
            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh').trigger('change');
            }, 100);
            this.spinner = false;
          } else {
            this.spinner = false;
            this.toast.warning(res.msg)
          }
        }, err => {
          this.spinner = false;
        });

    }else{
      this.f_validateFormData();
    }
}


GetAttendanceNTSDetailForEMP(){
  this.spinner = true;

  let data = {
    USERID:this.sharedService.loginUser[0].USERID,
    EMP_NO:this.emp_no,
    COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
    PYEAR:this.form.getRawValue().PYEAR,
    PERIOD_NO:this.form.getRawValue().PERIOD_NO,
    LOCATION_CODE:this.form.getRawValue().LOCATION_CODE,
  }
  this.http.PostRequest(this.apiUrl.GetAttendanceNTSDetailForEMP, data).then(res => {
    if (res.flag) {
      this.attendance_n_ts_detail = res.attendance_n_ts_detail;
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    }else {
      this.spinner = false;
    }
  }, err => {
    this.spinner = false;
  });
}


  f_validateFormData(){
    if (this.form.controls['COMPANY_CODE'].invalid) {
      this.toast.warning('Please select company');
      return false;
    } else if (this.form.controls['LOCATION_CODE'].invalid) {
      this.toast.warning('Please select location');
      return false;
    } else if (this.form.controls['PYEAR'].invalid) {
      this.toast.warning('Please select year');
      return false;
    } else if (this.form.controls['PERIOD_NO'].invalid) {
      this.toast.warning('Please select month');
      return false;
    } else if (this.form.controls['CALANDER_DAYS'].invalid) {
      this.toast.warning('Please enter calander days');
      return false;
    }  
    return true;
  }

  f_clearForm(){
    this.form.reset();
    this.isSubmited = false;
    this.attendance_proccess_detail = [];
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }


}
