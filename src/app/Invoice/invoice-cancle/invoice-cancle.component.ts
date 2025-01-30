import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

declare var $: any;

@Component({
  selector: 'app-invoice-cancle',
  templateUrl: './invoice-cancle.component.html',
  styleUrls: ['./invoice-cancle.component.css']
})


export class InvoiceCancleComponent implements OnInit {
  isViewInvoiceCancle:boolean = false;
  InvoiceCancleList:any = [];
  ADD_RIGHTS:boolean = false;
  spinner: boolean = false;
  COMPANY_CODE:any;
  LOCATION_CODE:any;
  STATE_CODE:any;
  REQ_ID:any;
  DOCTYPE_CODE:any;
  BILLING_NO:any;
  BILLING_DATE:any = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  DUE_DATE:any = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  CUST_CODE:any;
  PROJ_CODE:any;
  TEMPLATE_CODE:any;
  PO_NO:any;
  PO_DATE:any = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  KIND_ATTN:any;
  CURRENCY_CODE:any;
  EXCHANGE_RATE:any;
  DOC_VALUE:any;
  SGST_VALUE:any;
  CGST_VALUE:any;
  IGST_VALUE:any;
  ROUNDOFF_VALUE:any;
  BILL_VALUE:any;
  BASE_VALUE:any;
  Credit_Note_List:any = [];
  _invoice_detail:any = [{
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
  }];
  company_list:any = [];
  invoice_type_list:any = [];
  fyear_list:any = [];
  location_list:any = [];
  _location_list:any = [];
  customer_list:any = [];
  project_list:any = [];
  _project_list:any = [];
  currency_list:any = [];
  state_list:any = [];
  service_list:any = [];
  templete_list:any = [];
  invoice_list:any = [];
  userData:any = {};
  FYEAR:any;
  min_date:any = new Date();
  maxdate:any = new Date();
  BILL_ID:any;
  REMARKS:any;
  invoice_header:any = [];
  isModalOpen:boolean = false;
  CUST_NAME:any;
  CREDIT_NOTE_DATE:any = new Date();
  Min_Credit_Note_Date:any = new Date();

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    public validationService: ValidationService,
    private pipeService: PipeService,
    public datepipe: DatePipe) { }


  ngOnInit() {
    this.sharedService.formName = "Credit Note ";
    setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  },210);
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.FYEAR =  this.userData[0].FYEAR;
    this.GetInvoiceCommonList();
    this.GetInvoiceList();
    this.GetCreditNoteList();
  }

  GetCreditNoteList(){
    let data = {
      FYEAR: this.FYEAR
    }
    // console.log(data)
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetCreditNoteList, data).then(res => {
      if (res.flag) {
        this.Credit_Note_List = res.Credit_Note_List;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
   this.isViewInvoiceCancle = false;
   this.ClearForm();
      } else {
        this.spinner = false;
   this.isViewInvoiceCancle = false;
      }
    });
  }

  GetInvoiceList(){
    let data = {
      LISTTYPE:"pendingforinvoice"
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
    });
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
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    })
  }

  FormValidation(){
    if(!this.sharedService.isValid(this.CREDIT_NOTE_DATE)){
      this.toast.error("Select a Credit note date");
      return
  }
   if(!this.sharedService.isValid(this.REMARKS)){
        this.toast.error("Enter a Credit Note Remarks");
        this.isModalOpen = false;
        return
    }
    if (this.REMARKS.trim().length === 0) {
      this.toast.error("Enter a Remarks");
      this.isModalOpen = false;
      return  
    }
    if(this.REMARKS.length > 0){
      this.isModalOpen = true;
    }
  }

  SaveCreditNote(){
   let data = {
    "BILL_ID": this.BILL_ID,
    "CREDIT_NOTE_DATE": this.datepipe.transform(this.CREDIT_NOTE_DATE, 'dd-MMM-yyyy') ,
    "REMARKS": this.REMARKS,
   }
   this.spinner = true;
   console.log('data ->' , data)
   this.http.PostRequest(this.apiUrl.SaveCreditNote, data).then(res => {
    if (res.flag) {
      this.toast.success(res.msg)
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    this.isViewInvoiceCancle = false;
    } else {
      this.toast.warning(res.msg)
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    }
   });
  }

  CancleCreditNote(data:any){
    this.isViewInvoiceCancle = true;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    },210);
    this.BILL_ID = data.BILL_ID;
    this.Min_Credit_Note_Date = new Date(data.BILLING_DATE);
    this.GetInvoiceList();
    this.GetEditInvoiceDetail();
    // console.log('data ->' , data)
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
        // console.log('invoice_header -> ' , this.invoice_header)
        // console.log('_invoice_detail -> ' , this._invoice_detail)
        this.STATE_CODE = this.invoice_header[0].LOCATION_CODE;
        this.REQ_ID = this.invoice_header[0].REQ_ID;
        this.DOCTYPE_CODE = this.invoice_header[0].DOCTYPE_CODE;
        this.BILLING_NO = this.invoice_header[0].BILLING_NO;
        this.BILLING_DATE = this.datepipe.transform(new Date(this.invoice_header[0].BILLING_DATE), 'dd-MMM-yyyy'); 
        this.DUE_DATE = this.datepipe.transform(new Date(this.invoice_header[0].DUE_DATE), 'dd-MMM-yyyy'); 
        this.PROJ_CODE = this.invoice_header[0].PROJ_CODE;
        this.TEMPLATE_CODE = this.invoice_header[0].TEMPLATE_CODE;
        this.PO_NO = this.invoice_header[0].PO_NO;
        this.PO_DATE = this.datepipe.transform(new Date(this.invoice_header[0].PO_DATE), 'dd-MMM-yyyy'); 
        this.KIND_ATTN = this.invoice_header[0].KIND_ATTN;
        this.CURRENCY_CODE = this.invoice_header[0].CURRENCY_CODE;
        this.EXCHANGE_RATE = this.invoice_header[0].EXCHANGE_RATE;
        this.DOC_VALUE = this.invoice_header[0].DOC_VALUE;
        this.SGST_VALUE = this.invoice_header[0].SGST_VALUE;
        this.CGST_VALUE = this.invoice_header[0].CGST_VALUE;
        this.IGST_VALUE = this.invoice_header[0].IGST_VALUE;
        this.ROUNDOFF_VALUE = this.invoice_header[0].ROUNDOFF;
        this.BILL_VALUE = this.invoice_header[0].BILL_VALUE;
        this.BASE_VALUE = this.invoice_header[0].BASE_VALUE;
        let FYEAR = this.invoice_header[0].FYEAR;
        this.fyear_list.forEach((element:any)=>{
          if(element.FYEAR == FYEAR){
             this.FYEAR = element.FYEAR;
          }
        })
        let CUST_CODE = this.invoice_header[0].CUST_CODE;
        this.customer_list.forEach((element:any)=>{
          if(element.CUST_CODE == CUST_CODE){
             this.CUST_CODE = element.CUST_CODE;
             this.CUST_NAME = element.CUST_NAME;
            //  console.log('CUST_CODE ->' , this.CUST_CODE)
            //  console.log('CUST_NAME ->' , element.CUST_NAME)
          }
        })
        let STATE_CODE = this.invoice_header[0].STATE_CODE;
        this.state_list.forEach((element:any)=>{
          if(element.STATE_CODE == STATE_CODE){
             this.STATE_CODE = element.STATE_CODE;
          }
        })
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
    this.costInput();

  }

  backToForm(){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.isViewInvoiceCancle = true;
    this.ClearForm();
  }

  ClearForm(){
   this.COMPANY_CODE = '';
   this.LOCATION_CODE = '';
   this.STATE_CODE = '';
   this.REQ_ID = '';
   this.DOCTYPE_CODE = '';
   this.BILLING_NO = '';
   this.FYEAR = '';
   this.BILLING_DATE = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
   this.DUE_DATE = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
   this.CUST_CODE = '';
   this.PROJ_CODE = '';
   this.PO_NO = '';
   this.TEMPLATE_CODE = '';
   this.PO_DATE = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
   this.CURRENCY_CODE = '';
   this.EXCHANGE_RATE = '';
   this.DOC_VALUE = '';
   this.CGST_VALUE = '';
   this.IGST_VALUE = '';
   this.ROUNDOFF_VALUE = '';
   this.BILL_VALUE = '';
   this.BASE_VALUE = '';
   this.REMARKS = '';
  }

  costInput(){

  }

}
