import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-salary-information',
  templateUrl: './salary-information.component.html',
  styleUrls: ['./salary-information.component.css']
})
export class SalaryInformationComponent implements OnInit {
 
  spinner: boolean = false;
  isSubmited: boolean = false;
  form: FormGroup;
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }

  ngOnInit() {
    this.sharedService.formName = "Salary Information"
    this.form = this.formBuilder.group({
      PAID_DAYS: [""],
      UNPAID_DAYS: [""],
      LEAVE: [""],
      TOTALPAYABLE: [""],
      PERIOD_NO: [""],   
      PYEAR: [""],                
      EMP_NO: [""],     
      TOTAL: [""],      
      TOTAL_E: [""],      
      TOTAL_D: [""],      
      TOTAL_C: [""],    
      EARNTOTAL:[""] ,                 
      DEDUCTTOTAL :[""],
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');

    this.GetSalaryInfoCommonList();
  }


  ngAfterViewInit(){    
    setTimeout(() => {
      
      //this.GetSalaryInfoCommonList();
      this.GetEmployeeFixCommonList();
      this.form.get('EMP_NO').setValue(this.sharedService.loginUser[0].EMP_CODE );
    },150)
  }

  

  Headerdetail:Array<any>=[]; 
  Earningdetail:Array<any>=[];
  Deductiondetail:Array<any>=[];
  Contributiondetail:Array<any>=[];

  GetSalaryInformationforEMP(){ 
    this.spinner = true;
    let data = {
      EMP_NO:this.form.getRawValue().EMP_NO,
      PYEAR:this.form.getRawValue().PYEAR,
      PERIOD_NO:this.form.getRawValue().PERIOD_NO,
    }
    this.http.PostRequest(this.apiUrl.GetSalaryInformationforEMP, data).then(res => {
      if (res.flag) {
        console.log(res)
        this.Headerdetail = res.Headerdetail;
        this.Earningdetail = res.Earningdetail;
        this.Deductiondetail = res.Deductiondetail;
        this.Contributiondetail = res.Contributiondetail;
        if(this.Headerdetail.length!=0){
        this.form.get("PAID_DAYS").setValue(res.Headerdetail[0].PAID_DAYS)
        this.form.get("UNPAID_DAYS").setValue(res.Headerdetail[0].UNPAID_DAYS)
        this.form.get("LEAVE").setValue(res.Headerdetail[0].LEAVE)
        this.form.get("TOTALPAYABLE").setValue(res.Headerdetail[0].TOTALPAYABLE)
        this.form.get("TOTAL_E").setValue(res.Earningdetail[0].TOTAL)
        this.form.get("TOTAL_D").setValue(res.Deductiondetail[0].TOTAL)
        this.form.get("TOTAL_C").setValue(res.Contributiondetail[0].TOTAL)
        }
        else{
          this.spinner = false;
          this.toast.warning("Data Not Found")
        }
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

fyear_list:Array<any>=[];
month_list:Array<any>=[];
_month_list:Array<any>=[];

GetSalaryInfoCommonList(){
let data={
  "USERID":54
}

  this.spinner = true;
  console.log("res","res")
  this.http.PostRequest(this.apiUrl.GetSalaryInfoCommonList, data).then(res => {
    console.log("res",res)
    if (res.flag = true) {
      console.log("res",res)
       this.fyear_list = res.fyear_list;
       this.month_list = res.month_list;
       this._month_list = res.month_list;

    
     
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

employee_list:Array<any>=[];
GetEmployeeFixCommonList(){
  this.spinner = true;
  let data = {
    //USERID:this.form.getRawValue().USERID,
    LISTTYPE: "all"
  }
  this.http.PostRequest(this.apiUrl.GetEmployeeFixCommonList, data).then(res => {
    if (res.flag) {
      this.employee_list = res.employee_list;
      //console.log("this.employee_list",this.employee_list)
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

showTable(){
  setTimeout(() => {
    this.GetSalaryInformationforEMP();
  }, 100);


}
f_fillFormData() {
  // this.form.get("PAID_DAYS").setValue(this.Headerdetail[0].PAID_DAYS)
  // this.form.get("UNPAID_DAYS").setValue(this.Headerdetail[0].UNPAID_DAYS)
  // this.form.get("LEAVE").setValue(this.Headerdetail[0].LEAVE)
  // this.form.get("TOTALPAYABLE").setValue(this.Headerdetail[0].TOTALPAYABLE)
  // this.form.get("TOTAL").setValue(this.Earningdetail[0].TOTAL)
  // this.form.get("TOTAL").setValue(this.Deductiondetail[0].TOTAL)
  // this.form.get("TOTAL").setValue(this.Contributiondetail[0].TOTAL)
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
    this.spinner = false;
  }, 100);
}


}

