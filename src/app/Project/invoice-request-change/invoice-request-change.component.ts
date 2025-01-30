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
  selector: 'app-invoice-request-change',
  templateUrl: './invoice-request-change.component.html',
  styleUrls: ['./invoice-request-change.component.css']
})
export class InvoiceRequestChangeComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  data: { DOC_VALUE: string, TOTAL_AMOUNT_VALUE: string } = { DOC_VALUE: '', TOTAL_AMOUNT_VALUE: '' };
  editing: boolean = false;
  selectedStatus: string = 'pending';
  ViewListHideShow:boolean=false;
  isviewdata:boolean=false;
  yourDataObject = {
    DOC_VALUE: 0, // Example value
    BASE_VALUE: 0 // Example value
  };
  
  detail: any = {
    CLOSE: '',
    isChecked: false,
    showData: false 
  };
  PendingSONOL:any;
  

  spinner: boolean = false;
  NoDocs:any;
  SO_ID:any;
  REQ_NO:any;
  REQ_DATE: any = '';
  maxdate = new Date();
  CUST_CODE:any;
  RAISE_INVOICE_ON:any;
  PROJ_CODE:any;
  SO_NO:any;
  REQ_REMARKS:any;
  uploadedDocument:any = [];
  project_list: Array<any> = [];
  isSubmited:boolean = false;
  form:FormGroup;
  invoice_detail:any = [];
  _project_list: Array<any> = [];
  customer_list: Array<any> = [];
  _location_list: Array<any> = [];
  location_list: Array<any> = [];
  SO_NO_list:any=[];
  SO_list:any=[];
  PendingSO_list:any = [];
  Cust_name:any;
  Proj_name:any;
  So_NumberList:any=[];
  SO_Number:any=[];
  _DATE:any;
  credit_days: number = 0;
  min_date = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date(new Date().getFullYear() + 1, 11, 31);
  uploadingFiles: Array<any> = [];
  today_date = new Date();
  SelectedFileName: string = "";
  minDate: any = new Date()
  totalValue: any = 0;
  today_date_s: any;
  fyear_list: Array<any> = [];
  SO_MILESTONE_T: Array<any> = [
    {
    SR_NO:"",
    REMARKS: "",
    DOC_VALUE: "0",
    PENDING_VALUE:"0",
    BASE_VALUE:"0",
    isChecked:"0",
   
    
  }
  ]
  SO_Milestone_list:any[]
  SO_DOCUMENT_LIST:any[] = [];
  displayBasic:boolean=false;
  document_name:any;
  documentsys_name:any;
  viewDocumentHideShow:boolean=false;
  INVOICELIST:any;
  INVOICE_APPROVE_LIST:any;
  UPLOAD_DOCUMENT_LIST:any;
  ADD_RIGHTS: boolean = true;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isChecked: boolean = true; 
  hiddenDetails: any[] = [];
  constructor(private sharedService: SharedServiceService,
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
    console.log(this.sharedService.loginUser,"login")
    this.form = this.formBuilder.group({
      SO_ID: [""],
      REQ_ID: "",
      REQ_NO:["",Validators.required],
      REQ_REMARKS:'',
      RAISE_INVOICE_ON:["",Validators.required],
      LOCATION_STATE: ["", Validators.required],
      STATE_CODE: ["", Validators.required],
      COMPANY_CODE: ["", Validators.required],
      LOCATION_CODE: ["", Validators.required],
      FYEAR: ["", Validators.required],
      DOCTYPE_CODE: ["", Validators.required],
      SO_NO: "",
      SO_DATE: ["", Validators.required],
      DUE_DATE: ["", Validators.required],
      CUST_CODE: ["", Validators.required],
     
      PROJ_CODE: ["", Validators.required],
      PO_NO: ["", Validators.required],
      REQ_DATE:["",Validators.required],
      KIND_ATTN: "",
      CURRENCY_CODE: ["INR", Validators.required],
      EXCHANGE_RATE: ["", Validators.required],
      DOC_VALUE: ["", Validators.required],
      BASE_VALUE: "",
      SGST_VALUE: "",
      CGST_VALUE: "",
      IGST_VALUE: "",
      ROUNDOFF_VALUE: 0,
      SO_VALUE: 0,
      RCVD_VALUE: "",
      CANCEL_IND: "",
      TEMPLATE_CODE: ["", Validators.required],
      BILL_IND: "",
      SO_STATUS: ["", Validators.required],
      COST: "",
      PENDING_VALUE:"",
      BILL_VALUE: "",
      SO_REMARKS: ["", Validators.required],
      DOCUMENT_FILENAME: ["", Validators.required],
    });
    this.GetSOCommonList();
    this.GetSOList();
 
     //this.calculatePendingValue(this.yourDataObject);

    $('.selectpicker').selectpicker('refresh').trigger('change');
    this.maxdate = this.today_date;
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
        this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
        this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
        this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
        
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
      
      this.GetSOCommonList();

    }, 150)

    
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

  selectDocument(event:any){
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      extension = event.target.files[i].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase()

      if (_ext === 'BAT' || _ext === 'GIF' || _ext === 'PNG' || _ext === 'JAVA' || _ext === 'XML' || _ext === 'ZIP'
        || _ext === 'RAR' || _ext === 'JAR' || _ext === 'EXE') {
        this.toast.warning("Please select valid document (XLSX/ DOCS/ PDF/ TEXT File/ Image)")
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        extension = event.target.files[i].name.split(".");
        this.uploadingFiles.push(
          {
            DOCUMENT_NAME: "",
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_FILETYPE: extension[extension.length - 1].toUpperCase(),
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            b64: b64
          }
        )
        this.uploadDoc();
      }
      // this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
    }

  }
  uploadDoc() {
    console.log("Number of files being uploaded:", this.uploadingFiles.length);

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
    console.log("Number of documents in uploadedDocument array:", this.uploadedDocument.length);
  }
  SaveInvoiceRequestChange(){
    let _documents = [];
    for (let i = 0; i < this.uploadedDocument.length; i++) {
      if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
        _documents.push({
          DOCUMENT_NAME: this.uploadedDocument[i].DOCUMENT_NAME,
          DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
          DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
          UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
          UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
          ACTIVE: this.uploadedDocument[i].ACTIVE,
          ISNEW: this.uploadedDocument[i].ISNEW
        })
      }
    }
    
    let data={
      "USER_ID": this.sharedService.loginUser[0].USERID,
      "CUST_CODE":this.form.getRawValue().CUST_CODE,
      "PROJ_CODE":this.form.getRawValue().PROJ_CODE,
      "SO_NO":this.form.getRawValue().SO_NO,
      "REQ_REMARKS":this.form.getRawValue().REQ_REMARKS,
      "REQ_NO":this.form.getRawValue().REQ_NO,
      "REQ_DATE":this.form.getRawValue().REQ_DATE,
      "RAISE_INVOICE_ON":this.form.getRawValue().RAISE_INVOICE_ON,
      "INVOICE_APPROVE_LIST":this.SO_MILESTONE_T,
      "UPLOAD_DOCUMENT_LIST":this.uploadedDocument,
      "LOCATION_CODE":this.form.getRawValue().LOCATION_CODE,
      "FYEAR":this.form.getRawValue().FYEAR,

     // "SO_Milestone_list": this.SO_MILESTONE_T
    }
    if (this.form.controls['CUST_CODE'].invalid) {
      this.toast.warning('Please select company');
      return;
    }
    if (this.form.controls['PROJ_CODE'].invalid) {
      this.toast.warning('Please select project');
      return;
    }
    if (this.form.controls['SO_NO'].invalid) {
      this.toast.warning('Please select SO NO');
      return;
    }
    if (this.form.controls['REQ_REMARKS'].invalid) {
      this.toast.warning('Please select Req Remarks');
      return;
    }
    console.log('data',data)
 
    this.http.PostRequest(this.apiUrl.SaveInvoiceDetails, data).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.viewList();
        this.f_uploadFiles()
        this.getsonumderlist()
        this.editViewInvoice(data)
        // this.f_fillForm();
        this.f_clearForm();
        this.isSubmited = false;  
      
        this.spinner = false;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  viewList(){
    this.ADD_RIGHTS=false;
    let data = {
      USERID: this.sharedService.loginUser[0].USERID,
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetInvoiceViewList, data).then(res => {
      if (res.flag) {
        // this.SO_list = res.SO_list;
        this.ViewListHideShow=true
        this.customer_list = res.customer_list;
        this.project_list = res.project_list;
        this.SO_MILESTONE_T = res.SO_Milestone_list;
        this.SO_DOCUMENT_LIST=res.ve
        this.INVOICELIST=res.INVOICELIST;
        this.INVOICE_APPROVE_LIST=res.SO_MILESTONE_T;
        this.UPLOAD_DOCUMENT_LIST=res.uploadedDocument;
        this.location_list = res.location_list;
        this.fyear_list = res.fyear_list;
        this.spinner = false;
        this.GetSOCommonList();
        this.getsonumderlist();
        this.f_fillForm();
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);


  }

  removeDoc(fileIndex:any){
    if (this.uploadedDocument[fileIndex].ISNEW == 1) {
      this.uploadedDocument.splice(fileIndex, 1);
    } else if (this.uploadedDocument[fileIndex].ACTIVE == 1) {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    } else {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    }
    this.NoDocs = 0;
    this.uploadedDocument.forEach(element => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1
      }
    });

  }

  f_downloadDocument(file:any){
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

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);

  }
  

//   ViewDocument() {
//     const selectedDocument = this.form.getRawValue().uploadedDocument;

//     const foundDocument = this.SO_DOCUMENT_LIST.find(element => element.uploadedDocument === selectedDocument);

//     if (foundDocument) {
 
//         console.log('Found document:', foundDocument);
//     } else {
//         console.log('Document not found');
//     }
// }
ViewDocumnet(data:any) {
  console.log('ganesh',data)
  this.displayBasic=true;
  // this.GetSODetail(dSata)
  // this.SO_DOCUMENT_LIST=[];
  // const selectedDocument = this.form.getRawValue().uploadedDocument;
  
  // this.SO_DOCUMENT_LIST.forEach(element => {
  //   if (element.uploadedDocument === selectedDocument) {
      
  //     this.SO_DOCUMENT_LIST.push(element); 
  //   }
  // });
}
displayBasicModel(){
 this.displayBasic=false;
}
// Replace 'newMethodName' with your desired method name
downloadDocument(file: any) {
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


  GetSOCommonList() {
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetSOCommonList, {}).then(res => {
      if (res.flag) {
        this.customer_list = res.customer_list;
        this.project_list = res.project_list;
        this._project_list = res.project_list;
        this.form.get('REQ_DATE').setValue(this.sharedService.getTodayDate())
        this._location_list = res.location_list;
      this.location_list = res.location_list;
      this.fyear_list = res.fyear_list;
        // this.form.get('REQ_DATE').setValue(this.sharedService.getTodayDate())
        
        // this._project_list = [];
        // this._project_list = res.project_list;
        this.spinner = false;
        // this.editViewInvoice()
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
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
        this.SO_list = res.SO_list;
         this.ViewListHideShow = false;
        
        this.SO_MILESTONE_T = res.SO_Milestone_list;
        // this.SO_DOCUMENT_LIST = this.uploadedDocument;\
        this.SO_DOCUMENT_LIST= res.SO_Document_list
        this.PendingSO_list = this.SO_list.filter(item => item.SO_STATUS === 'P');
        for (let i = 0; i < this.SO_list.length; i++) {
          if (this.SO_list[i].SO_STATUS == 'P') {
            this.PendingSO_list.push(this.SO_list[i])
          }
        }
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
 

  filterProject() {
    // const selectedCustomerCode = this.CUST_CODE;
    // console.log('Selected Customer Code:',  this.form.getRawValue().CUST_CODE,this.project_list);
    if (this.form.getRawValue().CUST_CODE != "" && this.form.getRawValue().CUST_CODE != null) {
    this._project_list = [];
    this.invoice_detail = [];
    this.project_list.forEach(element => {
      
      if (element.CUST_CODE == this.form.getRawValue().CUST_CODE+ "") {
        this._project_list.push(element)
      }
    });
    
    }
  
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  
  }

updateTotalAmount(): void {
  this.totalValue = 0;
  if (this.SO_MILESTONE_T && this.SO_MILESTONE_T.length > 0) {
    for (let i = 0; i < this.SO_MILESTONE_T.length; i++) {
      const docValue = parseFloat(this.SO_MILESTONE_T[i].DOC_VALUE || '0');
      this.totalValue += docValue;
    }
  }
    // console.log('Updating total amount',this.);
    this.totalValue=this.currencyPipe.transform(this.totalValue)
  }
getsonumderlist() {

  // this.So_NumberList = [];
  // this.customer_list.forEach(element => {
  //   if (element.CUST_CODE == this.form.getRawValue().CUST_CODE) {
  //     this.Cust_name=element.CUST_NAME;
  //   }
 
  // });
  console.log('CUST_CODE',this.CUST_CODE)
  this.So_NumberList = []; 
  this.customer_list.forEach(element => {
  if (element.CUST_CODE == this.form.getRawValue().CUST_CODE) {
       this.Cust_name = element.CUST_NAME;

  }
});

  this.project_list.forEach(element => {
    if (element.PROJ_CODE == this.form.getRawValue().PROJ_CODE) {
       this.Proj_name=element.PROJ_NAME;
    }
  });
  // console.log(this.Cust_name,this.Proj_name)
  this.SO_list.forEach(element => {
 
    if (element.CUST_NAME ==this.Cust_name && element.PROJ_NAME== this.Proj_name) {
      this.So_NumberList.push({"SO_NO": element.SO_NO,"SO_REMARKS":element.SO_REMARKS})
    }
  });
 
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);

}

getInvoice() {
  this.invoice_detail = [];
  this.So_NumberList.forEach(element => {
    if (element.SO_NO == this.form.getRawValue().SO_NO) {
      this.SO_Number = element.SO_NO;
      this.viewDocumentHideShow=true
    }
  });

  this.SO_list.forEach(element => {
    if (element.SO_NO === this.SO_Number) {
      this.invoice_detail.push( element);
      
      this.GetSODetail(element.SO_ID)
    }
  });

  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
 // this.GetSODetail(this.form.getRawValue().SO_NO)

  
}

ChangeBillDate(){
  this.REQ_DATE = this.datePipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')
  //  this.REQ_DATE

  var due_date_new = new Date(this.REQ_DATE);
  var new_date = moment(new Date(due_date_new)).add(this.credit_days, 'd');
  this.form.get('DUE_DATE').setValue(new_date);

  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

GetSODetail(SO_ID:any) {
  let data = {
    SO_ID: SO_ID
  }
  this.http.PostRequest(this.apiUrl.GetSODetail, data).then(res => {
    if (res.flag == 1) {
      // this.ViewListHideShow =!this.ViewListHideShow
      // console.log(res)
      this.SO_MILESTONE_T = res.SO_Milestone_list;
      this.SO_DOCUMENT_LIST = this.uploadedDocument;
      // this.uploadedDocument = res.SO_Document_list;
      this.SO_DOCUMENT_LIST=res.SO_Document_list
      // this.document_name=  this.SO_DOCUMENT_LIST[0].DOCUMENT_FILENAME 
      // this.documentsys_name=  this.SO_DOCUMENT_LIST[0].DOCUMENT_SYSFILENAME 
      
      // console.log(" this.SO_DOCUMENT_LIST ",  this.SO_DOCUMENT_LIST )
  }
  // this.IsView = !this.IsView;
});
setTimeout(() => {
  $('.selectpicker').selectpicker('refresh').trigger('change');
}, 100);

}
calculatePendingValue(data: any, val: any) {
  if (val > data.DOC_VALUE) {
    this.toast.error("Value cannot be greater than doc value");
    data.BASE_VALUE = 0;
  } else {
    const pendingValue = data.PENDING_VALUE || 0;
    if (pendingValue < val) {
      this.toast.error("Pending value cannot be negative");
      data.BASE_VALUE = 0;
    } else {
      data.PENDING_VALUE -= val;
      this.totalValue += (pendingValue - data.BILLED_VALUE) - val;
    }
  }
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}


updateClose(detail: any) {
  console.log(detail)
  if (detail && detail.isChecked) {

    this.hiddenDetails.push(detail);
   
    detail.isHidden = true;
  }
}


f_clearForm() {
  this.uploadedDocument = [];
  this.customer_list=[];
    this.project_list = [];
    this.REQ_DATE = '';
    this.RAISE_INVOICE_ON = this.maxDate;
    this.REQ_REMARKS=[];
    this.totalValue=[];
    this.SO_DOCUMENT_LIST=[];
    this.SO_MILESTONE_T = [{
      // EXPECTED_DATE: this.minDate,
      REMARKS: "",
      DOC_VALUE: "0",
      cost: "0",
      // TOTAL_AMOUNT_VALUE: "0",
      // TOTAL_COST_VALUE: "0",
      Active: 1
    }
    
    
    ];
    if (this.sharedService.loginUser[0].FYEAR == undefined) {
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []

    }
    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    this.form.get('REQ_DATE').setValue(this.sharedService.getTodayDate())
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    
}
f_fillForm(){
  this.ViewListHideShow=false
  this.form.get("CUST_CODE").setValue(this.INVOICELIST[0].CUST_CODE)
  this.form.get("PROJ_CODE").setValue(this.INVOICELIST[0].PROJ_CODE)
  this.form.get("SO_NO").setValue(this.INVOICELIST[0].SO_NO)
  this.form.get("REQ_REMARKS").setValue(this.INVOICELIST[0].REQ_REMARKS)
  this.form.get("REQ_NO").setValue(this.INVOICELIST[0].REQ_NO)
  this.form.get("REQ_DATE").setValue(this.INVOICELIST[0].REQ_DATE)
  this.form.get("RAISE_INVOICE_ON").setValue(this.INVOICELIST[0].RAISE_INVOICE_ON)
  this.form.get("LOCATION_CODE").setValue(this.INVOICELIST[0].LOCATION_CODE)
  this.form.get("FYEAR").setValue(this.INVOICELIST[0].FYEAR)
  this.form.get("LOCATION_CODE").setValue(Number(this.INVOICELIST[0].LOCATION_CODE))
  this.filterLocations();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}
back(){
  this.ADD_RIGHTS=true;
  this.isviewdata=false;
  this.ViewListHideShow = !this.ViewListHideShow
  this.f_clearForm();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}
editViewInvoice(data){
  console.log('CUST_CODE',data.CUST_CODE)
  console.log('SO_ID',data.SO_NO)

  this.GetViewInvoiceReq(data.SO_NO);
  this.ViewListHideShow=false;
  this.editing = false;
  
  this.isviewdata=true;



  // this.customer_list.forEach((element:any) => {
  //   if(data.CUST_CODE==element.CUST_NAME){
  //     this.form.get("CUST_CODE").setValue(element)
  //     // this.CUST_CODE=element
  //     console.log( this.CUST_CODE,'tghhygt')
  //   }
  // });
  this.form.get("CUST_CODE").setValue(data.CUST_CODE)
  this.form.get("PROJ_CODE").setValue(data.PROJ_CODE)
  this.form.get("SO_NO").setValue(data.SO_NO)
  this.form.get("REQ_REMARKS").setValue(data.REQ_REMARKS)
  this.form.get("REQ_NO").setValue(data.REQ_NO)
  this.form.get("REQ_DATE").setValue(new Date(data.REQ_DATE) )
  this.form.get("RAISE_INVOICE_ON").setValue(data.RAISE_INVOICE_ON)

  
  // this.CUST_CODE=data.CUST_CODE
  // this.REQ_REMARKS=data.REQ_REMARKS
  // this.INVOICELIST(data.SO_ID)
  for (let i = 0; i < this.SO_MILESTONE_T.length; i++) {
    this.totalValue = this.SO_MILESTONE_T[i].DOC_VALUE;
  }

  
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

GetViewInvoiceReq(SO_NO:any) {
  let data = {
    SO_NO: SO_NO,
    USERID: this.sharedService.loginUser[0].USERID,
  }
  console.log ('data',data)
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetViewInvoiceReq, data).then(res => {
    if (res.flag) {
      
      this.INVOICELIST=res.INVOICELIST
      this.GetSOCommonList()
      this.getsonumderlist()
      this.SO_MILESTONE_T=res.INVOICE_APPROVE_LIST;
      this.uploadedDocument=res.UPLOAD_DOCUMENT_LIST;
      this._location_list = res.location_list;
      this.location_list = res.location_list;
      this.fyear_list = res.fyear_list;
      // this.f_fillForm();

      this.spinner = false;
    } else {
      this.spinner = false;
    }
  }, err => {
    this.spinner = false;
  });
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

}


