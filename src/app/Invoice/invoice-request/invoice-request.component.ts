import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-invoice-request',
  templateUrl: './invoice-request.component.html',
  styleUrls: ['./invoice-request.component.css']
})
export class InvoiceRequestComponent implements OnInit {

  spinner: boolean = false;
  min_date = new Date(new Date().getFullYear(), 0, 1);
  form: FormGroup

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService,
    private route: RoutingService) { }

    REQ_DATE: any = '';
    maxdate = new Date();
    invoice_detail: Array<any>= [];
    task_search_val: string = '';
  ngOnInit() {
    this.sharedService.formName = "Invoice Request"
    this.form = this.formBuilder.group({
      REQ_NO: [""],
      COMPANY_CODE:  ["",Validators.required],
      LOCATION_CODE: ["",Validators.required],
      FYEAR: ["",Validators.required],
      DOCTYPE_CODE: ["",Validators.required],
      REQ_DATE: ["",Validators.required],
      CUST_CODE: ["",Validators.required],
      PROJ_CODE: ["",Validators.required],
      HEADING: ["",Validators.required],
      CLIENTAPPROVAL: "",
      INVOICE_VALUE:["",Validators.required],
      CURRENCY_CODE:["INR",Validators.required],
      CANCEL_IND: "",
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');

    
  }

  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;

ngAfterViewInit(){    
  setTimeout(() => {
    // if (this.sharedService.form_rights.ADD_RIGHTS) {
    //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
    // }
    // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
    //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
    // }

    // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
    
    this.form.get('REQ_DATE').setValue(this.sharedService.getTodayDate())
    this.REQ_DATE = this.sharedService.getTodayDate()
    this.GetInvoiceCommonList();
  },150)
}

  company_list: Array<any> = [];
  fyear_list: Array<any> = [];
  invoice_type_list: Array<any> = [];
  location_list: Array<any> = [];
  customer_list: Array<any> = [];
  project_list: Array<any> = [];
  currency_list: Array<any> = [];

  _location_list:Array<any> = [];
  GetInvoiceCommonList(){
    this.spinner = true;
    let data = {
      LISTTYPE: "all"
      
    }
    this.http.PostRequest(this.apiUrl.GetInvoiceCommonList, data).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.fyear_list = res.fyear_list;
        this.invoice_type_list = res.invoice_type_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.customer_list = res.customer_list;
        this.project_list = res.project_list;
        this.currency_list = res.currency_list;

        //this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR)
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

approveRoute(){
  this.route.changeRoute('invoiceapprove')
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
_project_list: Array<any> = [];
filterProjects(){
  if(this.form.getRawValue().CUST_CODE != '' && this.form.getRawValue().CUST_CODE != undefined && this.form.getRawValue().CUST_CODE != null){
    this._project_list = this.project_list.filter(e => e.CUST_CODE == this.form.getRawValue().CUST_CODE);
    this._project_list = this._project_list == undefined?[]:this._project_list
  } else {
    this._project_list = this.project_list
  }
  
}
task_list: Array<any> = [];
GetTaskList(){
  this.spinner = true;
  let data = {
    PROJ_CODE:this.form.getRawValue().PROJ_CODE,
    LISTTYPE:"INVOICE"
  }
    this.http.PostRequest(this.apiUrl.GetTaskList, data).then(res => {
      if (res.flag) {
        this.task_list = res.task_list;
        this.invoice_detail = res.task_list;
        
        this.invoice_detail.forEach(element => {
            element.ACTUAL_HOURS_D = this.f_M_H(element.ACTUAL_HOURS)
            element.BILLED_HOURS_D = this.f_M_H(element.BILLED_HOURS)
        });

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
f_H_M(hours: string = ''): any {
  let col = [];
  let H = 0;
  let M = 0;

  let time: any = null;
  if (hours != "" && hours != undefined && hours != null) {
    col = hours.split(':')
    H = +col[0] || 0;
    M = +col[1] || 0;

    time = (H * 60) + M
  }

  return time;

}
f_M_H(minutes: any = null): any {
  let hour = null;
  if(minutes > -1 && minutes != undefined && minutes != null){
   
  const H = Math.floor(minutes / 60);
  const M = minutes % 60;
  hour = ("0000" + H.toString()).slice(-2) + ':' + ("00" + M.toString()).slice(-2);
}
  return hour;
}
isSubmited: boolean = false;
SaveInvoiceRequest(){
  this.isSubmited = true;
  if(this.f_validateFormData()){

    for(let i=0; i< this.invoice_detail.length; i++){    
      this.invoice_detail[i].BILLED_HOURS = this.f_H_M(this.invoice_detail[i].BILLED_HOURS_D) 
  }
  this.form.get('REQ_NO').setValue(this.form.getRawValue().REQ_NO == ""?0:this.form.getRawValue().REQ_NO)
  let data = {
    invoice:this.form.value,
    invoice_detail: this.invoice_detail
  }


  this.http.PostRequest(this.apiUrl.SaveInvoiceRequest, data ).then(res => {
    if (res.flag) {
      this.toast.success(res.msg)

      this.f_clearForm();
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    } else {
      this.toast.warning(res.msg)
      this.spinner = false;
    }
  }, err => {
    this.spinner = false;
  });
  } else{
    
  }
}
_invoice_detail: Array<any> = [];
add_tasks(){
  this._invoice_detail = this.invoice_detail.filter(e=> e.ACTIVE == true )
}
f_validateFormData(){

  if (this.form.controls['COMPANY_CODE'].invalid) {
    this.toast.warning('Please select company');
    return false;
  } else if (this.form.controls['LOCATION_CODE'].invalid) {
    this.toast.warning('Please select location');
    return false;
  } else if (this.form.controls['DOCTYPE_CODE'].invalid) {
    this.toast.warning('Please select invoice type');
    return false;
  } else if (this.form.controls['FYEAR'].invalid) {
    this.toast.warning('Please select FYEAR');
    return false;
  }  else if (this.form.controls['REQ_NO'].invalid) {
    this.toast.warning('Please enter request number');
    return false;
  } else if (this.form.controls['REQ_DATE'].invalid) {
    this.toast.warning('Please enter request date');
    return false;
  } else if (this.form.controls['CUST_CODE'].invalid) {
    this.toast.warning('Please select customer');
    return false;
  } else if (this.form.controls['PROJ_CODE'].invalid) {
    this.toast.warning('Please select project');
    return false;
  }  else if (this.form.controls['INVOICE_VALUE'].invalid) {
    this.toast.warning('Please enter invoice value');
    return false;
  } else if (this.form.controls['CURRENCY_CODE'].invalid) {
    this.toast.warning('Please select currency');
    return false;
  } else if (this.form.controls['HEADING'].invalid) {
    this.toast.warning('Please enter heading');
    return false;
  } else if (this.form.controls['CLIENTAPPROVAL'].invalid) {
    this.toast.warning('Please enter client approval');
    return false;
  }  else if (this.form.controls['CANCEL_IND'].invalid) {
    this.toast.warning('Please select cancel...');
    return false;
  } 

  return true;
}

f_clearForm(){
  this.isSubmited=false;
  this.form.reset();
  this._invoice_detail = [];
  this.invoice_detail = [];
  this.form.get('REQ_DATE').setValue(this.sharedService.getTodayDate())
  this.REQ_DATE = this.sharedService.getTodayDate()
  this.form.get('CURRENCY_CODE').setValue('INR')
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}
}
