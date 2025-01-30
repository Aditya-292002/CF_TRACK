import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { log } from 'console';
declare var $: any;

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.css']
})
export class ManagerApprovalComponent implements OnInit {
  [x: string]: any;
  spinner: boolean = false;
  form: FormGroup
  isReject:boolean = false;
  
  isAdmin:boolean = false;
  isShowEmpDetails:boolean = false;
  isAddLeave:boolean = false;

  FROM_DATE: any = '';
  TO_DATE: any = '';
  T_DATE: any = '';
  F_DATE: any = '';
  maxdate = new Date();
  today_date = new Date();
  today_date_s : any;
  min_date = new Date(new Date().getFullYear(), 0, 1);

  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;

  isViewLeave:boolean = false;
 reject_reason:any;;
 USER_NAME:any;

 leaveDetails:any;
 REASON1:any;
 LEAVE_BALANCE:any;
 LEAVE_TYPE:any;
 REQ_ID:any;
 EMP_NO:any;
 EmployeeHistory:any;
 filterList:any='P';
 employeeDetailsFToggle:any='HISTORY';
 TOTAL_LEAVE_APPLIED:any;
 LEAVE_PENDING_FOR_PM_APPROVAL:any;
 LEAVE_PENDING_FOR_HR_APPROVAL:any;
 LEAVE_CODE:any;
 LeaveDetails:any
EmpCommon_list:any
FROM_DATE1:any;
TO_DATE1:any;
  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private route: RoutingService,
    private datepipe: DatePipe,
    public validationService: ValidationService) { }

  ngOnInit() {
    this.sharedService.formName = "Leave Approval(PM)"
    
    this.form = this.formBuilder.group({
      EMP_NO: ["",Validators.required],  
      LEAVE_TYPE: ["",Validators.required],
      FROM_DATE: "",
      TO_DATE:"",
      FYEAR: [""],
      REQ_ID:"0",
      USERID:"0",
      STATUS:["",Validators.required],
  

    })
    setTimeout(() => {
      // this.GetPendingLeave_Employee_List();

      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
    this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
    this.GetSearchLeaveList()
    
  }

  ngAfterViewInit(){    
    setTimeout(() => {

      //  if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      //  }
      //  if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      //  }
  
      //  this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
       if(this.sharedService.loginUser[0].FYEAR == undefined){
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
        
       }
       this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);

      //  this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
       
      
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.sharedService.loginUser[0].TO_DATE;
        this.GetPendingLeave_Employee_List();

       if(this.sharedService.loginUser[0].ROLE_NAME == 'SUPER ADMIN'){
          this.isAdmin = true;
         this.GetPendingLeave_Employee_List();
         this.GetLeaveCommonList();
         this.GetPendingLeave_Employee();
       } else{
        this.isAdmin = false;
       }
       this.isViewLeave = !this.isViewLeave;
       this.GetLeaveCommonList();
       this.GetPendingLeave_Employee();
      
    })
  }

  LeaveType_list: Array<any> = [];
  GetLeaveCommonList() {
    let data = {
      LISTTYPE: "all",
      // USER_NAME:this.sharedService.loginUser[0].USER_NAME
    }

    this.http.PostRequest(this.apiUrl.GetLeaveCommonList, data).then(res => {
      if (res.flag) {
        this.LeaveType_list = res.LeaveType_list;
        this.EmpCommon_list=res.EmpCommon_list
        // this.f_fillFormData();
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

  all_employee_list: Array<any> = [];
  Employee_list:Array<any>=[];
  GetPendingLeave_Employee_List() {
    let data = {
      TYPE:"LIST"
  
    }

    this.http.PostRequest(this.apiUrl.GetPendingLeave_Employee_List_Detail, data).then(res => {
     console.log(res)
      if (res.flag) {
        this.all_employee_list = res.pendingleave_emp_list_detail;
        // this.Employee_list = res.pendingleave_emp_list_detail;
        this.GetPendingLeave_Employee();

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

  GetPendingLeave_Employee() {
    let data = {
      TYPE:"Detail",

    }

    this.http.PostRequest(this.apiUrl.GetPendingLeave_Employee_List_Detail, data).then(res => {
     console.log(res)
      if (res.flag) {
        this.Employee_list = res.pendingleave_emp_list_detail;
        // this.GetPendingLeave_Employee();

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

  selectedIndex: number;
  clickApprove(index: number = null){
    this.selectedIndex = index;
  }
  // isApprove : boolean = false;

  ApproveLeave(){
    // this.GetPendingLeave_Employee();
    let data = {
      // REQ_ID:this.Employee_list[this.selectedIndex].REQ_ID,
     REQ_ID:this.REQ_ID,
     TYPE:"APPROVE",
     REASON:"",
     APPROVALTYPE:"MANAGER Approval"
  
    }
    console.log('ApproveLeave data',data);
   //return
    this.http.PostRequest(this.apiUrl.ApproveRejectLeave, data).then(res => {
      if (res.flag) {
        this.toast.success(res.msg)
        this.Employee_list.splice(this.selectedIndex,1)
        console.log('res',res);
        
        // this.isReject=false;
        // this.isApprove=true;
        // this.isPending=false;
 
        setTimeout(() => {
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
    // this.isApprove=false;
    this.isViewLeave=true;
  }

  selectedINDEX :number;
  clickReject(index : number=null){
   this.selectedINDEX = index
  }
  // isRejectLeave:boolean = false;
  RejectLeave(){
    let data = {
      // REQ_ID:this.Employee_list[this.selectedINDEX].REQ_ID,
      REQ_ID:this.REQ_ID,
     TYPE:"REJECT",
     REASON:this.reject_reason,
    //  Type:"HR Approval"

  
    }
   console.log('data RejectLeave',JSON.stringify(data));
  //return
    this.http.PostRequest(this.apiUrl.ApproveRejectLeave, data).then(res => {
     console.log(res)
      if (res.flag) {
        this.toast.success(res.msg)
        this.Employee_list.splice(this.selectedINDEX,1)
         this.isViewLeave=true;
        setTimeout(() => {
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
  }

  Search_List : Array<any> =[]
   GetSearchLeaveList() {
    let data = {
      EMP_NO:this.form.getRawValue().EMP_NO,
      FROM_DATA:this.form.getRawValue().FROM_DATE,
      TO_DATA:this.form.getRawValue().TO_DATE,
      LEAVE_TYPE:this.form.getRawValue().LEAVE_TYPE,
      STATUS:this.filterList,
      USERID :this.sharedService.loginUser[0].USERID,
    }

    console.log('GetSearchLeaveList',data,this.sharedService.loginUser)
    this.http.PostRequest(this.apiUrl.GetSearchLeaveList, data).then(res => {
      if (res.flag) {
        // this.Search_List= res.search_leave_list
        // this.Search_List= res.search_leave_list
        // this.Employee_list = this.Search_List;
        this.Employee_list= res.search_leave_list
        this.f_fillFormData();  
       console.log('this.Employee_list', this.Employee_list);
       
        
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
    // this.form.get("EMP_NO").setValue(this.Employee_list[0].EMP_NO)
    // this.form.get("FROM_DATE").setValue(this.Employee_list[0].FROM_DATE)
    // this.form.get("TO_DATE").setValue(this.Employee_list[0].TO_DATE)
    // this.form.get("LEAVE_TYPE").setValue(this.Employee_list[0].LEAVE_TYPE)

    setTimeout(() => {
      this.form.get("EMP_NO").setValue(this.form.getRawValue().EMP_NO)
      this.form.get("FROM_DATE").setValue(this.form.getRawValue().FROM_DATE)
      this.form.get("TO_DATE").setValue(this.form.getRawValue().TO_DATE)
      this.form.get("LEAVE_TYPE").setValue(this.form.getRawValue().LEAVE_TYPE)
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 200);
   }

   today_Leave_List:Array<any>=[];
   GetTodayLeavelist() {
     let data = {
       USERID :this.sharedService.loginUser[0].USERID,
       EMP_NO:this.form.getRawValue().EMP_NO,
       FROM_DATA:this.form.getRawValue().FROM_DATE,
       TO_DATA:this.form.getRawValue().TO_DATE,
 
     }
     console.log(data)
     this.http.PostRequest(this.apiUrl.GetClashLeave_EmployeeList, data).then(res => {
       console.log(res)
       if (res.flag) {
         this.today_Leave_List= res.clashleave_emp_list
 
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

   viewLeaveList(){
    // this.isAddLeave = !this.isAddLeave;
   this.GetTodayLeavelist();

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }


  leaveReason:any;
  clickLeave(reason: string = ''){

    this.leaveReason = (reason == ""?"NA":reason);
  }

  LeaveReason:any;
  clickReason(Reason: string = ''){
    // this.empno = reason;
    this.LeaveReason = (Reason == ""?"NA":Reason);

  }

  

   ChangeFDate(){

    this.FROM_DATE = this.datepipe.transform(new Date(this.F_DATE), 'dd-MMM-yyyy')
    
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

    viewDetails(data: any) {
      console.log('viewDetails data', data); // Log the data for debugging
      this.isViewLeave = false; // Hide the leave form
      // Bind the data to the component properties
      this.REQ_ID=data.REQ_ID;
      this.USER_NAME = data.USER_NAME;
      this.LEAVE_BALANCE = data.LEAVE_BALANCE;
      this.FROM_DATE1 = data.FROM_DATE;
      this.TO_DATE1 = data.TO_DATE;
      this.LEAVE_TYPE = data.LEAVE_TYPE;
      this.REASON1 = data.REASON;
      this.EMP_NO=data.EMP_NO;
      this.TOTAL_LEAVE_APPLIED=data.APPROVED_COUNT;
      this.LEAVE_PENDING_FOR_PM_APPROVAL=data.PENDING_COUNT
      this.LEAVE_PENDING_FOR_HR_APPROVAL=data.MANAGER_COUNT
      if(data.LEAVE_CODE=="PL"){
          this.LEAVE_CODE="PRIVILEGE LEAVE"
      }else if(data.LEAVE_CODE=="CL"){
          this.LEAVE_CODE="CASUAL//SICK//EXTENSION LEAVE"
      }else if(data.LEAVE_CODE=="ML"){
          this.LEAVE_CODE="MATERNITY LEAVE"
      }
    //  console.log('data.USER_NAME', data.USER_NAME); // For debugging
      this.employeeHistory(this.employeeDetailsFToggle);
    }
    toggle(){
      this.isViewLeave = !this.isViewLeave;
       this.employeeDetailsFToggle='HISTORY'
      this.GetSearchLeaveList()
    }
    employeeHistory(value:any){
      let data={
        EMP_NO:this.EMP_NO
      }
      this.spinner=true;
     
      this.employeeDetailsFToggle=value;

      if(value=='HISTORY'){
      
      this.http.PostRequest(this.apiUrl.EmployeeHistory, data).then(res => {
        if (res.flag) {
          //this.employeeDetailsFToggle=value;
          this.spinner = false;
         console.log('employeeHistory',res);
         this.EmployeeHistory=res.EmployeeHistory;
         this.LeaveDetails=res.v_LEAVE_DETAILS
        //  this.TOTAL_LEAVE_APPLIED=this.LeaveDetails[0].STATUS_COUNT  ;
        //  this.LEAVE_PENDING_FOR_PM_APPROVAL=this.LeaveDetails[1].STATUS_COUNT;
        //  this.LEAVE_PENDING_FOR_HR_APPROVAL=this.LeaveDetails[1].STATUS_COUNT;
          // this.f_fillFormData();
        }
      }, err => {
        this.spinner = false;
      });
    }
    else{
      this.EmployeeHistory=[];
      this.spinner = false;
      let data={
        EMP_NO:this.EMP_NO,
        FROM_DATE:this.FROM_DATE,
        TO_DATE:this.TO_DATE
      }
      this.http.PostRequest(this.apiUrl.PERIODWISE_LEAVE_DETAILS, data).then(res => {
        if (res.flag) {
       //   this.employeeDetailsFToggle=true;
          this.spinner = false;
         console.log('employeeHistory else',res);
         this.EmployeeHistory=res.EmployeeHistory
          // this.f_fillFormData();
        }
      }, err => {
        this.spinner = false;
      });
      console.log('EmployeeHistory',this.EmployeeHistory);
      
    } 
    }
    filterListWithStatus(val:any){
      this.filterList=val;
      console.log('this.filterList',this.filterList);
      this.GetSearchLeaveList();
    }
    resetDropdown(VAL:any) {
      // console.log('INSIDE',VAL);
       
       this.form.controls[VAL].setValue(''); 
       $('.selectpicker').selectpicker('refresh'); 
       this.GetSearchLeaveList()
     }

     clear(){
      this.form.controls['STATUS'].setValue('');  
      $('.selectpicker').selectpicker('refresh'); 
      this.form.controls['EMP_NO'].setValue('');  
      $('.selectpicker').selectpicker('refresh'); 
      this.form.controls['LEAVE_TYPE'].setValue('');  
      $('.selectpicker').selectpicker('refresh'); 
      this.form.controls['FROM_DATE'].setValue('');  
      $('.selectpicker').selectpicker('refresh'); 
      this.form.controls['TO_DATE'].setValue('');  
      $('.selectpicker').selectpicker('refresh'); 
      this.GetSearchLeaveList()
    
    }

    onChange(event: any) {
      const selectedLeaveType = event.target.value;
      this.GetSearchLeaveList();
    
    }
}
