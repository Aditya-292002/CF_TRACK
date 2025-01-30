import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { element } from 'protractor';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ValidationService } from 'src/app/services/validation.service';
import { PipeService } from 'src/app/services/pipe.service';
import * as moment from 'moment';


declare var $: any;

@Component({
  selector: 'app-sales-order-release',
  templateUrl: './sales-order-release.component.html',
  styleUrls: ['./sales-order-release.component.css']
})
export class SalesOrderReleaseComponent implements OnInit {
 @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
 @ViewChild('canvas', { static: false }) canvasRef: ElementRef;
  data: { DOC_VALUE: string, TOTAL_AMOUNT_VALUE: string } = { DOC_VALUE: '', TOTAL_AMOUNT_VALUE: '' };
  editing: boolean = false;
  selectedStatus: string = 'pending';
  isEditing: boolean = false;
  spinner: boolean = false;
  isViewSO: boolean = true;
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
  SO_Release_list: Array<any> = [];
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
  all_invoice_list: Array<any> = [];
  maxDate = new Date(new Date().getFullYear() + 1, 11, 31);
  SO_REMARKS: any;
  REMARKS: any;
  minDate: any = new Date();
  RAISE_INVOICE_ON: any;
  INVOICE_DETAIL_TOTAL: any = 0;
  TOT_VALUE: any;
  DOC_VALUE: 0;
  SO_MILESTONE_T: Array<any> = [{
    EXPECTED_DATE: this.minDate,
    REMARKS: "",
    DOC_VALUE: "0",
    BILLED_VALUE: "0",
    TOT_VALUE: "0",
    TOTAL_AMOUNT_VALUE: "0", 
    MILESTONE_SRNO: 1,
    Active: 1
  }
  ];
  TOTAL_AMOUNT_VALUE: any = 0;
  TOTAL_COST_VALUE: any = 0;
  status_list:any = [ {SO_STATUS: "PENDING" ,STATUS_NAME: "PENDING" },
    {SO_STATUS: "CLOSE" ,STATUS_NAME: "CLOSE" }
   ]
  SO_Detail_list:any = [];
  SO_UPLOADED_DOCUMENT:any = [];
  SO_REQUEST_UPLOADED_DOCUMENT:any = [];
  base64Pdf:any = '';
  base64Image:any = '';
  raisedinvoiceonmaxDate:any = new Date();
  TOTAL_REQUEST_VALUE: any = 0;
  TOTAL_BILLED_VALUE: any = 0;

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
    this.sharedService.formName = "Invoice Request Approve";
    this.form = this.formBuilder.group({
      SO_ID: [""],
      REQ_ID: "",
      LOCATION_STATE: ["", Validators.required],
      STATE_CODE: ["", Validators.required],
      COMPANY_CODE: ["", Validators.required],
      LOCATION_CODE: ["", Validators.required],
      FYEAR: ["", Validators.required],
      DOCTYPE_CODE: ["", Validators.required],
      SO_NO: "",
      SO_DATE: ["", Validators.required],
      SERVICE_CODE: ["", Validators.required],
      DUE_DATE: ["", Validators.required],
      RAISE_INVOICE_ON: ["", Validators.required],
      CUST_CODE: ["", Validators.required],
      PROJ_CODE: ["", Validators.required],
      PO_NO: ["", Validators.required],
      PO_DATE: ["", Validators.required],
      KIND_ATTN: "",
      CURRENCY_CODE: ["INR", Validators.required],
      EXCHANGE_RATE: ["", Validators.required],
      DOC_VALUE: ["", Validators.required],
      CANCEL_IND: "",
      TEMPLATE_CODE: ["", Validators.required],
      SO_STATUS: ["PENDING", Validators.required],
      SO_REMARKS: ['', Validators.required],
      REQUEST_REMARKS: ['', Validators.required],
      DOCUMENT_FILENAME: ["", Validators.required],
    })
      $('.selectpicker').selectpicker('refresh').trigger('change');
    this.minDate = new Date();
  }

  ngAfterViewInit() {
    this.spinner = true;
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      // }
      // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS ? false : true;
      if (this.sharedService.loginUser[0].FYEAR == undefined) {
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []
      }
      setTimeout(() => {
        this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
        this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
        this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
        this.form.get('DOCTYPE_CODE').setValue(this.sharedService.loginUser[0].DOCTYPE_CODE);
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
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);
      this.raisedinvoiceonmaxDate = currentDate.toISOString().split('T')[0];
      this.GetSOCommonList();
      this.GetSOReleaseList();
    }, 150)
    this.spinner = false;
  
  }

  GetSOCommonList() {
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetSOCommonList, {}).then(res => {
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
        this.form.get('EXCHANGE_RATE').setValue(1);
        this.form.get('TEMPLATE_CODE').setValue("LOCAL");
        this.form.get('DOCTYPE_CODE').setValue("SLL");
        this.form.get('DOC_VALUE').setValue("");
        this.form.get('SO_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())
        this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate())
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

  SaveSalesOrderRelease(type:any) {
    let SO_ID = this.form.get("SO_ID").value
    let REQ_ID = this.form.get("REQ_ID").value
    // let _documents = [];
    // for (let i = 0; i < this.uploadedDocument.length; i++) {
    //   if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
    //     _documents.push({
    //       DOCUMENT_NAME: this.uploadedDocument[i].DOCUMENT_NAME,
    //       DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
    //       DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
    //       UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
    //       UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
    //       ACTIVE: this.uploadedDocument[i].ACTIVE,
    //       ISNEW: this.uploadedDocument[i].ISNEW
    //     })
    //   }
    // }
    this.isSubmited = true;
    // if (this.form.controls['CUST_CODE'].invalid) {
    //   this.toast.warning('Please select company');
    //   return;
    // }
    // if (this.form.controls['PROJ_CODE'].invalid) {
    //   this.toast.warning('Please select project');
    //   return;
    // }
    // if (this.form.controls['DOCTYPE_CODE'].invalid) {
    //   this.toast.warning('Please select SO type');
    //   return;
    // }
    // if (this.form.controls['SO_STATUS'].invalid) {
    //   this.toast.warning('Please enter request Status');
    //   return;
    // }
    // if (this.form.controls['SO_REMARKS'].invalid) {
    //   this.toast.warning('Please enter So Remarks ');
    //   return;
    // }
    // if (this.uploadedDocument.length == 0) {
    //   this.toast.warning('Please attach a Documnet ');
    //   return;
    // }
 
    
    for (const element1 of this.SO_MILESTONE_T) {
      if(element1.REQ_VALUE < 1 && element1.REQ_VALUE != 0){
        this.toast.error('Please enter a req value is greater than zero');
        return
      }
      if(element1.DOC_VALUE < element1.REQ_VALUE){
        this.toast.error('Please enter a req value is less than amount');
        return
      }
      if((element1.DOC_VALUE - element1.BILLED_VALUE) < element1.REQ_VALUE){
        this.toast.error('Invalid req value should not be approve request');
        return
      }
    }

    for (const el of this.SO_MILESTONE_T) {
      el.REQ_VALUE = +(this.currencyPipe.parse(el.REQ_VALUE));
    }

      let data = {
        "USERID": this.sharedService.loginUser[0].USERID,
        "TYPE": type,
        "SO_ID": SO_ID,
        "REQ_ID": REQ_ID,
        "KIND_ATTN": this.form.get("KIND_ATTN").value,
        "REMARKS": this.form.get("REQUEST_REMARKS").value,
        "RAISE_INVOICE_ON": this.form.get("RAISE_INVOICE_ON").value,
        // "SO_RELEASE_Header": this.form.value,
        "SO_RELEASE_MILESTONE_T": this.SO_MILESTONE_T,
        // "SO_RELEASE_DOCUMENT_LIST": this.uploadedDocument,
        "SO_RELEASE_DOCUMENT_LIST": [],
        "TOTAL_AMOUNT_VALUE": +(this.TOTAL_AMOUNT_VALUE),
      }
// console.log('data -> ' , JSON.stringify(data))
// return  
      this.http.PostRequest(this.apiUrl.SaveInvoiceRequestApprove, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.isSubmited = false;
          this.f_clearForm();
          this.viewSOList();
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.spinner = false;
          this.isViewSO != this.isViewSO
        } else {
          this.toast.warning(res.msg)
          this.spinner = false;
        }
      });
  }

  f_validateFormData() {
    if (this.form.controls['COMPANY_CODE'].invalid) {
      this.toast.warning('Please select company');
      return false;
    } else if (this.form.controls['LOCATION_CODE'].invalid) {
      this.toast.warning('Please select location');
      return false;
    } else if (this.form.controls['DOCTYPE_CODE'].invalid) {
      this.toast.warning('Please select SO type');
      return false;
    }
    else if (this.form.controls['FYEAR'].invalid) {
      this.toast.warning('Please select FYEAR');
      return false;
    }
    else if (this.form.controls['SO_DATE'].invalid) {
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
    else if (this.form.controls['SO_STATUS'].invalid) {
      this.toast.warning('Please enter request Status');
      return false;
    }
    return true;
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
    this.project_list = [];
    this.invoice_type_list = [];
    this.SO_MILESTONE_T = [{
      EXPECTED_DATE: this.minDate,
      REMARKS: "",
      DOC_VALUE: "0",
      TOTAL_AMOUNT_VALUE: "0",
      TOTAL_COST_VALUE: "0",
      MILESTONE_SRNO: 0,
      Active: 1
    }
    ];
    this.form.get('EXCHANGE_RATE').setValue(1);
    this.form.get('TEMPLATE_CODE').setValue("LOCAL");
    this.form.get('SO_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('DUE_DATE').setValue(this.sharedService.getTodayDate())
    this.form.get('PO_DATE').setValue(this.sharedService.getTodayDate())
    if (this.sharedService.loginUser[0].FYEAR == undefined) {
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []
    }
    this.form.get('CURRENCY_CODE').setValue("INR");
    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    this.filterLocations();
    this.SelectState();
    this.GetSOCommonList();
    this._DATE = "";
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 210);
  }

  viewSOList() {
    this.GetSOReleaseList();
    this.f_clearForm();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GetSOReleaseList() {
    let data = {
      LISTTYPE: "ALL",
      USERID: this.sharedService.loginUser[0].USERID,
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetSOReleaseList, data).then(res => {
      if (res.flag) {
        this.SO_Release_list = res.SO_Release_list;
        this.isViewSO = true;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else {
        this.SO_Release_list = [];
        this.isViewSO = true;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      }
    });
  }

  backToForm() {
    this.editing = false;
    this.isViewSO = !this.isViewSO;
    this.f_clearForm();
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
        var file = new Blob([int8Array], { type: 'application/pdf;base64' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
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
    // console.log('data ->' , data)
    this.GetSalesOrderReleaseDetail(data.REQ_ID,data.SO_ID)
    this.editing = true;
  }

  GetSalesOrderReleaseDetail(REQ_ID:any,SO_ID:any) {
    this.TOTAL_REQUEST_VALUE = 0;
    this.TOTAL_BILLED_VALUE = 0;
    this.TOTAL_AMOUNT_VALUE = 0;
    let data = {
      REQ_ID: REQ_ID,
      SO_ID: SO_ID
    }
    this.http.PostRequest(this.apiUrl.GetSalesOrderReleaseDetail, data).then(res => {
      if (res.flag == 1) {
        this.SO_Detail_list = res.SO_Detail_list;
        this.SO_MILESTONE_T = res.SO_Milestone_list;
        this.SO_UPLOADED_DOCUMENT = res.SO_Document_list;
        this.SO_REQUEST_UPLOADED_DOCUMENT = res.SO_Request_Document_list;
        this.SO_MILESTONE_T.forEach((element:any)=>{
          element.EXPECTED_DATE = this.datepipe.transform(element.EXPECTED_DATE, 'dd-MMM-yyyy')
          element.REQ_VALUE = this.currencyPipe.transform(element.REQ_VALUE)
          this.TOTAL_REQUEST_VALUE += element.DOC_VALUE;
          this.TOTAL_BILLED_VALUE += element.BILLED_VALUE;
        })
        this.TOTAL_AMOUNT_VALUE = this.SO_Detail_list[0].TOTAL_AMOUNT_VALUE;
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
    this.form.get("SO_ID").setValue(this.SO_Detail_list[0].SO_ID)
    this.filterLocations();
    this.form.get("REQ_ID").setValue(this.SO_Detail_list[0].REQ_ID)
    this.form.get("LOCATION_STATE").setValue(this.SO_Detail_list[0].LOCATION_STATE)
    this.form.get("STATE_CODE").setValue(this.SO_Detail_list[0].STATE_CODE)
    this.form.get("COMPANY_CODE").setValue(this.SO_Detail_list[0].COMPANY_CODE)
    this.form.get("LOCATION_CODE").setValue(this.SO_Detail_list[0].LOCATION_CODE)
    this.form.get("FYEAR").setValue(this.SO_Detail_list[0].FYEAR)
    this.form.get("DOCTYPE_CODE").setValue(this.SO_Detail_list[0].DOCTYPE_CODE)
    this.form.get("SO_NO").setValue(this.SO_Detail_list[0].SO_NO)
    this.form.get("CUST_CODE").setValue(this.SO_Detail_list[0].CUST_CODE)
    this.form.get("PO_NO").setValue(this.SO_Detail_list[0].PO_NO)
    this.form.get("SO_DATE").setValue(this.datepipe.transform(this.SO_Detail_list[0].REQ_DATE, 'dd-MMM-yyyy'))
    this.form.get("PO_DATE").setValue(this.datepipe.transform(this.SO_Detail_list[0].PO_DATE, 'dd-MMM-yyyy'))
    // this.form.get("RAISE_INVOICE_ON").setValue(this.datepipe.transform(this.SO_Detail_list[0].RAISE_INVOICE_ON, 'dd-MMM-yyyy'))
    this.RAISE_INVOICE_ON = new Date(this.SO_Detail_list[0].RAISE_INVOICE_ON)
    this.form.get("KIND_ATTN").setValue(this.SO_Detail_list[0].KIND_ATTN)
    this.form.get("CURRENCY_CODE").setValue(this.SO_Detail_list[0].CURRENCY_CODE)
    this.form.get("EXCHANGE_RATE").setValue(this.SO_Detail_list[0].EXCHANGE_RATE)
    this.form.get("DOC_VALUE").setValue(this.SO_Detail_list[0].DOC_VALUE)
    this.form.get("CANCEL_IND").setValue(this.SO_Detail_list[0].CANCEL_IND)
    this.form.get("TEMPLATE_CODE").setValue(this.SO_Detail_list[0].TEMPLATE_CODE)
    this.form.get("PROJ_CODE").setValue(this.SO_Detail_list[0].PROJ_CODE)
    this.form.get("SO_STATUS").setValue(this.SO_Detail_list[0].SO_STATUS)
    this.form.get("SO_REMARKS").setValue(this.SO_Detail_list[0].REMARKS)
    this.form.get("REQUEST_REMARKS").setValue(this.SO_Detail_list[0].REQUEST_REMARKS)
    this.SelectState();
    setTimeout(() => {
      this.form.get("COMPANY_CODE").setValue(this.SO_Detail_list[0].COMPANY_CODE)
      this.form.get("LOCATION_CODE").setValue(Number(this.SO_Detail_list[0].LOCATION_CODE))
    this.form.get("SERVICE_CODE").setValue(this.SO_Detail_list[0].SERVICE_CODE)
    this.form.get("CUST_CODE").setValue(this.SO_Detail_list[0].CUST_CODE)
    this.form.get("TEMPLATE_CODE").setValue(this.SO_Detail_list[0].TEMPLATE_CODE)
    this.form.get("DOCTYPE_CODE").setValue(this.SO_Detail_list[0].DOCTYPE_CODE)
    this.form.get("SO_STATUS").setValue(this.SO_Detail_list[0].SO_STATUS)
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.spinner = false;
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

  f_addmilestone() {
    this.SO_MILESTONE_T.push({
      EXPECTED_DATE: this.minDate,
      REMARKS: "",
      DOC_VALUE: "0",
      TOTAL_AMOUNT_VALUE: "0",
      MILESTONE_SRNO: this.SO_MILESTONE_T.length + 1,
      Active: 1
    })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }

  GetPendingData(type:any) {
    this.PendingSO_list = [];
    if (type === 'P') {
      this.PendingSO_list = this.SO_Release_list.filter(item => item.SO_STATUS === type);
      this.isPending = true;
      for (let i = 0; i < this.SO_Release_list.length; i++) {
        if (this.SO_Release_list[i].SO_STATUS == type) {
          this.PendingSO_list.push(this.SO_Release_list[i])
        }
      }
    } else {
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
      this.TOTAL_AMOUNT_VALUE += (+this.currencyPipe.parse(element.REQ_VALUE));
    })
    this.TOTAL_AMOUNT_VALUE= this.TOTAL_AMOUNT_VALUE;
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


}





