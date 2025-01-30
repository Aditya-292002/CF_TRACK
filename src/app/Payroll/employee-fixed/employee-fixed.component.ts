import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-employee-fixed',
  templateUrl: './employee-fixed.component.html',
  styleUrls: ['./employee-fixed.component.css']
})
export class EmployeeFixedComponent implements OnInit {

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private pipeService: PipeService,
    private datepipe: DatePipe,
    public validationService: ValidationService) { }

    spinner: boolean = false;
    ADD_RIGHTS: boolean = false;
    UPDATE_RIGHTS: boolean = false;
    NO_RIGHTS: boolean = false;
    isAdd: boolean = false;
    isUpdate: boolean = false;
    isSubmited: boolean = false;
    form: FormGroup;

    empfixdetail_list: Array<any> = [];
    company_list: Array<any> = [];
    dept_list: Array<any> = [];
    division_list: Array<any> = [];
    location_list: Array<any> = [];
    _location_list:Array<any> = [];
    employee_list: Array<any> = [];
    shift_list: Array<any> = [];
    structure_list: Array<any> = [];
    empfixheader_data: Array<any> = [];
    DESIGNATION_WEF:any  = '';
    SAL_MONTH:any  = '';
    min_date = new Date();

  ngOnInit() {
    this.sharedService.formName = "Employee Fixed"

    this.form = this.formBuilder.group({
      USERID: [""],
      COMPANY_CODE: ["",Validators.required],
      EMP_NO: ["",Validators.required],
      DIVISION_CODE: [""],
      DEPT_CODE: [""],
      LOCATION_CODE: ["",Validators.required],
      SHIFT_CODE: ["",Validators.required],
      STRU_CODE: ["",Validators.required],
      DESIGNATION_WEF: ["",Validators.required],
      DESIGNATION: ["",Validators.required],
      TS_COST: ["",Validators.required],
      TOTAL_MONTH: [""],
      TOTAL_ANNAUL: [""],
     
    })
   
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }

  
  ngAfterViewInit(){    
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }

      // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE );
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
      this.form.get('TOTAL_MONTH').setValue('0');
      this.form.get('TOTAL_ANNAUL').setValue('0');
      this.form.get('DESIGNATION_WEF').setValue(this.sharedService.getTodayDate())
      this.DESIGNATION_WEF = this.sharedService.getTodayDate()
      this.GetEmployeeFixCommonList();
      
    },150)
  }
  

  GetEmployeeFixCommonList(){
    this.spinner = true;
    let data = {
      USERID:this.form.getRawValue().USERID,
      LISTTYPE: "all"
    }
    this.http.PostRequest(this.apiUrl.GetEmployeeFixCommonList, data).then(res => {
      console.log("res",res);
     // if (res.flag) {
        this.company_list = res.company_list; 
        this.dept_list = res.dept_list;
        this.division_list = res.division_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.employee_list = res.employee_list;
        this.shift_list = res.shift_list;
        this.structure_list = res.structure_list;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      // } else {
      //   this.spinner = false;
      // }
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


  GetEmployeeFixDetailList(){
    let data = {
      USERID:this.form.getRawValue().USERID,
      STRU_CODE:this.form.getRawValue().STRU_CODE,
      EMP_NO:this.form.getRawValue().EMP_NO,
    }
      this.http.PostRequest(this.apiUrl.GetEmployeeFixDetailList, data).then(res => {
        if (res.flag) {
          this.empfixdetail_list = res.empfixdetail_list;
          this.empfixheader_data = res.empfixheader_data;
          this.f_fillFormData();
          this.calculateTotal();
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



  struChange(){
    //this.GetEmployeeFixDetailList();
    //this.calculateTotal();
    this.GetEmployeeFixSalHeadDetail();
  }

  _empfixheader_data: Array<any> =[]
  employeeChange(){
    this.GetEmployeeFixDetailList();
    // this.f_fillFormData();
    // this.dept_list.reset();
    // this._empfixheader_data = [];
    // if(this.form.getRawValue().EMP_NO != "" && this.form.getRawValue().EMP_NO != null){
      
    //   this.empfixheader_data.forEach(element => {
    //     if(Number(element.EMP_CODE) == Number(this.form.getRawValue().EMP_CODE)){
    //       this._empfixheader_data.push(element)
    //     }
    //   });
    // } else {
    //   this._empfixheader_data = this.empfixheader_data
    // }

    // if(this.form.getRawValue().EMP_NO == event){
    //   this.f_fillFormData();
    // }
    // else{
    //   this.form.getRawValue().dept_list = '';
    //   this.form.getRawValue().division_list = '';
    //   this.form.getRawValue().employee_list = '';
    //   this.form.getRawValue().shift_list = '';
    //   this.form.getRawValue().structure_list = '';
    // }
  }
  
  empFixedSave(){
    this.isSubmited = true;
    if(this.form.valid){

      if(this.WEF_VALIDATE != null){
        var WEF_VALIDATE = this.datepipe.transform(new Date(this.WEF_VALIDATE), 'yyyy-MM-dd')
        var DESIGNATION_WEF = this.datepipe.transform(new Date(this.form.getRawValue().DESIGNATION_WEF), 'yyyy-MM-dd')
    
        if(WEF_VALIDATE > DESIGNATION_WEF ){
          this.toast.warning("WEF date should be greater than previous save date");
          return;
        }
      }
     
      if(this.form.getRawValue().TOTAL_MONTH == "" || this.form.getRawValue().TOTAL_MONTH == '0'){
        this.toast.warning("Please enter monthly amount");
        return;
      }
      
    //   for(let i=0; i< this.empfixdetail_list.length; i++){    
    //     if(this.empfixdetail_list[i].TOTAL_MONTH === "" || this.empfixdetail_list[i].TOTAL_MONTH == '0') {
    //       this.toast.warning("Please enter monthly amount");
    //       return;
    //     }
    // }

    this.form.get('TOTAL_MONTH').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TOTAL_MONTH)));
    this.form.get('TOTAL_ANNAUL').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TOTAL_ANNAUL)));
      let data = {
        EmployeeFixHeader:this.form.value,
        EmployeeFixDetail:this.empfixdetail_list
      }

      this.spinner = true;
      this.http.PostRequest(this.apiUrl.SaveEmployeeFix, data).then(res => {
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

GetEmployeeFixSalHeadDetail(){
  this.spinner = true;
  let data = {
    USERID:this.form.getRawValue().USERID,
    STRU_CODE:this.form.getRawValue().STRU_CODE,
    EMP_NO:this.form.getRawValue().EMP_NO,
  }
  this.http.PostRequest(this.apiUrl.GetEmployeeFixSalHeadDetail, data).then(res => {
    if (res.flag) {
      console.log(res)
      this.empfixdetail_list = res.empfixdetail_list;
      
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

  calculateTotal(index: number = null){
    this.spinner = false;
    var SAL_MONTH=0;
    var SAL_ANNUAL= 0;
    var TOTAL_MONTH=0;
    var TOTAL_ANNAUL=0;
    this.empfixdetail_list.forEach(element => {
      if(element.SAL_MONTH == undefined){
        element.SAL_MONTH = 0;
      }
      element.SAL_ANNUAL = element.SAL_MONTH*12;
      SAL_ANNUAL += parseFloat(element.SAL_ANNUAL); 
      TOTAL_MONTH += parseFloat(element.SAL_MONTH);
      TOTAL_ANNAUL += parseFloat(element.SAL_ANNUAL); 
    }); 

 
    this.form.get('TOTAL_MONTH').setValue(this.pipeService.setCommaseprated(TOTAL_MONTH.toFixed(2)))
    this.form.get('TOTAL_ANNAUL').setValue(this.pipeService.setCommaseprated(TOTAL_ANNAUL.toFixed(2)));
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
   
  }

 WEF_VALIDATE : Date = null; 
  f_fillFormData() {
    this.spinner = false;
    this.WEF_VALIDATE = null;
    // this.empfixdetail_list = [];
    if(this.empfixheader_data.length == 0){
            
      this.form.get('STRU_CODE').setValue('');
      this.form.get('TS_COST').setValue('0');
    }
    else{

    
    this.form.get("DESIGNATION").setValue(this.empfixheader_data[0].DESIGNATION)
    this.form.get("DESIGNATION_WEF").setValue(this.empfixheader_data[0].DESIGNATION_WEF)
    this.form.get("TOTAL_ANNAUL").setValue(this.empfixheader_data[0].TOTAL_ANNAUL)
    this.form.get("TOTAL_MONTH").setValue(this.empfixheader_data[0].TOTAL_MONTH)
    this.form.get("TS_COST").setValue(this.empfixheader_data[0].TS_COST)
    this.WEF_VALIDATE = this.empfixheader_data[0].DESIGNATION_WEF;

    
    setTimeout(() => {
      this.form.get("DEPT_CODE").setValue(this.empfixheader_data[0].DEPT_CODE)
      this.form.get("DIVISION_CODE").setValue(this.empfixheader_data[0].DIVISION_CODE)
      this.form.get("SHIFT_CODE").setValue(this.empfixheader_data[0].SHIFT_CODE)
      this.form.get("STRU_CODE").setValue(this.empfixheader_data[0].STRU_CODE)
      this.form.get("DESIGNATION_WEF").setValue(this.empfixheader_data[0].DESIGNATION_WEF)
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  }



  f_validateFormData(){
    if (this.form.controls['COMPANY_CODE'].invalid) {
      this.toast.warning('Please select company');
      return false;
    } else if (this.form.controls['EMP_NO'].invalid) {
      this.toast.warning('Please select employee');
      return false;
    } else if (this.form.controls['DESIGNATION_WEF'].invalid) {
      this.toast.warning('Please select WEF date');
      return false;
    } else if (this.form.controls['DESIGNATION'].invalid) {
      this.toast.warning('Please enter designation');
      return false;
    }  else if (this.form.controls['DIVISION_CODE'].invalid) {
      this.toast.warning('Please select dividion');
      return false;
    } else if (this.form.controls['DEPT_CODE'].invalid) {
      this.toast.warning('Please select department');
      return false;
    } else if (this.form.controls['LOCATION_CODE'].invalid) {
      this.toast.warning('Please select location');
      return false;
    } else if (this.form.controls['SHIFT_CODE'].invalid) {
      this.toast.warning('Please select shift');
      return false;
    }  else if (this.form.controls['STRU_CODE'].invalid) {
      this.toast.warning('Please select structure');
      return false;
    } else if (this.form.controls['TS_COST'].invalid) {
      this.toast.warning('Please enter timesheet cost');
      return false;
    } 
    return true;
  }
  

  f_clearForm(){
    this.form.reset();
    this.isSubmited = false;
    this.empfixdetail_list = [];
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    this.form.get('TOTAL_MONTH').setValue('0');
    this.form.get('TOTAL_ANNAUL').setValue('0');
    this.form.get('DESIGNATION_WEF').setValue(this.sharedService.getTodayDate())
    this.DESIGNATION_WEF = this.sharedService.getTodayDate()
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
}
