import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

declare var $: any;

@Component({
  selector: 'app-self-appraisal-list',
  templateUrl: './self-appraisal-list.component.html',
  styleUrls: ['./self-appraisal-list.component.css']
})
export class SelfAppraisalListComponent implements OnInit {

  userData:any = {};
  SELF_APPRIASAL_LIST:any = [];
  spinner:boolean = false;
  USERID:any;
  FYEAR:any;
  isViewList:any = false;
  SELF_APPRIASAL_DETAILS:any = [];
  answer:string ="Yes";
  USERNAME:any;
  
   constructor(public sharedService: SharedServiceService,
       private apiUrl: ApiUrlService,
       private http: HttpRequestServiceService,
       private formBuilder: FormBuilder,
       private toast: ToastrService,
       private datePipe: DatePipe,
       public validationService: ValidationService,
       private pipeService: PipeService,
       public datepipe: DatePipe,
       private currencyPipe: CostFilterPipe) { }
 
   ngOnInit() {
      this.sharedService.formName = "Appraisal List";
      this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
      this.USERID = this.userData[0].USERID;
      this.FYEAR = this.userData[0].FYEAR;
      this.GetSaveAppriasalList();
      setTimeout(() => {
       $('.selectpicker').selectpicker('refresh').trigger('change');
     }, 100);
   } 
 
   GetSaveAppriasalList(){
    let data = {
      USERID: this.USERID,
      FYEAR: this.FYEAR
    }
    // console.log('data ->' , JSON.stringify(data))
    // return
    this.http.PostRequest(this.apiUrl.GetSaveAppriasalList,data).then((res:any)=>{
      if(res.flag == 1){
        this.SELF_APPRIASAL_LIST = res.Appriasal_list;
        this.isViewList = true;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
       }else {
        this.spinner = false;
       }
    })
   }

   GetAppriasalDetailsByUserId(val:any){
    this.USERNAME = val.USER_NAME
    let data = {
      USERID: val.USERID,
      FYEAR: val.FYEAR
    }
    // console.log('data ->' , JSON.stringify(data))
    // return
    this.http.PostRequest(this.apiUrl.GetAppriasalDetailsByUserId,data).then((res:any)=>{
      if(res.flag == 1){
        this.SELF_APPRIASAL_DETAILS = res.Appriasal_Details;
        this.sharedService.formName = "Appraisal Details";
        this.isViewList = false;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
       }else {
        this.spinner = false;
       }
    })
   }

   BackToList(){
    this.sharedService.formName = "Appraisal List";
    this.GetSaveAppriasalList();
   }

}
