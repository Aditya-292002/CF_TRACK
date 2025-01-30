import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-salary-process',
  templateUrl: './salary-process.component.html',
  styleUrls: ['./salary-process.component.css']
})
export class SalaryProcessComponent implements OnInit {
  [x: string]: any;
 
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }

    spinner: boolean = false;
    form: FormGroup;
    isSubmited: boolean = false;
    emp_name:any;
    empno: any;
    company_list: Array<any> = [];
    fyear_list:Array<any>=[];
    month_list:Array<any>=[];
    _month_list:Array<any>=[];
    location_list:Array<any>=[];
    _location_list:Array<any>=[];
    salary_detail:Array<any> = [];
    salary_head_detail:Array<any> = [];
    _salary_head_detail:Array<any> = [];


  ngOnInit() {
    this.sharedService.formName = "Salary process"
    this.form = this.formBuilder.group({
      USERID: [""],
      COMPANY_CODE: ["",Validators.required],
      LOCATION_CODE: ["",Validators.required],
      PYEAR: ["",Validators.required],
      PERIOD_NO: ["",Validators.required],
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }


  ngAfterViewInit(){
    setTimeout(() => {
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE );
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE );
      this.GetEmployeeMonthCommonList();
      this.GetSalaryProcessDetail();
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

  onlocationFilter(){
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

  onmonthFilter(){
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




  GetSalaryProcessDetail(){
    this.spinner = true;
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
      PYEAR:this.form.getRawValue().PYEAR,
      PERIOD_NO:this.form.getRawValue().PERIOD_NO,
      LOCATION_CODE:this.form.getRawValue().LOCATION_CODE,
    }
    this.http.PostRequest(this.apiUrl.GetSalaryProcessDetail, data).then(res => {
      if (res.flag) {
        this.salary_detail = res.salary_detail;
        this.salary_head_detail = res.salary_head_detail;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      }else {
        // this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  onProcessChange(){
    this.GetSalaryProcessDetail();
  }



  onEmployeeSelect(empcode: string = '',empname: string = ''){
    this.empno = empcode;
    this.emp_name = empname;
    this._salary_head_detail= [];
    this.salary_head_detail.forEach(element => {
      if(element.EMP_NO == empcode){
        this._salary_head_detail.push(element)

      }
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  }



  SaveSalaryProcess(){
    this.isSubmited = true;
    if(this.form.valid){
      this.spinner = true;

        let data = {
          salary_header:this.form.value,
          salary_head_detail:this.salary_head_detail,
          salary_detail:this.salary_detail
        }
        this.http.PostRequest(this.apiUrl.SaveSalaryProcess, data).then(res => {
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
    }
    return true;
  }

  f_clearForm(){
    this.form.reset();
    this.isSubmited = false;
    this.salary_detail = [];
    this._salary_head_detail = [];
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

}
