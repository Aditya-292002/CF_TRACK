import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { noUndefined } from '@angular/compiler/src/util';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { PipeService } from 'src/app/services/pipe.service';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';

declare var $: any;

@Component({
  selector: 'app-self-appraisal',
  templateUrl: './self-appraisal.component.html',
  styleUrls: ['./self-appraisal.component.css']
})
export class SelfAppraisalComponent implements OnInit {

  spinner:boolean = false;
  QUESTIONS_LIST: any[] = [];
  currentIndex: any = 1;
  APPRAISAL_ID:any;
  dummyquestions_list:any[] =[]
  isSubmited: boolean = false;
  answer:string ="Yes"
  IsConfirmationCancelModal:boolean =false
  APPRAISAL_PERIOD:any;
  NOTE:any;
  STATUS_CODE:any;
  isStartQuize:boolean = false;
  QuizBtnLable:any;
  userData:any = {};
  Username:any;
  Usernames:any;
  USER_ID:any;

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
     this.sharedService.formName = "Self Appraisal";
     this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
      this.USER_ID = this.userData[0].USERID;
      this.Username=this.userData[0].USER_NAME;
      this.Usernames=this.Username.split(" ");
      this.Username=this.Usernames[0];
      this.GetAppriasalDetails();
     setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  } 

  GetAppriasalDetails(){
  let data = {
    "USERID":this.USER_ID
  };
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetAppriasalDetails,data).then((res:any) =>{
   if(res.flag == 1){
    this.QUESTIONS_LIST = res.Appriasal_detail;
    this.APPRAISAL_ID = this.QUESTIONS_LIST[0].APPRAISAL_ID
    this.APPRAISAL_PERIOD = this.QUESTIONS_LIST[0].APPRAISAL_PERIOD
    this.NOTE = this.QUESTIONS_LIST[0].NOTE
    this.STATUS_CODE = this.QUESTIONS_LIST[0].STATUS_CODE
    this.isStartQuize = true;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.spinner = false;
   }else {
    this.spinner = false;
   }
  })  
  }

  GetBackQuestion(){
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  GetNextQuestion(answer:any){
    if(!this.sharedService.isValid(answer)){
      this.toast.error("Please Enter the answer");
      return;
    }
    if (this.currentIndex < this.QUESTIONS_LIST.length ) {
        this.currentIndex++;
      }
  }

  Submit(val:any){
    if(val == 0){
      for(let data of this.QUESTIONS_LIST){
        if(!this.sharedService.isValid(data.APPRAISAL_ANS)){
          this.toast.error("Please Enter the answer of Question No. "+data.SR_NO);
          return;
        }
       }
    }

      if(val==0){
        this.IsConfirmationCancelModal =true
        return
      }
      if(val=="Y"){
        val =0
      }

    let data = {
      "APPRAISAL_ID": this.APPRAISAL_ID,
      "QUESTIONS_LIST": this.QUESTIONS_LIST,
      "IS_DRAFT": val,
    } 
    // console.log('data ->' , JSON.stringify(data))
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.SaveAppriasalDetailsByUserId,data).then((res:any)=>{
    if (res.flag) {
      this.toast.success(res.msg);
      this.GetAppriasalDetails();
      this.isStartQuize = true;
      this.spinner = false;
    }else {
      this.spinner = false;
    }
    })
  }

  OnYesClickCancel(val:any){
    if(val=='Y'){
      this.IsConfirmationCancelModal =false
      this.Submit(val)
    }
    else{
      this.IsConfirmationCancelModal =false
    }
  }

  QuizBtn(){
   this.isStartQuize = false;
  }

  BackToStart(){
   this.isStartQuize = true;
  }

}

