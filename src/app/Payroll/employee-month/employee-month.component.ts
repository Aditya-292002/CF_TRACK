import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-employee-month',
  templateUrl: './employee-month.component.html',
  styleUrls: ['./employee-month.component.css']
})
export class EmployeeMonthComponent implements OnInit {

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private pipeService: PipeService,
    public validationService: ValidationService) { }

    spinner: boolean = false;
    isSubmited: boolean = false;
    form: FormGroup;
    company_list: Array<any> = [];
    fyear_list: Array<any> = [];
    month_list: Array<any> = [];
    _month_list: Array<any> = [];
    sal_head_list: Array<any> = [];
    empdetail: Array<any> = [];
    AMOUNT:any;

  ngOnInit() {
    this.sharedService.formName = "Employee Month"
    this.form = this.formBuilder.group({
      USERID: [""],
      COMPANY_CODE: ["",Validators.required],
      PYEAR: ["",Validators.required],
      PERIOD_NO: ["",Validators.required],
      SAL_HEAD: ["",Validators.required],
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }


  ngAfterViewInit(){    
    setTimeout(() => {
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE );
      this.GetEmployeeMonthCommonList();
    },150)
  }

  
  GetEmployeeMonthCommonList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetEmployeeMonthCommonList, {}).then(res => {
      if (res.flag) {
        console.log(res)
        this.company_list = res.company_list;
        this.fyear_list = res.fyear_list;
        this.month_list = res.month_list;
        this._month_list = res.month_list;
        this.sal_head_list = res.sal_head_list;
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


  GetEmployeeMonth_EMPDetail(){
    this.spinner = true;
    let data = {
      USERID:this.form.getRawValue().USERID,
      COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
      PYEAR:this.form.getRawValue().PYEAR,
      PERIOD_NO:this.form.getRawValue().PERIOD_NO,
      SAL_HEAD:this.form.getRawValue().SAL_HEAD,
    }
    this.http.PostRequest(this.apiUrl.GetEmployeeMonth_EMPDetail, data).then(res => {
      if (res.flag) {
        this.empdetail = res.empdetail;
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

  onMonthChange(){
    this.GetEmployeeMonth_EMPDetail();
  }



  onSalaryHeadChange(){
    this.GetEmployeeMonth_EMPDetail();
  }


  showDetail(){ 
    this.GetEmployeeMonth_EMPDetail();
    var AMOUNT = 0;
    this.form.get('AMOUNT').setValue(this.pipeService.setCommaseprated(AMOUNT.toFixed(2)))
  }

//  saving API
  SaveEmployeeMonth(){
     
    this.isSubmited = true;
    if(this.form.valid){
     
      let zero_count = 0;
        for(let i=0; i< this.empdetail.length; i++){    
          if(this.empdetail[i].AMOUNT === "" || this.empdetail[i].AMOUNT == "0" ) {
            //this.toast.warning("Please enter amount");
            //return;
            zero_count = zero_count + 1;
          }
      }
      if(zero_count == this.empdetail.length){
        this.toast.warning("Please enter amount atleat for one employee.");
            return;
      }
      
      this.spinner = true;
        let data = {
          EmployeeMonthHeader:this.form.value,
          EmployeeMonthDetail:this.empdetail
        }

        this.http.PostRequest(this.apiUrl.SaveEmployeeMonth, data).then(res => {
          if (res.flag) {
            console.log(res)
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
        this.form.get('AMOUNT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().AMOUNT)));

    }else{
      this.f_validateFormData();
    }
}

f_validateFormData(){
  
  if (this.form.controls['COMPANY_CODE'].invalid) {
    this.toast.warning('Please select company');
    return false;
  } else if (this.form.controls['PYEAR'].invalid) {
    this.toast.warning('Please select year');
    return false;
  } else if (this.form.controls['PERIOD_NO'].invalid) {
    this.toast.warning('Please select month');
    return false;
  } else if (this.form.controls['SAL_HEAD'].invalid) {
    this.toast.warning('Please enter salary head');
    return false;
  }  
  return true;
}

  f_clearForm(){
    this.form.reset();
    this.isSubmited = false;
    this.empdetail = [];
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
}
