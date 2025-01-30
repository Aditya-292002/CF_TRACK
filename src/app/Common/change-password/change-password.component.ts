import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  form: FormGroup;
  spinner: boolean = true;
  format : RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  constructor(private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService,
    private route: RoutingService,
    private encr: EncryptionService,
    private toast: ToastrService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private apiUrl: ApiUrlService) {
      
     }


     private regx_AlphaOnly: RegExp = new RegExp(/[^A-Z]+$/g);
     private regx_NumOnly: RegExp = new RegExp(/[^0-9]+$/g);
     private regx_SpecialOnly: RegExp = new RegExp(/[^!@#$%^&*]+$/g);
    userData: string = "";
    oldPassword : string= "";
    newPassword: string ;
    confPassword: string = "";

  ngOnInit() {
    this.sharedService.formName = "Change Password"

    this.form = this.formBuilder.group({
      newPassword:["",[
        Validators.required, 
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]],
    })

    $('.selectpicker').selectpicker('refresh').trigger('change');
  

    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.userData = params['data'];
    // });

    // if (this.userData != "" && this.userData != undefined && this.userData != null) {
      
    // } else {
    //   this.route.changeRoute()
    // }
  }

  ngAfterViewInit(){
    // this.encr.BASE64_TO_UTF8(this.userData).then( data=> {
      // let data = this.encr.BASE64_TO_UTF8(decodeURIComponent(this.userData))
      // let data = this.encr.JS_DECRYPT_STRING(decodeURIComponent(this.userData))
      setTimeout(() => {
          // this.route.changeRoute()
          this.spinner = false;
      }, 200);
      
    // })
     
  }

  isSubmited: boolean = false;
  onSubmitPassword() {
    this.isSubmited = true;
if(this.oldPassword == "" || this.oldPassword == null || this.oldPassword == undefined){

  this.toast.warning("Please enter your old password")
}
else if(this.form.getRawValue().newPassword == "" || this.form.getRawValue().newPassword == null 
|| this.form.getRawValue().newPassword == undefined){

  this.toast.warning("Please enter your new password")
}
else if(this.confPassword == "" || this.confPassword == null || this.confPassword == undefined){

  this.toast.warning("Please enter your confirm password")
}
  else  if (this.oldPassword != this.form.getRawValue().newPassword ) {
      if(this.f_validateFormData()){
      let data = {
        TYPE: "change-password",
        OLDPASSWORD : this.oldPassword,
        NEWPASSWORD: this.form.getRawValue().newPassword
      }

      this.http.PostRequest(this.apiUrl.ChangePassword, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.isSubmited = false;
          this.spinner = false;
          this.route.changeRoute('')
        } else {
         this.oldPassword = "";
          this.toast.error(res.msg)
          this.spinner = false;
         }
       }, err => {
        this.spinner = false;
       }).catch(e => {
        this.spinner = false;
       })}
      }else {
      this.toast.warning("Old Password cannot be same as New Password!")
    }
  }
  // "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#\*\?])(?=.{8,})/"
  f_validateFormData(){
    var newpass =  this.form.getRawValue().newPassword;

    this.form.getRawValue().newPassword = newpass.replace(this.regx_AlphaOnly, '');
    
    var newpass_AlphaOnly = newpass.replace(this.regx_AlphaOnly, '');
    var newpass_NumOnly = newpass.replace(this.regx_NumOnly, '');
    var newpass_SpecialOnly = newpass.replace(this.regx_SpecialOnly, '');
    // this.form.setValue(this.form.getRawValue().newPassword)
    
    if(newpass_AlphaOnly.length < 1){
      this.toast.warning('Password must contain at least one uppercase character')
      return false;
      
    }
    if(newpass_NumOnly.length < 1 ){
      this.toast.warning('Password must contain at least one number character')
      return false;
      
    }
    if(newpass_SpecialOnly.length < 1){
      this.toast.warning('Password must contain at least one special character')
      return false;
      
    }
    else if (newpass.length <= 7) {
      this.toast.warning('please enter password minimum 8 char');
      return false;
    }
     else if (newpass !== this.confPassword) {
      this.toast.warning("New Password and Confirm Password does not match!");
      return false;
    }
    return true;
  }


  // log(){
  //   console.log('pattern: ', this.form.getRawValue().newPassword('pattern'));
  // }

  // login(){
  //   this.confPassword='';
  //   this.oldPassword='';
  //   this.newPassword='';
  //   this.route.changeRoute()
  // }
  

  onDashboard(){
    this.route.changeRoute('')
  }



}
