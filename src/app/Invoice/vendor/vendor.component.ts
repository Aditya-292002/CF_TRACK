import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  @ViewChild('email', { static: false }) email: ElementRef;
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }

    spinner: boolean = false;
    form: FormGroup;
    public isCheckModel: number = 0;
    public isCheckActive: number = 0;
    search_vendor_id: string = '';
  ngOnInit() {
    this.sharedService.formName = "Vendor";
    this.form = this.formBuilder.group({
      VENDOR_NO:[""],
      VENDOR_TYPE:[""],
      VENDOR_NAME:  [""],
      VENDOR_ADDRESS1:  [""],
      VENDOR_CITY: [""],
      VENDOR_PIN:[""],
      VENDOR_STATE: [""],
      VENDOR_COUNTRY: [""],
      VENDOR_PAN: "",
      VENDOR_GSTIN: [""],
      VEND_CURRENCY: ["INR"],
      VEND_CREDITDAYS: [0],
      VEND_PHONE: [""],
      VEND_EMAIL: [""],
      VEND_CONTACT: [""],
      PO_REQD:["1"],
      TDSAPPLICABLE: ["1"],
      VENDOR_GL:[0],
      TDS_CODE:[""],
      VENDOR_BANK:"",
      VENDOR_IFSC:"",
      VENDOR_BANK_ACC:"",
      ACTIVE:["1"],
      GST_CLASS:"1",
    })
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.GetVendorCommonList();
      this.form.get('ACTIVE').setValue('1');
      if(this.sharedService.commonData.length >0 ){
        this.search_vendor_id = this.sharedService.commonData[0].VENDOR_NO;
        this.searchVendor()
      }

    }, 150);
  }


  vendor_list: Array<any> = [];
  currency_list: Array<any> = [];
  tds_list: Array<any> = [];
  country_list: Array<any> = [];
  state_list: Array<any> = [];
  bank_list: Array<any> = [];
  vendortype_list: Array<any> = [];
  GetVendorCommonList(){
    this.spinner = true;
    // let data = {
    //   LISTTYPE: "all"

    // }
    this.http.PostRequest(this.apiUrl.GetVendorCommonList, {}).then(res => {
      if (res.flag) {
        // console.log(res);
        this.vendor_list = res.vendor_list;
        this.vendortype_list = res.vendortype_list;
        this.currency_list = res.currency_list;
        this.tds_list = res.tds_list;
        this.country_list = res.country_list;
        this.state_list = res.state_list;
        //this.bank_list = res.bank_list;
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

  GetVendorDetails(){
    this.spinner = true;
    let data = {
     // VENDOR_NO:this.form.getRawValue().VENDOR_NO,
       VENDOR_NO:this.search_vendor_id,

    }
    this.http.PostRequest(this.apiUrl.GetVendorDetails, data).then(res => {
      if (res.flag) {
        console.log(res);
        this.f_fillFormData(res.vendor_details);
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
  SaveVendor(){
    this.isSubmited = true;
    let data = {
      SaveVendor:this.form.value,
      // STATE_CODE:this.form.getRawValue().VENDOR_STATE,
      // COUNTRY_CODE:this.form.getRawValue().VENDOR_COUNTRY,
      }
      console.log(data)
   // return
    this.http.PostRequest(this.apiUrl.SaveVendor, data ).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.isSubmited = false;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else {
        this.toast.warning(res.msg);
        this.f_clearForm();
        this.spinner = false;
        // this.f_clearForm();
      }
    }, err => {
      this.spinner = false;
    });
    }
    _state_list: Array<any> = [];
      filterState(){
        this._state_list = [];
        // console.log('state_list',this._state_list)
      if(this.form.getRawValue().VENDOR_COUNTRY != "" && this.form.getRawValue().VENDOR_COUNTRY != null){

        this.state_list.forEach(element => {

          if((element.COUNTRY_CODE) == (this.form.getRawValue().VENDOR_COUNTRY)){
            this._state_list.push(element)
          }
        });
      } else {
        this._state_list = this.state_list
      }
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
    }

    textBoxDisabled:boolean = false;
    onChangeType(para: string = ''){
      if(para == '1'){
        this.textBoxDisabled = false;
      } else {
        this.textBoxDisabled = true;
      }

    }

    validateEmail() {
      if (!this.validationService.emailValidator(this.form.getRawValue().VEND_EMAIL)) {
        this.form.get('VEND_EMAIL').setValue('')
        this.email.nativeElement.focus()
      } else {

      }
  }

  f_validatePAN(){
    if(this.form.getRawValue().VENDOR_PAN != "" && this.form.getRawValue().VENDOR_PAN != undefined && this.form.getRawValue().VENDOR_PAN != null){
      let pan_regex: RegExp = new RegExp(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
      if(!pan_regex.test(this.form.getRawValue().VENDOR_PAN)){
        this.form.getRawValue().VENDOR_PAN = '';
        document.getElementById('panno').focus();
        this.toast.warning('PAN number not valid')
      }
    }
  }

  f_validateGSTNO(){
    if(this.form.getRawValue().VENDOR_GSTIN != "" && this.form.getRawValue().VENDOR_GSTIN != undefined && this.form.getRawValue().VENDOR_GSTIN != null){
      let gst_regex: RegExp = new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/);
      if(!gst_regex.test(this.form.getRawValue().VENDOR_GSTIN)){
        this.form.getRawValue().VENDOR_GSTIN = '';
        document.getElementById('gstno').focus();
        this.toast.warning('GST number not valid')
      }
    }
  }

  searchVendor() {
    if (this.search_vendor_id != "" || this.search_vendor_id != undefined) {
      this.GetVendorDetails();
      this.onChangeType();
    } else {
      this.f_clearForm();
    }
  }

  f_fillFormData(data: Array<any> = []) {
    this.form.get('VENDOR_NO').setValue(this.search_vendor_id)
    this.form.get('VENDOR_TYPE').setValue(data[0].VENDOR_TYPE)
    this.form.get('VENDOR_GL').setValue(data[0].VENDOR_GL)
    this.form.get('VENDOR_NAME').setValue(data[0].VENDOR_NAME)
    this.form.get('VENDOR_ADDRESS1').setValue(data[0].VENDOR_ADDRESS1)
    this.form.get('VENDOR_CITY').setValue(data[0].VENDOR_CITY)
    this.form.get('VENDOR_PIN').setValue(data[0].VENDOR_PIN)
    this.form.get('VENDOR_COUNTRY').setValue(data[0].VENDOR_COUNTRY)
    this.form.get('VENDOR_STATE').setValue(data[0].VENDOR_STATE)
    this.form.get('VENDOR_PAN').setValue(data[0].VENDOR_PAN)
    this.form.get('VENDOR_GSTIN').setValue(data[0].VENDOR_GSTIN)
    this.form.get('VEND_EMAIL').setValue(data[0].VEND_EMAIL)
    this.form.get('VEND_PHONE').setValue(data[0].VEND_PHONE)
    this.form.get('VEND_CONTACT').setValue(data[0].VEND_CONTACT)

    this.form.get('VEND_CURRENCY').setValue(data[0].VEND_CURRENCY)
    this.form.get('VEND_CREDITDAYS').setValue(data[0].VEND_CREDITDAYS)
    this.form.get('PO_REQD').setValue(data[0].PO_REQD)
    this.form.get('TDSAPPLICABLE').setValue(data[0].TDSAPPLICABLE)
    this.form.get('TDS_CODE').setValue(data[0].TDS_CODE)
    this.form.get('GST_CLASS').setValue(data[0].GST_CLASS)
    this.form.get('ACTIVE').setValue(data[0].ACTIVE)
    this.form.get('VENDOR_BANK').setValue(data[0].VENDOR_BANK)
    this.form.get('VENDOR_IFSC').setValue(data[0].VENDOR_IFSC)
    this.form.get('VENDOR_BANK_ACC').setValue(data[0].VENDOR_BANK_ACC)

    // this.setCompany();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 250);
  }

    f_validateFormData(){

      if (this.form.controls['VENDOR_TYPE'].invalid) {
        this.toast.warning('Please select Vendor Type');
        return false;
      } else if (this.form.controls['VENDOR_NO'].invalid) {
        this.toast.warning('Please enter Vendor Code');
        return false;
      } else if (this.form.controls['VENDOR_GL'].invalid) {
        this.toast.warning('Please enter Vendor GL');
        return false;
      } else if (this.form.controls['VENDOR_NAME'].invalid) {
        this.toast.warning('Please enter Vendor Name');
        return false;
      }  else if (this.form.controls['VENDOR_ADDRESS1'].invalid) {
        this.toast.warning('Please enter Address');
        return false;
      } else if (this.form.controls['VENDOR_CITY'].invalid) {
        this.toast.warning('Please enter City');
        return false;
      } else if (this.form.controls['VENDOR_PIN'].invalid) {
        this.toast.warning('Please enter PIN Code');
        return false;
      } else if (this.form.controls['VENDOR_COUNTRY'].invalid) {
        this.toast.warning('Please select Country');
        return false;
      } else if (this.form.controls['VENDOR_STATE'].invalid) {
        this.toast.warning('Please select State');
        return false;
      } else if (this.form.controls['VENDOR_PAN'].invalid) {
        this.toast.warning('Please enter PAN No ');
        return false;
      } else if (this.form.controls['VENDOR_GSTIN'].invalid) {
        this.toast.warning('Please enter GSTIN');
        return false;
      } else if (this.form.controls['VEND_EMAIL'].invalid) {
        this.toast.warning('Please enter Email');
        return false;
      } else if (this.form.controls['VEND_PHONE'].invalid) {
        this.toast.warning('Please enter Phone');
        return false;
      } else if (this.form.controls['VEND_CONTACT'].invalid) {
        this.toast.warning('Please enter Contact Person ');
        return false;
      }  else if (this.form.controls['VEND_CURRENCY'].invalid) {
        this.toast.warning('Please select Currency');
        return false;
      } else if (this.form.controls['VEND_CREDITDAYS'].invalid) {
        this.toast.warning('Please enter Cr. Days ');
        return false;
      } else if (this.form.controls['TDS_CODE'].invalid) {
        this.toast.warning('Please select TDS Code');
        return false;
      } else if (this.form.controls['VENDOR_BANK'].invalid) {
        this.toast.warning('Please select Bank');
        return false;
      } else if (this.form.controls['VENDOR_IFSC'].invalid) {
        this.toast.warning('Please enter IFSC Code');
        return false;
      } else if (this.form.controls['VENDOR_BANK_ACC'].invalid) {
        this.toast.warning('Please enter Account No ');
        return false;
      }
      return true;
    }

    f_clearForm(){
      this.form.reset();
      this.search_vendor_id = '';
      this.isSubmited = false;
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
    }

}
