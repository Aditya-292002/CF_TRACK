import { Component, OnInit } from '@angular/core';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-pm-confirmation-list',
  templateUrl: './pm-confirmation-list.component.html',
  styleUrls: ['./pm-confirmation-list.component.css']
})

export class PmConfirmationListComponent implements OnInit {

 USER_ID:any;
  USER_NAME:any;
  FUNCTION_CODE:any;
  LISTSTATUS:any;
  ISSUE_REQUEST_COLUMN_LIST:any = [];
  ISSUE_REQUEST_LIST_DATA:any = [];
  SAMPEL_ISSUE_REQUEST_LIST_DATA:any = [];
  ISSUE_NO:any;
  IS_CANCEL:any = 0;
  CANCEL_IND:any;
  FILTER_ISSUE_REQUEST_LIST_DATA:any = [];
  FILTER:any;
  SearchValue:any;
  ISSUE_ID:any;
  userData: any;
  liststatus:any="Pending"; // Default status
  Is_Edit_Visible_status :any; 
  viewflag:boolean = true;
  projectList: any;
  statusList: any;
  form: FormGroup;
  minDate:any;
  selectedProjCode:any;
   selectedStatusCode:any;
  constructor(
    private apiurl: ApiUrlService,
    private http: HttpRequestServiceService,
    private route: RoutingService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 

  }

  ngOnInit() {
  this.form = this.formBuilder.group({
      PROJ_CODE: [],
      STATUS_CODE: []
    
    });
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    console.log(' this.userData', this.userData);
    this.USER_ID = this.userData[0].USERID;
    this.FUNCTION_CODE = localStorage.getItem('FUNCTION_CODE');
    this.LISTSTATUS = sessionStorage.getItem('LISTSTATUS'); 
    this.GET_PM_COMMON_LIST()
    this.GET_PM_CONFIRMATION_LIST();

    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

    
  }

onStatusChange(value: any) {
this.selectedStatusCode=value
  this.GET_PM_CONFIRMATION_LIST(); // or filter data etc.
}
onProjectChange(value: any) {
  this.selectedProjCode=value;
  this.GET_PM_CONFIRMATION_LIST(); // or filter data etc.
}

 resetProjectDropdown(): void {
    // Clear the form control value
    this.form.controls['PROJ_CODE'].setValue("");
   

    // Force Bootstrap selectpicker to visually reset
    $('#projectType').val('').selectpicker('refresh');
 this.selectedProjCode=""
 console.log(this.selectedProjCode,"this.selectedProjCode")
    console.log('Dropdown reset done.');

    // 🔥 Call your API here
    this.GET_PM_CONFIRMATION_LIST();
  }
   resetStatusDropdown(): void {
    // Clear the form control value
    this.form.controls['STATUS_CODE'].setValue("");
   

    // Force Bootstrap selectpicker to visually reset
    $('#statusType').val('').selectpicker('refresh');
 this.selectedStatusCode=""
 console.log(this.selectedProjCode,"this.selectedProjCode")
    console.log('Dropdown reset done.');

    // 🔥 Call your API here
    this.GET_PM_CONFIRMATION_LIST();
  }
  GET_PM_CONFIRMATION_LIST(){
      let data = {
        "USER_ID": (+this.USER_ID),
        "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
         "LISTSTATUS": ( this.liststatus == "Pending") ? "P" : "C",
         "EMP_CODE": (+this.userData[0].EMP_CODE),
         "STATUS_CODE":(this.selectedStatusCode==null?"":this.selectedStatusCode),
         "PROJ_CODE":(this.selectedProjCode==null?"":this.selectedProjCode)
      }
       this.http.PostRequest(this.apiurl.GetIssuePmApprovalList, data).then((res: any) => {
       this.ISSUE_REQUEST_COLUMN_LIST = res.Columnlist;
       this.ISSUE_REQUEST_LIST_DATA = res.Datalist;
       this.FILTER_ISSUE_REQUEST_LIST_DATA = res.Datalist;
       this.SAMPEL_ISSUE_REQUEST_LIST_DATA = this.ISSUE_REQUEST_LIST_DATA;
      //  this.LISTSTATUS = res.LISTSTATUS;
       console.log('LISTSTATUS set to:', this.liststatus);
     
    });
     }
    GET_PM_COMMON_LIST() {
  let data = {
    "USER_ID": (+this.userData[0].USERID),
    "EMP_CODE": (+this.userData[0].EMP_CODE),
  }

  this.http.PostRequest(this.apiurl.GetPMCommonList, data).then((res: any) => {
    this.projectList = res.ProjectList;
    this.statusList = res.StatusList;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 100);
  });
}



  GetDeveloperRequestRaised(col:any,rowData:any){
    if(col.Col_Filed == "ISSSUE_NO"){
        localStorage.setItem('MODE', 'E');
      this.ISSUE_NO = rowData.ISSSUE_NO;
      this.ISSUE_ID = rowData.ISSUE_ID;
      localStorage.setItem('ISSUE_NO' , this.ISSUE_NO)
      localStorage.setItem('ISSUE_ID' , this.ISSUE_ID)
      this.router.navigate([`/pmconfirmationmaster`]);
    }else{
      return
    }
  }
 

  //  GetInputFilter(val:any){
  //   const lowerSearchText = val.toLowerCase();
  //   let result: any[] = [];
  //   this.FILTER_ISSUE_REQUEST_LIST_DATA.forEach((element:any) => {
  //     if(lowerSearchText.length == 0 || lowerSearchText == '' || lowerSearchText == null || lowerSearchText == undefined || lowerSearchText == 'undefined'){
  //       this.ISSUE_REQUEST_LIST_DATA = [];
  //       this.ISSUE_REQUEST_LIST_DATA  = this.FILTER_ISSUE_REQUEST_LIST_DATA;
  //       return
  //     }else if (element.ISSUE_TYPE_DESC.toLowerCase() == lowerSearchText) {
  //       result.push(element); 
  //   this.ISSUE_REQUEST_LIST_DATA = [];
  //   this.ISSUE_REQUEST_LIST_DATA = result; 
  //     }else if(element.MODULE_DESC.toLowerCase() == lowerSearchText){
  //       result.push(element); 
  //   this.ISSUE_REQUEST_LIST_DATA = [];
  //   this.ISSUE_REQUEST_LIST_DATA = result; 
  //     }else if(element.FUNCTION_CODE.toLowerCase() == lowerSearchText){
  //       result.push(element); 
  //   this.ISSUE_REQUEST_LIST_DATA = [];
  //   this.ISSUE_REQUEST_LIST_DATA = result; 
  //     }
  //   });
  // } 

   GetInputFilter(val:any){
    console.log('INSIDE SEARH',val);
    
    const lowerSearchText = val.toLowerCase();
    let result: any[] = [];
    this.FILTER_ISSUE_REQUEST_LIST_DATA.forEach((element:any) => {
      if(lowerSearchText.length == 0 || lowerSearchText == '' || lowerSearchText == null || lowerSearchText == undefined || lowerSearchText == 'undefined'){
        this.ISSUE_REQUEST_LIST_DATA = [];
        this.ISSUE_REQUEST_LIST_DATA  = this.FILTER_ISSUE_REQUEST_LIST_DATA;
        return
      }else if (element.ISSUE_SUBJECT.toLowerCase() == lowerSearchText) {
        result.push(element); 
    this.ISSUE_REQUEST_LIST_DATA = []; 
    this.ISSUE_REQUEST_LIST_DATA = result; 
      }else if(element.MODULE_CODE.toLowerCase() == lowerSearchText){
        result.push(element); 
    this.ISSUE_REQUEST_LIST_DATA = [];
    this.ISSUE_REQUEST_LIST_DATA = result;
      }else if(element.FUNCTION_CODE.toLowerCase() == lowerSearchText){
        result.push(element);
    this.ISSUE_REQUEST_LIST_DATA = [];
    this.ISSUE_REQUEST_LIST_DATA = result; 
      }else if(element.PROJ_NAME.toLowerCase() == lowerSearchText){
        result.push(element); 
    this.ISSUE_REQUEST_LIST_DATA = [];
    this.ISSUE_REQUEST_LIST_DATA = result; 
      }
      else if(element.ISSUE_TYPE_DESC.toLowerCase() == lowerSearchText){
        result.push(element); 
    this.ISSUE_REQUEST_LIST_DATA = [];
    this.ISSUE_REQUEST_LIST_DATA = result; 
      }
    });
  }

 setStatus(value: string) {
  this.liststatus = value;
  // you can also filter your data or call API here
  console.log('Selected Status:', this.liststatus);

  this.GET_PM_CONFIRMATION_LIST();
}

}
