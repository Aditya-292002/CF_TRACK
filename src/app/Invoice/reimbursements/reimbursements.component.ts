import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { saveAs } from 'file-saver';
import { PipeService } from 'src/app/services/pipe.service';

@Component({
  selector: 'app-reimbursements',
  templateUrl: './reimbursements.component.html',
  styleUrls: ['./reimbursements.component.css']
})
export class ReimbursementsComponent implements OnInit {
 @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  spinner: boolean = false;
  DOCTYPE_CODE:any = 'REI';
  company_list:any = [];
  currency_list:any = [];
  customer_list:any = [];
  doc_type_list:any = [];
  employee_list:any = [];
  location_list:any = [];
  sampel_exphead_list:any = [];
  exphead_list:any = [];
  fyear_list:any = [];
  vendor_list:any = [];
  tds_code_list:any = [];
  COMPANY_CURRENCY:any;
  FYEAR:any;
  COMPANY_CODE:any;
  LOCATION_CODE:any;
  CURRENCY_CODE:any = 'INR';
  isExchangeRate:boolean = false;
  reimbursement_detail:any = [];
  project_list:any = [];
  uploadedDocument:any = [];
  isCancel:boolean = false;
  isViewReimbursement:boolean = false;
  EXCHANGE_RATE:any = '1';
  PAY_BY_DATE:any = new Date();
  REIMBURSEMENT_DATE:any = new Date();
  TDS_RATE:any = 0;
  TDS_AMT:any = 0;
  PAY_TO:any;
  TDS_CODE:any = "";
  LOCATION_STATE:any;
  LOCATION_COUNTRY:any;
  BASE_BILL:any = 0;
  TOTAL_BILL:any = 0;
  ROUNDOFF:any = 0;
  IGST_AMT:any = 0;
  CGST_AMT:any = 0;
  SGST_AMT:any = 0;
  TDS_ON:any = 0;
  TDS_APPLICABLE:any;
  REIMBURSEMENT_AMT:any = 0;isView: boolean=false;
  reimbursement_detail_copy: any;
;
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  EMP_CODE:any;
  REMARKS:any;
  PO_ID:any;
  BILL_NO:any;
  BILL_DATE:any = new Date();
  DUE_DATE:any;
  GST_CLASS:boolean = false;
  VENDOR_COUNTRY:any;
  VENDOR_STATE:any;
  VOUCHER_NO:any;
  min_date:any = new Date(new Date().getFullYear(), 0, 1);
  maxdate:any;
  SelectedFileName:any;
  uploadingFiles:any = [];
  IS_UPDATE:any = 0;
  all_expense_detail:any = [];
  REIMBURSEMENT_ID:any = 0;
  UserDetails:any = {};
  USER_ID:any;
  CANCEL_IND:any = 0;
  reimbursement_header:any = [];
  IsUpdate:any = "Save";
  PROJ_CODE:any;
  APPROVED_AMOUNT:any=0
  Total_App_Amount:any=0
  Total_Req_Amount_Price:any=0;
   constructor(public sharedService: SharedServiceService,
     private apiUrl: ApiUrlService,
     private http: HttpRequestServiceService,
     private formBuilder: FormBuilder,
     private toast: ToastrService,
     private datePipe: DatePipe,
     public validationService: ValidationService,
     private cdRef: ChangeDetectorRef,
    private pipeService:PipeService) { }

  ngOnInit() {
    this.sharedService.formName = "Reimbursement";
    // if (this.sharedService.form_rights.ADD_RIGHTS) {
    //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
    // }
    // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
    //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
    // }
    // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
    // if(this.sharedService.loginUser[0].FYEAR == undefined){
    //   this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
    //  }
    this.isView=false
    this.FYEAR = this.sharedService.loginUser[0].FYEAR;
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE;
    this.LOCATION_CODE = this.sharedService.loginUser[0].LOCATION_CODE;
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE;
    this.COMPANY_CURRENCY = this.sharedService.loginUser[0].COMPANY_CURRENCY;
    this.EMP_CODE = this.sharedService.loginUser[0].EMP_CODE;
    this.USER_ID = this.sharedService.loginUser[0].USERID;
    this.REIMBURSEMENT_DATE = this.datePipe.transform((this.REIMBURSEMENT_DATE), 'dd-MMM-yyyy')
    this.BILL_DATE = this.datePipe.transform((this.BILL_DATE), 'dd-MMM-yyyy')
    this.PAY_BY_DATE = this.datePipe.transform((this.PAY_BY_DATE), 'dd-MMM-yyyy')
    this.GetReimbursementCommonList();
    this.GetProjectList();
    this.f_addRow();
    this.Addrights();
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 100);
  }

  Addrights(){
    if(this.USER_ID == 2){
      document.getElementById('employee').setAttribute("disabled","true");
    }
    else if(this.USER_ID != 2){
      document.getElementById('employee').removeAttribute("disabled");
    }
    this.cdRef.detectChanges();
  }


  ReimbursementList(val:any){
    this.isView=false
    this.GetReimbursementList(val);
    this.isViewReimbursement = !this.isViewReimbursement;
    this.isCancel = false;
    this.IS_UPDATE=0
    this.Total_App_Amount=0
    this.TOTAL_BILL=0
    // this.GetExpenseList('P');
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 100);
  }

  GetReimbursementList(val:any){
    console.log('this.isViewReimbursement',this.isViewReimbursement);
    
  let data = {
    LISTTYPE:val
  }
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetReimbursementList, data).then(res => {
    if (res.flag) {
      this.all_expense_detail = res.reimbursement_list;
      this.f_clearForm();
      // setTimeout(() => {
      //   $('.selectpicker').selectpicker('refresh').trigger('change');
      // }, 100);
      this.spinner = false;
    } else {
      this.spinner = false;
    } 
  }, err => {
    this.spinner = false;
  });
}

GetReimbursementDetail(REIMBURSEMENT_ID:any,val:any){
  let data = {
    REIMBURSEMENT_ID: REIMBURSEMENT_ID
  }
  this.spinner = true;
  this.reimbursement_detail = [];
  this.reimbursement_header = [];
  this.http.PostRequest(this.apiUrl.GetReimbursementDetail, data).then(res => {
    if (res.flag) {
      console.log('res',res);
      this.reimbursement_detail = res.reimbursement_detail;
      this.reimbursement_header = res.reimbursement_header;
      this.uploadedDocument = res.expense_document_detail;
      this.REIMBURSEMENT_DATE = this.reimbursement_header[0].REIMBURSEMENT_DATE,
      this.REIMBURSEMENT_AMT = this.reimbursement_header[0].REIMBURSEMENT_AMT,
      this.EMP_CODE = this.reimbursement_header[0].EMP_NO,
      this.BILL_NO = this.reimbursement_header[0].BILL_NO,
      this.PAY_TO = this.reimbursement_header[0].PAY_TO,
      this.REMARKS = this.reimbursement_header[0].REMARKS,
      this.PO_ID = this.reimbursement_header[0].PO_ID,
      this.BILL_DATE = this.reimbursement_header[0].BILL_DATE,
      this.PAY_BY_DATE = this.reimbursement_header[0].DUE_DATE,
      this.PO_ID = this.reimbursement_header[0].PO_ID,
      this.CURRENCY_CODE = this.reimbursement_header[0].CURRENCY_CODE,
      this.EXCHANGE_RATE = this.reimbursement_header[0].EXCHANGE_RATE,
      this.BASE_BILL = this.reimbursement_header[0].BASE_BILL,
      this.TDS_ON = this.reimbursement_header[0].TDS_ON,
      this.TDS_AMT = this.reimbursement_header[0].TDS_AMT,
      this.TDS_CODE = this.reimbursement_header[0].TDS_CODE,
      this.TDS_RATE = this.reimbursement_header[0].TDS_RATE,
      this.SGST_AMT = this.reimbursement_header[0].SGST_AMT,
      this.CGST_AMT = this.reimbursement_header[0].CGST_AMT,
      this.IGST_AMT = this.reimbursement_header[0].IGST_AMT,
      this.ROUNDOFF = this.reimbursement_header[0].ROUNDOFF;
      if(val==1){
        this.TOTAL_BILL =this.pipeService.setCommaseprated((+this.reimbursement_header[0].TOTAL_BILL).toFixed(2))
      }
      this.CANCEL_IND = this.reimbursement_header[0].CANCEL_IND
      this.PROJ_CODE=this.reimbursement_detail[0].PROJ_CODE
      this.reimbursement_detail.forEach((element:any) => {
        element.PRICE=this.pipeService.setCommaseprated((+element.PRICE).toFixed(2));
        element.APPROVED_AMOUNT=this.pipeService.setCommaseprated((+element.APPROVED_AMOUNT).toFixed(2));
      });
      this.spinner = false;
    } else {
      this.spinner = false;
    } 
  }, err => {
    this.spinner = false;
  });
}

  GetReimbursementCommonList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetReimbursementCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.currency_list = res.currency_list;
        this.customer_list = res.customer_list;
        this.doc_type_list = res.doc_type_list;
        this.employee_list = res.employee_list;
        this.location_list = res.location_list;
        this.sampel_exphead_list = res.exphead_list;
        this.exphead_list = res.exphead_list;
        this.fyear_list = res.fyear_list;
        this.tds_code_list = res.tds_code_list;
        this.vendor_list = res.vendor_list;
        this.FilterExpHead('REI');
        if(this.CURRENCY_CODE == this.COMPANY_CURRENCY){
          this.isExchangeRate = true;
        }
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  GetProjectList() {
    let data = {
      LISTTYPE: "customerwise",
      COMPANY_CODE: this.COMPANY_CODE,
    }
    this.http.PostRequest(this.apiUrl.GetProjectList, data).then(res => {
      if (res.flag) {
        this.project_list = res.project_list;
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_addRow(){
    this.reimbursement_detail.push({
      ACTIVE:1,
      SRNO:0,
      PO_SRNO: "0",
      EXPENSE_HEAD:"",
      HSN_CODE:"",
      EXPENSE_GL:"0",
      REMARKS:"",
      TDS_ON:"0",
      SGST_RATE:"0",
      SGST_AMOUNT:"0",
      CGST_RATE:"0",
      CGST_AMOUNT:"0",
      IGST_RATE:"0",
      IGST_AMOUNT:"0",
      TOTAL_AMOUNT:"0",
      REIMBURSEMENT_AMOUNT: "0",
      QTY:"1",
      PRICE: "0",
      APPROVED_AMOUNT:"0"
      // PROJ_CODE:""
    })
  };

  addNew(){
    this.IsUpdate = "Save";
    this.isViewReimbursement = !this.isViewReimbursement ;
    this.isCancel = false;
    this. f_clearForm();
  }

  f_clearForm(){
    var new_date = new Date();
    this.reimbursement_detail = [];
    this.uploadedDocument = [];
    this.CURRENCY_CODE = 'INR';
    this.EXCHANGE_RATE = 1;
    this.FYEAR = this.sharedService.loginUser[0].FYEAR;
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE;
    this.LOCATION_CODE = this.sharedService.loginUser[0].LOCATION_CODE;
    this.LOCATION_CODE = this.sharedService.loginUser[0].LOCATION_CODE;
    this.TDS_RATE = 0;
    this.TDS_AMT = 0;
    this.TDS_CODE = '';
    this.REIMBURSEMENT_DATE=this.datePipe.transform((new_date), 'dd-MMM-yyyy'),
    this.PAY_BY_DATE = '';
    this.REMARKS = '',
    this.PO_ID = '',
    this.BILL_NO = '',
    this.BILL_DATE = this.datePipe.transform((new_date), 'dd-MMM-yyyy'),
    this.PAY_BY_DATE = this.datePipe.transform((new_date), 'dd-MMM-yyyy'),
    this.BASE_BILL = '',
    this.TDS_ON = "0",
    this.SGST_AMT = "0",
    this.CGST_AMT = "0",
    this.IGST_AMT = "0",
    this.ROUNDOFF = 0,
    this.TOTAL_BILL = 0,
    this.CANCEL_IND = 0
    this.PROJ_CODE=''
      this.f_addRow();
      this.GetProjectList();
      this.SelectState();
  }

  SelectState(){
    if(this.LOCATION_CODE != "" && this.LOCATION_CODE != null){
      
      this.location_list.forEach(element => {
        if(Number(element.LOCATION_CODE) == Number(this.LOCATION_CODE)){
          this.LOCATION_COUNTRY = element.LOCATION_COUNTRY;
          this.LOCATION_STATE = element.LOCATION_STATE;
        }
      });
    }
  }

  CalculateFinalAmount (){
        this.TOTAL_BILL=0
        // this.Total_Req_Amount=0;
        console.log('this.reimbursement_detail',this.reimbursement_detail);
        this.REIMBURSEMENT_AMT = 0;
        this.reimbursement_detail.forEach((element:any) => {
          element.PRICE=this.pipeService.removeCommaseprated(element.PRICE)
         console.log('element.PRICE',element.PRICE);
          
        element.TOTAL_AMOUNT = element.PRICE*element.QTY
        element.REIMBURSEMENT_AMOUNT = element.TOTAL_AMOUNT;
        //Total_Req_Amount and TOTAL_BILL both are same 
        // this.Total_Req_Amount += element.REIMBURSEMENT_AMOUNT;
        this.TOTAL_BILL += element.REIMBURSEMENT_AMOUNT;
        this.REIMBURSEMENT_AMT = this.TOTAL_BILL;
      });
    //  this.Total_Req_Amount=this.pipeService.setCommaseprated((+this.Total_Req_Amount).toFixed(2));

      console.log('this.TOTAL_BILL',this.TOTAL_BILL);
      
       this.TOTAL_BILL=this.pipeService.setCommaseprated((+this.TOTAL_BILL).toFixed(2));

    // this.TOTAL_BILL = 0;
    // this.REIMBURSEMENT_AMT = 0;
    // this.reimbursement_detail.forEach((element:any) => {
    //     element.TOTAL_AMOUNT = element.PRICE*element.QTY
    //     element.REIMBURSEMENT_AMOUNT = element.TOTAL_AMOUNT;
    //     this.TOTAL_BILL += element.REIMBURSEMENT_AMOUNT;
    //     this.REIMBURSEMENT_AMT = this.TOTAL_BILL;
    //   });
    //   this.TOTAL_BILL=this.pipeService.setCommaseprated((+this.TOTAL_BILL).toFixed(2));

    // var REIMBURSEMENT_AMOUNT= 0;
    // var SGST_VALUE= 0;
    // var CGST_VALUE= 0;
    // var IGST_VALUE= 0;
    // var TOT_VALUE= 0;
    // var FINAL_TOTAL_ROUND = 0;
    // var ROUNDOFF = 0;
    // this.reimbursement_detail.forEach((element:any) => {
    //   element.REIMBURSEMENT_AMOUNT = element.QTY*element.PRICE;
    //   REIMBURSEMENT_AMOUNT += parseFloat(element.REIMBURSEMENT_AMOUNT);    
    //   if(Number(element.SGST_AMOUNT) == 0)  {
    //     element.SGST_AMOUNT = (parseFloat(element.REIMBURSEMENT_AMOUNT) * parseFloat(element.SGST_RATE)/100).toFixed(2);     
    //   }
    //   if(element.CGST_AMOUNT == 0)  {
    //     element.CGST_AMOUNT = (parseFloat(element.REIMBURSEMENT_AMOUNT) * parseFloat(element.CGST_RATE)/100).toFixed(2);    
    //   }
    //   if(element.IGST_AMOUNT == 0)  {
    //     element.IGST_AMOUNT = (parseFloat(element.REIMBURSEMENT_AMOUNT) * parseFloat(element.IGST_RATE)/100).toFixed(2);     
    //   }           
    //   element.TOTAL_AMOUNT =  (REIMBURSEMENT_AMOUNT+parseFloat(element.SGST_AMOUNT)+parseFloat(element.CGST_AMOUNT)+parseFloat(element.IGST_AMOUNT)).toFixed(2);
    //   element.BASE_VALUE = (this.EXCHANGE_RATE * REIMBURSEMENT_AMOUNT).toFixed(2);
    //   SGST_VALUE += parseFloat(element.SGST_AMOUNT);
    //   CGST_VALUE += parseFloat(element.CGST_AMOUNT);
    //   IGST_VALUE += parseFloat(element.IGST_AMOUNT);
    //   TOT_VALUE += parseFloat(element.TOTAL_AMOUNT);
    // });
    // this.REIMBURSEMENT_AMT = (REIMBURSEMENT_AMOUNT).toFixed(2);
    // this.TDS_APPLICABLE = (REIMBURSEMENT_AMOUNT).toFixed(2);
    // this.SGST_AMT = (SGST_VALUE).toFixed(2);
    // this.CGST_AMT = (CGST_VALUE).toFixed(2);
    // this.IGST_AMT = (IGST_VALUE).toFixed(2);
    // FINAL_TOTAL_ROUND = TOT_VALUE;
    // ROUNDOFF = this.ROUNDOFF;
    // FINAL_TOTAL_ROUND = Number(FINAL_TOTAL_ROUND) + Number(ROUNDOFF);
    // this.TOTAL_BILL = (FINAL_TOTAL_ROUND).toFixed(2);
    // this.TOTAL_BILL = (FINAL_TOTAL_ROUND).toFixed(2);
    // var FINAL_BASE_VALUE = (FINAL_TOTAL_ROUND*this.EXCHANGE_RATE);
    // this.BASE_BILL = (FINAL_BASE_VALUE).toFixed(2);
  }
  
  FilterExpHead(code:any){
    this.exphead_list = [];
    this.sampel_exphead_list.forEach((element:any)=>{
      if(element.DOCTYPE_CODE == code){
         this.exphead_list.push(element);
      }
    })
  }

  ChangeExpenseHead(){
    // var i = 0;
    // this.reimbursement_detail.forEach((ele:any) => { 
    //   ele.SGST_RATE = 0;
    //   ele.CGST_RATE = 0;
    //   ele.IGST_RATE = 0;
    //   // ele.PROJ_CODE = ele.PROJ_CODE;
    //   document.getElementById('sgst_val_'+i).setAttribute("disabled","true");
    //   document.getElementById('cgst_val_'+i).setAttribute("disabled","true");
    //   document.getElementById('igst_val_'+i).setAttribute("disabled","true");
    //     this.exphead_list.forEach((element:any) => {
    //       if(ele.EXPENSE_HEAD == element.EXPENSE_HEAD){
    //         // ele.PROJ_CODE = element.DEFAULT_PROJECT;            
    //         ele.HSN_CODE = element.HSN_CODE;
    //         ele.EXPENSE_GL = element.EXPENSE_GL;
    //       }
    //       if(this.GST_CLASS == true){
    //         if(this.LOCATION_COUNTRY == this.VENDOR_COUNTRY){
    //           if(element.EXPENSE_HEAD == ele.EXPENSE_HEAD)  {
    //                 if(this.LOCATION_STATE == this.VENDOR_STATE){
    //                   ele.SGST_RATE = element.SGST_RATE;
    //                   ele.CGST_RATE = element.CGST_RATE;
    //                   document.getElementById('sgst_val_'+i).removeAttribute("disabled") 
    //                   document.getElementById('cgst_val_'+i).removeAttribute("disabled") 
    //                 }else{
    //                   ele.IGST_RATE = element.IGST_RATE;
    //                   document.getElementById('igst_val_'+i).removeAttribute("disabled")
    //                 }
    //           }     
    //         }    
    //       } 
    //     });
    // });
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 200);
  }

  RemoveReimbursementIndex(index:any){
    this.reimbursement_detail.forEach((element:any,index1:any)=>{
      if(index == index1){
         this.reimbursement_detail.splice(index1,1)
      }
    });
    this.CalculateFinalAmount();
  }

 f_downloadDocument(file: any) {
    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetFile, { DOCUMENT_FILENAME: file.DOCUMENT_FILENAME }).then(res => {
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

  ChangeDate(){
    this.REIMBURSEMENT_DATE = this.datePipe.transform(new Date(this.REIMBURSEMENT_DATE), 'dd-MMM-yyyy')
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 100);
  }
  
  ChangeDate1(){
    this.DUE_DATE = this.datePipe.transform(new Date(this.PAY_BY_DATE), 'dd-MMM-yyyy')
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 100);
  }

  GetSelectCurrency(code:any){
    if( this.COMPANY_CURRENCY == code){
      this.isExchangeRate = true;
      this.EXCHANGE_RATE = 1;
      this.CalculateFinalAmount();
    }else {
      this.isExchangeRate = false;
    }
    // setTimeout(() => {
    //   $('.selectpicker').selectpicker('refresh').trigger('change');
    // }, 100);
  }

  ChangeTDS(){
    if(this.TDS_CODE != "" && this.TDS_CODE != null){
      this.tds_code_list.forEach(element => {
        if(element.TDS_CODE == this.TDS_CODE){
           this.TDS_RATE = element.TDS_PERCENT;
          var TDS_AMT = (Math.ceil((parseFloat(this.TDS_RATE) * this.TDS_APPLICABLE/100))).toFixed(2); 
          this.TDS_AMT= TDS_AMT;
          var BASE_BILL = this.TOTAL_BILL - this.TDS_AMT;
          this.BASE_BILL= BASE_BILL;
        }
      });
    }
  }

  selectDocument(event: any) {
    const file = event.target.files[0];
    const extension1 = event.target.files[0].name.split(".");
    let ext1 = extension1[extension1.length - 1].toUpperCase();
    if(this.uploadedDocument.length > 4){
      this.toast.warning('Upload your expense images & pdf valid only five');
      return
    }
    if (file) {
      // 1 MB = 1048576 bytes
      const maxFileSize = 5242880 ;
      if (file.size > maxFileSize) {
        this.toast.warning('Upload your expense' + ' ' + ext1 + ' ' + 'file size less than 5MB');
        return
      } 
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
              DOC_SRNO: this.uploadedDocument.length + 1,
              DOCUMENT_TYPE:  '.' + extension[extension.length - 1],
              UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
              UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
              BASE64: b64
            }
          )
          this.uploadedDocument.forEach((element:any)=>{
            if(element.DOCUMENT_FILENAME == event.target.files[i].name){
              this.toast.warning('This expense documnet added previously');
              return
            }else {
              return true
            }
            })
          this.uploadDoc();
        }
        this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
      }
    }

    uploadDoc() {
      for (let i = 0; i < this.uploadingFiles.length; i++) {
        this.uploadedDocument.push(this.uploadingFiles[i])
      }
      this.fileInput.nativeElement.value = "";
      this.uploadingFiles = []
      this.SelectedFileName = "";
    }

    removeDoc(fileIndex: number) {
      this.uploadedDocument.splice(fileIndex, 1);
    }

  SaveReimbursement(val:any){
   if(!this.sharedService.isValid(this.EMP_CODE)){
       this.toast.error('Select a Employee')
       return
   }
    if(!this.sharedService.isValid(this.PROJ_CODE)){
      this.toast.error('Select a Project')
      return
      }
      if(!this.sharedService.isValid(this.REMARKS)){
        this.toast.error('Enter a Remarks')
        return
        }
  //   if(!this.sharedService.isValid(this.BILL_NO)){
  //     this.toast.error('Enter a Bill No')
  //     return
  //  }
  //  if(!this.sharedService.isValid(this.BILL_DATE)){
  //   this.toast.error('Select a Bill No')
  //   return
  //  }
  //  if(!this.sharedService.isValid(this.PAY_BY_DATE)){
  //   this.toast.error('Select a Pay by date')
  //   return
  //  }
  //  if(!this.sharedService.isValid(this.CURRENCY_CODE)){
  //   this.toast.error('Select a Currency')
  //   return
  //  }
  //  if(!this.sharedService.isValid(this.EXCHANGE_RATE)){
  //   this.toast.error('Enter a Exchange rate')
  //   return
  //  }
   for (const element of this.reimbursement_detail) {
    if (!this.sharedService.isValid(element.EXPENSE_HEAD)) {
      this.toast.error('Select a Exp head');
      return false;
    }
    if (element.QTY <= 0) {
      this.toast.error('Enter a Quantity is greater than zero.');
      return false;
    }
    if (element.PRICE <= 0) {
      this.toast.error('Enter a Price is greater than zero.');
      return false;
    }
    if (!this.sharedService.isValid(element.REMARKS)) {
      this.toast.error('Enter a Description');
      return false;
    }
    // if (!this.sharedService.isValid(element.PROJ_CODE)) {
    //   this.toast.error('Select a Project');
    //   return false;
    // }
  }; 
  if(this.uploadedDocument.length == 0){
    this.toast.error('Please Upload a Document')
    return
   }
   if(this.BASE_BILL==""){
    this.BASE_BILL=0
   }
   this.reimbursement_detail_copy= this.reimbursement_detail;
   this.reimbursement_detail_copy.forEach((element:any) => {
    element.PRICE=this.pipeService.removeCommaseprated((element.PRICE));
    element.APPROVED_AMOUNT=this.pipeService.removeCommaseprated((element.APPROVED_AMOUNT));
  });

    let data = {
      TYPE:"",
      REIMBURSEMENT: [{
        "REIMBURSEMENT_ID": this.REIMBURSEMENT_ID,
        "DOCTYPE_CODE": this.DOCTYPE_CODE,
        "COMPANY_CODE": this.COMPANY_CODE,
        "FYEAR": this.FYEAR,
        "LOCATION_CODE": this.LOCATION_CODE,
        "VOUCHER_NO": this.VOUCHER_NO,
        "PROJ_CODE": this.PROJ_CODE,
        "REIMBURSEMENT_DATE": this.REIMBURSEMENT_DATE,
        "REIMBURSEMENT_AMT": this.REIMBURSEMENT_AMT,
        "EMP_NO": this.EMP_CODE,
        "REMARKS": this.REMARKS,
        "PAY_TO": this.PAY_TO,
        "PO_ID": this.PO_ID,
        "BILL_NO": this.BILL_NO,
        "BILL_DATE": this.BILL_DATE,
        "PAY_BY_DATE": this.BILL_DATE,
        "CURRENCY_CODE": this.CURRENCY_CODE,
        "EXCHANGE_RATE": this.EXCHANGE_RATE,
        "BASE_BILL": this.BASE_BILL,
        "TDS_ON": this.TDS_ON,
        "TDS_AMT": this.TDS_AMT,
        "TDS_CODE": this.TDS_CODE,
        "TDS_RATE": this.TDS_RATE,
        "SGST_AMT": this.SGST_AMT,
        "CGST_AMT": this.CGST_AMT,
        "IGST_AMT": this.IGST_AMT,
        "ROUNDOFF": this.ROUNDOFF,
        "TOTAL_BILL": this.pipeService.removeCommaseprated(this.TOTAL_BILL),
        "CANCEL_IND": this.CANCEL_IND
      }],
      REIMBURSEMENT_DETAILS: this.reimbursement_detail_copy,
      IS_UPDATE: this.IS_UPDATE,
      IS_CANCLE: 0,
      REIMBURSEMENT_DOCUMENT: this.uploadedDocument
   }
  //console.log('data ->' , JSON.stringify(data))
  
  this.http.PostRequest(this.apiUrl.SaveReimbursement, data ).then((res:any) => {
    if (res.flag) {
      this.toast.success(res.msg)
      this.f_clearForm();
      this.isViewReimbursement=true;
      this.GetReimbursementList('ALL');
      this.spinner = false;
      if(val == 1){
         this.isViewReimbursement = true;
      }
    } else {
      this.toast.warning(res.msg)
      this.spinner = false;
    }
  });
  }

  editReimbursement(data:any){
    //console.log('data',data);
    //this.Total_Req_Amount=data.TOTAL_AMOUNT
    this.IsUpdate = "Update"
    this.isView=false;
    this.GetProjectList();
    this.exphead_list = [];
    this.exphead_list = this.sampel_exphead_list;
    this.isViewReimbursement = false;
    this.isCancel = true;
    this.IS_UPDATE = 1;
    this.REIMBURSEMENT_ID = data.REIMBURSEMENT_ID;
    this.GetReimbursementDetail(data.REIMBURSEMENT_ID,1);
  }
  viewReimbursement(data:any){
    console.log('data',data);
    this.TOTAL_BILL=data.TOTAL_AMOUNT
    this.Total_App_Amount=data.TOTAL_APPROVED_AMOUNT

    console.log('values-->',this.TOTAL_BILL,this.Total_App_Amount);
    
    this.isView=true;
    this.GetProjectList();
    this.exphead_list = [];
    this.exphead_list = this.sampel_exphead_list;
    this.isViewReimbursement = false;
    this.isCancel = true;
    this.IS_UPDATE = 1;
    this.REIMBURSEMENT_ID = data.REIMBURSEMENT_ID;
    this.GetReimbursementDetail(data.REIMBURSEMENT_ID,0);
  }

  Print(p_data:any){
    let data = {
      EXP_ID:p_data.EXP_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.PrintExpenseVoucher, data).then(res => {
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
            var file = new Blob([int8Array], { type: 'application/pdf;base64' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            //saveAs(data, res.filename);
          }
        // setTimeout(() => {
        //   $('.selectpicker').selectpicker('refresh').trigger('change');
        // }, 100);
        this.spinner = false;
    }, err => {
      this.spinner = false;
    });
  }
  CalculateApprovedFinalAmount(){

  }

}
