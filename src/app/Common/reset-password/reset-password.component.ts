import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  spinner: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
    private route: RoutingService,
    private encr: EncryptionService,
    private toast: ToastrService,
    private http: HttpRequestServiceService,
    private apiUrl: ApiUrlService) { }

  userData: string = "";
  userEmail: string = "";
  userOTP: any = '';
  userPassword: string = "";
  confPassword: string = "";


  private regx_AlphaOnly: RegExp = new RegExp(/[^A-Z]+$/g);
  private regx_NumOnly: RegExp = new RegExp(/[^0-9]+$/g);
  private regx_SpecialOnly: RegExp = new RegExp(/[^!@#$%^&*]+$/g);
  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.userData = params['data'];
    });

    if (this.userData != "" && this.userData != undefined && this.userData != null) {

    } else {
      this.route.changeRoute()
    }

  }

  ngAfterViewInit() {
    // this.encr.BASE64_TO_UTF8(this.userData).then( data=> {
    let data = this.encr.BASE64_TO_UTF8(decodeURIComponent(this.userData))
    // let data = this.encr.JS_DECRYPT_STRING(decodeURIComponent(this.userData))
    setTimeout(() => {
      if (data == "" || data == undefined) {
        this.route.changeRoute()
        this.spinner = false;
      } else {
        this.userEmail = data;
        this.spinner = false;
      }
    }, 200);

    // })

  }

  onSubmitPassword() {
    if (this.f_validateFormData()) {

      if (this.userPassword == this.confPassword) {
        let data = {
          TYPE: "forgot",
          EMAIL: this.userEmail,
          OTP: this.userOTP,
          PASSWORD: this.userPassword
        }

        this.http.PostRequest(this.apiUrl.CheckOTP_ForgotPassword, data).then(res => {
          if (res.flag) {
            this.toast.success(res.msg)
            this.spinner = false;
            this.route.changeRoute()
          } else {
            this.userOTP = "";
            this.toast.error(res.msg)
            this.spinner = false;
          }
        }, err => {
          this.spinner = false;
        }).catch(e => {
          this.spinner = false;
        })
      } else {
        this.toast.warning("New Password and Confirm Password does not match!")
      }
    }
  }


  f_validateFormData() {
    var newpass = this.userPassword;
    var newpass_AlphaOnly = newpass.replace(this.regx_AlphaOnly, '');
    var newpass_NumOnly = newpass.replace(this.regx_NumOnly, '');
    var newpass_SpecialOnly = newpass.replace(this.regx_SpecialOnly, '');
    // this.form.setValue(this.form.getRawValue().newPassword)
    if (this.userOTP.length < 1) {
      this.toast.warning('Please enter your otp.')
      return false;
    }
    if (this.userPassword.length < 1) {
      this.toast.warning('Please enter your new password.')
      return false;
    }
    if (this.confPassword.length < 1) {
      this.toast.warning('Please enter your confirm password.')
      return false;
    }
    if (newpass_AlphaOnly.length < 1) {
      this.toast.warning('Password must contain at least one uppercase character')
      return false;

    }
    if (newpass_NumOnly.length < 1) {
      this.toast.warning('Password must contain at least one number character')
      return false;

    }
    if (newpass_SpecialOnly.length < 1) {
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


  login() {
    this.confPassword = '';
    this.userEmail = '';
    this.userOTP = '';
    this.userPassword = '';
    this.route.changeRoute()
  }
}
