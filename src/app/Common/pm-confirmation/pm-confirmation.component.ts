import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';


@Component({
  selector: 'app-pm-confirmation',
  templateUrl: './pm-confirmation.component.html',
  styleUrls: ['./pm-confirmation.component.css']
})
export class PmConfirmationComponent implements OnInit {

  form: FormGroup;
  DEVELOPER_STATUS_SELECTED: string = ''
  statusflag:boolean=false;
  // Options for dropdowns
  RESOLUTION_LIST: { RESOLUTION_CODE: string, RESOLUTION_NAME: string }[] = [];
  
  // Uploaded document list
  DEVELOPER_DOCUMENT_LIST: { FILE_NAME: string, FILE_EXTENSION: string, DOC_BASE64: string }[] = [];
  userData: any;
  MODE: any;
  ISSUE_NO: any;
  ISSUE_ID: any;
  FUNCTION_CODE: any;
  USER_ID: any;
  USER_NAME: any;
  IS_HISTORY: any;
  IS_UPDATE: any;
  STATUS_CODE: any;
  STATUS_NAME: any;
  MODULE_DESC: any;
  FUNCTION_DESC: any;
  product_code: any; 
  REQUEST_DATE: any;
  REQUESTER_NAME: any;
  RAISED_BY_NAME: any;
  ISSUE_TYPE_DESC: any;
  PRIORITY_DESC: any;
  MODULE_CODE: any;
  ISSUE_SUBJECT: any;
  ISSSUE_NO: any;
    DatePipe: any;
    developerStatus: any="OK";

 constructor(
    private fb: FormBuilder,
    private route: RoutingService,
    private http: HttpRequestServiceService,
    private apiurl: ApiUrlService,
  


  ) { }
  formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
  ngOnInit(): void {
    this.form = this.fb.group({
    
          DEVELOPER_STATUS: ["OK"],
      DEVELOPER_COMMENT: [''],
      DELIVERY_BY: [null],
      EST_HOURS: [null, [Validators.min(0), Validators.max(999)]],
      RESOLUTION_CODE: ['']
    });
console.log(this.form.get('DEVELOPER_STATUS').value,"value");
this.DEVELOPER_STATUS_SELECTED =this.form.get('DEVELOPER_STATUS').value
if(this.DEVELOPER_STATUS_SELECTED=='OK'){

  this.statusflag=true;
  }else{
    this.statusflag=false;
  }
    // Subscribe to changes and update our variable
    // this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
    //   this.DEVELOPER_STATUS_SELECTED =this.form.get('DEVELOPER_STATUS').value;
    //   console.log('Status', value);

    //   // Reset fields based on status
      
    // });

    
 this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.MODE = localStorage.getItem('MODE');
    console.log(' this.MODE', this.MODE);
    this.ISSUE_NO = localStorage.getItem('ISSUE_NO');
    console.log(' this.ISSUE_NO', this.ISSUE_NO);


    if (this.ISSUE_NO !== null && this.MODE === 'E') {

      this.GETISSUERAISEDDETAILSBYISSUENO();
      // this.GETISSUERAISEDHISTORY(0);
    }

     this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
    this.developerStatus = value;

  });
  }

  
 GETISSUERAISEDDETAILSBYISSUENO() {
    console.log('GETISSUERAISEDDETAILSBYISSUENO inside');

    const data = {
      USER_ID: +this.USER_ID ,
      FUNCTION_CODE: (this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE,
      ISSUE_NO: this.ISSUE_NO,
      MODE: this.MODE
    };

    this.http.PostRequest(this.apiurl.GETISSUERAISEDDETAILSBYISSUENO, data).then((res: any) => {
      const response = res.datalist[0];
      console.log(response,"response")
      if (!response) return;
      this.IS_HISTORY = response.IS_HISTORY;
      this.ISSSUE_NO = response.ISSSUE_NO;
      const REQUEST_DATE = this.formatDate(response.REQUEST_DATE as string);
      this.REQUEST_DATE = REQUEST_DATE;
      this.REQUESTER_NAME = response.REQUESTER_NAME;
      this.RAISED_BY_NAME = response.RAISED_BY_NAME;
      this.ISSUE_TYPE_DESC = response.ISSUE_TYPE_DESC;
      this.PRIORITY_DESC = response.PRIORITY_DESC;
      this.MODULE_CODE = response.MODULE_CODE;
      this.MODULE_DESC = response.MODULE_DESC;
      this.FUNCTION_CODE = response.FUNCTION_CODE;
      this.FUNCTION_DESC = response.FUNCTION_DESC;
      this.ISSUE_SUBJECT = response.ISSUE_SUBJECT;
      this.IS_UPDATE = response.IS_UPDATE;
      this.STATUS_CODE = response.STATUS_CODE;
      this.STATUS_NAME = response.STATUS_NAME;
      this.product_code = response.PRODUCT_CODE;

    });  
  }
     
  // File upload
  onFileSelectedUploadDocument(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.DEVELOPER_DOCUMENT_LIST.push({
          FILE_NAME: file.name,
          FILE_EXTENSION: file.name.split('.').pop()!.toLowerCase(),
          DOC_BASE64: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadDoc(file: any) {
    this.DEVELOPER_DOCUMENT_LIST = this.DEVELOPER_DOCUMENT_LIST.filter(f => f !== file);
  }

  viewDocument(file: any) {
    console.log('View document', file);
  }

  goToList() {
    this.route.changeRoute('/pmconfirmation');
  }

  

}