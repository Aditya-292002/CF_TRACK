import { DatePipe } from '@angular/common';
import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';
import { HostListener } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
declare var jQuery: any;

@Component({
  selector: 'app-layout-new',
  templateUrl: './layout-new.component.html',
  styleUrls: ['./layout-new.component.css']
})
export class LayoutNewComponent implements OnInit {
  @ViewChild('attendance', { static: false }) attendance: ElementRef;  
  @ViewChild('chagefyear', { static: false }) chagefyear: ElementRef;
  spinner: boolean = false;
  
  constructor(
    private route: RoutingService,
    private authService: AuthServiceService,
    public sharedService: SharedServiceService,
    private http: HttpRequestServiceService,
    private apiUrl: ApiUrlService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  login_user: string = "";
  role_name : string = "";
  designation : string = "";
  SYS_DATE_TIME: any = '';
  ATT_DATE: any = '';
  WORK_LOC: any ='O';
  ISFINANCE: boolean = false;
  FYEAR: number = null;
  FROM_DATE:Date = null;
  TO_DATE:Date = null;
  FYEAR_CLOSE:boolean=true;
  COMPANY_CODE:any;
  company_list:any = [];
  COMPANY_NAME:any;
  LOCATION_NAME:any;
  FYEAR_DESC:any;
  location_list:any = [];
  Url:any;
  headerName:string = "";
  isShowToggle:boolean = false;
  FUNCTIONCODE:any;

// MenuRightList=[
//   {
//     "FUNCTION_CODE": "DH",
//     "FUNCTION_DESC": "Dashboard",
//     "URL": "",
//     "ICON":"pi pi-home",
//     "DETAIL": []
// },
//   {
//       "FUNCTION_CODE": "HR",
//       "FUNCTION_DESC": "HR & Self Service",
//       "URL": "",
//       "ICON":"pi pi-sitemap",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "HR001",
//               "FUNCTION_DESC": "Employee",
//               "URL": "/employeeinfo",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "HR004",
//               "FUNCTION_DESC": "Attendance By Admin",
//               "URL": "/attendancebyadmin",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "HR005",
//               "FUNCTION_DESC": "Timesheet Allow Extend",
//               "URL": "/timesheetallowextend",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "L0001",
//               "FUNCTION_DESC": "Leave Request",
//               "URL": "/leaverequest",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "L0002",
//               "FUNCTION_DESC": "HR Leave Approval",
//               "URL": "/leaveapproval",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "HR",
//               "FUNCTION_CODE": "HR006",
//               "FUNCTION_DESC": "Salary Information",
//               "URL": "/salaryinformation",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   },
//   {
//       "FUNCTION_CODE": "MK",
//       "FUNCTION_DESC": "Marketing",
//       "URL": "",
//       "ICON":"pi pi-shop",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "MK",
//               "FUNCTION_CODE": "MK001",
//               "FUNCTION_DESC": "Customer",
//               "URL": "/customer",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "MK",
//               "FUNCTION_CODE": "MK002",
//               "FUNCTION_DESC": "Project",
//               "URL": "/project",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   },
//   {
//       "FUNCTION_CODE": "FI",
//       "FUNCTION_DESC": "Finance",
//       "URL": "",
//       "ICON":"pi pi-wallet",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI001",
//               "FUNCTION_DESC": "Invoice Request",
//               "URL": "/invoicerequest",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI003",
//               "FUNCTION_DESC": "Invoice",
//               "URL": "/invoice",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI004",
//               "FUNCTION_DESC": "Vendor",
//               "URL": "/vendor",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI005",
//               "FUNCTION_DESC": "Purchase Order",
//               "URL": "/po",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI006",
//               "FUNCTION_DESC": "Journal Voucher",
//               "URL": "/jv",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI007",
//               "FUNCTION_DESC": "Expense",
//               "URL": "/expense",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI008",
//               "FUNCTION_DESC": "Bank Receipt",
//               "URL": "/bankreceipt",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI009",
//               "FUNCTION_DESC": "Bank Payment",
//               "URL": "/bankpayment",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI011",
//               "FUNCTION_DESC": "Bank Multi Payment",
//               "URL": "/bankmultipayment",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI012",
//               "FUNCTION_DESC": "E-Invoice",
//               "URL": "/e-invoice",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "FI",
//               "FUNCTION_CODE": "FI013",
//               "FUNCTION_DESC": "Credit Note",
//               "URL": "/invoicecancel",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   },
//   {
//       "FUNCTION_CODE": "PY",
//       "FUNCTION_DESC": "Payroll",
//       "URL": "",
//       "ICON":"pi pi-receipt",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "PY",
//               "FUNCTION_CODE": "PY001",
//               "FUNCTION_DESC": "Employee Fixed",
//               "URL": "/empfixed",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "PY",
//               "FUNCTION_CODE": "PY002",
//               "FUNCTION_DESC": "Employee Month",
//               "URL": "/empmonth",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "PY",
//               "FUNCTION_CODE": "PY003",
//               "FUNCTION_DESC": "Attendance Process",
//               "URL": "/attendanceprocess",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           },
//           {
//               "MODULE_CODE": "PY",
//               "FUNCTION_CODE": "PY004",
//               "FUNCTION_DESC": "Salary Process",
//               "URL": "/salaryprocess",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   },
//   {
//       "FUNCTION_CODE": "RP",
//       "FUNCTION_DESC": "Reports",
//       "URL": "",
//       "ICON":"pi pi-receipt",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "RP",
//               "FUNCTION_CODE": "RP001",
//               "FUNCTION_DESC": "General Reports",
//               "URL": "/reports",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   },
//   {
//       "FUNCTION_CODE": "PT",
//       "FUNCTION_DESC": "Print",
//       "URL": "",
//       "ICON":"pi pi-print",
//       "DETAIL": [
//           {
//               "MODULE_CODE": "PT",
//               "FUNCTION_CODE": "PT001",
//               "FUNCTION_DESC": "EXPENSE PRINT",
//               "URL": "/expenseprint",
//               "VIEW_RIGHTS": 1,
//               "ADD_RIGHTS": 1,
//               "UPDATE_RIGHTS": 1,
//               "DELETE_RIGHTS": 1,
//               "NO_ACCESS": 0
//           }
//       ]
//   }
// ];



ngOnInit() {
  let Url = this.router.url;
  this.isShowToggle=true
  if(Url == '/'){
    this.headerName = 'Dashboard';
  }else{
    return;
  }
  $(document).ready(function(){
      var window_width=$(window).width();
      if(window_width<1000)
        $(".page-wrapper").removeClass("toggled");
      else
        $(".page-wrapper").addClass("toggled");
  });
  $(window).resize(function() {
    var window_width=$(window).width();
    if(window_width<1000)
      $(".page-wrapper").removeClass("toggled");
    else
      $(".page-wrapper").addClass("toggled");
  });
  
    $(".sidebar-dropdown > a").click(function () {
      $(".sidebar-submenu").slideUp(200);
      if (
        $(this)
          .parent()
          .hasClass("active")
      ) {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .parent()
          .removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .next(".sidebar-submenu")
          .slideDown(200);
        $(this)
          .parent()
          .addClass("active");
      }
    });

    $("#close-sidebar").click(function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
      $(".page-wrapper").addClass("toggled");
    });

    // this.url = this.route.url;

    
  this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
  this.ATT_DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
  
  //$$('.selectpicker').selectpicker('refresh').trigger('change');
  if(this.sharedService.loginUser[0].EMP_CODE == undefined){
    this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
    this.sharedService.profile_pic = sessionStorage.getItem('profile_pic') ? sessionStorage.getItem('profile_pic'):""

    this.profile_pic = this.sharedService.profile_pic
    this.spinner = true;      
    this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
    this.role_name = this.sharedService.loginUser[0].ROLE_NAME
    this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
    this.designation = this.sharedService.loginUser[0].DESIGNATION
    this.FYEAR = this.sharedService.loginUser[0].FYEAR
    this.FYEAR_DESC = this.sharedService.loginUser[0].FYEAR_DESC
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
    this.getUserMenu();
    this.getFyear();
    this.onLoadCheckAttendance();

//    console.log("this.sharedService.loginUser[0].FYEAR",this.sharedService.loginUser[0].FYEAR)
    
  }   else{ 
    this.profile_pic = this.sharedService.profile_pic
    this.spinner = true;      
    this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
    this.role_name = this.sharedService.loginUser[0].ROLE_NAME        
    this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
    this.designation = this.sharedService.loginUser[0].DESIGNATION
    this.FYEAR = this.sharedService.loginUser[0].FYEAR
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
    this.getUserMenu();
    this.getFyear();
    this.onLoadCheckAttendance();

  }   

}

ngAfterViewInit(){    
  setTimeout(() => { 
    if (this.authService.isLoggedIn()) {
      if(sessionStorage.getItem('route')){
        this.route.changeRoute(sessionStorage.getItem('route'))
      }else{
        this.route.changeRoute('')
      }
    } else {
      this.authService.logout();
    }   

    this.sharedService.form_rights = JSON.parse(sessionStorage.getItem('form_rights'))  
    if(this.sharedService.loginUser[0].EMP_CODE == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
      this.sharedService.profile_pic = sessionStorage.getItem('profile_pic') ? sessionStorage.getItem('profile_pic'):""

      this.profile_pic = this.sharedService.profile_pic
      this.spinner = true;      
      this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
      this.role_name = this.sharedService.loginUser[0].ROLE_NAME
      this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
      this.designation = this.sharedService.loginUser[0].DESIGNATION
      this.FYEAR = this.sharedService.loginUser[0].FYEAR
      this.FYEAR_DESC = this.sharedService.loginUser[0].FYEAR_DESC
      this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
      this.getUserMenu();
      this.getFyear();
      this.onLoadCheckAttendance();

  //    console.log("this.sharedService.loginUser[0].FYEAR",this.sharedService.loginUser[0].FYEAR)
      
    }   else{ 
      this.profile_pic = this.sharedService.profile_pic
      this.spinner = true;      
      this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
      this.role_name = this.sharedService.loginUser[0].ROLE_NAME        
      this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
      this.designation = this.sharedService.loginUser[0].DESIGNATION
      this.FYEAR = this.sharedService.loginUser[0].FYEAR
      this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
      this.getUserMenu();
      this.getFyear();
      this.onLoadCheckAttendance();

    }   

    $(document).ready(function() {
      $("#addNewRow").click(function() {
        $('html,body').animate({
            scrollTop: $(".tabs").offset().top
        }, 400);
    });
   });

    // top button function code
    $(document).ready(function(){
      $(window).scroll(function () {
          if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
          } else {
            $('#back-to-top').fadeOut();
          }
        });
        // scroll body to 0px on click
        $('#back-to-top').click(function () {
          $('body,html').animate({
            scrollTop: 0
          }, 400);
          return false;
        });
    });

   
  }, 100);
}

MainMenuClick(data:any){
  //console.log('formdetails',data);
  
  this.menu_list.forEach((element: any) => {
    if (element.FUNCTION_CODE == data.FUNCTION_CODE && element.IS_SUBSELECTED == true) {
      element.IS_SUBSELECTED = false;
     // console.log('data.FUNCTION_CODE1',data.FUNCTION_CODE);
      this.router.navigate([element.DETAIL[0].URL]);
      this.Url = element.DETAIL[0].URL
    } 
    else if (element.FUNCTION_CODE == data.FUNCTION_CODE) {
    //  console.log('data.FUNCTION_CODE2',data.FUNCTION_CODE)
      element.IS_SUBSELECTED = true;
    } else {
      element.IS_SUBSELECTED = false;
    }
  });
  this.FUNCTIONCODE = data.FUNCTION_CODE;
  localStorage.setItem('FUNCTION_CODE',this.FUNCTIONCODE)
} 

subMenuClick(data:any){
  // console.log('subMenuClick',data);
  
  this.menu_list.forEach((element:any)=>{
    if(element.FUNCTION_CODE == data.FUNCTION_CODE){
       element.IS_SUBSELECTED = true;
    }
  });
  //added by hemant 17-jan-2025
  sessionStorage.setItem('form_rights',JSON.stringify(data))      
  this.sharedService.form_rights = data;

  this.FUNCTIONCODE = data.FUNCTION_CODE;
  localStorage.setItem('FUNCTION_CODE',this.FUNCTIONCODE)
  this.router.navigate([data.URL]);
  this.Url = data.URL
}


  onActivate(event) {
    window.scrollTo(0, 0);
  }

  profile_pic: string = "";

  gotoDahboard(){
    this.route.changeRoute('')
  }

  attendance_type: string = 'TIME_IN'
  isAttendance: boolean=false;
  EMP_NAME: string = ''
  onLoadCheckAttendance() {
    this.spinner = true;
    this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
    let data = {  }
    this.http.PostRequest(this.apiUrl.Check_Attendance, data).then(res => {
      if(this.role_name == "MANAGEMENT"){
        this.isAttendance = true;        
        this.spinner = false;
      }
      else if (res.flag  && res.today_flag != 1) {
        this.attendance_type = res.attendance_type
        this.ATT_DATE = res.Date;
        this.EMP_NAME = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
        
        jQuery(this.attendance.nativeElement).modal('show')
        this.isAttendance = false;
        this.spinner = false;
      } else {
        this.isAttendance = true;        
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  CheckAttendance(para: number = null) {
    this.f_clearPopup();
    this.spinner = true;
    this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
    let data = {  }
    this.http.PostRequest(this.apiUrl.Check_Attendance, data).then(res => {
      if (res.flag) {
        this.attendance_type = res.attendance_type
        this.ATT_DATE = res.Date;
        this.EMP_NAME = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
        
        jQuery(this.attendance.nativeElement).modal('show')
        this.isAttendance = false;
        this.spinner = false;
      } else {
        this.isAttendance = true;
        if(para == null){
          this.toast.warning(res.msg)
        }
        
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  _ATT_DATE: any = ''
  ATT_REMARK: string = '';
  TIME_IN: any = '';
  TIME_OUT: any = '';
  onSubmitAttendance() {
   
    let enterd_time: string = ''
    if (this.attendance_type == 'TIME_IN') {

      if(this.TIME_IN == '' || this.TIME_IN == undefined || this.TIME_IN == null){
        this.toast.warning("Please enter IN Time");
        return false;
      }
      enterd_time = this.TIME_IN;

    } else if (this.attendance_type == 'TIME_OUT') {

      if(this.TIME_OUT == '' || this.TIME_OUT == undefined || this.TIME_OUT == null){
        this.toast.warning("Please enter OUT Time");
        return false;
      }
      enterd_time = this.TIME_OUT;

    }
    this.spinner = true
    let t = enterd_time.split(':')
    let h = t[0] || "";
    let m = t[1] || "00"
    enterd_time = ("00" + h.toString()).slice(-2) + ':' + ("00" + m.toString()).slice(-2);
    let data = {
      DATE: this.ATT_DATE,
      attendance_type: this.attendance_type,
      IN_OUT_TIME: enterd_time,
      SYSTEM_TIME: this.SYS_DATE_TIME,
      WORK_LOC: this.WORK_LOC

    }
    this.http.PostRequest(this.apiUrl.Save_Attendance, data).then(res => {
      if (res.flag) { 
        this.spinner = false;
        if(this.ATT_DATE == this.datePipe.transform(new Date(), 'dd-MMM-yyyy')){
          jQuery(this.attendance.nativeElement).modal('hide')
        }
        this.toast.success(res.msg)        
        this.f_clearPopup();
        this.CheckAttendance(1);
       
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  f_clearPopup() {
    this.ATT_DATE = ''
    this._ATT_DATE = ''
    this.ATT_REMARK = '';
    this.TIME_IN = '';
    this.TIME_OUT = '';
    // this.ATT_DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.isAttendance = false;
    this.attendance_type = 'TIME_IN';
  }

  f_logout(){
    this.authService.logout();
    this.sharedService.loginUser =[{}]
  }
click_index: number = -1;
isMainActive: number = null;
isSubActive: number = null;
status: boolean = false;
  // menu_expand_collapse(index){
  //   if(this.click_index == index && index != -1){
  //     // this.click_index = null;
  //   }
  //   else{
  //     this.click_index = index;
  //     this.isMainActive = index;
  //   }
  // }
  // formName: string = "";

  menu_expand_collapse(list,index,flag){
  
    if (index !== -1) {
      for (let i = 0; i < list.length; i++) {
        if (i != index)
          list[i].TOGGLE = false;
      }
      list[index].TOGGLE = !list[index].TOGGLE;
    } else if (index === -1) {
      for (let i = 0; i < list.length; i++) {
        list[i].TOGGLE = false;
        
      }
    }
    this.click_index = index;
    // if(this.click_index == index && index != -1){
    //   this.click_index = null;
    // }
    // else{
    //   this.click_index = index;
    //   this.isMainActive = index;
    // }
  }


 select_submain(list, pindex, cindex) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].DETAIL.length > 0) {
      for (let j = 0; j < list[i].DETAIL.length; j++) {
        list[i].DETAIL[j].toggle = false;
      }
    }
  }
  list[pindex].DETAIL[cindex].toggle = true
  this.isShowToggle = true;
}

  menuClick(para: any, index: number = null){
    // console.log(para);
    if(typeof(para)=='object' && para != ""){
      if(para.MODULE_CODE == "FI" && this.ISFINANCE == true && (this.FYEAR == null || this.FYEAR == 0 || this.FYEAR == undefined)){
        // jQuery(this.chagefyear.nativeElement).modal('show')
        // this.FYEAR_CLOSE = false;
        
        this.route.changeRoute('/companyfyear')
      }
      else{
        this.isSubActive = index;
        sessionStorage.setItem('form_rights',JSON.stringify(para))
        
        this.sharedService.form_rights = para;
        this.route.changeRoute(para.URL)
      }
      
    } else if(para == 'dashboard'){
      this.route.changeRoute('')
      this.isSubActive = null;
    }
  }
  menu_list: Array<any>=[]
  fyear_list: Array<any>=[]
  getUserMenu(){

    this.http.PostRequest(this.apiUrl.GetMenuItems, {}).then(res => {
      if (res) {
        this.menu_list = res.menu_list;
        this.IsSelectedSubMenu();
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }


  IsSelectedSubMenu(){
    // this.menu_list.forEach((element: any) => {
    //   if (element.FORM_NAME == '') {
    //     if (element.sabmenu[0].FORM_NAME == this.url) {
    //     element.IS_SUBSELECTED = true;
    //   }
    // }
    // });
  }

  getFyear(){

    this.http.PostRequest(this.apiUrl.GetFyearList, {}).then(res => {
      if (res) {
        this.fyear_list = res.fyear_list
        this.company_list = res.company_list;
        this.location_list = res.location_list;
        this.company_list.forEach((element:any) => {
          if(element.COMPANY_CODE == this.COMPANY_CODE){
            this.COMPANY_NAME = element.COMPANY_NAME;
        }
        });
        this.location_list.forEach((element:any) => {
          if(element.COMPANY_CODE == this.COMPANY_CODE){
            this.LOCATION_NAME = element.LOCATION_NAME;
        }
        });

      
  
        this.sharedService.loginUser[0].FYEAR = this.FYEAR;
  this.sharedService.loginUser[0].FYEAR = this.FYEAR;
  this.FYEAR_CLOSE = false;
  this.fyear_list.forEach(element => {
    if(element.FYEAR == this.FYEAR){
      this.FROM_DATE = element.FROM_DATE;
      this.TO_DATE = element.TO_DATE;
      this.sharedService.loginUser[0].FROM_DATE = this.FROM_DATE;
      this.sharedService.loginUser[0].TO_DATE = this.TO_DATE;
      this.sharedService.loginUser[0].FYEAR_DESC = element.FYEAR_DESC;
      this.FYEAR_DESC = element.FYEAR_DESC;
    }
  });
  
  sessionStorage.setItem('user_detail', JSON.stringify(this.sharedService.loginUser))
  jQuery(this.chagefyear.nativeElement).modal('hide')

        this.spinner = false;
      setTimeout(() => {
        //$$('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  
  }

  
issideBar: boolean = false;
_temp : number = 0;
 istopBar :boolean = false;
 @HostListener('click', ['$event.target'])
 onClickBody(para) {
   if(this._temp==1){
     this.issideBar = false;
     this.istopBar = false;
     this._temp = 0;
   }

}

// status: boolean = false;
 clickEvent(){
     this.status = !this.status;       
 }
 ShowChangeFyear(){
   
  this.route.changeRoute("/companyfyear")
  //jQuery(this.chagefyear.nativeElement).modal('show')
 }

 onContinueFyear(){
  this.sharedService.loginUser[0].FYEAR = this.FYEAR;
  this.sharedService.loginUser[0].FYEAR = this.FYEAR;
  this.FYEAR_CLOSE = false;
  this.fyear_list.forEach(element => {
    if(element.FYEAR == this.FYEAR){
      this.FROM_DATE = element.FROM_DATE;
      this.TO_DATE = element.TO_DATE;
      this.sharedService.loginUser[0].FROM_DATE = this.FROM_DATE;
      this.sharedService.loginUser[0].TO_DATE = this.TO_DATE;
      this.sharedService.loginUser[0].FYEAR_DESC = element.FYEAR_DESC;
      this.FYEAR_DESC = element.FYEAR_DESC;
    }
  });
  
  sessionStorage.setItem('user_detail', JSON.stringify(this.sharedService.loginUser))
  jQuery(this.chagefyear.nativeElement).modal('hide')
 }

 onRouteChange(){
  this.route.changeRoute('notification')
 }

 OnChangePassword(){
   
  this.route.changeRoute('changepassword')
 }

 showToggleFun(){
  this.isShowToggle = !this.isShowToggle;
}

}
