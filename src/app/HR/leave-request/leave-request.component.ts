import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  @ViewChild('attendance', { static: false }) attendance: ElementRef;  
  @ViewChild('SaveConformationPopUp', { static: false }) SaveConformationPopUp: ElementRef;  
  // public date: Date;
  spinner: boolean = false;
  form: FormGroup
  isReject:boolean = false;
  isViewLeave:boolean = false;
  type: number = 0;
  inboundClick: boolean = false;
  // maxDate: any ='';
  Annualleave:any = '';
  LeaveUsed:any = '';
  BalanceLeave:any = '';
  TODAY_DATE: any = '';
  FROM_DATE: any = '';
  TO_DATE: any = '';
  REQUEST_DATE: any= '';
  maxdate = new Date();
  today_date = new Date();
  today_date_s : any;
  min_date = new Date(new Date().getFullYear(), 0, 1);
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;
  // data: any;
  isAdmin:boolean = false;
  all_leave_list: Array<any> = [];
  Leave_list:Array<any> = [];
  EmpCommon_list: Array<any> = [];
  LeaveType_list: Array<any> = [];
  isSubmited: boolean = false;
  F_DATE: any = '';
  isHalfDay:boolean = true;
  T_DATE: any = '';
  Pending_Leave_Count_list:any = [];
  aprrovalDetails:any = [];
  count:any = 0;
  userData:any = {};
  ROLE_NAME:any;
  isSaveReturn:any;
  warningmess:any;
  
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private route: RoutingService,
    private toast: ToastrService,
    private datepipe: DatePipe,
    public validationService: ValidationService){}

  ngOnInit() {
    this.sharedService.formName = "Leave Request"
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.ROLE_NAME = this.userData[0].ROLE_NAME;
    // console.log('userData ->' , this.userData)
    // console.log('ROLE_NAME ->' , this.ROLE_NAME)
    this.form = this.formBuilder.group({
      EMP_NO: ["",Validators.required],  
      REQUEST_DATE: ["",Validators.required],
      LEAVE_TYPE: ["",Validators.required],
      LEAVE_CODE: ["",Validators.required],
      LEAVE_BALANCE : "",
      HR_APPROVED_LEAVE: 0,
      LEAVE_PENDING_FOR_HR_APPROVAL: 0,
      LEAVE_PENDING_FOR_PM_APPROVAL: 0,
      REASON :["",Validators.required],
      FROM_DATE:["",Validators.required],
      TO_DATE:["",Validators.required],
      FYEAR: [""],
      REQ_ID:"0"
    })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ngAfterViewInit(){ 
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
      if(this.sharedService.loginUser[0].FYEAR == undefined){
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
        
       }
       this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
       this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.sharedService.loginUser[0].TO_DATE;
       this.form.get('REQUEST_DATE').setValue(this.sharedService.getTodayDate());
       this.REQUEST_DATE =this.sharedService.getTodayDate();
      if(this.sharedService.loginUser[0].ROLE_NAME == 'SUPER ADMIN'){
          this.isAdmin = true;
         this.GetLeaveCommonList();
         this.Addrights();
      } else{
        this.isAdmin = false;
      }
      this.isViewLeave = !this.isViewLeave;
      this.GetLeaveCommonList();
      this.Addrights();
      this.GetLeaveBalance();
      this.GetLeaveDetailsforheader();
    },150)
  }

  GetLeaveCommonList() {
    let data = {
      LISTTYPE: "all",
      EMP_NO: this.sharedService.loginUser[0].EMP_CODE,
      // USER_NAME:this.sharedService.loginUser[0].USER_NAME
    }
    this.http.PostRequest(this.apiUrl.GetLeaveCommonList, data).then(res => {
      if (res.flag) {
        this.EmpCommon_list = res.EmpCommon_list;
        this.Leave_list = res.Leave_list;
        this.LeaveType_list = res.LeaveType_list;
        this.Pending_Leave_Count_list = res.Pending_Leave_Count_list;
        this.Pending_Leave_Count_list.forEach((element:any)=>{
          if(element.STATUS == 'P' ){
            this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').setValue(+element.STATUS_COUNT)
          }else if(element.STATUS == 'M' ){
            this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').setValue(+element.STATUS_COUNT)
          }else if(element.STATUS == 'A' ){
            this.form.get('HR_APPROVED_LEAVE').setValue(+element.STATUS_COUNT)
          }  
          if(this.form.get('HR_APPROVED_LEAVE').value == ''){
            this.form.get('HR_APPROVED_LEAVE').setValue(0)
          }
          if(this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').value == ''){
            this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').setValue(0)
          }
          if(this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').value == ''){
            this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').setValue(0)
          }
        })
        this.f_fillFormData();
        this.GetLeaveBalance();
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

  f_fillFormData() {
    this.form.get("EMP_NO").setValue(this.sharedService.loginUser[0].EMP_CODE)
    // this.form.get("USER_NAME").setValue(this.sharedService.loginUser[0].USER_NAME)
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
      this.GetLeaveList();
    }, 100);
  }

  Addrights(){
    if(this.ADD_RIGHTS == false){
      document.getElementById('emp').setAttribute("disabled","true");
    }
    else if(this.ADD_RIGHTS == true ){
      document.getElementById('emp').removeAttribute("disabled");
    }
  }

  GetLeaveList(){
    let data = {
      LISTTYPE:"all",
      // REQ_ON:REQ_ON,
      EMP_NO : this.form.getRawValue().EMP_NO,
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetLeaveList, data).then(res => {
      if (res.flag) {
        this.all_leave_list = res.Leave_list;

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

 changeViewList(){
  this.GetLeaveList();
 this.GetLeaveBalance();
//  this.GetLeaveCommonList();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 
  100);
 }

 viewLeaveList(){
  this.isViewLeave = !this.isViewLeave;
  this.inboundClick = false;
  this.GetLeaveList();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

 GetLeaveBalance(){
  let data = {
    USERID:this.sharedService.loginUser[0].USERID,
    PAYEAR:this.sharedService.loginUser[0].FYEAR,
    EMP_NO:this.form.getRawValue().EMP_NO,
  }
  // console.log(data)
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetLeaveBalance, data).then((res:any) => {
    if (res.flag) {
      // this.form.get('LEAVE_BALANCE').setValue(res.LeaveBalance[0].BALANCELEAVE);
      this.Pending_Leave_Count_list = res.Pending_Leave_Count_list;
      if(this.Pending_Leave_Count_list.length == 0){
        this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').setValue(0)
        this.form.get('HR_APPROVED_LEAVE').setValue(0)
        this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').setValue(0)
      } else {
        this.Pending_Leave_Count_list.forEach((element:any)=>{
          if(element.STATUS == 'P' ){
            this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').setValue(+element.STATUS_COUNT)
          }else if(element.STATUS == 'M' ){
            this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').setValue(+element.STATUS_COUNT)
          }else if(element.STATUS == 'A' ){
            this.form.get('HR_APPROVED_LEAVE').setValue(+element.STATUS_COUNT)
          }  
          if(this.form.get('HR_APPROVED_LEAVE').value == ''){
            this.form.get('HR_APPROVED_LEAVE').setValue(0)
          }
          if(this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').value == ''){
            this.form.get('LEAVE_PENDING_FOR_HR_APPROVAL').setValue(0)
          }
          if(this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').value == ''){
            this.form.get('LEAVE_PENDING_FOR_PM_APPROVAL').setValue(0)
          }
        })
      }
      // if(res.LeaveBalance !== []){
      // this.form.get('LEAVE_BALANCE').setValue(res.LeaveBalance[0].BALANCELEAVE)
      // }
      // else{
      //   this.form.get('LEAVE_BALANCE').setValue= null;
      // }
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

  backToForm(){
    this.isViewLeave = !this.isViewLeave;
    this.inboundClick = false;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  SAVE_LEAVE(val:any){
   this.isSaveReturn = val;
   this.isSubmited = true;
    let data = {
      TYPE:"APPROVE",
      USERID: this.userData[0].USERID,
      REQ_ID: this.form.value.REQ_ID,
      SaveLeave:this.form.value,
    }
    if(this.isSaveReturn == 0){
        return
    }else if(this.isSaveReturn == 2){
      jQuery(this.SaveConformationPopUp.nativeElement).modal('show')
       return
    }
    // console.log('data ->' , JSON.stringify(data));
    // return
    this.http.PostRequest(this.apiUrl.SaveLeave, data ).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.isSubmited = false;
        this.f_clearForm();
        this.GetLeaveCommonList();
        setTimeout(() => {
          this.viewLeaveList();
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
     this.inboundClick=false;
  }

  f_clearForm(){
    this.isSubmited = false;
    this.form.reset();
    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('REQUEST_DATE').setValue(this.sharedService.getTodayDate())
    this.REQUEST_DATE = this.sharedService.getTodayDate();
    this.form.get("EMP_NO").setValue(this.sharedService.loginUser[0].EMP_CODE)
    // this.form.get("EMP_NO").setValue(this.form.getRawValue().EMP_NO)
    // this.form.get("USER_NAME").setValue(this.sharedService.loginUser[0].USER_NAME)
    this.isViewLeave = !this.isViewLeave;
    this.FROM_DATE = '';
    this.F_DATE='';
    this.TO_DATE='';
    this.T_DATE='';
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  f_validateFormData(){
    if (this.form.controls['EMP_NO'].invalid) {
      this.toast.warning('Please select employee');
      return false;
    }    
     else if (this.form.controls['REQUEST_DATE'].invalid) {
      this.toast.warning('Please select request date');
      return false;
    }
     else if (this.form.controls['LEAVE_CODE'].invalid) {
      this.toast.warning('Please select leave code');
      return false;
    }
    else if (this.form.controls['LEAVE_TYPE'].invalid) {
      this.toast.warning('Please select leave type');
      return false;
    }
    else if (this.form.controls['FROM_DATE'].invalid) {
      this.toast.warning('Please select from date');
      return false;
    }
    else if (this.form.controls['TO_DATE'].invalid) {
      this.toast.warning('Please select to date');
      return false;
    }
    else if (this.form.controls['REASON'].invalid) {
      this.toast.warning('Enter a reason for leave');
      return false;
    }
    return true;
  }

  editLeave(data:any){
    this.form.get("FROM_DATE").setValue(data.FROM_DATE)
    this.form.get("TO_DATE").setValue(data.TO_DATE)
    this.form.get("LEAVE_CODE").setValue(data.LEAVE_CODE)
    this.form.get("LEAVE_TYPE").setValue(data.LEAVE_TYPE)
    this.form.get("REQ_ID").setValue(data.REQ_ID)
    this.form.get("REQUEST_DATE").setValue(data.REQUEST_DATE)
    this.form.get("REASON").setValue(data.REASON)
    //this.form.get("LEAVE_CODE").setValue(data.LEAVE_NAME)
    //this.form.get("LEAVE_TYPE").setValue(data.LEAVE_TYPE_DESC)
    // this.GetLeaveList(data.REQ_ON)
    // this.inboundClick = false;LEAVE_TYPE
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ChangeToDate(){
    this.REQUEST_DATE = this.datepipe.transform(new Date(this.TODAY_DATE), 'dd-MMM-yyyy')
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

   ChangeFDate(){
    if(this.form.getRawValue().LEAVE_TYPE == "H"){
      // document.getElementById('cal3').setAttribute("disabled","true");
      // document.getElementById('dt_cal3').setAttribute("disabled","true");
      // document.getElementById('div_todate').setAttribute("disabled","true");
    this.isHalfDay = false;
    this.FROM_DATE = this.datepipe.transform(new Date(this.F_DATE), 'dd-MMM-yyyy')
    var to_date = this.datepipe.transform(new Date(this.FROM_DATE),'dd-MMM-yyyy');
    this.form.get('TO_DATE').setValue(to_date);
    }
    else{
      this.isHalfDay = true;
      this.FROM_DATE = this.datepipe.transform(new Date(this.F_DATE), 'dd-MMM-yyyy')
      // document.getElementById('cal3').removeAttribute("disabled");
      // document.getElementById('dt_cal3').removeAttribute("disabled");
      // document.getElementById('div_todate').removeAttribute("disabled");
      // this.form.get('TO_DATE').reset();
    }
     setTimeout(() => {
       $('.selectpicker').selectpicker('refresh').trigger('change');
     }, 100);
   }

   ChangeTDate(){
    this.TO_DATE = this.datepipe.transform(new Date(this.T_DATE), 'dd-MMM-yyyy')
    setTimeout(() => {
       $('.selectpicker').selectpicker('refresh').trigger('change');
     }, 100);
  }

  GetLeaveDetailsforheader() {
    let data = {
      LISTTYPE: "all",
      EMP_NO: this.sharedService.loginUser[0].EMP_CODE,
      // USER_NAME:this.sharedService.loginUser[0].USER_NAME
    }
    this.http.PostRequest(this.apiUrl.GetLeaveDetailsforheader, data).then(res => {
      if (res.flag) {
        // console.log(res);
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

  openPopup(details: any, column: string): void {
    if (column === 'Status') {
      let data={
        "EMP_NO":details.EMP_NO,
        "REQ_ID":details.REQ_ID
      }
      this.http.PostRequest(this.apiUrl.ApproveDetails, data).then((res:any) => {
          this.aprrovalDetails=res.search_leave_list
          if(this.aprrovalDetails[0].STATUS != "P"){
            this.aprrovalDetails[0].APPROVEDON=this.datepipe.transform(this.aprrovalDetails[0].APPROVEDON, 'dd-MM-yyyy');
            this.aprrovalDetails[0].HRAPPROVEDON=this.datepipe.transform(this.aprrovalDetails[0].HRAPPROVEDON, 'dd-MM-yyyy');
            jQuery(this.attendance.nativeElement).modal('show')
          }
      });
    }
  }

  CheckValidationForLeaveRequest(){
   if(this.f_validateFormData()){
    let data = {
      USERID: this.userData.USERID,
      LeaveData: [{
        "EMP_NO": this.form.value.EMP_NO,
        "LEAVE_CODE": this.form.value.LEAVE_CODE,
        "LEAVE_TYPE": this.form.value.LEAVE_TYPE,
        "REQUEST_DATE": this.form.value.REQUEST_DATE,
        "FROM_DATE": this.form.value.FROM_DATE,
        "TO_DATE": this.form.value.TO_DATE,
        "REASON": this.form.value.REASON,
      }],
    }
    // console.log('data 1 ->' , data)
    // return
    this.http.PostRequest(this.apiUrl.CheckValidationForLeaveRequest, data ).then((res:any) => {
      this.isSaveReturn = res.flag;
      if (this.isSaveReturn == 0) {
          this.toast.warning(res.msg)
      }else if(this.isSaveReturn == 1){
        // this.toast.success(res.msg)
      }else if(this.isSaveReturn == 2){
        this.warningmess = res.msg;
        // this.toast.success(res.msg)
      }
      this.SAVE_LEAVE(this.isSaveReturn);
        this.isSubmited = false;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
    });
  }
  }

}
