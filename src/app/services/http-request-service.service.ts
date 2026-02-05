import { Injectable } from '@angular/core';
import { SharedServiceService } from './shared-service.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestServiceService {

  public API_URL: string = "";

  constructor(
    public http: HttpClient,
    private sharedService: SharedServiceService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit() { }


  getToken(data): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer my-token',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      }),
      withCredentials: true,
      responseType: 'text' as 'json'
    }

    let body = data;
    // console.log(JSON.stringify(data))
    return new Promise<any>((resolve, reject) => {
      if (this.sharedService.API_URL == "" || this.sharedService.API_URL == undefined) {
        this.toast.warning("API Url not found, please check app settings.")
        reject();
        return;
      } 
      
      this.http.post(this.sharedService.TOKEN_URL, body, httpOptions).toPromise().then(res => {

        let result = typeof (res) == 'object' ? res : JSON.parse(res)

        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('access_token', result.access_token)
        if (result.access_token != null || result.access_token != "") {
          resolve({ flag: true })
        } else {
          resolve({ flag: false, msg: res })
      }

      }, err => {
        this.spinner.hide();
        let result = typeof (err) == 'object' ? err : JSON.parse(err)
        if (result.status == 404) {
          resolve({ flag: false, msg: result.statusText })
        } else if (result.status == 0) {
          resolve({ flag: false, msg: "API not found" })
        } else if(result.status == 400){
          let _result = typeof (result.error) == 'object' ? result.error : JSON.parse(result.error) 
          let _msg = _result.error_description?_result.error_description:"API Request Failure"
          resolve({ flag: false, msg: _msg })
        }else {
         let _result = typeof (result.error) == 'object' ? result.error : JSON.parse(result.error) 
         let _msg = _result.error_description?_result.error_description:"API Request Failure"         
          resolve({ flag: false, msg: _msg })
        }
      });

    }).catch(e => {
      console.log("You got an EXCEPTION in HTTP_Request: " , e);
      this.spinner.hide();
    })
  }

  PostRequest(url, data): Promise<any> {
    let tokn= sessionStorage.getItem('access_token') == null?"":sessionStorage.getItem('access_token')
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + tokn,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access_token': tokn
      }),
      withCredentials: true,
      observe: 'response' as 'body',
      responseType: 'text' as 'json'
    }
    let body = {}

    if(this.sharedService.loginUser == null || this.sharedService.loginUser == undefined)
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') != null?JSON.parse(sessionStorage.getItem('user_detail')):[];
    // console.log('this.sharedService.loginUser ->' , this.sharedService.loginUser)

    //--------------------------------Commented 2-2-2026-------------------------------
    // let _loginUser = this.sharedService.loginUser == undefined ? {} : {"USERID" : this.sharedService.loginUser[0].USERID };
    //------------------------------------------------------------------------


    //-----------------------------------Added 2-2-2026--------------------------------
    let _loginUser = {};

    if (Array.isArray(this.sharedService.loginUser) &&
      this.sharedService.loginUser.length > 0 &&
      this.sharedService.loginUser[0].USERID
      ) {
        _loginUser = { USERID: this.sharedService.loginUser[0].USERID };
      }
    //------------------------------------------------------------------------

    let _userData = data == undefined ? {} : data
    body = {..._loginUser, ..._userData}

    body = JSON.stringify(body)

    return new Promise<any>((resolve, reject) => {
      if (this.sharedService.API_URL == "" || this.sharedService.API_URL == undefined) {
        this.toast.warning("API Url not found, please check app settings.")
        reject();
        return;
      } 

      this.http.post(this.sharedService.API_URL + url, body, httpOptions).toPromise().then(res => {
      
        let _result = typeof (res['body']) == 'object' ? res['body'] : JSON.parse(res['body'])
        resolve(_result)
      }, err => {
        this.spinner.hide();
        let result = typeof (err) == 'object' ? err : JSON.parse(err)
        if (result.status == 404) {
          resolve({ flag: false, msg: result.statusText })
        } else if (result.status == 0) {
          resolve({ flag: false, msg: "API not found" })
        }else if(result.status == 400){
          let _result = typeof (result.error) == 'object' ? result.error : JSON.parse(result.error) 
          let _msg = _result.error_description?_result.error_description:"API Request Failure"
          resolve({ flag: false, msg:  _msg })
        }else {
         let _result = typeof (result.error) == 'object' ? result.error : JSON.parse(result.error) 
         let _msg = _result.error_description?_result.error_description:"API Request Failure"         
          resolve({ flag: false, msg: _msg })
        }
      }).catch(e=>{
        console.log(e)
        this.spinner.hide()
      })


    }).catch(e => {
      console.log("You got an EXCEPTION in HTTP_Request: " + e)
      this.spinner.hide();
    })
  }

  uploadFiles(url, data): void {
    let tokn= sessionStorage.getItem('access_token') == null?"":sessionStorage.getItem('access_token')
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'bearer ' + tokn,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access_token': tokn
      }),
      withCredentials: true,
      observe: 'response' as 'body',
      responseType: 'text' as 'json'
    }
    let body = {}
    let _loginUser = this.sharedService.loginUser[0] == undefined ? {} : this.sharedService.loginUser[0]
    
    let _userData = data == undefined ? {} : data
    body = {..._loginUser, ..._userData}

    
    this.http.post(this.sharedService.API_URL + url, body, httpOptions).toPromise().then(res => {
      let _result = typeof (res['body']) == 'object' ? res['body'] : JSON.parse(res['body'])
      if(_result.flag){
      }else{
        // this.toast.warning(_result.msg,"File Upload")
      }
    }, err => {
      this.spinner.hide();
      let result = typeof (err) == 'object' ? err : JSON.parse(err)
      if (result.status == 404) {
        this.toast.error(result.statusText,"File Upload")
      } else if (result.status == 0) {
        this.toast.error("API not found","File Upload")
      } else {
        result = typeof (result.error) == 'object' ? result.error : result
        this.toast.error(result,"File Upload")
      }
    });
    
  }
}
