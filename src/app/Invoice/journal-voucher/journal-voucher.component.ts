import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { PipeService } from 'src/app/services/pipe.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
declare var $: any;
@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements OnInit {

   spinner: boolean = false;
   form: FormGroup;
  data: any;
  list: any[];
  name: string;
  value: any;
  isAddRowVisible: any;
  isAddRow: boolean;
  PARTY: any[];
  DEBIT_AMT: number;
  CREDIT_AMT: number;
  JV_ID:any = 0;
  JV_NO:any = 0;
maxdate = new Date();
today_date = new Date();
today_date_s : any;
min_date = new Date(new Date().getFullYear(), 0, 1);
ADD_RIGHTS: boolean = false;
UPDATE_RIGHTS: boolean = false;
NO_RIGHTS: boolean = false;
isAdd: boolean = false;
isUpdate: boolean = false;
company_list:Array<any> = [];
location_list:Array<any> = [];
doc_type_list:Array<any> = [];
currency_list:Array<any> = [];
gl_list:Array<any> = [];
vendor_list:Array<any> = [];
project_list:Array<any> = [];
employee_list:Array<any> = [];
customer_list:Array<any> = [];
bank_list:Array<any> = [];
all_list:Array<any> = [];
all_jv_list:Array<any> = [];
_JV_Detail: Array<any> = [];
VOUCHER_DATE: any = '';
max_date = new Date();
journal_voucher_detail: Array<any>=[];
Jv_detail: Array<any> = [];
JV_DATE: any;
jv_header : Array<any> = [];
COMPANY_CODE:any;
LOCATION_CODE:any;
DOCTYPE_CODE:any;
CURRENCY_CODE:any = "INR";
EXCHANGE_RATE:any = 1;
JV_REMARKS:any;
Credit_VALUE:any;
Debit_VALUE:any;
FYEAR:any;
PROJ_CODE:any = "";
isSubmited: boolean = false;
isEnabled : boolean= false;
_selected_index : any = null;
inboundClick: boolean = false;
isViewJV:boolean = false;
COMPANY_NAME:any;
GET_GL_NO:any;
isExchangeRate:boolean = false;
COMPANY_CURRENCY:any;
fyear_list:any = [];

constructor(public sharedService: SharedServiceService,
  private apiUrl: ApiUrlService,
  private http: HttpRequestServiceService,
  private toast: ToastrService,
  public validationService: ValidationService,
  private pipeService: PipeService,
  public datepipe: DatePipe) { }
   
  ngOnInit() {
    this.sharedService.formName = "Journal Voucher";
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      }
      this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
      if(this.sharedService.loginUser[0].FYEAR == undefined){
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
       }
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }

  ngAfterViewInit(){    
  setTimeout(() => {
     this.FYEAR = this.sharedService.loginUser[0].FYEAR;
      this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE;
      this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
      this.min_date = this.sharedService.loginUser[0].FROM_DATE;
      this.maxdate = this.sharedService.loginUser[0].TO_DATE;
      this.LOCATION_CODE = this.sharedService.loginUser[0].LOCATION_CODE;
      this.COMPANY_CURRENCY = this.sharedService.loginUser[0].COMPANY_CURRENCY;
     this.GetFyearList();
      this.GetJVCommonList(1);
      this.GetProjectList();
  },100)
}

  
GetFyearList(){
  let data = {
    "IS_ALL": 1
  }
  this.http.PostRequest(this.apiUrl.GetFyearList, data).then(res => {
    if (res) {
      this.fyear_list = res.fyear_list
      this.fyear_list.forEach((element:any)=>{
          if(this.FYEAR == element.FYEAR){
          let TO_DATE = new Date(this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy'));
          let CURRENT_DATE = new Date();
          if(CURRENT_DATE < TO_DATE){
            this.JV_DATE = this.datepipe.transform(new Date(CURRENT_DATE), 'dd-MMM-yyyy') 
            return
          }else {
            this.JV_DATE = this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy');
          }
          }
      });
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

  GetJVCommonList(val:any){
     this.spinner = true;
     this.http.PostRequest(this.apiUrl.GetJVCommonList,{}).then(res =>{
    if(res.flag){
      this.company_list = res.company_list;
      this.location_list = res.location_list;
      this.doc_type_list = res.doc_type_list;
      this.currency_list = res.currency_list;
      this.gl_list = res.gl_list;
      this.vendor_list = res.vendor_list;
      this.employee_list = res.employee_list;
      this.customer_list = res.customer_list;
      this.bank_list = res.bank_list;
      this.all_list = res.all_list;
      if(this.CURRENCY_CODE == this.COMPANY_CURRENCY){
        this.isExchangeRate = true;
      }
      if(val == 1){
       this.f_addRow();
      }
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    }else{
      this.spinner = false;
    }
   },err =>{
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

  f_addRow(){
      this._JV_Detail.push({
      SRNO: this._JV_Detail.length + 1,
      GL_NO:"",
      RECGRP:null,
      PARTY_CODE:"",
      VENDOR_NO:"",
      CUST_CODE:"",
      BANK_CODE:"",
      EMP_NO:"",
      PROJ_CODE:"",
      LOCATION_CODE: this.LOCATION_CODE,
      REMARKS:"",
      DEBIT_AMT:"0",
      CREDIT_AMT:"0",
      Debit_VALUE:0,
      disabled1: false,
      disabled2: false,
      PARTY : []
    })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  f_H_M(hours: any)  {
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

  SAVE_JV(){
    this.isSubmited = true;
     // if (!this.sharedService.isValid(this.COMPANY_CODE)) {
    //   this.toast.error('Select a Company');
    //   return false;
    // } else if (!this.sharedService.isValid(this.LOCATION_CODE)) {
    //   this.toast.error('Select a Location');
    //   return false;
    // } else 
    if (!this.sharedService.isValid(this.DOCTYPE_CODE)) {
      this.toast.error('Select a Doc Type');
      return false;
    } else if (!this.sharedService.isValid(this.JV_DATE)) {
      this.toast.error('Select a Voucher Date');
      return false;
    } else if (!this.sharedService.isValid(this.CURRENCY_CODE)) {
      this.toast.error('Select a Currency');
      return false;
   
    // }  else if (!this.sharedService.isValid(this.EXCHANGE_RATE)) {
    //   this.toast.error('Enter a Exchange rate');
    //   return false;
    // } else if (this.EXCHANGE_RATE <= 0) {
    //   this.toast.error('Enter a Exchange rate is greater than zero.');
    //   return false;
    } 
    for (const element of this._JV_Detail) {
      if (!this.sharedService.isValid(element.GL_NO)) {
        this.toast.error('Select a Gl');
        return false;
      }
      // if (!this.sharedService.isValid(element.PARTY_CODE)) {
      //   this.toast.error('Select a Party');
      //   return false;
      // }
      // if (!this.sharedService.isValid(element.PROJ_CODE)) {
      //   this.toast.error('Select a Project');
      //   return false;
      // }
      if (!this.sharedService.isValid(element.LOCATION_CODE)) {
        this.toast.error('Select a Location');
        return false;
      }
    };
    
      for(let i=0; i< this.Jv_detail.length; i++){    
        this.Jv_detail[i].BILLED_HOURS = this.f_H_M(this.Jv_detail[i].BILLED_HOURS_D) 
      }
      this.Debit_VALUE = this.pipeService.removeCommaseprated(this.Debit_VALUE)
      this.Credit_VALUE = this.pipeService.removeCommaseprated(this.Credit_VALUE)
      if (this.Debit_VALUE == 0 || this.Credit_VALUE == 0) {
        this.toast.error('Debit or Credit total not allowed zero');
        return false;
      }else if (this.pipeService.removeCommaseprated(this.Debit_VALUE) != this.pipeService.removeCommaseprated(this.Credit_VALUE)) {
        this.toast.error('Debit and Credit total should be match');
        return false;
      }  
      this._JV_Detail.forEach((element)=>{
        
       element.DEBIT_AMT=this.pipeService.removeCommaseprated( element.DEBIT_AMT);
       element.CREDIT_AMT=this.pipeService.removeCommaseprated(  element.CREDIT_AMT);
      // console.log();
       
       if(element.DEBIT_AMT==""){
        element.DEBIT_AMT=0
      }
      if(element.CREDIT_AMT==""){
        element.CREDIT_AMT=0
      }
      })

      let data = {
        TYPE:"APPROVE",
        SaveJV: [{
          "JV_ID":this.JV_ID,
          "COMPANY_CODE":this.COMPANY_CODE,
          "DOCTYPE_CODE":this.DOCTYPE_CODE,
          "LOCATION_CODE": this.LOCATION_CODE,
          "FYEAR": this.FYEAR,
          "JV_NO":this.JV_NO,
          "JV_DATE": this.datepipe.transform(this.JV_DATE, 'dd-MMM-yyyy') ,
          "CURRENCY_CODE":this.CURRENCY_CODE,
          "EXCHANGE_RATE":this.EXCHANGE_RATE,
          "JV_REMARKS":this.JV_REMARKS,
          "DEBIT_VALUE": this.Debit_VALUE,
          "CREDIT_VALUE": this.Credit_VALUE
        }],
        SaveJV_detail: this._JV_Detail,
        JV_ID: this.JV_ID,
        JVNO: this.JV_NO,
      }
   //  console.log('res',data);
    // return
    this.http.PostRequest(this.apiUrl.SaveJV, data ).then(res => {
      if (res.flag) {
        this.toast.success(res.msg);
        this.isSubmited = false;
        this.f_clearForm();
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.GetJVList();
        this.spinner = false;
        this.isViewJV = !this.isViewJV;
        this.inboundClick = true;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  
  f_clearForm(){
    this.isSubmited = false;
    this.Jv_detail = [];
    this._JV_Detail = [];
    if(this.sharedService.loginUser[0].FYEAR == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
     }
     this.FYEAR = this.sharedService.loginUser[0].FYEAR;
     this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE;
     this.LOCATION_CODE = this.sharedService.loginUser[0].LOCATION_CODE;
     this.EXCHANGE_RATE = 1;
     this.CURRENCY_CODE = "INR";
     this.Credit_VALUE = 0;
     this.Debit_VALUE = 0;
     this.EXCHANGE_RATE = 1;
     this.JV_REMARKS = "";
     this.DOCTYPE_CODE = "";
     this.isExchangeRate = true;
     this.f_addRow();
    this.isAddRow = true;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ChangeGL(GL_NO: any,index: any){
    this.data = null;
    this._JV_Detail[index].PARTY=[];
    this.list=[];
    this.gl_list.forEach(element => {    
       if(element.GL_NO == GL_NO){
        this.all_list.forEach(ele => {
          if(element.RECGRP == ele.RECGRP && element.GL_NO == ele.GL_NO ){
            this._JV_Detail[index].PARTY.push(ele)
          }
        });
      }
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 
    100);
  }

  CalculateTotalAmount(index: any){
    this._JV_Detail[index].DEBIT_AMT =this.pipeService.removeCommaseprated((this._JV_Detail[index].DEBIT_AMT));
    this._JV_Detail[index].CREDIT_AMT = this.pipeService.removeCommaseprated((this._JV_Detail[index].CREDIT_AMT));

    this._selected_index = index;
    this._JV_Detail[index].DEBIT_AMT = this.checkVal(this._JV_Detail[index].DEBIT_AMT);
    this._JV_Detail[index].CREDIT_AMT = this.checkVal(this._JV_Detail[index].CREDIT_AMT);
    this._JV_Detail.forEach((element:any)=>{
      if(element.DEBIT_AMT == 0 || element.DEBIT_AMT == null){
          element.disabled1 = true;
      }else if(element.CREDIT_AMT == 0 || element.CREDIT_AMT == null){
        element.disabled2 = true;
    }   else if(element.CREDIT_AMT == 0 && element.DEBIT_AMT == 0){
      element.disabled2 = false;
      element.disabled1 = false;
  }
    })
    this.isEnabled = true;
    var TOTAL_DEBIT=0;
    var TOTAL_CREDIT=0;
    this._JV_Detail.forEach((element:any) => {
      let debitAmount = element["DEBIT_AMT"];
      if (debitAmount !== null && debitAmount !== undefined) {
        if (typeof debitAmount === 'string') {
          debitAmount = parseFloat(this.pipeService.removeCommaseprated(debitAmount));
        }
        if (!isNaN(debitAmount)) {
          TOTAL_DEBIT += debitAmount;
        }
      }
      let creditAmount = element["CREDIT_AMT"];
      if (creditAmount !== null && creditAmount !== undefined) {
        if (typeof creditAmount === 'string') {
          creditAmount = parseFloat(this.pipeService.removeCommaseprated(creditAmount));
        }
        if (creditAmount === null) {
          creditAmount = 0;
        }
        if (!isNaN(creditAmount)) {
          TOTAL_CREDIT += creditAmount;
        }
      }
    }); 
      this.Debit_VALUE = TOTAL_DEBIT;
      this.Credit_VALUE =TOTAL_CREDIT;
   this.Debit_VALUE = this.pipeService.setCommaseprated((+TOTAL_DEBIT).toFixed(2));
   this.Credit_VALUE = this.pipeService.setCommaseprated((+TOTAL_CREDIT).toFixed(2));
    this._JV_Detail.forEach((element:any)=>{
      if(element.CREDIT_AMT == 0 && element.DEBIT_AMT == 0 || element.CREDIT_AMT == null && element.DEBIT_AMT == null){
      element.disabled2 = false;
      element.disabled1 = false;
      }
    })

   this._JV_Detail[index].DEBIT_AMT =this.pipeService.setCommaseprated((+this._JV_Detail[index].DEBIT_AMT).toFixed(2));
   this._JV_Detail[index].CREDIT_AMT = this.pipeService.setCommaseprated((+this._JV_Detail[index].CREDIT_AMT).toFixed(2));

  }

  checkVal(val:any){
    if(val == undefined){
      val=0;
    }else if(val == null){
      val=0;
    }else if(val == 0){
      val=0;
    }else if(val == ""){
      val=0;
    }
    return val;
  }

  GetJVList(){
    let useDetail = JSON.parse(sessionStorage.getItem('user_detail'))
    let data = {
      LISTTYPE:"billed",
      FYEAR:useDetail[0].FYEAR,
      GL_NO: this.GET_GL_NO,
      COMPANY_CODE:useDetail[0].COMPANY_CODE
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetJVList, data).then(res => {
      if (res.flag) {
        this.all_jv_list = res.jv_list;
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

  viewJvList(){
    this.isViewJV = !this.isViewJV;
    this.inboundClick = true;
    this.GetJVList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  backToForm(){
    this.isViewJV = !this.isViewJV;
    this.inboundClick = false;
    this.JV_ID = 0;
    this.JV_NO = 0;
    this.GET_GL_NO = '';
    this.f_clearForm();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  editJV(data:any){
    this.GetJVDetail(data.JV_ID)
    this.JV_ID = data.JV_ID;
    this.JV_NO = data.JV_NO;
    this.inboundClick = false;
  }

  GetJVDetail(JV_ID:any){
    let data = {
      JV_ID:JV_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetJVDetail, data).then(res => {
      if (res.flag) {
        this.jv_header = res.jv_header;
        this._JV_Detail = res.jv_detail;
        let DOCTYPE_CODE = this.jv_header[0].DOCTYPE_CODE;
        this.EXCHANGE_RATE = this.jv_header[0].EXCHANGE_RATE;
        this.JV_REMARKS = this.jv_header[0].JV_REMARKS; 
        let CURRENCY_CODE = this.jv_header[0].CURRENCY_CODE;
        this.JV_DATE = this.datepipe.transform(this.jv_header[0].JV_DATE , 'dd-MMM-yyyy') 
        // console.log('jv_header -> ' , this.jv_header)
        // console.log('_JV_Detail 1 -> ' , this._JV_Detail)
        this._JV_Detail.forEach((element:any)=>{
          if(element.DEBIT_AMT == 0 || element.DEBIT_AMT == null){
              element.disabled1 = true;
          }else{
            element.DEBIT_AMT=this.pipeService.setCommaseprated((+element.DEBIT_AMT));
          }
          if(element.CREDIT_AMT == 0 || element.CREDIT_AMT == null){
            element.disabled2 = true;
        }else{
          element.CREDIT_AMT=this.pipeService.setCommaseprated((+element.CREDIT_AMT));
        }
        element.PARTY=[]; 
        if(element.RECGRP != null || element.RECGRP != "" || element.RECGRP != undefined){
          if(element.GL_NO != null || element.GL_NO != "" || element.GL_NO != undefined){
           this.all_list.forEach(ele => {          
             if(element.RECGRP == ele.RECGRP && element.GL_NO == ele.GL_NO ){
              element.PARTY.push(ele)
             }
           });
          }
        }
        })
        var TOTAL_DEBIT=0;
        var TOTAL_CREDIT=0;
        this._JV_Detail.forEach((element:any) => {
          let debitAmount = element["DEBIT_AMT"];
          if (debitAmount !== null && debitAmount !== undefined) {
            if (typeof debitAmount === 'string') {
              debitAmount = parseFloat(this.pipeService.removeCommaseprated(debitAmount));
            }
            if (!isNaN(debitAmount)) {
              TOTAL_DEBIT += debitAmount;
            }
          }
          let creditAmount = element["CREDIT_AMT"];
          if (creditAmount !== null && creditAmount !== undefined) {
            if (typeof creditAmount === 'string') {
              creditAmount = parseFloat(this.pipeService.removeCommaseprated(creditAmount));
            }
            if (creditAmount === null) {
              creditAmount = 0;
            }
            if (!isNaN(creditAmount)) {
              TOTAL_CREDIT += creditAmount;
            }
          }
        }); 
        this.Debit_VALUE = this.pipeService.setCommaseprated((+TOTAL_DEBIT).toFixed(2));
        this.Credit_VALUE =  this.pipeService.setCommaseprated((+TOTAL_CREDIT).toFixed(2));
        this.isViewJV = !this.isViewJV;
        setTimeout(() => {
          this.doc_type_list.forEach((element:any)=>{
            if(DOCTYPE_CODE == element.DOCTYPE_CODE){
               this.DOCTYPE_CODE = element.DOCTYPE_CODE;
            }
          })
          this.currency_list.forEach((element:any)=>{
            if(CURRENCY_CODE == element.CURRENCY_CODE){
               this.CURRENCY_CODE = element.CURRENCY_CODE;
            }
          })
          if(this.CURRENCY_CODE == this.COMPANY_CURRENCY){
            this.isExchangeRate = true;
          }else {
            this.isExchangeRate = false;
          }
          this.GetProjectList();
          this.GetJVCommonList(0);
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

  ChangeDate(){
    this.JV_DATE = this.datepipe.transform(new Date(this.JV_DATE), 'dd-MMM-yyyy')
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  
  GetSelectCurrency(code:any){
    // console.log('code ->' , code)
    // console.log('COMPANY_CURRENCY ->' , this.COMPANY_CURRENCY)
    if( this.COMPANY_CURRENCY == code){
      this.isExchangeRate = true;
      this.EXCHANGE_RATE = 1;
    }else {
      this.isExchangeRate = false;
    }
    // console.log('isExchangeRate ->' , this.isExchangeRate)
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  RemoveJvIndex(index:any){
    this._JV_Detail.forEach((element:any,index1:any)=>{
      if(index == index1){
         this._JV_Detail.splice(index1,1)
      }
    });
    var TOTAL_DEBIT=0;
    var TOTAL_CREDIT=0;
    this._JV_Detail.forEach((element:any) => {
      let debitAmount = element["DEBIT_AMT"];
      if (debitAmount !== null && debitAmount !== undefined) {
        if (typeof debitAmount === 'string') {
          debitAmount = parseFloat(this.pipeService.removeCommaseprated(debitAmount));
        }
        if (!isNaN(debitAmount)) {
          TOTAL_DEBIT += debitAmount;
        }
      }
      let creditAmount = element["CREDIT_AMT"];
      if (creditAmount !== null && creditAmount !== undefined) {
        if (typeof creditAmount === 'string') {
          creditAmount = parseFloat(this.pipeService.removeCommaseprated(creditAmount));
        }
        if (creditAmount === null) {
          creditAmount = 0;
        }
        if (!isNaN(creditAmount)) {
          TOTAL_CREDIT += creditAmount;
        }
      }
    }); 
    this.Debit_VALUE = this.pipeService.setCommaseprated((+TOTAL_DEBIT).toFixed(2));
    this.Credit_VALUE = this.pipeService.setCommaseprated((+TOTAL_CREDIT).toFixed(2));
    // this.Debit_VALUE = this.pipeService.setCommaseprated(TOTAL_DEBIT.toFixed(2));
    // this.Credit_VALUE = this.pipeService.setCommaseprated(TOTAL_CREDIT.toFixed(2));
  }

  GetResetGlNo(){
    this.GET_GL_NO = '';
    this.GetJVList();
  }

}


