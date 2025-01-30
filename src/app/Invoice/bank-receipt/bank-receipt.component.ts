import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { parse } from 'querystring';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { PipeService } from 'src/app/services/pipe.service';
declare var $: any;
@Component({
  selector: 'app-bank-receipt',
  templateUrl: './bank-receipt.component.html',
  styleUrls: ['./bank-receipt.component.css']
})
export class BankReceiptComponent implements OnInit { 

  spinner: boolean = false;
  form: FormGroup
  TRXN_DATE: string = "";
  PAY_DATE: string = "";
  Adjust_Amt: number;
  task_search_val: string = '';
  data: any;
  TRXN_AMT:number;
dummyCustomerList:any=[];
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
    this.sharedService.formName = "Bank Receipt"
    this.form = this.formBuilder.group({
      COMPANY_CODE:  ["",Validators.required],
      LOCATION_CODE: ["",Validators.required],
      CUST_CODE: [""],
      CURRENCY_CODE:["INR",Validators.required],
      VENDOR_NO:  [""],
      TDS_CODE:  [""],
      FYEAR: [""],
      REMARKS:  [""],
      TRXN_ID:  ["0"],
      TRXN_TYPE:  ["BR"],
      VOUCHER_NO:  [""],
      TRXN_DATE:  ["",Validators.required],
      PARTY_TYPE:  ["C"],
      EMP_NO:  [""],
      GL_NO:  ["0"],
      PAY_REFNO:  [""],
      PAY_DATE:  ["",Validators.required],
      BANK_CODE:  ["",Validators.required],
      EXCHANGE_RATE:  ["1",Validators.required],
      TRXN_AMT:  ["",Validators.required],
      TRXN_AMT_1:  [""],
      TRXN_BASE:  ["",Validators.required],
      TDS_ON:  ["0"],
      TDS_AMT:  ["0"],
      FINAL_AMT:  ["",Validators.required],
      OTH_CHARGEGL1: ["0"],
      OTH_CHARGEGL2: ["0"],
      OTH_CHARGEAMT1: ["0"],
      OTH_CHARGEAMT2: ["0"],
      OTH_CURRENCY_CODE1: ["INR"],
      OTH_CURRENCY_CODE2: ["INR"],
      Adjust_Amt : "",
      ADJUST_TOTAL : [""],
      BAL_TO_ADJUST : [""],
      PROJ_CODE : [""]

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
       this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE );
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
    
       this.changeCurrency();
       this.GetProjectList();
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
      this.GetBankCommonList()
    },150)
  }

  radioSelected0:boolean = true
  radioSelected1:boolean = false
  radioSelected2:boolean = false
  radioSelected3:boolean = false
  radioSelected4:boolean = false
  VENDOR_NO:string=""
  EMP_NO:string=""
  BANK_CODE:string=""
  GL_NO:string=""
  CUST_CODE:string=""
  showContent(para: string = ''){
    if(para == 'C'){
      console.log(para)
      this.radioSelected0 = true;
      this.radioSelected1 = false;
      this.radioSelected2 = false;
      this.radioSelected3 = false;
      this.radioSelected4 = false;
      this.form.get('VENDOR_NO').setValue("");
      //this.form.get('BANK_CODE').setValue("");
      this.form.get('EMP_NO').setValue("");
      this.form.get('GL_NO').setValue("0");
    } 
     if(para == 'V'){
       console.log(para)
      this.radioSelected1 = true;
      this.radioSelected0 = false;
      this.radioSelected2 = false;
      this.radioSelected3 = false;
      this.radioSelected4 = false;
      this.form.get('CUST_CODE').setValue("");
      //this.form.get('BANK_CODE').setValue("");
      this.form.get('EMP_NO').setValue("");
      this.form.get('GL_NO').setValue("0");
    } 
    // if(para == 'B'){
    //      console.log(para)
    //   this.radioSelected2 = true;
    //   this.radioSelected1 = false;
    //   this.radioSelected0 = false;
    //   this.radioSelected3 = false;
    //   this.radioSelected4 = false;
    //   this.form.get('CUST_CODE').setValue("");
    //   this.form.get('VENDOR_NO').setValue("");
    //   this.form.get('EMP_NO').setValue("");
    //   this.form.get('GL_NO').setValue("0");
    // } 
    if(para == 'E'){
         console.log(para)
      this.radioSelected3 = true;
      this.radioSelected1 = false;
      this.radioSelected2 = false;
      this.radioSelected0 = false;
      this.radioSelected4 = false;
      this.form.get('CUST_CODE').setValue("");
      this.form.get('VENDOR_NO').setValue("");
      //this.form.get('BANK_CODE').setValue("");
      this.form.get('GL_NO').setValue("0");
    } 
     if(para == 'G'){
      console.log(para)
      this.radioSelected4 = true;
      this.radioSelected1 = false;
      this.radioSelected2 = false;
      this.radioSelected3 = false;
      this.radioSelected0 = false;
      this.form.get('CUST_CODE').setValue("");
      this.form.get('VENDOR_NO').setValue("");
      //this.form.get('BANK_CODE').setValue("");
      this.form.get('EMP_NO').setValue("");
    }
     
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }

  company_list: Array<any> = [];
  vendor_list: Array<any> = [];
  currency_list: Array<any> = [];
  other_currency_list: Array<any> = [];
  bank_list: Array<any> = [];
  gl_list: Array<any> = [];
  customer_list: Array<any> = [];
  employee_list: Array<any> = [];
  location_list: Array<any> = [];
  _location_list: Array<any> = [];
  tds_code_list: Array<any> = [];

  bankreceipt_detail: Array<any> = [];

  GetBankCommonList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetBankCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.dummyCustomerList =res.customer_list;
        this.currency_list = res.currency_list;
        this.other_currency_list = res.currency_list;
        
        this.customer_list = res.customer_list;
        this.bank_list = res.bank_list;
        this.employee_list = res.employee_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.gl_list = res.gl_list;
        this.vendor_list = res.vendor_list;
        this.tds_code_list = res.tds_code_list;
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
  ChangeCustomer(){
    this.RECGRP = "C";    
    this.PARTY_CODE=this.form.getRawValue().CUST_CODE;
   
    this.customer_list.forEach(element => {
      if(element.CUST_CODE == this.form.getRawValue().CUST_CODE){
          this.form.get("CURRENCY_CODE").setValue(element.CUST_CURRENCY); 
          this.changeCurrency();         
      }  
    });
    //this.GetBankReceiptDetail("C",this.form.getRawValue().CUST_CODE);  
  }

  ChangeGL(){
    this.RECGRP = "G";    
    this.PARTY_CODE=this.form.getRawValue().GL_NO;
    this.form.get("CURRENCY_CODE").setValue("INR"); 
    this.changeCurrency();  
    //this.GetBankReceiptDetail("G",this.form.getRawValue().GL_NO);  
  }

  ChangeEmployee(){
    this.RECGRP = "E";    
    this.PARTY_CODE=this.form.getRawValue().EMP_NO;
    this.form.get("CURRENCY_CODE").setValue("INR"); 
    this.changeCurrency(); 
    //this.GetBankReceiptDetail("E",this.form.getRawValue().EMP_NO);  
  }

  ChangeVendor(){
    this.RECGRP = "V";    
    this.PARTY_CODE=this.form.getRawValue().VENDOR_NO;
    
    this.form.get("CURRENCY_CODE").setValue("INR"); 
    this.changeCurrency(); 
    this.vendor_list.forEach(element => {
      if(element.VENDOR_NO == this.form.getRawValue().VENDOR_NO){
        this.form.get("CURRENCY_CODE").setValue(element.VEND_CURRENCY); 
        this.changeCurrency();         
      } 
    });
    //this.GetBankReceiptDetail("V",this.form.getRawValue().VENDOR_NO);  
  }

  showbill(){
    this.GetBankReceiptDetail(this.RECGRP,this.PARTY_CODE); 
  }
  GetBankReceiptDetail(RECGRP,PARTY_CODE){
    this.spinner = true;
    let data = {
      RECGRP : RECGRP,
      PARTY_CODE:PARTY_CODE,
      COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
      CURRENCY_CODE:this.form.getRawValue().CURRENCY_CODE,
    }
      this.http.PostRequest(this.apiUrl.GetBankReceiptDetail, data).then(res => {
        if (res.flag) {
          this.bankreceipt_detail = res.bankreceipt_detail;
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
    this._BANK_Detail.forEach(element =>{
      if(element.DR_CR == "D"){
        TOTAL_ADJUST += parseFloat(element.ADJUST_AMT);
      }
      else if(element.DR_CR == "C"){
        TOTAL_ADJUST = TOTAL_ADJUST - parseFloat(element.ADJUST_AMT);
      }
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
        TRXN_AMT = TRXN_AMT_1;
      }
    }
    
    

    TRXN_AMT_1 = Number(this.pipeService.removeCommaseprated(TRXN_AMT_1));
    TRXN_AMT = Number(this.pipeService.removeCommaseprated(TRXN_AMT));
    this.form.get('TRXN_BASE').setValue(((TRXN_AMT == 0?TRXN_AMT_1:TRXN_AMT) * this.form.getRawValue().EXCHANGE_RATE).toFixed(2));

    var TRXN_BASE = 0;
    if(this.form.getRawValue().TRXN_BASE != "" || this.form.getRawValue().TRXN_BASE != undefined || this.form.getRawValue().TRXN_BASE != null){
      TRXN_BASE = this.form.getRawValue().TRXN_BASE;
    }
    this.form.get('TRXN_BASE').setValue(this.pipeService.setCommaseprated(TRXN_BASE))
     
    //this.form.get('ADJUST_TOTAL').setValue((TOTAL_ADJUST).toFixed(2));
    //this.form.get('BAL_TO_ADJUST').setValue(((TRXN_BASE) - (TOTAL_ADJUST)).toFixed(2));
    if(this._BANK_Detail.length>0){
      this.form.get('ADJUST_TOTAL').setValue(this.pipeService.setCommaseprated((TOTAL_ADJUST).toFixed(2)))
      this.form.get('BAL_TO_ADJUST').setValue(this.pipeService.setCommaseprated(((TRXN_AMT) - (TOTAL_ADJUST)).toFixed(2)))
      
    }
    else{
      
        this.form.get('ADJUST_TOTAL').setValue(this.pipeService.setCommaseprated((0).toFixed(2)))
        this.form.get('BAL_TO_ADJUST').setValue(this.pipeService.setCommaseprated((0).toFixed(2)))
        
    }
    

    
    var OTH_CURRENCY_CODE1 = "INR";
    if(this.form.getRawValue().OTH_CURRENCY_CODE1 != "" || this.form.getRawValue().OTH_CURRENCY_CODE1 != undefined || this.form.getRawValue().OTH_CURRENCY_CODE1 != null){
      OTH_CURRENCY_CODE1 = this.form.getRawValue().OTH_CURRENCY_CODE1;
    }
    

    var OTH_CURRENCY_CODE2 = "INR";
    if(this.form.getRawValue().OTH_CURRENCY_CODE2 != "" || this.form.getRawValue().OTH_CURRENCY_CODE2 != undefined || this.form.getRawValue().OTH_CURRENCY_CODE2 != null){
      OTH_CURRENCY_CODE2 = this.form.getRawValue().OTH_CURRENCY_CODE2;
    }

    var OTH_CHARGEAMT1 = 0;
    var FINAL_OTH_CHARGEAMT1 = 0;
    if(this.form.getRawValue().OTH_CHARGEAMT1 != "" || this.form.getRawValue().OTH_CHARGEAMT1 != undefined || this.form.getRawValue().OTH_CHARGEAMT1 != null){
      OTH_CHARGEAMT1 = this.form.getRawValue().OTH_CHARGEAMT1;
      FINAL_OTH_CHARGEAMT1 = OTH_CHARGEAMT1;
    }

    
    if(OTH_CURRENCY_CODE1 != "INR"){
      FINAL_OTH_CHARGEAMT1 = (OTH_CHARGEAMT1 * this.form.getRawValue().EXCHANGE_RATE);
    }

    var OTH_CHARGEAMT2 = 0;    
    var FINAL_OTH_CHARGEAMT2 = 0;
    if(this.form.getRawValue().OTH_CHARGEAMT2 != "" || this.form.getRawValue().OTH_CHARGEAMT2 != undefined || this.form.getRawValue().OTH_CHARGEAMT2 != null){
      OTH_CHARGEAMT2 = this.form.getRawValue().OTH_CHARGEAMT2;
      FINAL_OTH_CHARGEAMT2 = OTH_CHARGEAMT2;
    }
    if(OTH_CURRENCY_CODE2 != "INR"){
      FINAL_OTH_CHARGEAMT2 = (OTH_CHARGEAMT2 * this.form.getRawValue().EXCHANGE_RATE);
    }

    

    var TDS_ON = 0;
    if(this.form.getRawValue().TDS_ON != "" || this.form.getRawValue().TDS_ON != undefined || this.form.getRawValue().TDS_ON != null){
      TDS_ON = this.form.getRawValue().TDS_ON;
    }
    
    //this.form.get('TDS_AMT').setValue(((TDS_ON * this.TDS_PERCENT)/100).toFixed(2));
    //this.form.get('TDS_AMT').setValue(this.pipeService.setCommaseprated(((TDS_ON * this.TDS_PERCENT)/100).toFixed(2)))
    var TDS_AMT = 0;
    if(this.form.getRawValue().TDS_AMT != "" || this.form.getRawValue().TDS_AMT != undefined || this.form.getRawValue().TDS_AMT != null){
      //TDS_AMT = this.form.getRawValue().TDS_AMT;
      TDS_AMT = this.pipeService.removeCommaseprated(this.form.getRawValue().TDS_AMT);
    }

    if(TDS_AMT != null || TDS_AMT != undefined ){
      if(TDS_AMT == 0 || TDS_AMT.toString() == ""){
        if((TRXN_AMT - TRXN_AMT_1)>0){
          this.form.get('TDS_AMT').setValue(((TRXN_AMT - TRXN_AMT_1).toFixed(2)))
        }
        
      }
    }
    
    //this.form.get('FINAL_AMT').setValue(((TRXN_BASE - TDS_AMT - OTH_CHARGEAMT1 - OTH_CHARGEAMT2)).toFixed(2));
   
    this.form.get('FINAL_AMT').setValue(this.pipeService.setCommaseprated(((TRXN_BASE - TDS_AMT - FINAL_OTH_CHARGEAMT1 - FINAL_OTH_CHARGEAMT2)).toFixed(2)))
  }

  changeCurrency(){
    if(this.form.getRawValue().CURRENCY_CODE == "INR"){
      //this.form.getRawValue().EXCHANGE_RATE = "1";
      
      this.form.get('EXCHANGE_RATE').setValue("1");
      this.form.get('OTH_CURRENCY_CODE1').setValue("INR");
      this.form.get('OTH_CURRENCY_CODE2').setValue("INR");
      document.getElementById('EXCHANGE_RATE').setAttribute("disabled","true"); 
      document.getElementById('OTH_CURRENCY_CODE1').setAttribute("disabled","true"); 
      document.getElementById('OTH_CURRENCY_CODE2').setAttribute("disabled","true"); 
      this.CalculateAdjustAmount();
    }
    else{  
      this.other_currency_list = [];
      this.currency_list.forEach(element => {
        if(element.CURRENCY_CODE == this.form.getRawValue().CURRENCY_CODE){

          this.other_currency_list.push(element);
        }
        if(element.CURRENCY_CODE == "INR"){

          this.other_currency_list.push(element);
        }

      });
      //this.other_currency_list = res.currency_list;
      document.getElementById('EXCHANGE_RATE').removeAttribute("disabled");
      document.getElementById('OTH_CURRENCY_CODE1').removeAttribute("disabled");
      document.getElementById('OTH_CURRENCY_CODE2').removeAttribute("disabled");
    }
    this.CalculateAdjustAmount();

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  TDS_PERCENT:any = 0;
  ChangeTds(){
    this.tds_code_list.forEach(    element =>{
      if(this.form.getRawValue().TDS_CODE == element.TDS_CODE){
        if(element.TDS_PERCENT != null || element.TDS_PERCENT != "" || element.TDS_PERCENT != undefined){
          
          this.TDS_PERCENT = element.TDS_PERCENT;
        }
        else{
          this.TDS_PERCENT = 0;
        }
      }
      
      
    });
    
    this.CalculateAdjustAmount();
  }
  _BANK_Detail: Array<any> = [];
  f_addRow(){
  //   this.bankreceipt_detail.push({
  //     COMPANY_CODE:"",
  //     LOCATION_CODE:"",
  //     FYEAR:"",
  //     TRAN_TYPE:"",
  //     FI_ID:"",
  //     ITEM_NO:"",
  //     ADJUST_AMT:"0",
  //     VOUCHER_NO:"",
  //     INVOICE_NO:"",
  //     INVOICE_DATE:"",
  //     DR_CR:"",
  //     INVOICE_AMT:"",
  //     BALANCE_AMT:"",
  //     VOUCHER_DATE:"",
  //     REF_PARTY:""

  // });
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
  this._BANK_Detail = [];
  this.bankreceipt_detail.forEach(element =>{
    if(element.ACTIVE == 1){
      this._BANK_Detail.push(element);
      // if(this._BANK_Detail.length == 0){
      //   this._BANK_Detail.push(element);
      // }
      // else{
      //   this._BANK_Detail.forEach(ele =>{
      //     if(Number(ele.COMPANY_CODE) != Number(element.COMPANY_CODE) && 
      //         Number(ele.LOCATION_CODE) != Number(element.LOCATION_CODE) &&
      //         Number(ele.FYEAR) != Number(element.FYEAR) &&
      //         ele.TRAN_TYPE != element.TRAN_TYPE && Number(ele.FI_ID) != Number(element.FI_ID)
      //         && Number(ele.ITEM_NO) != Number(element.ITEM_NO)){
      
      //           this._BANK_Detail.push(element);
      //     }
      //     //element.ADJUST_AMT += parseFloat(element.BALANCE_AMT);
      //    });
      // }
      
    }

    
    //element.ADJUST_AMT += parseFloat(element.BALANCE_AMT);
   });
   //this._BANK_Detail = this.bankreceipt_detail.filter(e=> e.ACTIVE == true );
  // this._BANK_Detail = this.bankreceipt_detail.filter(e=> e.ACTIVE == true );
  this.CalculateAdjustAmount();
}


  f_validateFormData(){
    this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
    this.form.get('TRXN_AMT_1').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_AMT_1)));
    this.form.get('TRXN_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_AMT)));// add a line
    this.form.get('FINAL_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().FINAL_AMT)));
      
    if (this.form.controls['COMPANY_CODE'].invalid) {
      this.toast.warning('Please select company');
      return false;
    } else if (this.form.controls['LOCATION_CODE'].invalid) {
      this.toast.warning('Please select location');
      return false;
    } else if (this.form.controls['TRXN_DATE'].invalid) {
      this.toast.warning('Please select receipt date');
      return false;
    } 
    // else if (this.form.controls['TRXN_ID'].invalid) {
    //   this.toast.warning('Please select receipt no.');
    //   return false;
    // } else if (this.form.controls['CUST_CODE'].invalid) {
    //   this.toast.warning('Please select customer');
    //   return false;
    // } else if (this.form.controls['VENDOR_NO'].invalid) {
    //   this.toast.warning('Please select vendor');
    //   return false;
    // } 
    // else if (this.form.controls['PAY_DATE'].invalid) {
    //   this.toast.warning('Please select pay date');
    //   return false;
    // } 
    else if (this.form.controls['BANK_CODE'].invalid) {
      this.toast.warning('Please select bank');
      return false;
    }
    //else if (this.form.controls['EMP_NO'].invalid) {
    //   this.toast.warning('Please select employee');
    //   return false;
    // } else if (this.form.controls['GL_NO'].invalid) {
    //   this.toast.warning('Please select GL');
    //   return false;
    // } 
    // else if (this.form.controls['PAY_REFNO'].invalid) {
    //   this.toast.warning('Please enter pay ref no.');
    //   return false;
    // } 
    // else if (this.form.controls['OTH_CHARGES1'].invalid) {
    //   this.toast.warning('Please select other charges');
    //   return false;
    // } 
    // else if (this.form.controls['REMARKS'].invalid) {
    //   this.toast.warning('Please enter remarks');
    //   return false;
    // }
      // 
     
      // else if (this.form.controls['PAY_REFNO'].invalid) {
      //   this.toast.warning('Please enter pay ref no.');
      //   return false;
      // } 
      else if (this.form.controls['TRXN_AMT'].invalid) {
        this.toast.warning('Please enter received amount');
        return false;
      }
      else if (this.form.controls['CURRENCY_CODE'].invalid) {
        this.toast.warning('Please select currency');
        return false;
      } else if (this.form.controls['EXCHANGE_RATE'].invalid) {
        this.toast.warning('Please enter exchange rate');
        return false;
      } else if (this.form.controls['TRXN_BASE'].invalid) {
        this.toast.warning('Please enter received base');
        return false;
      }
      else if (this.form.getRawValue().BAL_TO_ADJUST < 0 ) {
        this.toast.warning('Balance to adjust amount can not less than zero.');
        return false;
      }
      else if (this.form.getRawValue().FINAL_AMT <= 0 ) {
        this.toast.warning('Bank receive amount can not be zero or less than zero.');
        return false;
      }
      else if (this.form.getRawValue().TRXN_AMT_1 !=  this.form.getRawValue().FINAL_AMT ) {
        this.toast.warning('Both bank receive amount should be match.');
        return false;
      }

      this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.setCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
    
      
    return true;
      
  }


  // clear form 
  f_clearForm(){
    this._BANK_Detail = [];
     this.bank_list=[];
    // this.tds_code_list=[];
    this.bankreceipt_detail = [];
    this._DATE = "";
    this._DATE1 = "";
    // this.customer_list = [];
    // this.customer_list=this.dummyCustomerList;
    // this.project_list=[];
   // this.tds_code_list=[];
   // this.customer_list=[];
    this.form.reset();

    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    
    this.form.get('CURRENCY_CODE').setValue("INR");
       this.form.get('EXCHANGE_RATE').setValue(1);
       this.form.get('OTH_CURRENCY_CODE1').setValue("INR");
       this.form.get('OTH_CURRENCY_CODE2').setValue("INR");
       this.form.get('OTH_CHARGEAMT1').setValue(0);
       this.form.get('OTH_CHARGEAMT2').setValue(0);
       this.form.get('OTH_CURRENCY_CODE2').setValue(0);
       this.form.get('OTH_CHARGEGL1').setValue(0);
       this.form.get('OTH_CHARGEGL2').setValue(0);
       this.form.get('TRXN_TYPE').setValue("BR");
       this.form.get('PARTY_TYPE').setValue("C");
       this.form.get('TRXN_AMT').setValue("0");    
       //this.form.get('TRXN_AMT1').setValue("0");             
       this.form.get('ADJUST_TOTAL').setValue("0");
       this.form.get('BAL_TO_ADJUST').setValue("0");
      // this.form.get('CUST_CODE').setValue("");
      //  this.form.get('PROJ_CODE').setValue("");
      //  this.form.get('BANK_CODE').setValue("");
       this.showContent("C");
      // this.form.get('CUST_CODE').setValue("");
      //  this.form.get('TDS_ON').setValue(0);
      //  this.form.get('CUST_CODE').setValue("");
       
       this.form.get('TRXN_AMT_1').setValue("0");  
      
       this.changeCurrency();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  project_list:any;
  GetProjectList() {
    let data = {
      LISTTYPE: "customerwise",
      COMPANY_CODE: this.form.getRawValue().COMPANY_CODE,
      
    }
    this.http.PostRequest(this.apiUrl.GetProjectList, data).then(res => {
      if (res.flag) {
        this.project_list = res.project_list
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
  isSubmited: boolean = false;
  bankSave(){
    this.isSubmited = true;
    if(this.f_validateFormData()){
      
      
      this.form.get('TRXN_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_AMT)));
      this.form.get('TRXN_BASE').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TRXN_BASE)));
      this.form.get('TDS_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().TDS_AMT)));
      this.form.get('FINAL_AMT').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().FINAL_AMT)));
      this.form.get('ADJUST_TOTAL').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().ADJUST_TOTAL)));
      this.form.get('BAL_TO_ADJUST').setValue((this.pipeService.removeCommaseprated(this.form.getRawValue().BAL_TO_ADJUST)));
      
      let data = {
        TYPE:"",
        SaveBankReceipt:this.form.value,
        SaveBankReceiptDetail: this._BANK_Detail,
      }

      this.f_clearForm();
      //this.GetBankCommonList();

    console.log(data);
      this.spinner = true;
      console.log('f_clearForm',this.f_clearForm)
      
      this.http.PostRequest(this.apiUrl.SaveBankReceipt, data).then(res => {
        console.log(res);
        if (res.flag) {
          this.toast.success(res.msg)
          this.spinner = false;
          this.isSubmited = false;
          this.f_clearForm();
        
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
         
        } else {
          
          this.toast.warning(res.msg)
          this.spinner = false;
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
