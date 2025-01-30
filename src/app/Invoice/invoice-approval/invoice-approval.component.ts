import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-invoice-approval',
  templateUrl: './invoice-approval.component.html',
  styleUrls: ['./invoice-approval.component.css']
})
export class InvoiceApprovalComponent implements OnInit {

  spinner: boolean = false;
  form: FormGroup

  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService,
    private route: RoutingService) { }

    REQ_DATE: any = '';
    maxdate = new Date();
    invoice_detail: Array<any>= [];
    INVOICE_ID: string = '';
    task_search_val: string = '';
  ngOnInit() {
    this.sharedService.formName = "Invoice Approve"

    this.form = this.formBuilder.group({
      REQ_ID:"",
      COMPANY_CODE: ["",Validators.required],
      LOCATION_CODE:["",Validators.required],
      FYEAR: ["",Validators.required],
      DOCTYPE_CODE: ["",Validators.required],
      REQ_NO: ["",Validators.required],
      REQ_DATE: ["",Validators.required],
      CUST_CODE: ["",Validators.required],
      PROJ_CODE: ["",Validators.required],
      HEADING: ["",Validators.required],
      CLIENTAPPROVAL: "",
      INVOICE_VALUE:["",Validators.required],
      CURRENCY_CODE: ["INR",Validators.required],
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

    this.GetInvoiceList();
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
    this.http.PostRequest(this.apiUrl.GetInvoiceCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.fyear_list = res.fyear_list;
        this.invoice_type_list = res.invoice_type_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.customer_list = res.customer_list;
        this.project_list = res.project_list;
        this.currency_list = res.currency_list;

        this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR)
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
  invoice_list: Array<any> = [];
  GetInvoiceList(){
    let data = {
      LISTTYPE:"pendingforapproval"
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetInvoiceList, data).then(res => {
      if (res.flag) {
        this.invoice_list = res.invoice_list;

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

  GetIvoiceDetail(){
    this.form.get('REQ_ID').setValue(this.INVOICE_ID)
    let data = {
      TYPE:"INV_REQ",
      REQ_ID:this.INVOICE_ID
    }

    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetIvoiceDetail, data).then(res => {
      if (res.flag) {
        this.f_fillFormData(res.invoice_header[0])
        this.invoice_detail = res.invoice_detail       
        this.invoice_detail.forEach(element => {
          element.ACTUAL_HOURS_D = this.f_M_H(element.ACTUAL_HOURS)
          element.BILLED_HOURS_D = this.f_M_H(element.BILLED_HOURS)
      });
        this.add_tasks();
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

  f_fillFormData(data: any = {}){
    if(data != undefined && data != null){
      this.form.get('COMPANY_CODE').setValue(data.COMPANY_CODE)
      this.form.get('LOCATION_CODE').setValue(data.LOCATION_CODE)
      this.form.get('FYEAR').setValue(data.FYEAR)
      this.form.get('DOCTYPE_CODE').setValue(data.DOCTYPE_CODE)
      this.form.get('REQ_NO').setValue(data.REQ_NO)
      this.form.get('REQ_DATE').setValue(data.REQ_DATE)
      this.form.get('CUST_CODE').setValue(data.CUST_CODE)
      this.form.get('PROJ_CODE').setValue(data.PROJ_CODE)
      this.form.get('HEADING').setValue(data.HEADING)
      this.form.get('CLIENTAPPROVAL').setValue(data.CLIENTAPPROVAL)
      this.form.get('INVOICE_VALUE').setValue(data.INVOICE_VALUE)
      this.form.get('CURRENCY_CODE').setValue(data.CURRENCY_CODE)
      this.form.get('CANCEL_IND').setValue(data.CANCEL_IND)
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

  let time: any = 0;
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

  if(minutes != '' && minutes != undefined && minutes != null){
  const H = Math.floor(minutes / 60);
  const M = minutes % 60;
  hour = ("00" + H.toString()).slice(-2) + ':' + ("00" + M.toString()).slice(-2);
}
  return hour || 0;
}

_invoice_detail: Array<any> = [];
add_tasks(){
  this._invoice_detail = this.invoice_detail.filter(e=> e.ACTIVE == true )
}

isSubmited: boolean = false;
SaveInvoiceApprove(){
  this.isSubmited = true;
  if(this.f_validateFormData()){
    for(let i=0; i< this.invoice_detail.length; i++){    
      this.invoice_detail[i].BILLED_HOURS = this.f_H_M(this.invoice_detail[i].BILLED_HOURS_D) 
  }
  let data = {
    TYPE:"APPROVE",
    invoice:this.form.value,
    invoice_detail: this.invoice_detail
  }


  this.http.PostRequest(this.apiUrl.SaveInvoiceRequest, data ).then(res => {
    if (res.flag) {
      this.toast.success(res.msg)
      this.isSubmited = false;
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
  }else{
    
  }
  
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
  this.isSubmited = false;
  this.INVOICE_ID = null;
  this.form.reset();
  this._invoice_detail = [];
  this.invoice_detail = [];
  this.REQ_DATE = '';
  this.GetInvoiceList();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
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

}
