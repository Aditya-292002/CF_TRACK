import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { PipeService } from 'src/app/services/pipe.service';
declare var $: any;

@Component({
  selector: 'app-bank-multi-payment',
  templateUrl: './bank-multi-payment.component.html',
  styleUrls: ['./bank-multi-payment.component.css']
})
export class BankMultiPaymentComponent implements OnInit {

  spinner: boolean = false;
  form: FormGroup;
  TRXN_DATE: string = "";
  PAY_DATE: string = "";
  Adjust_Amt: number;
  task_search_val: string = '';
  data: any;
  TRXN_AMT:number;
  company_list:Array<any>=[];
  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    public validationService: ValidationService,   
    private pipeService: PipeService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.sharedService.formName = "Bank Multi Payment"
    this.form = this.formBuilder.group({
      COMPANY_CODE:  ["",Validators.required],
      LOCATION_CODE: ["",Validators.required],
      CUST_CODE: [""],
      VENDOR_NO:  [""],
      TDS_CODE:  [""],
      FYEAR: [""],
      REMARKS:  [""],
      TRXN_ID:  ["0"],
      TRXN_TYPE:  ["BP"],
      VOUCHER_NO:  [""],
      TRXN_DATE:  ["",Validators.required],
      PARTY_TYPE:  ["V"],
      EMP_NO:  [""],
      GL_NO:  ["0"],
      PAY_REFNO:  [""],
      PAY_DATE:  ["",Validators.required],
      BANK_CODE:  ["",Validators.required],
      TRXN_AMT:  ["",Validators.required],
      TRXN_AMT_1:  [""],
      TRXN_BASE:  ["",Validators.required],
     
      ADJUST_TOTAL : [""],
      BAL_TO_ADJUST : [""],
      KEY_VALUE:["",Validators.required],
      
      FINAL_AMT : [""],
    })
    this.f_addRow();
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;

  maxdate = new Date();
    today_date = new Date();
    today_date_s : any;
    min_date = new Date(new Date().getFullYear(), 0, 1);

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
    
         this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
         this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
         this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
         
  
         this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
       if(this.today_date_s > this.sharedService.loginUser[0].TO_DATE){
       this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.sharedService.loginUser[0].TO_DATE;
      }
      else{
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.today_date;
      }
         setTimeout(() => {
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
        this.GetBankCommonList();
        this.GetBankMultiPay_DocList();
      },150)
    }



  bank_list: Array<any> = [];
  location_list: Array<any> = [];
  _location_list: Array<any> = [];

  GetBankCommonList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetBankCommonList, {}).then(res => {
      if (res.flag) {    
        
        this.company_list = res.company_list;
        this.bank_list = res.bank_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
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

  RECGRP:string=""
  PARTY_CODE:string=""
  ChangeDocument(){
     
  }

  _detail_list: Array<any> = [];
  detail_list: Array<any> = [];
  GetBankMultiPay_DetailList(){
    this.spinner = true;
    this.detail_list = [];
    let data = {
      LISTTYPE : '',
      KEY_VALUE : this.form.getRawValue().KEY_VALUE,
      COMPANY_CODE : this.form.getRawValue().COMPANY_CODE,
      LOCATION_CODE : this.form.getRawValue().LOCATION_CODE
    }
      this.http.PostRequest(this.apiUrl.GetBankMultiPay_DocWithDetail, data).then(res => {
        if (res.flag) {
          console.log(res.doc_detail_list);
          this.detail_list = res.doc_detail_list;


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
  showbill(){
    //this.GetBankMultiPay_DocWithDetail(); 
    this.GetBankMultiPay_DetailList();
  }

  doc_list: Array<any> = [];
  GetBankMultiPay_DocList(){
    this.spinner = true;
    let data = {
      LISTTYPE : 'list',
      COMPANY_CODE : this.form.getRawValue().COMPANY_CODE,
      LOCATION_CODE : this.form.getRawValue().LOCATION_CODE
    }
      this.http.PostRequest(this.apiUrl.GetBankMultiPay_DocWithDetail, data).then(res => {
        if (res.flag) {
          this.doc_list = res.doc_detail_list;


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

  isEnabled : boolean= false;
  CalculateAdjustAmount(){
    this.isEnabled = true;
    var TOTAL_ADJUST = 0;
    var TOTAL_BALANCE = 0;
    this._detail_list.forEach(element =>{
      //if(element.DR_CR == "D"){

        TOTAL_ADJUST += parseFloat(element.ADJUST_AMT);
      // }
      // else if(element.DR_CR == "C"){
      //   TOTAL_ADJUST = TOTAL_ADJUST - parseFloat(element.ADJUST_AMT);
      // }
    });
    if(TOTAL_ADJUST != 0){
      this.form.get('TRXN_AMT').setValue(this.pipeService.setCommaseprated((TOTAL_ADJUST).toFixed(2)));
    
    }
    

    var TRXN_AMT_1 = 0;
    if(this.form.getRawValue().TRXN_AMT_1 != "" || this.form.getRawValue().TRXN_AMT_1 != undefined || this.form.getRawValue().TRXN_AMT_1 != null){
      TRXN_AMT_1 = this.form.getRawValue().TRXN_AMT_1;
    }

    var TRXN_AMT = 0;
    if(this.form.getRawValue().TRXN_AMT != "" || this.form.getRawValue().TRXN_AMT != undefined || this.form.getRawValue().TRXN_AMT != null){
      TRXN_AMT = this.form.getRawValue().TRXN_AMT;
    }
    if(TRXN_AMT != null || TRXN_AMT != undefined ){
      if(TRXN_AMT == 0 || TRXN_AMT.toString() == ""){
        this.form.get('TRXN_AMT').setValue(TRXN_AMT_1);
      }
    }
    
    

    TRXN_AMT_1 = Number(this.pipeService.removeCommaseprated(TRXN_AMT_1));
    TRXN_AMT = Number(this.pipeService.removeCommaseprated(TRXN_AMT));
    this.form.get('TRXN_BASE').setValue((TRXN_AMT).toFixed(2));

    var TRXN_BASE = 0;
    if(this.form.getRawValue().TRXN_BASE != "" || this.form.getRawValue().TRXN_BASE != undefined || this.form.getRawValue().TRXN_BASE != null){
      TRXN_BASE = this.form.getRawValue().TRXN_BASE;
    }
    this.form.get('TRXN_BASE').setValue(this.pipeService.setCommaseprated(TRXN_BASE))
     
    //this.form.get('ADJUST_TOTAL').setValue((TOTAL_ADJUST).toFixed(2));
    //this.form.get('BAL_TO_ADJUST').setValue(((TRXN_BASE) - (TOTAL_ADJUST)).toFixed(2));
    
    this.form.get('ADJUST_TOTAL').setValue(this.pipeService.setCommaseprated((TOTAL_ADJUST).toFixed(2)))
    this.form.get('BAL_TO_ADJUST').setValue(this.pipeService.setCommaseprated(((TRXN_AMT) - (TOTAL_ADJUST)).toFixed(2)))
    
    
    this.form.get('FINAL_AMT').setValue(this.pipeService.setCommaseprated(((Number(TRXN_BASE))).toFixed(2)))
    
  }



  f_addRow(){
    this._detail_list = [];
  this.detail_list.forEach(element =>{
    if(element.ACTIVE == 1){
      this._detail_list.push(element);
      
      
    }
   });
   
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
  this.CalculateAdjustAmount();
}

f_validateFormData(){
  this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
    this.form.get('TRXN_AMT_1').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_AMT_1)));
    this.form.get('FINAL_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().FINAL_AMT)));
      
  if (this.form.controls['COMPANY_CODE'].invalid) {
    this.toast.warning('Please select company');
    return false;
  } else if (this.form.controls['LOCATION_CODE'].invalid) {
    this.toast.warning('Please select location');
    return false;
  }  else if (this.form.controls['TRXN_DATE'].invalid) {
    this.toast.warning('Please select receipt date');
    return false;
  } 
   
  else if (this.form.controls['BANK_CODE'].invalid) {
    this.toast.warning('Please select bank');
    return false;
  }
  else if (this.form.controls['KEY_VALUE'].invalid) {
    this.toast.warning('Please select doc no');
    return false;
  }
   
    else if (this.form.controls['TRXN_AMT'].invalid) {
      this.toast.warning('Please enter received amount');
      return false;
    }
     else if (this.form.controls['TRXN_BASE'].invalid) {
      this.toast.warning('Please enter received base');
      return false;
    }
    else if (this.form.getRawValue().BAL_TO_ADJUST < 0 ) {
      this.toast.warning('Balance to adjust amount can not less than zero.');
      return false;
    }
    // else if (this.form.getRawValue().FINAL_AMT <= 0 ) {
    //   this.toast.warning('Bank payment amount can not be zero or less than zero.');
    //   return false;
    // }
    // else if (this.form.getRawValue().TRXN_AMT_1 !=  this.form.getRawValue().FINAL_AMT ) {
    //   this.toast.warning('Both bank payment amount should be match.');
    //   return false;
    // }

    this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.setCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
  
    
  return true;
    
}

  // clear form 
  f_clearForm(){
    this.form.reset();

    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    
       this.form.get('TRXN_TYPE').setValue("BP");
       
       this.detail_list = [];
       this._detail_list = [];
       
      
       this._DATE = "";
       this._DATE1 = "";
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  
  isSubmited: boolean = false;
  bankSave(){
    this.isSubmited = true;
    if(this.f_validateFormData()){
      
      this.form.get('TRXN_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_AMT)));
      this.form.get('TRXN_BASE').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_BASE)));
      this.form.get('FINAL_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().FINAL_AMT)));
      this.form.get('ADJUST_TOTAL').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().ADJUST_TOTAL)));
      this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
      
      let data = {
        TYPE:"",
        SaveBankPayment:this.form.value,
        SaveBankPaymentDetail: this._detail_list,
      }

    console.log(data);
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.SaveBankMultiPayment, data).then(res => {
        console.log(res);
        if (res.flag) {
          this.toast.success(res.msg)
          this.isSubmited = false;
          this.f_clearForm();
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
          
          this.toast.warning(res.msg)
        }
      }, err => {
        this.spinner = false;
      });
    }
  }

  _DATE: any = ''
  ChangeDate(){
    this.PAY_DATE = this.datePipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')
  
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  _DATE1: any = ''
  ChangeReceiptDate(){
    this.TRXN_DATE = this.datePipe.transform(new Date(this._DATE1), 'dd-MMM-yyyy')
  
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }



}

