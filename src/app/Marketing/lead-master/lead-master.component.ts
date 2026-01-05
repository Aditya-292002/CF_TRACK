import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;

@Component({
  selector: 'app-lead-master',
  templateUrl: './lead-master.component.html',
  styleUrls: ['./lead-master.component.css']
})
export class LeadMasterComponent implements OnInit {
  @ViewChild('email', { static: false }) email: ElementRef;
    
  form: FormGroup
  USER_ID:any;
  search_user: any = ""
  spinner: boolean = false;
  isPanANDGstInNotMandatory:boolean = false;
  isSubmited: boolean = false;
  PANFlag:boolean=false;
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  country_list: Array<any> = [];
  leadMaster_status_list: Array<any> = [];
  leadMaster_group_list: Array<any> = [];
  leadMaster_contact_detail: Array<any> = [];
  segment_list: Array<any> = [];
  state_list: Array<any> = [];
  currency_list: Array<any> = [];
  salesregionlist: Array<any> = [];
  leadMaster_type_list: Array<any> = [];
  leadMaster_list: Array<any> = [];
  custypelist: Array<any> = [];
  userdetails: Array<any> = [];
  employee_list: Array<any> = [];
  
constructor(public sharedService: SharedServiceService,
  private apiUrl: ApiUrlService,
  private http: HttpRequestServiceService,
  private formBuilder: FormBuilder,
  private toast: ToastrService,
  private validationService: ValidationService) { } 
  
ngOnInit() {
  this.sharedService.formName = "Lead Master"
  this.form = this.formBuilder.group({
    EMP_CODE: [""],
    LOGIN_ID: [""],
    LEAD_CODE : [{value: '', disabled: true}],
    LEAD_NAME : ["",Validators.required],
    LEAD_LEGALNAME: ["",Validators.required],
    LEAD_TYPE: ["",Validators.required],
    LEAD_ADDRESS1: ["",Validators.required],
    LEAD_ADDRESS2: [""],
    LEAD_CITY: ["",Validators.required],
    LEAD_PIN: ["",[Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
    LEAD_COUNTRY: ["",Validators.required],
    LEAD_STATE: ["",Validators.required],
    LEAD_PAN: [""],
    LEAD_GSTIN: [""],
    LEAD_SEGMENT: ["",Validators.required],
    LEAD_PHONE: ["",Validators.required],
    LEAD_TURNOVER: ["",Validators.required],
    LEAD_EMAIL: ["",Validators.required],
    LEAD_PARTNER_CODE: [""],
    LEAD_URL: ["",[
    Validators.required,
    Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/)
    ]],
    LEAD_CURRENCY: ["INR",Validators.required],
    ACCT_MANAGER: ["",Validators.required],
    SALES_REGION_ID: ["",Validators.required],
    LEAD_STATUS: ["",Validators.required],
    LEAD_GRP_ID: [""],
    LEAD_REMARKS:[""]
  });
  $('.selectpicker').selectpicker('refresh');
  this.userdetails= JSON.parse (sessionStorage.getItem("user_detail")) ;
  console.log("this.userdetails : ",this.userdetails)
}
 
ngAfterViewInit() {
  setTimeout(() => {
    if (this.sharedService.form_rights.ADD_RIGHTS) {
      this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
    }
    if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
    }
    this.getLeadMasterCommonList();
    this.GetLeadMasterList();
    this.getEmployee();
    this.addRow()
  }, 150);
}
  
getLeadMasterCommonList() {

  this.http.PostRequest(this.apiUrl.GetLeadCommonList, {}).then(res => {
    console.log (res,"resres")
    if (res.flag) {
      this.country_list = res.countrylist;
      this.leadMaster_status_list = res.statuslist;
      this.leadMaster_group_list = res.leadMaster_group_list;
      this.segment_list = res.segementlist;
      this.state_list = res.statelist;
      this.currency_list = res.currencylist;
      this.salesregionlist = res.salesregionlist;
      this.leadMaster_type_list = res.leadpartnerlist;
      this.custypelist=res.custypelist

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

GetLeadMasterList(){
  let data = {
"ROLE_ID":this.userdetails[0].ROLE_ID,
"EMP_CODE":this.userdetails[0].EMP_CODE,
"USERID":this.userdetails[0].USERID
}
  this.http.PostRequest(this.apiUrl.GetLeadList, data).then(res => {
    if (res.flag) {
      this.leadMaster_list = res.Datalist;

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

getEmployee() {
  let data = { LISTTYPE: ""}
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

f_searchUserData() {
  this.isUpdate = false;
  if (this.search_user != "") {
    this.GetLeadMasterDetail();
  } else {
  }
}
  
GetLeadMasterDetail(){
  let data = {
    LEAD_CODE: this.search_user
  }
  this.spinner =true;
  this.http.PostRequest(this.apiUrl.GetLeadDetail, data).then(res => {
    if (res.flag) {
      this.leadMaster_contact_detail = res.leadcontactdetails;
      this.fillLeadMasterData(res.leadetails)
      this.spinner = false;
    } else {
      this.spinner = false;
    }
  }, err => {
    this.spinner = false;
  });
}

fillLeadMasterData(data: any = []){

  this.form.get('LEAD_CODE').setValue(data[0].LEAD_CODE)
  this.form.get('LEAD_NAME').setValue(data[0].LEAD_NAME)
  this.form.get('LEAD_LEGALNAME').setValue(data[0].LEAD_LEGALNAME)
  this.form.get('LEAD_TYPE').setValue(data[0].LEAD_TYPE)
  this.form.get('LEAD_ADDRESS1').setValue(data[0].LEAD_ADDRESS1)
  this.form.get('LEAD_ADDRESS2').setValue(data[0].LEAD_ADDRESS2)
  this.form.get('LEAD_CITY').setValue(data[0].LEAD_CITY)
  this.form.get('LEAD_PIN').setValue(Number(data[0].LEAD_PIN))
  this.form.get('LEAD_COUNTRY').setValue(data[0].LEAD_COUNTRY)
  this.form.get('LEAD_STATE').setValue(data[0].LEAD_STATE)
  this.form.get('LEAD_PAN').setValue(data[0].LEAD_PAN)
  this.form.get('LEAD_GSTIN').setValue(data[0].LEAD_GSTIN)
  this.form.get('LEAD_SEGMENT').setValue(data[0].LEAD_SEGMENT)
  this.form.get('LEAD_PHONE').setValue(data[0].LEAD_PHONE)
  this.form.get('LEAD_TURNOVER').setValue(data[0].LEAD_TURNOVER)
  this.form.get('LEAD_EMAIL').setValue(data[0].LEAD_EMAIL)
  this.form.get('LEAD_REMARKS').setValue(data[0].LEAD_REMARKS)
  this.form.get('LEAD_PARTNER_CODE').setValue(data[0].LEAD_PARTNER)
  this.form.get('LEAD_URL').setValue(data[0].LEAD_URL)
  this.form.get('LEAD_CURRENCY').setValue(data[0].LEAD_CURRENCY)
  this.form.get('ACCT_MANAGER').setValue(data[0].ACCT_MANAGER)
  this.form.get('SALES_REGION_ID').setValue(data[0].SALESREGIONID)
  this.form.get('LEAD_STATUS').setValue(data[0].LEAD_STATUS)
  this.form.get('LEAD_GRP_ID').setValue(data[0].LEAD_GRP_ID)
  
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);

  this.f_Add_Update('U');
}

f_validatePAN(){
  if(this.form.getRawValue().LEAD_PAN != "" && this.form.getRawValue().LEAD_PAN != undefined && this.form.getRawValue().LEAD_PAN != null){
    let pan_regex: RegExp = new RegExp(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    if(!pan_regex.test(this.form.getRawValue().LEAD_PAN)){
      this.form.getRawValue().LEAD_PAN = '';
      document.getElementById('panno').focus();
      this.toast.warning('PAN number not valid')
    }
  }

}

f_validateGSTNO(){
  if(this.form.getRawValue().LEAD_GSTIN != "" && this.form.getRawValue().LEAD_GSTIN != undefined && this.form.getRawValue().LEAD_GSTIN != null){
    let gst_regex: RegExp = new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/);
    if(!gst_regex.test(this.form.getRawValue().LEAD_GSTIN)){
      this.form.getRawValue().LEAD_GSTIN = '';
      document.getElementById('gstno').focus();
      this.toast.warning('GST number not valid')
    }
  }

}
  
// f_validateADDRESS1(){
//   if(this.form.getRawValue().LEAD_ADDRESS1 != "" && this.form.getRawValue().LEAD_ADDRESS1 != undefined && this.form.getRawValue().LEAD_ADDRESS1 != null){
//     let address1_regex: RegExp = new RegExp(/[A-Za-z0-9'\.\-\s\,]/);
//     if(!address1_regex.test(this.form.getRawValue().LEAD_ADDRESS1)){
//       this.form.getRawValue().LEAD_ADDRESS1 = '';
//       document.getElementById('address1').focus();
//       this.toast.warning('please enter your address')
//     }
//   }

// }
  
addRow(){
  this.leadMaster_contact_detail.push({
    LEAD_SRNO:0,
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
    if(this.leadMaster_contact_detail[index].LEAD_SRNO == 0){        
  this.leadMaster_contact_detail.splice(index,1);
    }else if(this.leadMaster_contact_detail[index].LEAD_SRNO > 0){        
      this.leadMaster_contact_detail[index].ACTIVE=0;
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

saveFormData(para: string = ''){

  this.isSubmited = true;
  if(this.form.valid){
    let _contact_detail: Array<any> = [];
    if(this.leadMaster_contact_detail.length < 0 ){
      this.toast.warning("Add minimun 1 contact detail");
      return;
    }
    for(let data of this.leadMaster_contact_detail){
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
      USER_ID:this.userdetails[0].USERID,
      CRM_LEAD: this.form.getRawValue(),
      LEAD_CONTACT: _contact_detail
    }
    // return
    console.log("data : ",data)

    //  return
    this.http.PostRequest(this.apiUrl.SaveLead, data).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.GetLeadMasterList();
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
  this.leadMaster_contact_detail = [];
  this.form.get('LEAD_CURRENCY').setValue("INR")
  // this.form.get('LEAD_URL').setValue("1")
  // this.form.get('LEAD_STATUS').setValue("P")
  this.addRow()
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

validateEmail() {
    if (!this.validationService.emailValidator(this.form.getRawValue().LEAD_EMAIL)) {
      this.form.get('LEAD_EMAIL').setValue('')
      this.email.nativeElement.focus()
    } else {
      
    }
}

f_validateForm(){
  if(this.form.controls["LEAD_TYPE"].invalid){
    this.toast.warning("Please select Lead Master type");
  } else if(this.form.controls["LEAD_NAME"].invalid){
    this.toast.warning("Please enter Lead Master name");
  }  else if(this.form.controls["LEAD_GRP_ID"].invalid){
    this.toast.warning("Please select Lead Master group");
  } else if(this.form.controls["LEAD_LEGALNAME"].invalid){
    this.toast.warning("Please enter Lead Master legal name");
  } else if(this.form.controls["LEAD_ADDRESS1"].invalid){
    this.toast.warning("Please enter address line 1");
  } else if(this.form.controls["LEAD_ADDRESS2"].invalid){
    this.toast.warning("Please enter address line 2");
  }
  else if(this.form.controls["LEAD_CITY"].invalid){
    this.toast.warning("Please enter city");
  } else if(this.form.controls["LEAD_PIN"].invalid ){
    this.toast.warning("Please enter valid 6 digit PIN");
  } else if(this.form.controls["LEAD_COUNTRY"].invalid){
    this.toast.warning("Please select Country");
  }  else if(this.form.controls["LEAD_STATE"].invalid){
    this.toast.warning("Please select state");
  } else if(this.form.controls["LEAD_PHONE"].invalid){
    this.toast.warning("Please enter Lead Master phone");
  } else if(this.form.controls["LEAD_EMAIL"].invalid){
    this.toast.warning("Please enter Lead Master email");
  } else if(this.form.controls["LEAD_PARTNER_CODE"].invalid){
    this.toast.warning("Please select Partner Code");
  } else if(this.form.controls["LEAD_REMARKS"].invalid){
    this.toast.warning("Please enter Remarks");
  } else if(this.form.controls["LEAD_PAN"].invalid && this.isPanANDGstInNotMandatory){
    this.toast.warning("Please enter PAN No");
  }
    else if(this.form.controls["LEAD_GSTIN"].invalid && this.isPanANDGstInNotMandatory){
    this.toast.warning("Please enter valid 15 digit GSTIN");
  } else if(this.form.controls["LEAD_CURRENCY"].invalid){
    this.toast.warning("Please select Currency");
  } 
  // else if(this.form.controls["LEAD_URL"].invalid){
  //   this.toast.warning("Please enter a valid Lead URL (e.g. https://example.com).");
  // } 
  else if(this.form.controls["LEAD_TURNOVER"].invalid){
    this.toast.warning("Please enter Lead Turnover");
  } else if(this.form.controls["ACCT_MANAGER"].invalid){
    this.toast.warning("Please select Account Manager");
  } else if(this.form.controls["SALES_REGION_ID"].invalid){
    this.toast.warning("Please select Sales Region");
  } else if(this.form.controls["LEAD_SEGMENT"].invalid){
    this.toast.warning("Please select Segment");
  } else if(this.form.controls["LEAD_STATUS"].invalid){
    this.toast.warning("Please select Status");
  }else if (this.form.controls["LEAD_URL"].invalid) {
    const urlCtrl = this.form.controls["LEAD_URL"];
    if ( urlCtrl.errors.pattern ) {
    this.toast.warning("Please enter a valid Lead URL (e.g. https://example.com).");
  } else if (urlCtrl.errors.required) {
    this.toast.warning("Lead URL is required.");
  }
}
}

ChangeCountry(){
  if(this.form.controls['LEAD_COUNTRY'].value == 'IND'){
      this.isPanANDGstInNotMandatory = true;
  }else {
    this.isPanANDGstInNotMandatory = false;
  }
// console.log('LEAD_COUNTRY ->' , this.form.controls['LEAD_COUNTRY'].value)
}

isValidPanCardNo() {
console.log('Inside PAN validation');

// PAN format: 5 uppercase letters, 4 digits, 1 uppercase letter
// let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
// return panRegex.test(pan.toUpperCase());
// Check if the PAN number is valid
if(this.form.getRawValue().LEAD_PAN =='' || this.form.getRawValue().LEAD_PAN ==null){
  this.PANFlag = false;
  return false;
}

if (panRegex.test(this.form.getRawValue().LEAD_PAN)) {
this.PANFlag = false;
console.log('Valid PAN');
// this.toast.warning("Please enter valid PAN number");
return true;
} else {
this.PANFlag = true;
console.log('Invalid PAN');
  this.toast.warning("Please enter valid PAN number");
return false;
}
}

validateMobileNumber(): boolean {
// Regular expression for validating mobile number with optional country code
  const pattern = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}$/;
    // const pattern = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}$/;
// Test if the number matches the pattern
  if (pattern.test(this.form.getRawValue().LEAD_PHONE)) {
console.log('Valid Phone');
return true;
} else {

console.log('Invalid Phone');
  this.toast.warning("Please enter valid Phone number");
return false;
}

}

allowOnlyNumbers(event: KeyboardEvent): void {
const charCode = event.which ? event.which : event.keyCode;
// Allow only digits (0–9)
if (charCode < 48 || charCode > 57) {
event.preventDefault();
}
}

}
  