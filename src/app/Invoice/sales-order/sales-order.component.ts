import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { element } from 'protractor';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';
declare var $: any;

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
  
})
export class SalesOrderComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  data: { DOC_VALUE: string, TOTAL_AMOUNT_VALUE: string } = { DOC_VALUE: '', TOTAL_AMOUNT_VALUE: '' };
  editing: boolean = false;
  selectedStatus: string = 'pending';
  isEditing: boolean = false;
  spinner: boolean = false;
  isViewSO: boolean = false;
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;
  isSubmited: boolean = false;
  isPending: boolean = false;
  form: FormGroup;
  SelectedFileName: string = "";
  NoDocs: number = 0;
  SO_DATE: any = new Date();
  DUE_DATE: any = '';
  PO_DATE: any = new Date();
  RAISE_INVOICE_ON: any = new Date();
  maxdate = new Date();
  today_date = new Date();
  today_date_s: any;
  min_date = new Date(new Date().getFullYear(), 0, 1);
  INVOICE_ID: string = '';
  cost: any = '';
  credit_days: number = 0;
  _selected_index: number = null;
  _selected_service_code: string = "";
  _DATE: any = '';
  FINAL_BASE_VALUE_2: number;
  invoice_detail: Array<any> = [];
  uploadingFiles: Array<any> = [];
  uploadedDocument: Array<any> = [];
  SO_list: Array<any> = [];
  PendingSO_list: Array<any> = [];
  company_list: Array<any> = [];
  fyear_list: Array<any> = [];
  invoice_type_list: Array<any> = [];
  location_list: Array<any> = [];
  customer_list: Array<any> = [];
  project_list: Array<any> = [];
  currency_list: Array<any> = [];
  _location_list: Array<any> = [];
  _project_list: Array<any> = [];
  state_list: Array<any> = [];
  service_list: Array<any> = [];
  templete_list: Array<any> = [];
  _invoice_detail: Array<any> = []; // change  Array<any> to any
  all_invoice_list: Array<any> = [];
  invoice_list: Array<any> = [];
  maxDate = new Date(new Date().getFullYear() + 1, 11, 31);
  SO_REMARKS: any;
  REMARKS: any;
  minDate: any = new Date()
  INVOICE_DETAIL_TOTAL: any = 0;
  MILESTONES_DETAIL_TOTAL: any = 0;
  TOT_VALUE: any;
  SO_VALUE: any = 0;
  DOC_VALUE: any = 0;
  SO_MILESTONE_T: Array<any> = [{
    EXPECTED_DATE: this.minDate,
    REMARKS: "",
    DOC_VALUE: 0,
    Active: 1,
    BASE_VALUE:0,
    IS_CLOSED: false,
    MILESTONE_SRNO: 1,
  }
  ];
  TOTAL_AMOUNT_VALUE: any = 0;
  TOTAL_COST_VALUE: any = 0;
  status_list:any = [ {SO_STATUS: "PENDING" ,STATUS_NAME: "PENDING" },
    {SO_STATUS: "CLOSE" ,STATUS_NAME: "CLOSE" }
   ]
   isExchangeRate:boolean = true;
   COMPANY_CURRENCY:any;
   IS_UPDATE:any = 0;
   leadMaster_type_list:any = [];
   Account_manager_list:any = [];
   proj_type_list:any = [];
  approveSOFlag: boolean;
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
    this.sharedService.formName = "Sales Order"

    this.form = this.formBuilder.group({
      SO_ID: 0,
      LOCATION_STATE: ["", Validators.required],
      STATE_CODE: ["", Validators.required],
      COMPANY_CODE: ["", Validators.required],
      LOCATION_CODE: ["", Validators.required],
      FYEAR: ["", Validators.required],
      DOCTYPE_CODE: ["", Validators.required],
      SERVICE_CODE: ["", Validators.required],
      SO_NO: "",
      SO_DATE: ["", Validators.required],
      DUE_DATE: ["", Validators.required],
      CUST_CODE: ["", Validators.required],
      PROJ_CODE: ["", Validators.required],
      PO_NO: ["", Validators.required],
      PO_DATE: ["", Validators.required],
      KIND_ATTN: "",
      RAISE_INVOICE_ON: ["", Validators.required],
      CURRENCY_CODE: ["INR", Validators.required],
      EXCHANGE_RATE: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      DOC_VALUE: 0,
      BASE_VALUE: 0,
      SGST_VALUE: 0,
      CGST_VALUE: 0,
      IGST_VALUE: 0,
      ROUNDOFF_VALUE: 0,
      SO_VALUE: 0,
      RCVD_VALUE: 0,
      CANCEL_IND: "",
      TEMPLATE_CODE: ["", Validators.required],
      LEAD_PARTNER_CODE: [""],
      PROJECT_TYPE: [""],
      ACCOUNT_MGR: [""],
      BILL_IND: "",
      SO_STATUS: ["PENDING", Validators.required],
      BILLED_VALUE: 0,
      BILL_VALUE: 0,
      SO_REMARKS: ['', Validators.required],
      DOCUMENT_FILENAME: ["", Validators.required],
    })
      $('.selectpicker').selectpicker('refresh').trigger('change');
    this.minDate = new Date();

  }

  ngAfterViewInit() {
    this.spinner = true;
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS ? false : true;

      if (this.sharedService.loginUser[0].FYEAR == undefined) {
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []
      }
      setTimeout(() => {
        this.form.get('FYEAR').setValue(+this.sharedService.loginUser[0].FYEAR);
        this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
        this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
        this.form.get('DOCTYPE_CODE').setValue(this.sharedService.loginUser[0].DOCTYPE_CODE);
        this.COMPANY_CURRENCY = this.sharedService.loginUser[0].COMPANY_CURRENCY;
        this.form.get('SO_STATUS').setValue("PENDING");
        this.filterLocations();
        this.SelectState();
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 210);
      this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
      if (this.today_date_s > this.sharedService.loginUser[0].TO_DATE) {
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.sharedService.loginUser[0].TO_DATE;
      }
      else {
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.today_date;
      }
      this.GetInvoiceList();
      this.GetSOCommonList();
      this.GetSOList();
    }, 150)
    this.spinner = false;
  }

  GetSOCommonList() {
    this.spinner = true;
    // let data = {
    //   LISTTYPE: "all"

    // }
    this.http.PostRequest(this.apiUrl.GetSOCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.fyear_list = res.fyear_list;
        this.invoice_type_list = res.invoice_type_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.customer_list = res.customer_list;
        // this.project_list = res.project_list;
        // this._project_list = res.project_list;
        this.currency_list = res.currency_list;
        this.state_list = res.state_list;
        this.service_list = res.service_list;
        this.templete_list = res.templete_list;
        this.Account_manager_list= res.acc_manager_list;
        this.leadMaster_type_list=res.lead_partener_list;
        this.proj_type_list=res.project_type_list;
        // console.log( this.invoice_type_list , this.currency_list," this.invoice_type_list ")
        //this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR)
        this.form.get('EXCHANGE_RATE').setValue(1);
        this.form.get('TEMPLATE_CODE').setValue("LOCAL");
        this.form.get('DOCTYPE_CODE').setValue("SLL");
        this.form.get('DOC_VALUE').setValue(0);
        this.form.get('SO_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('RAISE_INVOICE_ON').setValue(this.sharedService.getTodayDate())
        if(this.form.controls['CURRENCY_CODE'].value == this.COMPANY_CURRENCY){
          this.isExchangeRate = true;
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

  GetInvoiceList() {
    let data = {
      LISTTYPE: "pendingforinvoice"
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

  filterLocations() {
    if (this.form.getRawValue().COMPANY_CODE != "" && this.form.getRawValue().COMPANY_CODE != null) {
      this._location_list = [];
      this.location_list.forEach(element => {
        if (Number(element.COMPANY_CODE) == Number(this.form.getRawValue().COMPANY_CODE)) {
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

  SelectState() {
    if (this.form.getRawValue().LOCATION_CODE != "" && this.form.getRawValue().LOCATION_CODE != null) {

      this.location_list.forEach(element => {
        if (Number(element.LOCATION_CODE) == Number(this.form.getRawValue().LOCATION_CODE)) {
          // console.log(element.LOCATION_STATE);
          this.form.get('LOCATION_STATE').setValue(element.LOCATION_STATE + "");
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
        }
      });
    }
  }

  GetSoProjectList(code:any){
   let data = {
    CUST_CODE: code
   }
   this.spinner = true;
  //  console.log('data ->' , data)
  this._project_list = [];
  this.project_list = [];
   this.http.PostRequest(this.apiUrl.GetSoProjectList, data).then((res:any) => {
    if (res.flag) {
      // console.log('res ->' , res )
         this._project_list = res.PROJECT_LIST;
         this.project_list = this._project_list;
         this.filterProject();
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
         this.spinner = false;
  } else {
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.spinner = false;
  } 
  });
}

  filterProject() {
     this._project_list = [];
     this.project_list.forEach((element:any)=>{
      if(element.CUST_CODE == this.form.controls['CUST_CODE'].value){
        this._project_list.push(element);
      }
     })
     this.customer_list.forEach((element:any) => {
      if(element.CUST_CODE == this.form.controls['CUST_CODE'].value){
          this.form.get('KIND_ATTN').setValue(element.CUST_KINDATTN);
          this.form.get('CURRENCY_CODE').setValue(element.CUST_CURRENCY);
          if (element.CUST_CURRENCY == "INR") {
              this.form.get('EXCHANGE_RATE').setValue(1);
              // document.getElementById('EXCHANGE_RATE').setAttribute("disabled", "true");
              this.isExchangeRate = true;
            }
            else {
              // document.getElementById('EXCHANGE_RATE').removeAttribute("disabled")
              this.isExchangeRate = false;
            }
      }
     })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  SaveSalesOrder() {
    let _documents = [];
    for (let i = 0; i < this.uploadedDocument.length; i++) {
      if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
        _documents.push({
          DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
          DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
          UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
          UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
          ACTIVE: this.uploadedDocument[i].ACTIVE,
          ISNEW: this.uploadedDocument[i].ISNEW
        })
      }
    }
    this.isSubmited = true;
    if (this.form.controls['CUST_CODE'].invalid) {
      this.toast.error('Please select company');
      return;
    }
    if (this.form.controls['PROJ_CODE'].invalid) {
      this.toast.error('Please select project');
      return;
    }
    if (this.form.controls['DOCTYPE_CODE'].invalid) {
      this.toast.error('Please select so type');
      return;
    }
    if (this.form.controls['SERVICE_CODE'].invalid) {
      this.toast.error('Please select service');
      return;
    }
    if (this.form.controls['KIND_ATTN'].invalid) {
      this.toast.error('Enter a Kind Attention');
      return;
    }
    
    if (this.form.controls['SO_STATUS'].invalid) {
      this.toast.error('Please enter status');
      return;
    }
    if (this.form.controls['CURRENCY_CODE'].invalid) {
      this.toast.error('Please select currency ');
      return;
    }
    if (this.form.controls['SO_REMARKS'].invalid) {
      this.toast.error('Please enter remarks ');
      return;
    }
        if (this.form.controls['ACCOUNT_MGR'].invalid) {
      this.toast.error('Please Select Account Manager ');
      return;
    }
      if (this.form.controls['LEAD_PARTNER_CODE'].invalid) {
      this.toast.error('Please Select Lead Partner ');
      return;
    }
    for (const element of this.SO_MILESTONE_T) {
      if (element.DOC_VALUE == 0 ) {
        this.toast.error('Enter a Amount Value');
        return false;
      }
    }
          if (this.uploadedDocument.length==0) {
        this.toast.error('Please Select a Document');
        return false;
      }
    // if (this.uploadedDocument.length == 0) {
    //   this.toast.error('Please attach a Documnet ');
    //   return;
    // }
      if (this.form.controls['ACCOUNT_MGR'].invalid) {
        this.toast.error('Please Select a account manager ');
        return ;
      }
            if (this.form.controls['PROJECT_TYPE'].invalid) {
        this.toast.error('Please Select a project type ');
        return ;
      }
    this.SO_MILESTONE_T.forEach((element:any)=>{
      element.DOC_VALUE = +(this.currencyPipe.parse(element.DOC_VALUE));
    })

      let data = {
        SO_Header: this.form.value,
        // SO_T: this._invoice_detail,
        SO_MILESTONE_T: this.SO_MILESTONE_T,
        IS_UPDATE: this.IS_UPDATE,
        SO_DOCUMENT_LIST: this.uploadedDocument,
        TOTAL_AMOUNT_VALUE: +(this.TOTAL_AMOUNT_VALUE)
      }
       console.log('data ->' , data)
       return
      this.http.PostRequest(this.apiUrl.SaveSoDetails, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.isSubmited = false;
          this.f_uploadFiles(this.uploadedDocument)
          this.f_clearForm();
          this.viewSOList();
          this.isViewSO = true;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.spinner = false;
        } else {
          this.toast.warning(res.msg)
          this.viewSOList();
          this.isViewSO = true;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      });
  }

  f_clearForm() {
    this.isSubmited = false;
    this.INVOICE_ID = '';
    this.form.reset(); // --> Comment by Gauresh
    this.uploadedDocument = [];
    this.DOC_VALUE = 0,
      this.TOTAL_AMOUNT_VALUE = 0,
      this.SO_REMARKS = "",
      this.invoice_detail = [];
    this.SO_DATE = '';
    this.DUE_DATE = '';
    this.PO_DATE = '';
    this._invoice_detail = [];
    this.project_list = [];
    this.invoice_type_list = [];
    this.SO_MILESTONE_T = [{
      EXPECTED_DATE: this.minDate,
      REMARKS: "",
      DOC_VALUE: 0,
      Active: 1,
      IS_CLOSED: false,
      BASE_VALUE:0,
      MILESTONE_SRNO: 1,
    }
    ];
    // this.fileInput.nativeElement.value = " ";
    this.form.get('EXCHANGE_RATE').setValue(1);
    this.form.get('TEMPLATE_CODE').setValue("LOCAL");
    //this.form.get('FYEAR').setValue(this.fyear_list[0].FYEAR);
    this.form.get('SO_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('RAISE_INVOICE_ON').setValue(this.sharedService.getTodayDate())
    if (this.sharedService.loginUser[0].FYEAR == undefined) {
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []

    }
    this.form.get('SO_STATUS').setValue("PENDING");
    this.form.get('CURRENCY_CODE').setValue("INR");
    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    this.filterLocations();
    this.SelectState();
    this.GetInvoiceList(); 
    this.GetSOCommonList();
    this._DATE = "";
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 210);
  }

  viewSOList() {
    // console.log('so list ')
    this.GetSOList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }

  GetSOList() {
    let data = {
      LISTTYPE: "ALL",
      USERID: this.sharedService.loginUser[0].USERID,
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetSOList, data).then(res => {
      if (res.flag) {
        // console.log(res)
        this.SO_list = res.SO_list;
        this.GetPendingData('All');
        this.isViewSO = true;
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

  GetSelectCurrency(code:any){
    // console.log('code ->' , code)
    // console.log('COMPANY_CURRENCY ->' , this.COMPANY_CURRENCY)
    if( this.COMPANY_CURRENCY == code){
      this.isExchangeRate = true;
      this.form.get('EXCHANGE_RATE').setValue(1);
      this.updateTotalAmount();
    }else {
      this.isExchangeRate = false;
    }
    // console.log('isExchangeRate ->' , this.isExchangeRate)
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  backToForm() {
    this.editing = false;
    this.IS_UPDATE = 0;
    this.approveSOFlag = true;
    this.isViewSO = !this.isViewSO;
    this.f_clearForm();
    if (this.form.get('CURRENCY_CODE').value == "INR") {
      this.form.get('EXCHANGE_RATE').setValue(1);
      this.isExchangeRate = true;
      // document.getElementById('EXCHANGE_RATE').setAttribute("disabled", "true");
    }
    else {
      this.isExchangeRate = false;
      // document.getElementById('EXCHANGE_RATE').removeAttribute("disabled")
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  PrintInvoice(p_data:any) {
    let data = {
      BILL_ID: p_data.BILL_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.PrintInvoice, data).then(res => {
      this.spinner = false;
      console.log(res.data);
      console.log(res.filename);
      if (res.data != "") {
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

  editInvoice(data:any) {
    this.IS_UPDATE = 1;
    this.approveSOFlag=false;
    this.GetSODetail(data.SO_ID)
    this.editing = true;
  }

  GetSODetail(SO_ID:any) {
    this.TOTAL_AMOUNT_VALUE = 0;
    let data = {
      SO_ID: SO_ID
    }
    // this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetSODetail, data).then(res => {
      if (res.flag == 1) {
        this.SO_list = res.SO_list;
        this._invoice_detail = res.SO_Details_list;
        this.SO_MILESTONE_T = res.SO_Milestone_list;
        this.uploadedDocument = res.SO_Document_list;
        this.SO_MILESTONE_T.forEach((element:any)=>{
          element.EXPECTED_DATE = new Date(element.EXPECTED_DATE);  
          element.DOC_VALUE = this.currencyPipe.transform(element.DOC_VALUE);
        })
        this.TOTAL_AMOUNT_VALUE = this.SO_list[0].TOTAL_AMOUNT_VALUE;
        this.f_fillFormData();
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

  f_fillFormData() {
    this.isViewSO = false
    // this.spinner = true;
     this.approveSOFlag = this.SO_list[0].IS_APPROVED;
    this.form.get("SO_ID").setValue(this.SO_list[0].SO_ID)
    this.form.get("SO_NO").setValue(this.SO_list[0].SO_NO)
    this.filterLocations();
    // this.form.get("REQ_ID").setValue(this.SO_list[0].REQ_ID)
    this.form.get("LOCATION_STATE").setValue(this.SO_list[0].LOCATION_STATE)
    this.form.get("STATE_CODE").setValue(this.SO_list[0].STATE_CODE)
    // this.showContent(this.SO_list[0].PAY_TO);
    this.form.get("COMPANY_CODE").setValue(this.SO_list[0].COMPANY_CODE)
    this.form.get("LOCATION_CODE").setValue(this.SO_list[0].LOCATION_CODE)
    this.form.get("FYEAR").setValue(this.SO_list[0].FYEAR)
    this.form.get("DOCTYPE_CODE").setValue(this.SO_list[0].DOCTYPE_CODE)
    // this.form.get("SEGMENT_CODE").setValue(this.SO_list[0].SEGMENT_CODE)
    this.form.get("SO_NO").setValue(this.SO_list[0].SO_NO)
    this.form.get("CUST_CODE").setValue(this.SO_list[0].CUST_CODE)
    // this.form.get("RAISE_INVOICE_ON").setValue( this.datepipe.transform(this.SO_list[0].RAISE_INVOICE_ON))
    this.RAISE_INVOICE_ON = new Date(this.SO_list[0].RAISE_INVOICE_ON)
    this.form.get("PO_NO").setValue(this.SO_list[0].PO_NO)
    this.form.get("KIND_ATTN").setValue(this.SO_list[0].KIND_ATTN)
    this.form.get("CURRENCY_CODE").setValue(this.SO_list[0].CURRENCY_CODE)
    this.form.get("EXCHANGE_RATE").setValue(this.SO_list[0].EXCHANGE_RATE)
    this.form.get("DOC_VALUE").setValue(this.SO_list[0].DOC_VALUE)
    this.form.get("BASE_VALUE").setValue(this.SO_list[0].BASE_VALUE)
    this.form.get("SGST_VALUE").setValue(this.SO_list[0].SGST_VALUE)
    this.form.get("CGST_VALUE").setValue(this.SO_list[0].CGST_VALUE)
    this.form.get("IGST_VALUE").setValue(this.SO_list[0].IGST_VALUE)
    this.form.get("ROUNDOFF_VALUE").setValue(this.SO_list[0].ROUNDOFF_VALUE)
    this.form.get("SO_VALUE").setValue(this.SO_list[0].SO_VALUE)
    this.form.get("RCVD_VALUE").setValue(this.SO_list[0].RCVD_VALUE)
    this.form.get("CANCEL_IND").setValue(this.SO_list[0].CANCEL_IND)
    this.form.get("TEMPLATE_CODE").setValue(this.SO_list[0].TEMPLATE_CODE)
    this.form.get("BILL_IND").setValue(this.SO_list[0].BILL_IND)

    // this.form.get("COST").setValue(this.SO_list[0].COST)

    //this.form.get("TOT_VALUE").setValue(this.SO_list[0].TOTAL_AMOUNT_VALUE)
    this.form.get("BILLED_VALUE").setValue(this.SO_list[0].BILLED_VALUE)
    this.SelectState();
    this.GetSoProjectList(this.form.controls['CUST_CODE'].value);
    this.form.get("PROJ_CODE").setValue(this.SO_list[0].PROJ_CODE)
    setTimeout(() => {
    this.form.get("SERVICE_CODE").setValue(this.SO_list[0].SERVICE_CODE)
    this.form.get("COMPANY_CODE").setValue(this.SO_list[0].COMPANY_CODE)
      //         this.GetProjectList();
    this.form.get("CUST_CODE").setValue(this.SO_list[0].CUST_CODE)
    this.form.get("DOCTYPE_CODE").setValue(this.SO_list[0].DOCTYPE_CODE)
    this.form.get("SO_STATUS").setValue(this.SO_list[0].SO_STATUS)
      this.form.get("LOCATION_CODE").setValue(Number(this.SO_list[0].LOCATION_CODE))
    this.form.get("PROJ_CODE").setValue(this.SO_list[0].PROJ_CODE)
    this.form.get("SO_REMARKS").setValue(this.SO_list[0].SO_REMARKS)
    // this.form.get("TDS_CODE").setValue(this.SO_list[0].TDS_CODE)
    this.form.get("SO_DATE").setValue(this.datepipe.transform(this.SO_list[0].SO_DATE, 'dd-MMM-yyyy'))
    this.form.get("PO_DATE").setValue(this.datepipe.transform(this.SO_list[0].PO_DATE, 'dd-MMM-yyyy'))

     this.form.get("LEAD_PARTNER_CODE").setValue((this.SO_list[0].LEAD_PARTNER_CODE))
    this.form.get("PROJECT_TYPE").setValue(this.SO_list[0].PROJECT_TYPE)
    this.form.get("ACCOUNT_MGR").setValue(this.SO_list[0].ACCOUNT_MGR)
      // this.showContent();
      // this.form.get("VENDOR_NO").setValue(this.SO_list[0].VENDOR_NO)
      // this.form.get("EMP_NO").setValue(this.SO_list[0].EMP_NO)
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.spinner = false;
  }

  //isViewSO:boolean = false;
  InvoiceList() {
    this.isViewSO = !this.isViewSO;
    this.GetInvoiceList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  selectDocument(event: any) {
    const file = event.target.files[0];
    const extension1 = event.target.files[0].name.split(".");
    let ext1 = extension1[extension1.length - 1].toUpperCase();
    if (file) {
      // 1 MB = 1048576 bytes
      const maxFileSize = 1048576;
      if (file.size > maxFileSize) {
        this.toast.warning('Upload your expense' + ' ' + ext1 + ' ' + 'file size less than 1MB');
        return
      } 
    }
  if(this.uploadedDocument.length > 4){
    this.toast.warning('Upload your expense images & pdf valid only five');
    return
  }
  
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];

    for (let i = 0; i < event.target.files.length; i++) {
      extension = event.target.files[i].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase()
   
      if(_ext === 'BAT' || _ext === 'GIF' || _ext === 'JAVA' || _ext === 'XML' || _ext === 'ZIP' 
      || _ext === 'RAR' || _ext === 'JAR' || _ext === 'EXE' || _ext === 'DOCS' || _ext === 'XLSX' || _ext === 'TEXT ' ){
        this.toast.warning("Please select valid document PDF & Image.)")
        return;
      } 
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        extension = event.target.files[i].name.split(".");
        this.uploadingFiles.push(
          {
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_TYPE: '.' + extension[extension.length - 1],
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            DOC_SRNO: this.uploadedDocument.length + 1,
            BASE64: b64
          }
        )
        this.uploadDoc();
      }
    }
  }

  uploadDoc() {
    // console.log("Number of files being uploaded:", this.uploadingFiles.length);

    for (let i = 0; i < this.uploadingFiles.length; i++) {
      this.uploadedDocument.push(this.uploadingFiles[i])
    }

    this.fileInput.nativeElement.value = "";
    this.uploadingFiles = [];

    this.SelectedFileName = "";
    this.NoDocs = 0;

    this.uploadedDocument.forEach(element => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1
      }
    });
    // console.log("Number of documents in uploadedDocument array:", this.uploadedDocument.length);
  }

  f_downloadDocument(file: any) {
    // console.log('file ->' , file)
    // console.log('file.DOCUMENT_NAME ->' , file.DOCUMENT_NAME)
    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetSalesOrderFile, { DOCUMENT_NAME: file.DOCUMENT_NAME }).then(res => {

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

  removeDoc(file: any) {
    // console.log('file ->' , file)
    this.uploadedDocument.forEach((element:any)=>{
      if(file.DOC_SRNO == element.DOC_SRNO){
        this.uploadedDocument.splice(element,1)
      }
    })
    // console.log('uploadedDocument ->' , this.uploadedDocument)
  }

  f_addmilestone() {
    // console.log(this.SO_MILESTONE_T)
    this.SO_MILESTONE_T.push({
      EXPECTED_DATE: this.minDate,
      REMARKS: "",
      DOC_VALUE: 0,
      BASE_VALUE:0,
      MILESTONE_SRNO: this.SO_MILESTONE_T.length + 1,
      IS_CLOSED: false
    })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }

  removeData(data: any): void {
    const index = this.SO_MILESTONE_T.indexOf(data);
    if (index !== -1) {
      this.SO_MILESTONE_T.splice(index, 1);
    }
    this.updateTotalAmount();
  }

  f_uploadFiles(fileArray: Array<any> = []) {
    let _documents: Array<any> = [];
    for (let i = 0; i < fileArray.length; i++) {
      if (fileArray[i].ISNEW == 1) {
        _documents.push({
          DOCUMENT_FILENAME: fileArray[i].DOCUMENT_FILENAME,
          DOCUMENT_SYSFILENAME: fileArray[i].DOCUMENT_SYSFILENAME,
          ACTIVE: fileArray[i].ACTIVE,
          ISNEW: fileArray[i].ISNEW,
          b64: fileArray[i].b64
        })
      }
    }
    let _profile: Array<any> = [];
    let isFileSave: boolean = false
    isFileSave = _documents.length > 0 ? true : false;

    if (isFileSave)
      this.http.uploadFiles(this.apiUrl.SaveFile, { filedata: _documents, profiledata: _profile });


  }

  GetPendingData(type:any) {
    this.PendingSO_list = [];
    if (type == 'P') {
     this.SO_list.forEach((element:any)=>{
      if(element.SO_STATUS == type){
         this.PendingSO_list.push(element)
      }
     })
    } else if(type == 'All'){
      this.PendingSO_list = this.SO_list;
      this.isPending = false;
    }
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  updateTotalAmount() {
    this.TOTAL_AMOUNT_VALUE = 0;
    this.SO_MILESTONE_T.forEach((element:any)=>{
      element.BASE_VALUE = Math.round((+this.currencyPipe.parse(element.DOC_VALUE)) *  this.form.controls['EXCHANGE_RATE'].value) 
      this.TOTAL_AMOUNT_VALUE += (element.BASE_VALUE);
    })
    this.TOTAL_AMOUNT_VALUE= this.TOTAL_AMOUNT_VALUE;
  }

approveSo(){
      let data = {
      "SO_ID": this.form.get("SO_ID").value,
      "USER_ID": this.sharedService.loginUser[0].USERID
    }
    this.approveSOFlag=false
        this.http.PostRequest(this.apiUrl.ApproveSOForInvoiceList, data).then(res => {
      if (res.flag == 1) {
          this.approveSOFlag=true
          this.toast.success(res.msg);
        this.spinner = false;
      } else {

        this.spinner = false;
      }
    }, err => {
      this.toast.success("cant approve so");
      this.spinner = false;
    });
   // this.toast.success('Sales Order Approved Successfully');
}
}




