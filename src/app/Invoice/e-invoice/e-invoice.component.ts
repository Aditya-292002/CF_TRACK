import { Component, OnInit } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { DialogModule } from 'primeng/dialog';
declare var $: any;
@Component({
  selector: 'app-e-invoice',
  templateUrl: './e-invoice.component.html',
  styleUrls: ['./e-invoice.component.css'],
 
})
export class EInvoiceComponent implements OnInit {
  spinner: boolean = false;
  form: FormGroup
  isPending:boolean =false; 
  isQRCODEHideShow:boolean=false;
  isPrintHideShow:boolean=false;
  displayDialog: boolean = false;
  

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    public validationService: ValidationService,
    private pipeService: PipeService,
    public datepipe: DatePipe,
    ) { }
    Bill_ID_Updated = '';
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
      
    })
    // this.GetInvoiceList();
    this.GetE_Invoice("Pending");
      $('.selectpicker').selectpicker('refresh').trigger('change');
  }
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
  templete_list: Array<any> = [];
  Pendinginvoice_list: Array<any> = [];
  Generatedinvoice_list: Array<any> = [];
  invoice_list: Array<any> = [];
  _invoice_detail: Array<any> = [];
  all_invoice_list: Array<any> = [];
  Pending_List:Array<any> = [];
  Generate_QR_Code:Array<any> = [];
  BILLING_NO:Array<any> = [];
  SIGNEDQRCODE:Array<any> = [];
 
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
       // this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate()) 
        // this.f_addRow();
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
  GetE_Invoice(type){
    let useDetail = JSON.parse(sessionStorage.getItem('user_detail'))
    console.log('dfgdrgdf',type)
    console.log(`dfgdrgdf ${type}`)
    let data = {
      LISTTYPE:type==null?"Pending":type,
      FYEAR:useDetail[0].FYEAR
    }
    console.log(data,JSON.parse(sessionStorage.getItem('user_detail')),"billed")
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetE_Invoice, data).then(res => {
      if (res.flag) {
        console.log(res.Pending_List);

        this.Pending_List = res.Pending_List;
        type === 'Pending' ? this.ShowPrintOrQrIcon('P') : this.ShowPrintOrQrIcon('Generated');
        this.GetPendingData1( this.Pending_List);
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else {
        this.Pending_List=res.Pending_List
        type === 'Pending' ? this.ShowPrintOrQrIcon('P') : this.ShowPrintOrQrIcon('Generated');
        this.GetPendingData1( this.Pending_List);
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  GetPendingData1(billed) {
    
// var dif = null;
    this.Pendinginvoice_list = [];
    
    if(billed != null) {
      this.Pendinginvoice_list =billed;
      // console.log(this.Pendinginvoice_list)
    } else {
      this.Pendinginvoice_list = [];
    }
        console.log(this.Pendinginvoice_list)
        this.isPending = true;
        
     
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
    
}

ShowPrintOrQrIcon(billed) {
  if(billed=="P"){
    this.isPending = true;
    this.isQRCODEHideShow=false;
    this.isPrintHideShow=false;
  }
  if(billed=="Generated"){
    this.isPending = false;
    this.isQRCODEHideShow=true;
      this.isPrintHideShow=true;
  }
setTimeout(() => {
  $('.selectpicker').selectpicker('refresh').trigger('change');
}, 100);
}




PrintE_Invoice(p_data){
    let data = {
      BILL_ID:p_data.BILL_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.PrintE_Invoice, data).then(res => {
      
      this.spinner = false;
        console.log(res.data);
        console.log(res.filename);
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
            // this.isPrintHideShow=true;         
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

  GetGenerateQRCode(BILL_ID){
    console.log("BILL_ID")
    let data = {
      
      BILL_ID:BILL_ID
    }
  
    this.spinner = true;
     this.http.PostRequest(this.apiUrl.GetGenerateQRCode, data).then(res => {
      
      if (res.flag) {

       this.Generate_QR_Code = res.Generate_QR_Code
       this.toast.success(res.msg)
       this.GetE_Invoice("Pending");
        setTimeout(() => {
           $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
       this.spinner = false;
      } else {
        this.toast.error(res.msg)
        //this.toast.error("Error While Generateing QR code")
        this.spinner = false;
      } 
     }, err => {
       this.spinner = false;
     });
  }
  GetQRCode(BILL_ID){
    this.GetGenerateQRCode(BILL_ID);
  
  }
  showDialog(BILL_ID) {
    console.log(BILL_ID);
    this.Bill_ID_Updated = BILL_ID;

    this.displayDialog = true;

  }

  hideDialog() {
    this.displayDialog = false;
  }
  generateQRCode() {
    // console.log(this.BILL_ID);
    // if (BILL_ID != null) {
      // console.log('Generating QR Code for BILL_ID:',);
      this.GetQRCode(this.Bill_ID_Updated);
      this.hideDialog();

    } 
    // else {
    //   console.error('BILL_ID is not set.');
    // }
    DownloadInvoice(BILL_ID){
      console.log("BILL_ID")
      let data = {
        
        BILL_ID:BILL_ID
      }
    
      this.spinner = true;
      
     this.http.PostRequest(this.apiUrl.GETJSONFILE, data).then(res => {
      this.spinner = false;
      const blob = new Blob([JSON.stringify(res)], {type : 'application/json'});
      saveAs(blob, BILL_ID+'.json');
      
    });
  }
}
    

  


 
  




