import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { log } from 'console';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-reimbursementsapproval',
  templateUrl: './reimbursementsapproval.component.html',
  styleUrls: ['./reimbursementsapproval.component.css']
})
export class ReimbursementsapprovalComponent implements OnInit {
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
    isViewReimbursement:boolean = true;
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
    REIMBURSEMENT_AMT:any;
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
    all_reimbursement_list:any = [];
    REIMBURSEMENT_ID:any = 0;
    UserDetails:any = {};
    USER_ID:any;
    CANCEL_IND:any = 0;
    reimbursement_header:any = [];
    IsUpdate:any = "Save";
    PROJ_CODE:any;
    all_employee_list: Array<any> = [];
    search_user: any;
    sampel_all_reimbursement_list: Array<any> = [];
    APPROVED_AMOUNT:any=0
    warning:string=''
  openModel: boolean;
  reimbursement_detail_copy: any;
    rejectModel:boolean=false
    REJECT_REASON:string="";
    Total_Req_Amount:any=0;
    differenceOfreqAndApp:boolean=false;
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
      this.sharedService.formName = "Reimbursement Approval";
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
      this.GetReimbursementList('P',0);
      this.getAllEmployee();
      // setTimeout(() => {
      //   $('.selectpicker').selectpicker('refresh').trigger('change');
      // }, 100);
    }

    
    GetReimbursementList(val:any,number:any){
      //approve model flag
      this.openModel=false;
      let data = {
        LISTTYPE:val
      }
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetReimbursementList, data).then(res => {
        if (res.flag) {
          this.all_reimbursement_list = res.reimbursement_list;
          this.sampel_all_reimbursement_list = this.all_reimbursement_list;
          if(number == 1){
            this.isViewReimbursement = true;
          }
          this.isCancel = false;
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

    getAllEmployee() {
      let data = {
        LISTTYPE: "all",
      }
      this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(res => {
        if (res.flag) {
          this.all_employee_list = res.employee_list;
          this.search_user = this.sharedService.loginUser[0].USERID;
          this.EMP_CODE=this.sharedService.loginUser[0].EMP_CODE
          //this. f_searchUserData();
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      });
    }

    f_searchUserData() {
      let EMP_CODE = '';
      this.all_employee_list.forEach((element:any) =>{
        if(this.search_user == element.USERID){
          EMP_CODE = element.EMP_CODE
        }
      });
      if (this.search_user != "") {
        this.all_reimbursement_list = [];
        this.sampel_all_reimbursement_list.forEach((element:any)=>{
          if(element.EMP_NO == EMP_CODE){
            this.all_reimbursement_list.push(element)
          }
        });
      }
    }
  
  GetReimbursementDetail(REIMBURSEMENT_ID:any){
    let data = {
      REIMBURSEMENT_ID: REIMBURSEMENT_ID
    }
    this.spinner = true;
    this.reimbursement_detail = [];
    this.reimbursement_header = [];
    this.http.PostRequest(this.apiUrl.GetReimbursementDetail, data).then(res => {
      if (res.flag) {
        console.log('res headerlist',res.reimbursement_header);
      //  this.Total_App_Amount= this.reimbursement_header[0].REIMBURSEMENT_AMT
        this.reimbursement_detail = res.reimbursement_detail;
        this.reimbursement_header = res.reimbursement_header;
        this.uploadedDocument = res.expense_document_detail;
        this.REIMBURSEMENT_DATE = this.reimbursement_header[0].REIMBURSEMENT_DATE,
       //  this.Total_Req_Amount= this.reimbursement_header[0]?.REIMBURSEMENT_AMT
        this.Total_Req_Amount =this.pipeService.setCommaseprated((+this.reimbursement_header[0].REIMBURSEMENT_AMT).toFixed(2)),
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
        this.ROUNDOFF = this.reimbursement_header[0].ROUNDOFF,
        this.TOTAL_BILL =0;
        this.CANCEL_IND = this.reimbursement_header[0].CANCEL_IND
        this.PROJ_CODE=this.reimbursement_detail[0].PROJ_CODE
        this.spinner = false;
        this.reimbursement_detail.forEach((element:any) => {
          element.PRICE=this.pipeService.setCommaseprated((+element.PRICE).toFixed(2));
          element.APPROVED_AMOUNT=this.pipeService.setCommaseprated((+element.APPROVED_AMOUNT).toFixed(2));
        });
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
        EXPENSE_AMOUNT: "0",
        QTY:"1",
        PRICE: "0",
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
      this.EMP_CODE = '',
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
      this.differenceOfreqAndApp=false;
      this.TOTAL_BILL = 0;
      this.REIMBURSEMENT_AMT = 0;
      // this.reimbursement_detail.forEach((element:any) => {
      //     element.TOTAL_AMOUNT = element.PRICE*element.QTY
      //     element.REIMBURSEMENT_AMOUNT = element.TOTAL_AMOUNT;
      //     this.TOTAL_BILL += element.REIMBURSEMENT_AMOUNT;
      //     this.REIMBURSEMENT_AMT = this.TOTAL_BILL;
      //   });
     

      this.reimbursement_detail.forEach((element:any) => {
        element.TOTAL_AMOUNT = element.APPROVED_AMOUNT*element.QTY
        element.APPROVED_AMOUNT = element.TOTAL_AMOUNT/element.QTY;
        this.TOTAL_BILL += element.TOTAL_AMOUNT;
        this.REIMBURSEMENT_AMT = this.TOTAL_BILL;
      });
      

      console.log('values-->',this.Total_Req_Amount ,this.TOTAL_BILL);
      this.TOTAL_BILL=this.pipeService.setCommaseprated((+this.TOTAL_BILL).toFixed(3));

      if(this.Total_Req_Amount==this.TOTAL_BILL){
        this.differenceOfreqAndApp=false;
      }else if(this.TOTAL_BILL<this.Total_Req_Amount){
        this.differenceOfreqAndApp=true;
      }else{
        this.differenceOfreqAndApp=true;
      }

      
     
      // var EXPENSE_AMOUNT= 0;
      // var SGST_VALUE= 0;
      // var CGST_VALUE= 0;
      // var IGST_VALUE= 0;
      // var TOT_VALUE= 0;
      // var FINAL_TOTAL_ROUND = 0;
      // var ROUNDOFF = 0;
      // this.reimbursement_detail.forEach((element:any) => {
      //   element.EXPENSE_AMOUNT = element.QTY*element.PRICE;
      //   EXPENSE_AMOUNT += parseFloat(element.EXPENSE_AMOUNT);    
      //   if(Number(element.SGST_AMOUNT) == 0)  {
      //     element.SGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.SGST_RATE)/100).toFixed(2);     
      //   }
      //   if(element.CGST_AMOUNT == 0)  {
      //     element.CGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.CGST_RATE)/100).toFixed(2);    
      //   }
      //   if(element.IGST_AMOUNT == 0)  {
      //     element.IGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.IGST_RATE)/100).toFixed(2);     
      //   }           
      //   element.TOTAL_AMOUNT =  (EXPENSE_AMOUNT+parseFloat(element.SGST_AMOUNT)+parseFloat(element.CGST_AMOUNT)+parseFloat(element.IGST_AMOUNT)).toFixed(2);
      //   element.BASE_VALUE = (this.EXCHANGE_RATE * EXPENSE_AMOUNT).toFixed(2);
      //   SGST_VALUE += parseFloat(element.SGST_AMOUNT);
      //   CGST_VALUE += parseFloat(element.CGST_AMOUNT);
      //   IGST_VALUE += parseFloat(element.IGST_AMOUNT);
      //   TOT_VALUE += parseFloat(element.TOTAL_AMOUNT);
      // });
      // this.REIMBURSEMENT_AMT = (EXPENSE_AMOUNT).toFixed(2);
      // this.TDS_APPLICABLE = (EXPENSE_AMOUNT).toFixed(2);
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
     if(val == 1){
      var type = ""
      this.CANCEL_IND = true;
      if(this.REJECT_REASON==""){
      //  this.rejectModel=true;
        this.toast.error('Enter reject remark its mandatory');
        return;
      }
      this.rejectModel=false
     }else if(val == 0){
      var type = "APPROVE"
      if(this.REJECT_REASON==""){
      //  this.rejectModel=true;
        this.toast.error('Enter Approve remark its mandatory');
        return;
      }
      //this.REJECT_REASON=""
     }
     this.reimbursement_detail_copy= this.reimbursement_detail
     this.reimbursement_detail_copy.forEach((element:any) => {

      element.PRICE=this.pipeService.removeCommaseprated((element.PRICE));
      // element.APPROVED_AMOUNT=this.pipeService.removeCommaseprated((element.APPROVED_AMOUNT));
    });
  
      let data = {
        TYPE: type,
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
          "CANCEL_IND": this.CANCEL_IND,
          "REJECT_REMARKS":this.REJECT_REASON
        }],
        REIMBURSEMENT_DETAILS: this.reimbursement_detail_copy,
        IS_UPDATE: 1,
        IS_CANCLE: val,
        REIMBURSEMENT_DOCUMENT: this.uploadedDocument
     }
     //console.log('this.reimbursement_detail',data);
     
    //console.log('data ->' , JSON.stringify(data))
 // return

    this.http.PostRequest(this.apiUrl.SaveReimbursement, data ).then((res:any) => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.f_clearForm();
        this.spinner = false;
        // this.isViewReimbursement = true;
        this.GetReimbursementList('P',1);
        // if(val == 1){
        //    this.isViewReimbursement = true;
        // }else{
        //   this.isViewReimbursement=false;
        // }
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    });
    }
  
    editReimbursement(data:any){
    this.IsUpdate = "Approve";
      this.GetProjectList();
      this.exphead_list = [];
      this.exphead_list = this.sampel_exphead_list;
      this.isViewReimbursement = false;
      this.isCancel = true;
      this.IS_UPDATE = 1;
      this.REIMBURSEMENT_ID = data.REIMBURSEMENT_ID;
      this.GetReimbursementDetail(data.REIMBURSEMENT_ID);
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


    onClickConfirmation(value:any){
      if(value=='A'){
        console.log('status');
        
        //this.warning="Are you sure ,you want to approve?"
        this.saveValidation()
      }
      if(value=='R'){
        this.rejectModel=true;
       // this.warning="Are you sure ,you want to reject?"
      }
    }
    saveValidation(){
      console.log('savevalidastion');
      
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
     if (element.APPROVED_AMOUNT <= 0) {
      this.toast.error('Enter a Approved Amount is greater than zero.');
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
   this.openModel=true;
  }
  onCancelClick(){
    this.openModel=false;
  }
  
}
