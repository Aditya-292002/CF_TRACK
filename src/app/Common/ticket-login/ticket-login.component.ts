import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-ticket-login',
  templateUrl: './ticket-login.component.html',
  styleUrls: ['./ticket-login.component.css']
})
export class TicketLoginComponent implements OnInit {
  spinner: boolean = false;
  @ViewChild("username", { static: false }) username: ElementRef;
  @ViewChild("password", { static: false }) password: ElementRef;
  @ViewChild("login_userId", { static: false }) forgotPass_email: ElementRef;


  loginForm: FormGroup
  profile_pic: string = "";
  login_user:any;
  OTPFLAG:boolean=false;
 otpFields: string[] = Array(4).fill('');
    timeLeft: number = 600; // 10 minutes = 600 seconds
  timerSubscription: Subscription | null = null;
  otpExpired: boolean = false;
input1: string = '';
input2: string = '';
input3: string = '';
input4: string = '';
  @ViewChild('inputRef1', { static: false }) inputRef1!: ElementRef;
  @ViewChild('inputRef2', { static: false }) inputRef2!: ElementRef;
  @ViewChild('inputRef3', { static: false }) inputRef3!: ElementRef;
  @ViewChild('inputRef4', { static: false }) inputRef4!: ElementRef;
  OTPASS: string='';
  role_id: any;
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
     
    });
   
  }
    ngOnDestroy() {
  if (this.timerSubscription) {
  this.timerSubscription.unsubscribe();
}
  }

  login_userId: string = ""
  ngAfterViewInit() {
    this.username.nativeElement.focus();
  }

  onSubmitLogin() {
    // if (this.loginForm.valid) {
      this.spinner = true;
        console.log('data1',this.OTPASS);
      let _username = this.encr.JS_ENCRYPT_STRING(this.login_userId)
      let _password = this.encr.JS_ENCRYPT_STRING(this.getOtp())
      let data = {
        grant_type: "password",
        UserName: _username,
        Password: _password
      }
      console.log('data1',data);
       let _data = "grant_type=password&password=" + "&username=" + encodeURIComponent(_username)
      this.OTPFLAG=false;
      console.log('data',_data);
      
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
                  }
                  else if(this.login_user === 'NA'){
                    this.route.changeRoute('/issuerequestlist');
                  }
                  else{
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
      })


    // } else {
     // this.f_loginFormValidations();
      this.spinner = false;
    // }
  }

  f_loginFormValidations(){
    if(this.loginForm.controls['login_userId'].invalid){
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
      console.log('this.login_userId',this.login_userId);
      
      this.forgotPass_email.nativeElement.focus();
      return;
    }

    if (!this.validationService.emailValidator(this.login_userId)) {
      this.toast.warning("Please enter valid email id.");
      this.forgotPass_email.nativeElement.focus();
      return;
    }
   // this.spinner = true;

    let data = {
      EMAIL: this.login_userId,
      TYPE: "forgot"
    }
    
    //return
      this.http.PostRequest(this.apiurl.VERIFYCLIENTDETAILS, data).then(res => {
        if (res.flag==1) {
          //this.isForgetSceen = false;
          this.OTPFLAG=true
          this.spinner = false;
          //this.login_userId = "";
          this.sendOTPassword();
        //  this.toast.success(res.msg)`
        } else {
          this.isForgetSceen = false;
          this.spinner = false;
         // this.login_userId = "";
          this.toast.error(res.msg)
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

    sendOTPassword() {
      this.startCountdown();
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
        URL: "",
        TYPE: "forgot",
        EMAIL: this.login_userId

      }
    
      this.http.PostRequest(this.apiurl.SendOTP_getOTPassword, data).then(res => {
        if (res.flag) {
          this.isForgetSceen = false;
          this.spinner = false;``
          // this.login_userId = "";
          this.OTPFLAG=true
          this.toast.success(res.msg)
          this.otpExpired=false
        } else {
          this.isForgetSceen = false;
          this.spinner = false;
          this.login_userId = "";
          this.toast.error(res.msg)
          this.OTPFLAG=false;
        }
      }, err => {
        this.spinner = false;
      }).catch(e => {
        this.spinner = false;
      })

  }
//  otp logic


  onInputChange(event: any, index: number) {
    // Log the OTP fields to check if they are being updated
    console.log('OTP Fields:', this.otpFields,event.target.value);
      const value = event.target.value;
    this.otpFields[index] = value;
    if (event.target.value.length === 1 && index < this.otpFields.length - 1) {
      const nextInput = document.getElementsByClassName('otp-input')[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onFocus(index: number) {
    // Select text when the user focuses on the input field
    console.log('Input field focused:', index);
    // setTimeout(() => {
      const inputElement = document.getElementsByClassName('otp-input')[index] as HTMLInputElement;
      if (inputElement) {
        inputElement.select();
      }
    // }, 100);
  }

  onKeydown(event: KeyboardEvent, index: number) {
    // Handle keydown events like "Backspace" or "ArrowRight"
    if (event.key === 'Backspace' && index > 0) {
      const prevInput = document.getElementsByClassName('otp-input')[index - 1] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();  // Move focus to the previous input on "Backspace"
      }
    }
  }

  // submitOTP() {
    // const otp = this.otpFields.join('');
    // console.log('Submitted OTP:', otp);
    // VERIFYOTP
    // Call your backend to verify OTP here
  // }

      submitOTP() {
  //         this.input1 = '1';
  // this.input2 = '2';
  // this.input3 = '3';
  // this.input4 = '4';

  console.log('input1:', this.input1);
  console.log('input2:', this.input2);
  console.log('input3:', this.input3);
  console.log('input4:', this.input4);
             const otp = this.getOtp();
  console.log('Submitted OTP:', otp);
    // this.spinner = true;
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
        URL: "",
        TYPE: "forgot",
        EMAIL: this.login_userId,
        OTP:otp
      }
      console.log('data',data);
      
    
      this.http.PostRequest(this.apiurl.VERIFYOTP, data).then(async res => {
        if (res.flag) {
          console.log('inside flag');
          
          //this.isForgetSceen = false;
           this.geToken();
          this.spinner = false;
        //  this.login_userId = "";
         // this.route.changeRoute('/issuerequestmaster'); 
          this.toast.success(res.msg)
        } else {
        //  this.isForgetSceen = false;
          this.spinner = false;
        //  this.login_userId = "";
          this.toast.error(res.msg)
         // this.OTPFLAG=false;
        }
      }, err => {
        this.spinner = false;
      }).catch(e => {
        this.spinner = false;
      })

  }

    startCountdown() {
      console.log('startCountdown called');
      
    this.timerSubscription = interval(1000).subscribe(() => {
      console.log('startCountdown called inside');
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.otpExpired = true;
    if (this.timerSubscription) {
  this.timerSubscription.unsubscribe();
}
      }
    });
  }
  get minutes(): string {
  return Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
}

get seconds(): string {
  return (this.timeLeft % 60).toString().padStart(2, '0');
}





  onInput(event: any, index: number) {
    const value = event.target.value;
    if (!/^[0-9a-zA-Z]$/.test(value)) {
      event.target.value = '';
      return;
    }

    // Auto-move to next input
    switch (index) {
      case 1:
        this.inputRef2.nativeElement.focus();
        break;
      case 2:
        this.inputRef3.nativeElement.focus();
        break;
      case 3:
        this.inputRef4.nativeElement.focus();
        break;
      case 4:
        // Optionally blur or submit
        this.inputRef4.nativeElement.blur();
        break;
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      switch (index) {
        case 4:
          if (!this.input4) this.inputRef3.nativeElement.focus();
          break;
        case 3:
          if (!this.input3) this.inputRef2.nativeElement.focus();
          break;
        case 2:
          if (!this.input2) this.inputRef1.nativeElement.focus();
          break;
      }
    }
  }

getOtp(): string {
  this.OTPASS="";
    this.OTPASS= (this.input1 || '') + (this.input2 || '') + (this.input3 || '') + (this.input4 || '');
  return (this.input1 || '') + (this.input2 || '') + (this.input3 || '') + (this.input4 || '');
}

   geToken() {
    // if (this.loginForm.valid) {
      console.log('this.OTPASS',this.OTPASS);
      this.spinner = true;
      let _username = this.encr.JS_ENCRYPT_STRING(this.login_userId)
      let _password = this.encr.JS_ENCRYPT_STRING(this.OTPASS)
      
      let data = {
        grant_type: "password",
        UserName: _username,
        Password: _password
      }
  
      let _data = "grant_type=password&password=" + encodeURIComponent(_password) + "&username=" + encodeURIComponent(_username)
      console.log('data geToken',data);
     //  this.submitOTP();
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
               this.role_id=this.sharedService.loginUser[0].ROLE_ID
                setTimeout(() => {
                  // this.route.changeRoute('');
                  if(this.login_user === '1001'){
                    this.route.changeRoute('/dashboard');
                  }
                  else if(this.login_user === '1234'){
                    this.route.changeRoute('/issuerequestlist');
                  }
                  else{
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
      })

    // } else {
      // this.f_loginFormValidations();
      // this.spinner = false;
    // }
  }
  backToLogin(){
    this.OTPFLAG=false;
    this.timeLeft=600;
    // this.otpExpired=false;
  }
}
