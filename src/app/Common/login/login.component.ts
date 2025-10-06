import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  spinner: boolean = false;
  @ViewChild("username", { static: false }) username: ElementRef;
  @ViewChild("password", { static: false }) password: ElementRef;
  @ViewChild("user_email_id", { static: false }) forgotPass_email: ElementRef;

  loginForm: FormGroup
  profile_pic: string = "";
  login_user:any;
  constructor(
    private authService: AuthServiceService,
    private route: RoutingService,
    private formBuilder: FormBuilder,
    private http: HttpRequestServiceService,
    private sharedService: SharedServiceService,
    private toast: ToastrService,
    private apiurl: ApiUrlService,
    private validationService: ValidationService,
    private encr: EncryptionService
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
   
  }

  login_userId: string = ""
  ngAfterViewInit() {
    this.username.nativeElement.focus();
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.spinner = true;
      let _username = this.encr.JS_ENCRYPT_STRING(this.loginForm.getRawValue().username)
      let _password = this.encr.JS_ENCRYPT_STRING(this.loginForm.getRawValue().password)
      let data = {
        grant_type: "password",
        UserName: _username,
        Password: _password
      }
  
      let _data = "grant_type=password&password=" + encodeURIComponent(_password) + "&username=" + encodeURIComponent(_username)
      
      this.http.getToken(_data).then((res:any) => {
        if (res.flag) {
          this.http.PostRequest(this.apiurl.GetUserDetail, data).then((res:any) => {
            if (res.flag) {
              this.sharedService.loginUser = res.user_detail;
              this.sharedService.profile_pic = res.b64;
              sessionStorage.setItem('user_detail', JSON.stringify(res.user_detail))
              sessionStorage.setItem('profile_pic', res.b64)
              this.sharedService.formName = "";
              this.login_user = this.sharedService.loginUser[0].EMP_CODE 
                setTimeout(() => {
                  // this.route.changeRoute('');
                  if(this.login_user === '1001'){
                    this.route.changeRoute('/dashboard');
                  }else{
                    this.route.changeRoute('/calendar');
                  }
                 
                }, 150);
            } else {
              this.loginForm.reset()
              this.toast.error(res.msg)
              this.spinner = false;
            }
          }, err => {
            this.spinner = false;
          }).catch(e => {
            console.log(e)
          })

          this.sharedService.formName = "";
        } else {
          this.loginForm.reset()
          this.toast.error(res.msg)
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      }).catch(e => {
        console.log(e)
        this.spinner = false;
      })


    } else {
      this.f_loginFormValidations();
      this.spinner = false;
    }
  }

  f_loginFormValidations(){
    if(this.loginForm.controls['username'].invalid){
      this.toast.warning('Please enter usename');
      this.username.nativeElement.focus();
    } else if(this.loginForm.controls['password'].invalid){
      this.toast.warning('Please enter password');
    }
  }
  // forget code
  isForgetSceen: boolean = false;

  onSubmitForgot() {
    if (this.login_userId == "" || this.login_userId == null || this.login_userId == undefined) {
      this.toast.warning("Please enter email id.");
      this.forgotPass_email.nativeElement.focus();
      return;
    }

    if (!this.validationService.emailValidator(this.login_userId)) {
      this.toast.warning("Please enter valid email id.");
      this.forgotPass_email.nativeElement.focus();
      return;
    }
    this.spinner = true;

    let data = {
      EMAIL: this.login_userId,
      TYPE: "forgot"
    }
    this.http.PostRequest(this.apiurl.Check_EmpNo_Email, data).then(res => {
      if (res.flag) {
        this.f_sendResetPasswordUrl()
      } else {
        this.login_userId = "";
        this.toast.error(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    }).catch(e => {
      this.spinner = false;
    })
  }
  _url_string: string = ''
  f_sendResetPasswordUrl() {
    this.spinner = true;
    let encr_url = this.encr.UTF_TO_BASE64(this.login_userId)
    // let encr_url = this.encr.JS_ENCRYPT_STRING (this.login_userId)
    encr_url = encodeURIComponent(encr_url)
      //let _url: any = location.origin + '/ForgotPasswordReset?data=' + encr_url;
      let _url: any = location.href + '/ForgotPasswordReset?data=' + encr_url;
      //console.log(_url);
     _url = _url.toString().replaceAll("/login",'')
      // _url = _url.toString().replaceAll("https://",'')
      console.log("After replace : " + _url);
      let data = {
        URL: _url,
        TYPE: "forgot",
        EMAIL: this.login_userId

      }
    
      this.http.PostRequest(this.apiurl.SendOTP_ForgotPassword, data).then(res => {
        if (res.flag) {
          this.isForgetSceen = false;
          this.spinner = false;
          this.login_userId = "";
          this.toast.success(res.msg)
        } else {
          this.isForgetSceen = false;
          this.spinner = false;
          this.login_userId = "";
          this.toast.success(res.msg)
        }
      }, err => {
        this.spinner = false;
      }).catch(e => {
        this.spinner = false;
      })

  }
  enc(){
  
  }
}
