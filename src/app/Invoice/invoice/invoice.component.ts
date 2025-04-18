import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { PipeService } from 'src/app/services/pipe.service';
import { element } from 'protractor';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';
// import { MatDatepickerFilter } from '@angular/material/datepicker';


declare var $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
   @ViewChild('CheckValidationForInvoiceCreate', { static: false }) modal: ElementRef;
   
  spinner: boolean = false;
  form: FormGroup
    BILLING_DATE: any = '';
    DUE_DATE: any = '';
    PO_DATE: any = '';
    maxdate = new Date();
    today_date = new Date();
    today_date_s : any;
    min_date = new Date(new Date().getFullYear(), 0, 1);
    invoice_detail: Array<any>= [];
    INVOICE_ID: string = '';
    cost: any = '';
    credit_days:number=0;
    val_data:any = [];
    PO_NO: any;
    KIND_ATTN:any ='';
    REMARKS:any='';
    BILL_ID:any;
    IsInvoiedteailDisable:boolean=false;
    UpdateDisable:boolean=false;
    ADD_RIGHTS: boolean = false;
    UPDATE_RIGHTS: boolean = false;
    NO_RIGHTS: boolean = false;
    isAdd: boolean = false;
    isUpdate: boolean = false;
    userData:any = {};
    FYEAR:any;
    FYEAR_DATE:any;
    isPending: boolean = false;
    company_list: Array<any> = [];
    fyear_list: Array<any> = [];
    invoice_type_list: Array<any> = [];
    location_list: Array<any> = [];
    customer_list: Array<any> = [];
    project_list: Array<any> = [];
    currency_list: Array<any> = [];
    _location_list:Array<any> = [];
    _project_list:Array<any> = [];
    state_list: Array<any> = [];
    service_list: Array<any> = [];
    _service_list: Array<any> = [];
    templete_list: Array<any> = [];
    _invoice_detail: Array<any> = [];
    all_invoice_list: Array<any> = [];
    invoice_list: Array<any> = [];
    _selected_index : number = null;
    _selected_service_code : string = "";
    _DATE: any = ''
    FINAL_BASE_VALUE_2:number;
    isSubmited: boolean = false;
    isViewInvoice:boolean = false;
    invoice_header : Array<any> = [];
    SO_Detail_list: Array<any> = [];
    RAISE_INVOICE_ON: any = new Date();
    minDate: any = new Date();
    raisedinvoiceonmaxDate:any = new Date();
    VIEW_RAISE_INVOICE_ON: any = new Date();
    SO_REMARKS:any = '';
    REQUEST_REMARKS:any = '';
    isViewDocument:boolean = false;
    Document_list:any = [];
    base64Image:any ='';
    base64Pdf:any ='';
    ViewDocumentDetailsList:boolean = false;
    EXPECTED_PAYMENT_DATE:any = new Date();

    constructor(public sharedService: SharedServiceService,
      private apiUrl: ApiUrlService,
      private http: HttpRequestServiceService,
      private formBuilder: FormBuilder,
      private toast: ToastrService,
      private datePipe: DatePipe,
      public validationService: ValidationService,
      private pipeService: PipeService,
      public datepipe: DatePipe,
    private currencyPipe: CostFilterPipe) { }

  ngOnInit() {
    this.sharedService.formName = "Invoice"
    this.form = this.formBuilder.group({
      BILL_ID:[""],
      REQ_ID:"",
      LOCATION_STATE:  ["",Validators.required],
      STATE_CODE:  ["",Validators.required],
      COMPANY_CODE: ["",Validators.required],
      LOCATION_CODE:["",Validators.required],
      FYEAR: ["",Validators.required],
      DOCTYPE_CODE: ["",Validators.required],
      BILLING_NO: "",
      BILLING_DATE: ["",Validators.required],
      DUE_DATE: ["",Validators.required],
      CUST_CODE: ["",Validators.required],
      PROJ_CODE: ["",Validators.required],
      PO_NO: ["",Validators.required],
      PO_DATE: ["",Validators.required],
      KIND_ATTN: "",
      CURRENCY_CODE: ["INR",Validators.required], 
      RAISE_INVOICE_ON: ["", Validators.required],
      EXCHANGE_RATE:["",Validators.required],
      DOC_VALUE:["",Validators.required],
      BASE_VALUE:"",
      SGST_VALUE:"",
      CGST_VALUE:"",
      IGST_VALUE:"",
      ROUNDOFF_VALUE:"",
      BILL_VALUE:"",
      CUSTOMER_NAME: "",
      _ACTION: "",
      RCVD_VALUE:"",
      CANCEL_IND: "",
      TEMPLATE_CODE:["",Validators.required],
      BILL_IND:"",
      EXPECTED_PAYMENT_DATE: ["",Validators.required],
    })
      $('.selectpicker').selectpicker('refresh').trigger('change');
      this.userData = JSON.parse(sessionStorage.getItem('user_detail'))
      this.FYEAR =  this.userData[0].FYEAR
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

    if(this.sharedService.loginUser[0].FYEAR == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
      
     }
    

     setTimeout(() => {
  
     this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
     this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
     this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    //  this.filterLocations();
     this.SelectState();
     $('.selectpicker').selectpicker('refresh').trigger('change');
     },210);

    this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
     if(this.today_date_s > this.sharedService.loginUser[0].TO_DATE){
      this.min_date = this.sharedService.loginUser[0].FROM_DATE;
      this.maxdate = this.sharedService.loginUser[0].TO_DATE;
    }
    else{      
      this.min_date = this.sharedService.loginUser[0].FROM_DATE;
      this.maxdate = this.today_date;
    }
    
    this.GetInvoiceList();
    this.GetInvoiceCommonList();
    
  },150)
}

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
        this._project_list = res.project_list;
        
        this.currency_list = res.currency_list;
        this.state_list = res.state_list;
        this.service_list = res.service_list;
        this.templete_list = res.templete_list;
        //this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR)
        this.form.get('EXCHANGE_RATE').setValue(1);        
        this.form.get('TEMPLATE_CODE').setValue("LOCAL");   
        this.form.get('DOCTYPE_CODE').setValue("SLL");   
                         
        this.form.get('BILLING_DATE').setValue(this.sharedService.getTodayDate())        
        this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate()) 
        this.f_addRow();
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

  f_changeService(service_code: string = '',index: number = null){
    this._selected_index = index;
    if(this.f_validateFormData()){
      document.getElementById('val_'+index).removeAttribute("disabled");  
      this.GetGSTRate();
    }
    else{
      //this._invoice_detail.forEach(element => {    
      //  element.SERVICE_CODE = "";     
      //});
      this._invoice_detail[this._selected_index].SERVICE_CODE = "";
    }
  }

  onChangeDetail(){
  }

  GetGSTRate(){
    if(this.form.getRawValue().CUST_CODE != "" || this.form.getRawValue().CUST_CODE != undefined || this.form.getRawValue().CUST_CODE != null
    || this.form.getRawValue().LOCATION_CODE != "" || this.form.getRawValue().LOCATION_CODE != undefined || this.form.getRawValue().LOCATION_CODE != null
    )
    {
      this._invoice_detail.forEach((element:any) => {    
        if(element.SERVICE_CODE != "" || element.SERVICE_CODE != undefined || element.SERVICE_CODE != null){
          let data = {
            CUST_CODE:this.form.getRawValue().CUST_CODE,
            LOCATION_CODE:this.form.getRawValue().LOCATION_CODE,
            SERVICE_CODE:element.SERVICE_CODE
          }

          this.http.PostRequest(this.apiUrl.GetGstRate, data).then(res => {
            if (res.flag) {
              //console.log(res.gstrate_list[0].SGST_RATE);
              //this._invoice_detail[this._selected_index].SGST_RATE = res.gstrate_list[0].SGST_RATE;
              //this._invoice_detail[this._selected_index].CGST_RATE = res.gstrate_list[0].CGST_RATE;
              //this._invoice_detail[this._selected_index].IGST_RATE = res.gstrate_list[0].IGST_RATE;
              element.SGST_RATE = res.gstrate_list[0].SGST_RATE;
              element.CGST_RATE = res.gstrate_list[0].CGST_RATE;
              element.IGST_RATE = res.gstrate_list[0].IGST_RATE;
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh').trigger('change');
              }, 
              100);
              
            } else {
            }
          }, err => {
          });
        }    
      });
    }
  }

  f_addRow(){
    this._invoice_detail.push({
      BILL_SRNO:0,
      SERVICE_CODE: "",
      REMARKS:"",
      DOC_VALUE:"0",
      BASE_VALUE:"0",
      SGST_RATE:"0",
      SGST_VALUE:"0",
      CGST_RATE:"0",
      CGST_VALUE:"0",
      IGST_RATE:"0",
      IGST_VALUE:"0",
      TOT_VALUE:"0",
      Active:1
    })

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GetInvoiceList(){
    let data = {
      LISTTYPE:"approved"
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

  SelectState(){
    if(this.form.getRawValue().LOCATION_CODE != "" && this.form.getRawValue().LOCATION_CODE != null){
      this.location_list.forEach(element => {
        if(Number(element.LOCATION_CODE) == Number(this.form.getRawValue().LOCATION_CODE)){
          // console.log(element.LOCATION_STATE);
          this.form.get('LOCATION_STATE').setValue(element.LOCATION_STATE+"");
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.GetGSTRate();
        }
      });
    }
  }

  filterProject(){
    this._project_list = [];
     this.project_list.forEach((element:any)=>{
      if(element.CUST_CODE == this.form.controls['CUST_CODE'].value){
        this._project_list.push(element);
      }
     })
     this.customer_list.forEach((element:any) => {
      if(element.CUST_CODE == this.form.controls['CUST_CODE'].value){
          this.form.get('STATE_CODE').setValue(element.CUST_STATE+"");
          this.form.get('KIND_ATTN').setValue(element.CUST_KINDATTN);
          this.form.get('CURRENCY_CODE').setValue(element.CUST_CURRENCY);
          if (element.CUST_CURRENCY == "INR") {
              this.form.get('EXCHANGE_RATE').setValue(1);
              document.getElementById('EXCHANGE_RATE').setAttribute("disabled", "true");
            }
            else {
              document.getElementById('EXCHANGE_RATE').removeAttribute("disabled")
            }
      }
     })
     this.form.get("PROJ_CODE").setValue(this.SO_Detail_list[0].PROJ_CODE)
    setTimeout(() => {
    this.CalculateFinalAmount();
      $('.selectpicker').selectpicker('refresh').trigger('change');

      // this._service_list = [];
      // this.service_list.forEach((element:any)=>{
      //   if(element.SERVICE_CODE == this.SO_Detail_list[0].SERVICE_CODE){
      //     console.log("" )
      //     this.form.get("SERVICE_CODE").setValue(this.SO_Detail_list[0].SERVICE_CODE)
      //   }
      //  })

    }, 100);
  }

  ChangeBillDate(){
    this.BILLING_DATE = this.datePipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')
    var due_date_new = new Date(this.BILLING_DATE);       
    var new_date  = moment(new Date(due_date_new)).add(this.credit_days,'d');          
    this.form.get('DUE_DATE').setValue(new_date);
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  CalculateFinalAmount (){
    // console.log(' _invoice_detail 1 ->' , this._invoice_detail)
    var BILL_VALUE= 0;
    var SGST_VALUE= 0;
    var CGST_VALUE= 0;
    var IGST_VALUE= 0;
    var TOT_VALUE= 0;
    var FINAL_TOTAL_ROUND = 0;
    var ROUNDOFF = 0;
    // console.log(' _invoice_detail 2 ->' , this._invoice_detail)
    this._invoice_detail.forEach((element:any) => {
      BILL_VALUE += parseFloat(element.DOC_VALUE);   
      element.SGST_VALUE = (parseFloat(element.DOC_VALUE) * parseFloat(element.SGST_RATE)/100).toFixed(2);     
      element.CGST_VALUE = (parseFloat(element.DOC_VALUE) * parseFloat(element.CGST_RATE)/100).toFixed(2);     
      element.IGST_VALUE = (parseFloat(element.DOC_VALUE) * parseFloat(element.IGST_RATE)/100).toFixed(2);       
      element.TOT_VALUE =  (BILL_VALUE+parseFloat(element.SGST_VALUE)+parseFloat(element.CGST_VALUE)+parseFloat(element.IGST_VALUE)).toFixed(2);
      element.BASE_VALUE = (this.form.getRawValue().EXCHANGE_RATE * BILL_VALUE).toFixed(2);
      SGST_VALUE += parseFloat(element.SGST_VALUE);
      CGST_VALUE += parseFloat(element.CGST_VALUE);
      IGST_VALUE += parseFloat(element.IGST_VALUE);
      TOT_VALUE += parseFloat(element.TOT_VALUE);
    });

    this.form.get('DOC_VALUE').setValue((BILL_VALUE).toFixed(2));
    this.form.get('SGST_VALUE').setValue((SGST_VALUE).toFixed(2));
    this.form.get('CGST_VALUE').setValue((CGST_VALUE).toFixed(2));
    this.form.get('IGST_VALUE').setValue((IGST_VALUE).toFixed(2));
    FINAL_TOTAL_ROUND = Math.round((TOT_VALUE));
    ROUNDOFF = FINAL_TOTAL_ROUND - TOT_VALUE;
    this.form.get('ROUNDOFF_VALUE').setValue((ROUNDOFF).toFixed(2));  
    this.form.get('BILL_VALUE').setValue((FINAL_TOTAL_ROUND).toFixed(2));
    
    var FINAL_BASE_VALUE = (FINAL_TOTAL_ROUND*this.form.getRawValue().EXCHANGE_RATE);
    //this.FINAL_BASE_VALUE_2 = FINAL_BASE_VALUE;
    this.form.get('BASE_VALUE').setValue((FINAL_BASE_VALUE).toFixed(2));
    this.form.get('BASE_VALUE').setValue((this.pipeService.setCommaseprated(FINAL_BASE_VALUE.toFixed(2))))
    // console.log(' _invoice_detail 3 ->' , this._invoice_detail)
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

  SaveInvoice(){
    this.isSubmited = true;
    if(this.f_validateFormData()){
      for(let i=0; i< this.invoice_detail.length; i++){    
        this.invoice_detail[i].BILLED_HOURS = this.f_H_M(this.invoice_detail[i].BILLED_HOURS_D) 
      }
      this.form.get('BASE_VALUE').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().BASE_VALUE)));
    
      let data = {
        TYPE:"APPROVE",
        invoice:this.form.value,
        invoice_detail: this._invoice_detail
      }

    // console.log(data);
    //return;
    this.http.PostRequest(this.apiUrl.SaveInvoice, data ).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.isSubmited = false;
        this.f_clearForm();
        this.f_fillFormData();
        this.isViewInvoice = !this.isViewInvoice;
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
    } 
  //  else if (this.form.controls['FYEAR'].invalid) {
  //     this.toast.warning('Please select FYEAR');
  //     return false;
  //   }  
    else if (this.form.controls['BILLING_DATE'].invalid) {
      this.toast.warning('Please enter request date');
      return false;
    } else if (this.form.controls['CUST_CODE'].invalid) {
      this.toast.warning('Please select customer');
      return false;
    } else if (this.form.controls['PROJ_CODE'].invalid) {
      this.toast.warning('Please select project');
      return false;
    } else if (this.form.controls['TEMPLATE_CODE'].invalid) {
      this.toast.warning('Please select templete');
      return false;
    } else if (this.form.controls['CURRENCY_CODE'].invalid) {
      this.toast.warning('Please select currency');
      return false;
    } 
  
    return true;
  }

  GetBilledInvoiceList(){
    let useDetail = JSON.parse(sessionStorage.getItem('user_detail'))
    let data = {
      LISTTYPE:"billed",
      FYEAR:useDetail[0].FYEAR
    }
    // console.log(data,JSON.parse(sessionStorage.getItem('user_detail')),"biiled")
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetInvoiceList, data).then(res => {
      if (res.flag) {
        this.all_invoice_list = res.invoice_list;
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

  viewInvoiceList(){
    this.isViewInvoice = !this.isViewInvoice;
    this.UpdateDisable=false
    this.GetBilledInvoiceList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  backToForm(){
    this.isViewInvoice = !this.isViewInvoice;
    this.UpdateDisable=false 
    this.IsInvoiedteailDisable = false;
    this.isViewDocument = false;
    this.f_clearForm();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  
  f_clearForm(){
    this.isSubmited = false;
    this.INVOICE_ID = '';
    this.form.reset();
    this.invoice_detail = [];
    this.BILLING_DATE = '';
    this.DUE_DATE = '';
    this.PO_DATE = '';
    this._invoice_detail = []; 
    this._invoice_detail = []; 
    this.form.get('EXCHANGE_RATE').setValue(1);        
    this.form.get('TEMPLATE_CODE').setValue("LOCAL"); 
    //this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR);
    this.form.get('BILLING_DATE').setValue(this.sharedService.getTodayDate())        
    this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())      
    this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('EXPECTED_PAYMENT_DATE').setValue(this.sharedService.getTodayDate())
    this.BILLING_DATE = new Date();
    this.DUE_DATE = new Date();
    this.PO_DATE = new Date();
    this.EXPECTED_PAYMENT_DATE = new Date();
    if(this.sharedService.loginUser[0].FYEAR == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
     }

     this.form.get('CURRENCY_CODE').setValue("INR");
     this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
     this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
     this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    //  this.filterLocations();
     this.SelectState();
    this.GetInvoiceList();
    // this.f_addRow();    
    this.GetInvoiceCommonList();
    this._DATE = "";
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 210);
  }
  
  PrintInvoice(p_data:any){
    let data = {
      BILL_ID:p_data.BILL_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.PrintInvoice, data).then(res => {
      this.spinner = false;
        // console.log(res.data);
        // console.log(res.filename);
        if(res.data != ""){
            const byteString = atob(res.data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
              int8Array[i] = byteString.charCodeAt(i);
            }
            const data: Blob = new Blob([int8Array]);
            //window.open("data:application/pdf," + encodeURI(res.data));
            //let pdfWindow = window.open("")
            // pdfWindow.document.write(
            //     "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
            //     encodeURI(res.data) + "'></iframe>"
            // )
            var file = new Blob([int8Array], { type: 'application/pdf;base64' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            //saveAs(data, res.filename);
          }
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
    }, err => {
      this.spinner = false;
    });
  }

  GetEditInvoiceDetail(){
    let data = {
      BILL_ID: this.BILL_ID
    }
  
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetEditInvoiceDetail, data).then(res => {
      if (res.flag) {
        this.invoice_header = res.invoice_header;
        this._invoice_detail = res.invoice_detail;
        this.f_fillFormData();
        this.isViewInvoice = !this.isViewInvoice;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else {
        this.spinner = false;
      } 
    });
  }

  f_fillFormData() {
    this.spinner = true;
    // this.filterLocations();
    this.form.get("BILL_ID").setValue(this.invoice_header[0].BILL_ID)
    // this.form.get("REQ_ID").setValue(this.invoice_header[0].REQ_ID)
    this.form.get("LOCATION_STATE").setValue(this.invoice_header[0].LOCATION_STATE)
    this.form.get("STATE_CODE").setValue(this.invoice_header[0].STATE_CODE)
   // this.showContent(this.invoice_header[0].PAY_TO);
    this.form.get("COMPANY_CODE").setValue(this.invoice_header[0].COMPANY_CODE)
    // this.form.get("PO_DATE").setValue(this.invoice_header[0].PO_DATE == null?'':this.invoice_header[0].PO_DATE)
    this.form.get("LOCATION_CODE").setValue(this.invoice_header[0].LOCATION_CODE)
    this.form.get("FYEAR").setValue(this.invoice_header[0].FYEAR)
    this.form.get("DOCTYPE_CODE").setValue(this.invoice_header[0].DOCTYPE_CODE)
    this.form.get("BILLING_NO").setValue(this.invoice_header[0].BILLING_NO)
    this.form.get("BILLING_DATE").setValue(this.invoice_header[0].BILLING_DATE)
    this.form.get("DUE_DATE").setValue(this.invoice_header[0].DUE_DATE)
    this.form.get("EXPECTED_PAYMENT_DATE").setValue(this.invoice_header[0].EXPECTED_PAYMENT_DATE)
    this.form.get("PO_DATE").setValue(this.invoice_header[0].PO_DATE)
    this.PO_DATE = this.datePipe.transform(this.invoice_header[0].PO_DATE,'dd-MMM-yyyy')
    this.BILLING_DATE = this.datePipe.transform(this.invoice_header[0].BILLING_DATE,'dd-MMM-yyyy')
    this.EXPECTED_PAYMENT_DATE = this.datePipe.transform(this.invoice_header[0].EXPECTED_PAYMENT_DATE,'dd-MMM-yyyy')
    this.DUE_DATE = this.datePipe.transform(this.invoice_header[0].DUE_DATE,'dd-MMM-yyyy')
    this.DUE_DATE = this.datePipe.transform(this.invoice_header[0].DUE_DATE,'dd-MMM-yyyy')
    this.form.get("CUST_CODE").setValue(this.invoice_header[0].CUST_CODE)
    this.form.get("PROJ_CODE").setValue(this.invoice_header[0].PROJ_CODE)
    this.form.get("PO_NO").setValue(this.invoice_header[0].PO_NO)
    this.form.get("KIND_ATTN").setValue(this.invoice_header[0].KIND_ATTN)
    this.form.get("CURRENCY_CODE").setValue(this.invoice_header[0].CURRENCY_CODE)
    this.form.get("EXCHANGE_RATE").setValue(this.invoice_header[0].EXCHANGE_RATE)
    this.form.get("DOC_VALUE").setValue(this.invoice_header[0].DOC_VALUE)
    this.form.get("BASE_VALUE").setValue(this.invoice_header[0].BASE_VALUE)    
    this.form.get("SGST_VALUE").setValue(this.invoice_header[0].SGST_VALUE) 
    this.form.get("CGST_VALUE").setValue(this.invoice_header[0].CGST_VALUE)
    this.form.get("IGST_VALUE").setValue(this.invoice_header[0].IGST_VALUE)
    this.form.get("ROUNDOFF_VALUE").setValue(this.invoice_header[0].ROUNDOFF_VALUE)
    this.form.get("BILL_VALUE").setValue(this.invoice_header[0].BILL_VALUE)
    this.form.get("RCVD_VALUE").setValue(this.invoice_header[0].RCVD_VALUE)
    this.form.get("CANCEL_IND").setValue(this.invoice_header[0].CANCEL_IND)
    this.form.get("TEMPLATE_CODE").setValue(this.invoice_header[0].TEMPLATE_CODE)
    this.form.get("BILL_IND").setValue(this.invoice_header[0].BILL_IND)
      
    this.SelectState();
        setTimeout(() => {
    this.form.get("REQ_ID").setValue(this.invoice_header[0].REQ_ID)
          this.form.get("COMPANY_CODE").setValue(this.invoice_header[0].COMPANY_CODE)
 //         this.GetProjectList();
          this.form.get("LOCATION_CODE").setValue(Number(this.invoice_header[0].LOCATION_CODE))
          // this.form.get("EXP_TYPE").setValue(this.invoice_header[0].EXP_TYPE)
          this.form.get("TDS_CODE").setValue(this.invoice_header[0].TDS_CODE)
          // this.showContent();
          this.form.get("VENDOR_NO").setValue(this.invoice_header[0].VENDOR_NO)
          this.form.get("EMP_NO").setValue(this.invoice_header[0].EMP_NO)
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
  }

  InvoiceList(){
    this.isViewInvoice = !this.isViewInvoice;
    this.GetInvoiceList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  editInvoice(data:any){
    this.BILL_ID = data.BILL_ID
    this.GetEditInvoiceDetail()
    this.IsInvoiedteailDisable = true;
    this.UpdateDisable=true ;
  }

  UpdateEditInvoice(){
    let data = {
      BILL_ID: this.BILL_ID,
      "PO_DATE":this.PO_DATE,
      "PO_NO":this.form.getRawValue().PO_NO,
      "KIND_ATTN": this.form.getRawValue().KIND_ATTN,
      "EXPECTED_PAYMENT_DATE": this.form.getRawValue().EXPECTED_PAYMENT_DATE,
      "REMARKS":this._invoice_detail
    }
    // console.log('update data',data)
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.UpdateEditInvoice, data ).then(res => {
      if (res.flag) {
        this.invoice_header = res.invoice_header;
        this._invoice_detail = res.invoice_detail;
        this.toast.success(res.msg)
        this.isSubmited = false;
        this.f_clearForm();
        this.UpdateDisable =!this.UpdateDisable
        this.IsInvoiedteailDisable = false;
        this.UpdateDisable=false;
        this.isViewDocument =false;
        this.isViewInvoice = !this.isViewInvoice;
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
  }

  GetSalesOrderReleaseDetail(val:any) {
    let SO_ID = 0;
    this.invoice_list.forEach((element:any)=>{
      if(element.REQ_ID == this.form.controls['REQ_ID'].value){
         SO_ID = element.SO_ID
      }
    })
    let data = {
      REQ_ID: this.form.controls['REQ_ID'].value,
      SO_ID: SO_ID
    }
    // console.log('data ->' , data)
    this.http.PostRequest(this.apiUrl.GetSalesOrderReleaseDetail, data).then(res => {
      if (res.flag == 1) {
        // console.log(' res ->' , res)
        this.SO_Detail_list = res.SO_Detail_list;
        // this._invoice_detail = res.SO_Milestone_list;
        this.Document_list = res.SO_Document_list;
        // for (let i = 0; i < this.SO_Detail_list.length; i++) {
        //   this.TOTAL_AMOUNT_VALUE = this.SO_Detail_list[i].TOTAL_AMOUNT_VALUE;
        // }
        // this.SO_MILESTONE_T.forEach((element:any)=>{
        //   this._invoice_detail[0].SERVICE_CODE += element.REQ_VALUE;
        // })
        this.RAISE_INVOICE_ON = new Date(this.SO_Detail_list[0].RAISE_INVOICE_ON)
        this.VIEW_RAISE_INVOICE_ON = this.datepipe.transform(this.SO_Detail_list[0].RAISE_INVOICE_ON, 'dd-MMM-yyyy');
        let ToDate = new Date();
        if (this.RAISE_INVOICE_ON > ToDate && val == 0) {
          const modalElement = document.getElementById('CheckValidationForInvoiceCreate');
          if (modalElement) {
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
          }
        }else if(val == 1){
          const modalElement = document.getElementById('CheckValidationForInvoiceCreate');
          if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
          }
        }
        this.form.get("PO_NO").setValue(this.SO_Detail_list[0].PO_NO)
        this.form.get("KIND_ATTN").setValue(this.SO_Detail_list[0].KIND_ATTN)
        this.form.get("COMPANY_CODE").setValue(this.SO_Detail_list[0].COMPANY_CODE)
        this.form.get("CUST_CODE").setValue(this.SO_Detail_list[0].CUST_CODE)
        this.form.get("TEMPLATE_CODE").setValue(this.SO_Detail_list[0].TEMPLATE_CODE)
        this.REQUEST_REMARKS = this.SO_Detail_list[0].REQUEST_REMARKS
        this.SO_REMARKS = this.SO_Detail_list[0].SO_REMARKS
        this._invoice_detail[0].SERVICE_CODE = this.SO_Detail_list[0].SERVICE_CODE
        this._invoice_detail[0].DOC_VALUE = this.SO_Detail_list[0].TOTAL_AMOUNT_VALUE.toString();
        this.isViewDocument = true;
        this.GetGSTRate();
        this.filterProject();
        this.spinner = false;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  removeData(data: any): void {
    const index = this._invoice_detail.indexOf(data);
    if (index !== -1) {
      this._invoice_detail.splice(index, 1);
    }
    this.CalculateFinalAmount();
  }

  CloseCheckValidationForInvoiceCreate(){
    this.GetGSTRate();
    this.filterProject(); 
    const modalElement = document.getElementById('CheckValidationForInvoiceCreate');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
    this.f_clearForm();
  }

  ViewDocumentDetails(){
this.ViewDocumentDetailsList = true;
  }

  ViewDocument(file:any){
    if(file.DOCUMENT_TYPE == ".pdf"){
     this.base64Pdf = file.BASE64
     this.openPdfInNewTab();
    }else {
     this.base64Image = file.BASE64
     const imageWindow = window.open();
     if (imageWindow) {
       imageWindow.document.write(
         `<img src="${this.base64Image}" width="100%" height="auto" />`
       );
     }
    }
   }

   openPdfInNewTab(): void {
    const byteCharacters = atob(this.base64Pdf.split(',')[1]); // Decode base64 string
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: 'application/pdf' });

  // Create a Blob URL
  const blobUrl = URL.createObjectURL(blob);

  // Open the Blob URL in a new tab
  const pdfWindow = window.open(blobUrl, '_blank');
  if (!pdfWindow) {
    alert('Failed to open the PDF in a new tab.');
  }
  }

  f_downloadDocument(file: any) {
    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetFile, { DOCUMENT_SYSFILENAME: file.DOCUMENT_SYSFILENAME }).then(res => {
        if (res.flag) {
          const byteString = atob(res.b64);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const int8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
          }
          const data: Blob = new Blob([int8Array]);
          saveAs(data, file.DOCUMENT_FILENAME);
        }
        this.spinner = false;
      })
    }
  }

  }