
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @ViewChild('email', { static: false }) email: ElementRef;
  
  spinner: boolean = false;
  form: FormGroup
  country_list: Array<any> = [];
  cust_status_list: Array<any> = [];
  cust_group_list: Array<any> = [];
  segment_list: Array<any> = [];
  state_list: Array<any> = [];
  currency_list: Array<any> = [];
  template_list: Array<any> = [];
  cust_type_list: Array<any> = [];
  customer_list: Array<any> = [];
  isPanANDGstInNotMandatory:boolean = false;

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private validationService: ValidationService) { } 

  ngOnInit() {
    this.sharedService.formName = "Customer"
    this.form = this.formBuilder.group({
      EMP_CODE: [""],
      LOGIN_ID: [""],
      CUST_CODE : [{value: '', disabled: true}],
      CUST_NAME : ["",Validators.required],
      CUST_LEGALNAME: ["",Validators.required],
      CUST_TYPE: ["",Validators.required],
      CUST_ADDRESS1: ["",Validators.required],
      CUST_ADDRESS2: ["",Validators.required],
      CUST_CITY: ["",Validators.required],
      CUST_PIN: ["",[Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
      CUST_COUNTRY: ["",Validators.required],
      CUST_STATE: ["",Validators.required],

      CUST_PAN: ["",Validators.required],
      CUST_GSTIN: ["",Validators.required],
      CUST_SEGMENT: ["",Validators.required],
      CUST_PHONE: ["",Validators.required],
      CUST_KINDATTN: ["",Validators.required],
      CUST_EMAIL: ["",Validators.required],
      CUST_CREDITDAYS: ["1",Validators.required],
      CUST_CURRENCY: ["INR",Validators.required],
      ACCT_MANAGER: ["",Validators.required],
      TEMPLATE_CODE: ["",Validators.required],
      CUST_STATUS: ["P",Validators.required],
      CUST_GRP_ID: ["",]

    });

    $('.selectpicker').selectpicker('refresh');
  }
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      }
      this.getCustCommonList();
      this.GetCustomerList();
      this.getEmployee();
      this.addRow()
    }, 150);
  }

  getCustCommonList() {

    this.http.PostRequest(this.apiUrl.GetCustCommonList, {}).then(res => {
      if (res.flag) {
        this.country_list = res.country_list;
        this.cust_status_list = res.cust_status_list;
        this.cust_group_list = res.cust_group_list;
        this.segment_list = res.segment_list;
        this.state_list = res.state_list;
        this.currency_list = res.currency_list;
        this.template_list = res.template_list;
        this.cust_type_list = res.cust_type_list;

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
  GetCustomerList(){
    let data = {
      LISTTYPE:"all"
    }
    this.http.PostRequest(this.apiUrl.GetCustomerList, data).then(res => {
      if (res.flag) {
        this.customer_list = res.customer_list;

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
  employee_list: Array<any> = [];
  getEmployee() {
    let data = {
      LISTTYPE: ""
    }

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(res => {
      if (res.flag) {
        this.employee_list = res.employee_list;

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
  search_user: any = ""
  f_searchUserData() {
    this.isUpdate = false;
    if (this.search_user != "") {
      this.GetCustomerDetail();
    } else {
    }
  }
  customer_contact_detail: Array<any> = [];
  GetCustomerDetail(){
    let data = {
      CUST_CODE: this.search_user
    }
    this.spinner =true;
    this.http.PostRequest(this.apiUrl.GetCustomerDetail, data).then(res => {
      if (res.flag) {
        this.customer_contact_detail = res.customer_contact_detail;
        this.fillCustomerData(res.customer_detail)
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  fillCustomerData(data: any = []){

    this.form.get('CUST_CODE').setValue(data[0].CUST_CODE)
    this.form.get('CUST_NAME').setValue(data[0].CUST_NAME)
    this.form.get('CUST_LEGALNAME').setValue(data[0].CUST_LEGALNAME)
    this.form.get('CUST_TYPE').setValue(data[0].CUST_TYPE)
    this.form.get('CUST_ADDRESS1').setValue(data[0].CUST_ADDRESS1)
    this.form.get('CUST_ADDRESS2').setValue(data[0].CUST_ADDRESS2)
    this.form.get('CUST_CITY').setValue(data[0].CUST_CITY)
    this.form.get('CUST_PIN').setValue(Number(data[0].CUST_PIN))
    this.form.get('CUST_COUNTRY').setValue(data[0].CUST_COUNTRY)
    this.form.get('CUST_STATE').setValue(data[0].CUST_STATE)
    this.form.get('CUST_PAN').setValue(data[0].CUST_PAN)
    this.form.get('CUST_GSTIN').setValue(data[0].CUST_GSTIN)
    this.form.get('CUST_SEGMENT').setValue(data[0].CUST_SEGMENT)
    this.form.get('CUST_PHONE').setValue(data[0].CUST_PHONE)
    this.form.get('CUST_KINDATTN').setValue(data[0].CUST_KINDATTN)
    this.form.get('CUST_EMAIL').setValue(data[0].CUST_EMAIL)
    this.form.get('CUST_CREDITDAYS').setValue(data[0].CUST_CREDITDAYS)
    this.form.get('CUST_CURRENCY').setValue(data[0].CUST_CURRENCY)
    this.form.get('ACCT_MANAGER').setValue(data[0].ACCT_MANAGER)
    this.form.get('TEMPLATE_CODE').setValue(data[0].TEMPLATE_CODE)
    this.form.get('CUST_STATUS').setValue(data[0].CUST_STATUS)
    this.form.get('CUST_GRP_ID').setValue(data[0].CUST_GRP_ID)
    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

    this.f_Add_Update('U');
  }

  f_validatePAN(){
    if(this.form.getRawValue().CUST_PAN != "" && this.form.getRawValue().CUST_PAN != undefined && this.form.getRawValue().CUST_PAN != null){
      let pan_regex: RegExp = new RegExp(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
      if(!pan_regex.test(this.form.getRawValue().CUST_PAN)){
        this.form.getRawValue().CUST_PAN = '';
        document.getElementById('panno').focus();
        this.toast.warning('PAN number not valid')
      }
    }

  }
  f_validateGSTNO(){
    if(this.form.getRawValue().CUST_GSTIN != "" && this.form.getRawValue().CUST_GSTIN != undefined && this.form.getRawValue().CUST_GSTIN != null){
      let gst_regex: RegExp = new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/);
      if(!gst_regex.test(this.form.getRawValue().CUST_GSTIN)){
        this.form.getRawValue().CUST_GSTIN = '';
        document.getElementById('gstno').focus();
        this.toast.warning('GST number not valid')
      }
    }

  }

  // f_validateADDRESS1(){
  //   if(this.form.getRawValue().CUST_ADDRESS1 != "" && this.form.getRawValue().CUST_ADDRESS1 != undefined && this.form.getRawValue().CUST_ADDRESS1 != null){
  //     let address1_regex: RegExp = new RegExp(/[A-Za-z0-9'\.\-\s\,]/);
  //     if(!address1_regex.test(this.form.getRawValue().CUST_ADDRESS1)){
  //       this.form.getRawValue().CUST_ADDRESS1 = '';
  //       document.getElementById('address1').focus();
  //       this.toast.warning('please enter your address')
  //     }
  //   }

  // }

  addRow(){
    this.customer_contact_detail.push({
      CUST_SRNO:0,
      CONTACT_NAME:"",
      CONTACT_MOBILE:"",
      CONTACT_DESIG:"",
      SEND_INVOICEEMAIL:"",
      SEND_RECEIPTEMAIL:"",
      CONTACT_EMAIL:"",
      CONTACT_PHONE:"",
      CONTACT_DEPT:"",
      ACTIVE:1
    })
  }


  removeRow(index: number){
      if(this.customer_contact_detail[index].CUST_SRNO == 0){        
    this.customer_contact_detail.splice(index,1);
      }else if(this.customer_contact_detail[index].CUST_SRNO > 0){        
        this.customer_contact_detail[index].ACTIVE=0;
          }
  }


  f_Add_Update(para: string = ''){
    if(para == 'C'){
      this.isUpdate = false;
      this.f_clearForm();
    } else if(para == 'U'){
      this.isUpdate = true;
    }
  }
  isSubmited: boolean = false;

  
  saveFormData(para: string = ''){
    this.isSubmited = true;
    if(this.form.valid){
      let _contact_detail: Array<any> = [];
      if(this.customer_contact_detail.length < 0 ){
        this.toast.warning("Add minimun 1 contact detail");
        return;
      }
      for(let data of this.customer_contact_detail){
        if(data.CONTACT_NAME == "" || data.CONTACT_NAME == undefined || data.CONTACT_NAME == null){
          this.toast.warning("Please enter contact person name");
          return;
        }else if(data.CONTACT_MOBILE == "" || data.CONTACT_MOBILE == undefined || data.CONTACT_MOBILE == null){
          this.toast.warning("Please enter contact person mobile");
          return;
        }else if(data.CONTACT_DESIG == "" || data.CONTACT_DESIG == undefined || data.CONTACT_DESIG == null){
          this.toast.warning("Please enter designation of contact person");
          return;
        }else if(data.CONTACT_EMAIL == "" || data.CONTACT_EMAIL == undefined || data.CONTACT_EMAIL == null){
          this.toast.warning("Please enter contact person email");
          return;
        }else if(data.CONTACT_PHONE == "" || data.CONTACT_PHONE == undefined || data.CONTACT_PHONE == null){
          this.toast.warning("Please enter contact person phone");
          return;
        }else if(data.CONTACT_DEPT == "" || data.CONTACT_DEPT == undefined || data.CONTACT_DEPT == null){
          this.toast.warning("Please enter contact person department");
          return;
        }
        
        _contact_detail.push(data)
        
      }
     
      let data = {
        customer_detail: this.form.getRawValue(),
        customer_contact_detail: _contact_detail
      }
      // return
      this.http.PostRequest(this.apiUrl.SaveCustomerDetail, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.GetCustomerList();
          this.spinner = false;
          this.f_clearForm()
        } else {
          this.toast.warning(res.msg)
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      });

    } else{
      this.f_validateForm();
    }
  }


  f_clearForm(){
    this.isSubmited = false;
    this.search_user = "";
    this.form.reset();
    this.isUpdate = false;
    this.customer_contact_detail = [];
    this.form.get('CUST_CURRENCY').setValue("INR")
    this.form.get('CUST_CREDITDAYS').setValue("1")
    this.form.get('CUST_STATUS').setValue("P")
    this.addRow()
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  
  validateEmail() {
      if (!this.validationService.emailValidator(this.form.getRawValue().CUST_EMAIL)) {
        this.form.get('CUST_EMAIL').setValue('')
        this.email.nativeElement.focus()
      } else {
        
      }
  }

  f_validateForm(){
    if(this.form.controls["CUST_TYPE"].invalid){
      this.toast.warning("Please select customer type");
    } else if(this.form.controls["CUST_NAME"].invalid){
      this.toast.warning("Please enter customer name");
    }  else if(this.form.controls["CUST_GRP_ID"].invalid){
      this.toast.warning("Please select customer group");
    } else if(this.form.controls["CUST_LEGALNAME"].invalid){
      this.toast.warning("Please enter customer legal name");
    } else if(this.form.controls["CUST_ADDRESS1"].invalid){
      this.toast.warning("Please enter address line 1");
    } else if(this.form.controls["CUST_ADDRESS2"].invalid){
      this.toast.warning("Please enter address line 2");
    }
    else if(this.form.controls["CUST_CITY"].invalid){
      this.toast.warning("Please enter city");
    } else if(this.form.controls["CUST_PIN"].invalid ){
      this.toast.warning("Please enter valid 6 digit PIN");
    } else if(this.form.controls["CUST_COUNTRY"].invalid){
      this.toast.warning("Please select Country");
    }  else if(this.form.controls["CUST_STATE"].invalid){
      this.toast.warning("Please select state");
    } else if(this.form.controls["CUST_PHONE"].invalid){
      this.toast.warning("Please enter customer phone");
    } else if(this.form.controls["CUST_EMAIL"].invalid){
      this.toast.warning("Please enter customer email");
    } else if(this.form.controls["CUST_PAN"].invalid && this.isPanANDGstInNotMandatory){
      this.toast.warning("Please enter PAN No");
    }
      else if(this.form.controls["CUST_GSTIN"].invalid && this.isPanANDGstInNotMandatory){
      this.toast.warning("Please enter valid 15 digit GSTIN");
    } else if(this.form.controls["CUST_CURRENCY"].invalid){
      this.toast.warning("Please select Currency");
    } else if(this.form.controls["CUST_CREDITDAYS"].invalid){
      this.toast.warning("Please enter credit days");
    } else if(this.form.controls["CUST_KINDATTN"].invalid){
      this.toast.warning("Please enter Kind Attention");
    } else if(this.form.controls["ACCT_MANAGER"].invalid){
      this.toast.warning("Please select Account Manager");
    } else if(this.form.controls["TEMPLATE_CODE"].invalid){
      this.toast.warning("Please select Template");
    } else if(this.form.controls["CUST_SEGMENT"].invalid){
      this.toast.warning("Please select Segment");
    } else if(this.form.controls["CUST_STATUS"].invalid){
      this.toast.warning("Please select Status");
    }
    
  }

  ChangeCountry(){
    if(this.form.controls['CUST_COUNTRY'].value == 'IND'){
       this.isPanANDGstInNotMandatory = true;
    }else {
      this.isPanANDGstInNotMandatory = false;
    }
  // console.log('CUST_COUNTRY ->' , this.form.controls['CUST_COUNTRY'].value)
  }

}
