
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-issue-request-list',
  templateUrl: './issue-request-list.component.html',
  styleUrls: ['./issue-request-list.component.css']
})
export class IssueRequestListComponent implements OnInit {

 USER_ID:any;
  USER_NAME:any;
  FUNCTION_CODE:any;
  ISSUE_REQUEST_COLUMN_LIST:any = [];
  ISSUE_REQUEST_LIST_DATA:any = [];
  ISSUE_NO:any;
  CUST_CODE:any;
  IS_CANCEL:any = 0;
  CANCEL_IND:any;
  SearchValue:any;
  STATUS_CODE:any = "";
  STATUS_LIST:any = [];
  SAMPEL_ISSUE_REQUEST_LIST_DATA:any = [];
  FILTER_ISSUE_REQUEST_LIST_DATA:any = [];
  IS_REVERT:any = 0;
  ISSUE_ID:any;
  apiService: any;
 all_leave_list:any=[];
  userData: any;
  liststatus: string = 'Pending'; // default view
 constructor(
        private authService: AuthServiceService,
        private route: RoutingService,
        private formBuilder: FormBuilder,
        private http: HttpRequestServiceService,
        private sharedService: SharedServiceService,
        private toast: ToastrService,
        private apiurl: ApiUrlService,
        private validationService: ValidationService,
        private encr: EncryptionService,
        private router: Router,
        private datepipe:DatePipe
      ) { }
   ngOnInit(): void {
     console.log('ngAfterViewInit called');
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.USER_ID = this.userData[0].LOGIN_ID;
    this.CUST_CODE = this.userData[0].CUST_CODE;
    console.log(' this.USER_ID', this.USER_ID);
    localStorage.removeItem('ISSUE_NO')
    localStorage.removeItem('IS_CANCEL')
    localStorage.removeItem('CANCEL_IND')
    localStorage.removeItem('STATUS_CODE')
    localStorage.removeItem('IS_REVERT')
    localStorage.removeItem('ISSUE_ID')
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.USER_ID = this.userData[0].LOGIN_ID;
    this.FUNCTION_CODE = localStorage.getItem('FUNCTION_CODE');
   // this.GETISSUEREQUESTMASTER();
    this.GETISSUEREQUESTLIST();
   }
    ngAfterViewInit(): void {
      console.log('ngAfterViewInit called');
      this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
      this.USER_ID = this.userData[0].LOGIN_ID;
      console.log(' this.USERID', this.USER_ID);
    
    // You can now safely access the DOM element

  }
   
   GETISSUEREQUESTMASTER() {
    let data = {
      "USER_ID": (+this.USER_ID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
     "COMPANY_CODE": this.userData[0].CUST_CODE
    }
    // this.apiService.post(this.apiurl.GETISSUEREQUESTMASTER, data).then((res: any) => {
    //   this.STATUS_LIST = res.Statuscodelist;
    //   this.GETISSUEREQUESTLIST();
    // });
  }

   GETISSUEREQUESTLIST(){
    let data = {
      "USER_ID": (+this.USER_ID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
      "LISTSTATUS": ( this.liststatus == "Pending") ? "P" : "C",
     "CUST_CODE": this.userData[0].CUST_CODE
    }
   
    this.http.PostRequest(this.apiurl.GetIssueRequestList, data).then((res: any) => {
       this.ISSUE_REQUEST_COLUMN_LIST = res.Columnlist;
       this.ISSUE_REQUEST_LIST_DATA = res.Datalist;
       this.SAMPEL_ISSUE_REQUEST_LIST_DATA = this.ISSUE_REQUEST_LIST_DATA;
      //  this.GetFilteSelectStatusType('00')
      // console.log('ISSUE_REQUEST_LIST_DATA ->' , this.ISSUE_REQUEST_LIST_DATA)
    });
   }

   AddIssueRequest(){
    this.router.navigate([`/issuerequestmaster`]);
    localStorage.setItem('MODE' , 'A')
   }

   GetEditRequestRaised(col:any,rowData:any){
    if(col.Col_Filed == "ISSSUE_NO"){
      this.ISSUE_NO = rowData.ISSSUE_NO;
      this.CANCEL_IND = rowData.CANCEL_IND;
      this.ISSUE_ID = rowData.ISSUE_ID;
      if(rowData.STATUS_CODE_COLOR == "bg-cyan-100"){
        this.IS_REVERT = 1; 
      }
      localStorage.setItem('CANCEL_IND' , this.CANCEL_IND)
      localStorage.setItem('ISSUE_ID' , this.ISSUE_ID)
      localStorage.setItem('ISSUE_NO' , this.ISSUE_NO)
      localStorage.setItem('STATUS_CODE' , this.STATUS_CODE)
      localStorage.setItem('IS_REVERT' , this.IS_REVERT)
      this.router.navigate(['issuerequestmaster'])
    }else{
      return
    }
   }

   CancleRequestRaised(rowData:any){
      this.ISSUE_NO = rowData.ISSSUE_NO;
      this.CANCEL_IND = rowData.CANCEL_IND;
      this.IS_CANCEL = 1;
      localStorage.setItem('ISSUE_NO' , this.ISSUE_NO)
      localStorage.setItem('IS_CANCEL' , this.IS_CANCEL)
      localStorage.setItem('CANCEL_IND' , this.CANCEL_IND)
      this.router.navigate(['issuerequestmaster'])
   }
  
   GetFilteSelectStatusType(code:any){
    // console.log('code ->' , code)
    this.ISSUE_REQUEST_LIST_DATA = [];
    this.FILTER_ISSUE_REQUEST_LIST_DATA = [];
    this.SAMPEL_ISSUE_REQUEST_LIST_DATA.forEach((element:any)=>{
      if(code == ""){
        this.ISSUE_REQUEST_LIST_DATA = this.SAMPEL_ISSUE_REQUEST_LIST_DATA;
      }else if(element.STATUS_CODE === code){
         this.ISSUE_REQUEST_LIST_DATA.push(element);
         this.FILTER_ISSUE_REQUEST_LIST_DATA = this.ISSUE_REQUEST_LIST_DATA;
      }
    });
   }

  //  GetInputFilter(val:any){
  //   const lowerSearchText = val.
  //   console.log('test',val);
    
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

   viewIssue(data:any){
    console.log('viewIssue');
  localStorage.setItem('MODE', 'E');
    localStorage.setItem('ISSUE_NO', data.ISSSUE_NO);
   // this.router.navigate([`/issuerequestmaster`]);
    this.route.changeRoute('/issuerequestmaster');
    // this.toast.info('This feature is coming soon','Info')
   }

 changeViewList(){

//  this.GetLeaveCommonList();
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 
  100);
 }

exportToExcel(): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ISSUE_REQUEST_LIST_DATA);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Data': worksheet },
    SheetNames: ['Data']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'exported-data');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(data, `${fileName}_export.xlsx`);
}




setStatus(value: string) {
  this.liststatus = value;
  // you can also filter your data or call API here
  console.log('Selected Status:', this.liststatus);

  this.GETISSUEREQUESTLIST();
}

GetInputFilter(val: any) {

    console.log('val', val);

  const searchText = (val || '').trim().toLowerCase();

console.log('searchText', searchText);

  // If no search text, show full list

  if (!searchText) {

    this.ISSUE_REQUEST_LIST_DATA = [...this.SAMPEL_ISSUE_REQUEST_LIST_DATA];

    return;

  }
 
  // Filter logic

  this.ISSUE_REQUEST_LIST_DATA = this.SAMPEL_ISSUE_REQUEST_LIST_DATA.filter((element: any) => {

    return (

      (element.ISSSUE_NO && element.ISSSUE_NO.toLowerCase().includes(searchText)) ||

      (element.PROJ_NAME && element.PROJ_NAME.toLowerCase().includes(searchText)) ||

      (element.ISSUE_TYPE_DESC && element.ISSUE_TYPE_DESC.toLowerCase().includes(searchText)) ||

      (element.PRIORITY_CODE && element.PRIORITY_CODE.toLowerCase().includes(searchText)) ||

      (element.STATUS_CODE && element.STATUS_CODE.toLowerCase().includes(searchText))
 
    );

  });

}

 
}


