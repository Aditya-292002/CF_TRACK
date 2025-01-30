import { Injectable } from '@angular/core';
// import * as NodeRSA from 'node-rsa';
import { SharedServiceService } from './shared-service.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeyService } from './key.service';

// declare var rsa_encrypt: any;
// declare function jsFunction(para1, para2): any;

declare function jsEncryption(data, key): any;
declare function jsDecryption(data, key): any;

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  // keys: any = new NodeRSA();
  privateKey: string;
  publicKey: string;
  ENCR: string = '';

  constructor(private sharedService: SharedServiceService,
    public http: HttpClient, private spinner: NgxSpinnerService, private encr_keys: KeyService) { }


  JS_ENCRYPT_DATA(p_data): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // let encr = jsEncryption(p_data, this.encr_keys.public_key);
      // resolve(encr);
      try {
        var str = p_data;
        var ret = '';
        var v_cl = 400;
        if (str != null || str != '') {
          var v_from = 0;
          while (v_from < str.length) {
            ret = ret + '$' + jsEncryption(str.substr(v_from, v_cl), this.encr_keys.public_key);
            v_from = v_from + v_cl;
          }
        }

        resolve(ret);
      } catch (e) {
        console.log(e)
        this.spinner.hide()
        resolve('');
      }
      /*
        try {
          this.keys.importKey(this.encr_keys.public_key, 'pkcs8-public-pem');
          let e = this.keys.encrypt(Buffer.from(p_data, 'utf8')).toString('base64');
          
          resolve(e);
        } catch (e) {
          console.log(e)
          this.spinner.hide()
          resolve(p_data)
        }
        */
    })
  }

  JS_DECRYPT_DATA(p_data): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      // let decr = jsDecryption(p_data, this.encr_keys.private_key);
      // resolve(decr);

      try {
        let data1 = p_data.split('$');
        let i = 0;
        let ret = "";
        while (i < data1.length) {
          if (i > 0) {
            ret = ret + jsDecryption(data1[i], this.encr_keys.private_key);
          }
          i++;
        }
        resolve(ret);
      } catch (e) {
        console.log(e)
        this.spinner.hide()
        resolve('');
      }
      /*
        try {
          this.keys.importKey(this.encr_keys.private_key, 'pkcs1-pem');
          let d = this.keys.decrypt(p_data).toString('utf8');
          resolve(d);
        } catch (e) {
          console.log(e)
          this.spinner.hide()
          resolve('');
        }
        */

    })

  }


  /*
   EncryptData(p_data: any = ""): any {
  
      this.http.get('../../files/public_rsa.key', { responseType: 'text' }).subscribe(res => {
  
        this.keys.importKey(res, 'pkcs8-public-pem');
  
        var str = p_data;
        var ret = '';
        var v_cl = 200;
        if (str != null || str != '') {
          var v_from = 0;
          while (v_from < str.length) {
            ret = ret + '$' + this.keys.encrypt(Buffer.from(str.substr(v_from, v_cl), 'utf8')).toString('base64');
            v_from = v_from + v_cl;
  
          }
        }
        this.ENCR = ret
        
        return this.ENCR;
      }, err=> {
        this.spinner.hide()
        return '';
      })
  
    };
  
   DecryptData(p_cripher: string = ""): any {
  
      try {
        this.http.get('../../files/private_rsa.key', { responseType: 'text' }).subscribe(res => {
  
          this.keys.importKey(res, 'pkcs1-pem');
  
          let data1 = p_cripher.split('$');
          let i = 0;
          let ret = "";
          while (i < data1.length) {
            if (i > 0) {
              ret = ret + this.keys.decrypt(data1[i]).toString('utf8');
            }
            i++;
          }
          let dcomp_data = ret;
          
          return dcomp_data;
        }, err => {
          this.spinner.hide()
          return '';
        })
      } catch (e) {
        this.spinner.hide()
        return "";
      }
    }
  */

  JS_ENCRYPT_STRING(data: string = '') {
    let encr = jsEncryption(data, this.encr_keys.public_key);
    return encr;
  }
  JS_DECRYPT_STRING(encrypted_data: string = '') {
    let decr = jsDecryption(encrypted_data, this.encr_keys.private_key);
    return decr;
  }

  UTF_TO_BASE64(data: any = ''): any {
    let b_string = Buffer.from(data).toString('base64')
    return b_string;
  }
  BASE64_TO_UTF8(data: any = ''): any {
    let _string = Buffer.from(data, 'base64').toString('ascii')
    return _string
  }
}
