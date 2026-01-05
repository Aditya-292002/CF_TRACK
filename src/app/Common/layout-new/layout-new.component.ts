import { DatePipe } from '@angular/common';
import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';
import { HostListener } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
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
  @HostListener('click', ['$event.target'])

  UserId:any="";
  login_user:any = "";
  role_name:any = "";
  designation:any = "";
  SYS_DATE_TIME:any = '';
  ATT_DATE:any = '';
  WORK_LOC:any = 'O';
  ISFINANCE:boolean = false;
  FYEAR:any;
  FROM_DATE:Date;
  TO_DATE:Date;
  FYEAR_CLOSE:boolean=true;
  COMPANY_CODE:any;
  company_list:any = [];
  COMPANY_NAME:any;
  LOCATION_NAME:any;
  FYEAR_DESC:any;
  location_list:any = [];
  Url:any;
  headerName:any = "";
  isShowToggle:boolean = false;
  FUNCTIONCODE:any;
  click_index:any = -1;
  isMainActive:any;
  isSubActive:any;
  status:boolean = false;
  profile_pic:any;
  attendance_type:any = 'TIME_IN'
  isAttendance:boolean=false;
  EMP_NAME:any;
  _ATT_DATE:any;
  ATT_REMARK:any;
  TIME_IN: any;
  TIME_OUT: any;
  menu_list: Array<any>=[];
  fyear_list: Array<any>=[];
  issideBar: boolean = false;
  _temp :any = 0;
  istopBar:boolean = false;
  mergedData:any = [];
  TODATE:any = new Date();
  SUBMITION_LAST_DATE:any;
  role_id: number;

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
  this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
  this.ATT_DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
  // $$('.selectpicker').selectpicker('refresh').trigger('change');
  if(this.sharedService.loginUser[0].EMP_CODE == undefined){
    this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
    this.sharedService.profile_pic = sessionStorage.getItem('profile_pic') ? sessionStorage.getItem('profile_pic'):""
    this.profile_pic = this.sharedService.profile_pic
    this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
    this.role_name = this.sharedService.loginUser[0].ROLE_NAME
    this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
    this.designation = this.sharedService.loginUser[0].DESIGNATION
    this.FYEAR = this.sharedService.loginUser[0].FYEAR
    this.FYEAR_DESC = this.sharedService.loginUser[0].FYEAR_DESC
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
    this.role_id=this.sharedService.loginUser[0].ROLE_ID
    this.getUserMenu();
    this.getFyear();
    this.onLoadCheckAttendance();
  }   else{ 
    this.profile_pic = this.sharedService.profile_pic
    this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
    this.role_name = this.sharedService.loginUser[0].ROLE_NAME        
    this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
    this.designation = this.sharedService.loginUser[0].DESIGNATION
    this.FYEAR = this.sharedService.loginUser[0].FYEAR
    this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
   this.role_id=this.sharedService.loginUser[0].ROLE_ID
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
    this.TODATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
    if(this.sharedService.loginUser[0].EMP_CODE == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
      this.sharedService.profile_pic = sessionStorage.getItem('profile_pic') ? sessionStorage.getItem('profile_pic'):""
      this.profile_pic = this.sharedService.profile_pic
      this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
      this.role_name = this.sharedService.loginUser[0].ROLE_NAME
      this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
      this.designation = this.sharedService.loginUser[0].DESIGNATION
      this.FYEAR = this.sharedService.loginUser[0].FYEAR
      this.FYEAR_DESC = this.sharedService.loginUser[0].FYEAR_DESC
      this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
          this.role_id=this.sharedService.loginUser[0].ROLE_ID
      this.getUserMenu();
      this.getFyear();
      this.onLoadCheckAttendance();
      this.GetAppriasalDetails();
    }   else{ 
      this.profile_pic = this.sharedService.profile_pic
      this.login_user = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
      this.role_name = this.sharedService.loginUser[0].ROLE_NAME        
      this.ISFINANCE = this.sharedService.loginUser[0].ISFINANCE
      this.designation = this.sharedService.loginUser[0].DESIGNATION
      this.FYEAR = this.sharedService.loginUser[0].FYEAR
      this.COMPANY_CODE = this.sharedService.loginUser[0].COMPANY_CODE
          this.role_id=this.sharedService.loginUser[0].ROLE_ID
      this.getUserMenu();
      this.getFyear();
      this.onLoadCheckAttendance();
      this.GetAppriasalDetails();
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
  // console.log('data',data);
  if(data.FUNCTION_DESC == "Dashboard"){
    this.router.navigate(["/dashboard"]);
  }
  if(data.FUNCTION_DESC == "Calendar"){
    this.router.navigate(["/calendar"]);
  }

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
  sessionStorage.setItem('route',this.sharedService.form_rights.URL)   
  this.FUNCTIONCODE = data.FUNCTION_CODE;
  localStorage.setItem('FUNCTION_CODE',this.FUNCTIONCODE)
  localStorage.removeItem('PROJ_CODE')
  this.router.navigate([data.URL]);
  this.Url = data.URL
}

onActivate(event:any) {
    window.scrollTo(0, 0);
}

onLoadCheckAttendance() {
    this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
    let data = {  }
    this.http.PostRequest(this.apiUrl.Check_Attendance, data).then(res => {
      if(this.role_id==10){
        this.isAttendance = false;        
      }
      if(this.role_name == "MANAGEMENT"){
        this.isAttendance = true; 
      }
      else if (res.flag  && res.today_flag != 1) {
        this.attendance_type = res.attendance_type
        this.ATT_DATE = res.Date;
        this.EMP_NAME = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
        console.log(' EMP_NAME -> ',this.EMP_NAME)
         if(this.EMP_NAME!='1234'){
          jQuery(this.attendance.nativeElement).modal('hide')
        }else{
          jQuery(this.attendance.nativeElement).modal('show')
        }
        this.isAttendance = false;
      } else {
        this.isAttendance = true; 
      }
    });
}

CheckAttendance(para:any) {
    this.f_clearPopup();
    this.SYS_DATE_TIME = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss')
    let data = {  }
    this.http.PostRequest(this.apiUrl.Check_Attendance, data).then(res => {
      if (res.flag) {
        this.attendance_type = res.attendance_type
        this.ATT_DATE = res.Date;
        this.EMP_NAME = this.sharedService.loginUser[0].EMP_CODE +" - "+this.sharedService.loginUser[0].USER_NAME
         if(this.EMP_NAME!='1234'){

          jQuery(this.attendance.nativeElement).modal('show')
        }
        this.isAttendance = false;
      } else {
        this.isAttendance = true;
        if(para == 0){
          this.toast.warning(res.msg)
        }
      }
    });
}
 
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
        if(this.ATT_DATE == this.datePipe.transform(new Date(), 'dd-MMM-yyyy')){
          jQuery(this.attendance.nativeElement).modal('hide')
        }
        this.toast.success(res.msg)        
        this.f_clearPopup();
        this.CheckAttendance(1);
      } else {
        this.toast.warning(res.msg)
      }
    });
}

f_clearPopup() {
    this.ATT_DATE = '';
    this._ATT_DATE = '';
    this.ATT_REMARK = '';
    this.TIME_IN = '';
    this.TIME_OUT = '';
    this.isAttendance = false;
    this.attendance_type = 'TIME_IN';
}

f_logout(){
  console.log('this.role_id',this.role_id);
  
  if(this.role_id==10){

    this.authService.clientLogout();
  }else{
this.authService.logout();
  }
    this.sharedService.loginUser =[{}]
}

menu_expand_collapse(list:any,index:any,flag:any){
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
}

 select_submain(list:any, pindex:any, cindex:any) {
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

menuClick(para: any, index:any){
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

getUserMenu(){
  console.log('INSIDE MENURIGHTD');
  
    this.http.PostRequest(this.apiUrl.GetMenuItems, {}).then(res => {
      if (res) {
        this.menu_list = res.menu_list;
        this.mergedData = this.menu_list.map((item:any) => {
          if (item.FUNCTION_CODE === "DH" || item.FUNCTION_CODE === "CL") {
            const mergedObject = { ...item };
          item.DETAIL.forEach((detail:any) => {
            Object.keys(detail).forEach(key => {
              mergedObject[`${key}`] = detail[key];
            });
          });
          delete mergedObject.DETAIL;
            return mergedObject;
          }
          return item;
        });
        this.menu_list = this.mergedData
        // console.log('mergedData -> ' , this.mergedData)
        // console.log('menu_list -> ' , this.menu_list)
        this.IsSelectedSubMenu();
      } 
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
  let data = {
    "IS_ALL": 0
  }
    this.http.PostRequest(this.apiUrl.GetFyearList, data).then(res => {
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
      setTimeout(() => {
        //$$('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      } 
    });
  
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

RedirectSelfAppraisal(){
  this.router.navigate(['/SelfAppraisal'])
}

GetAppriasalDetails(){
  let data = {
    "USERID":this.sharedService.loginUser[0].USERID
  };
  this.http.PostRequest(this.apiUrl.GetAppriasalDetails,data).then((res:any) =>{
   if(res.flag == 1){
    this.SUBMITION_LAST_DATE = res.Appriasal_detail[0].SUBMITION_LAST_DATE
   }
  })  
  }


}
