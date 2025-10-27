import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-pm-confirmation',
  templateUrl: './pm-confirmation.component.html',
  styleUrls: ['./pm-confirmation.component.css']
})
export class PmConfirmationComponent implements OnInit {

  form: FormGroup;
  DEVELOPER_STATUS_SELECTED: string = ''
  DOCUMENT_ATTECHED_LIST:any=[]
  DOCUMENT_ATTECHED_LIST1:any=[]
  statusflag:boolean=false;
  // Options for dropdowns
  // RESOLUTION_LIST: { RESOLUTION_CODE: string, RESOLUTION_NAME: string }[] = [];
    RESOLUTION_LIST = [
    { RESOLUTION_CODE: 'R001', RESOLUTION_NAME: 'Resolved' },
    { RESOLUTION_CODE: 'R002', RESOLUTION_NAME: 'Pending' },
    { RESOLUTION_CODE: 'R003', RESOLUTION_NAME: 'Rejected' },
    { RESOLUTION_CODE: 'R004', RESOLUTION_NAME: 'Reopened' }
  ];
  
  // Uploaded document list
  DEVELOPER_DOCUMENT_LIST: { FILE_NAME: string, FILE_EXTENSION: string, DOC_BASE64: string }[] = [];
  userData: any;
  MODE: any;
  PROJ_NAME:any;
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
  EST_HOURS:any;
  DEVELOPER_DOCUMENT_LIST1:any;
  RESOLUTION_CODE:any;
  DELIVERY_BY:any;
  DEVELOPER_STATUS:any;
  ISSUE_TYPE_CODE:any;
  PRIORITY_CODE:any;
  REASON_ISSUE:any;
  DESC_ISSUE:any;
  DEVELOPER_COMMENT:any;
  SaveConfirmationPopUp: boolean = false;
  CR_ISSUE_REASON:any;
  CUST_REF_NO:any;
  viewflag:boolean=false;
 constructor(
    private fb: FormBuilder,
    private route: RoutingService,
    private http: HttpRequestServiceService,
    private apiurl: ApiUrlService,
    private toast: ToastrService,
    private datepipe: DatePipe,
    private router: Router,
  


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

      CUST_REF_NO: [{ value: '', disabled: true }],
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
  this.USER_ID = localStorage.getItem('USERID');
  console.log(' this.ISSUE_NO', this.ISSUE_NO);


    if (this.ISSUE_NO !== null && this.MODE === 'E') {

      this.GETISSUERAISEDDETAILSBYISSUENO();
      // this.GETISSUERAISEDHISTORY(0);
    }

     this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
      console.log(value,"value")
    if(value===""){
      this.developerStatus="OK"
    }else if(value===undefined){
     this.developerStatus="OK"
    }else{
      this.developerStatus=value
    }

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
      this.PRIORITY_CODE = response.PRIORITY_CODE;
      this.ISSUE_TYPE_CODE = response.ISSUE_TYPE_CODE;
      this.DESC_ISSUE = response.DESC_OF_ISSUE_CR;
      this.REASON_ISSUE = response.ASREASON_OF_ISSUE_CR;
      this.PROJ_NAME = response.PROJ_NAME;
      this.CR_ISSUE_REASON = response.ASREASON_OF_ISSUE_CR;
      this.CUST_REF_NO = response.CUST_REF_NO;

      this.DEVELOPER_DOCUMENT_LIST1 = res.iteamlist || [];
      // this.GetRemoveBase64DocumnetExtension(this.DEVELOPER_DOCUMENT_LIST1);
      // console.log('GETISSUERAISEDDETAILSBYISSUENO response', response);


    const deliveryDate = response.DELIVERY_BY? new Date(response.DELIVERY_BY).toISOString().substring(0, 10) : '';
      this.form.patchValue({
      DELIVERY_BY: deliveryDate,
      EST_HOURS: response.EST_HOURS,
      RESOLUTION_CODE: response.RESOLUTION_CODE,
      DEVELOPER_COMMENT: response.DEVELOPER_COMMENT,
      DEVELOPER_STATUS: this.developerStatus
    });
  });
  }
     
    convertToDate(dateString: string): Date {
    const [datePart, timePart, period] = dateString.split(' '); // split date and time

    const [day, month, year] = datePart.split('-').map(Number); // split day, month, year
    let [hours, minutes, seconds] = timePart.split(':').map(Number); // split time into hours, minutes, seconds

    if (period === 'PM' && hours < 12) {
      hours += 12; // Convert PM hours to 24-hour format
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to 00:00
    }

    // Create a new Date object in 'yyyy-MM-ddTHH:mm:ss' format
    const formattedDate = new Date(year, month - 1, day, hours, minutes, seconds);

    return formattedDate;
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

  deleteFile(index: number) {
    this.DOCUMENT_ATTECHED_LIST.splice(index, 1);
  }
convertFilesToBase64(fileList: FileList) {
  const files = Array.from(fileList); // Convert FileList to actual array

  const fileReadPromises = files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64 = e.target.result;
        const fileData = {
          FILE_NAME: file.name,
          DOC_BASE64: base64,
          SR_NO: this.DOCUMENT_ATTECHED_LIST.length + 1,
          FILE_EXTENSION: fileExtension
        };

        resolve(fileData);
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', file.name, error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  });

  Promise.all(fileReadPromises)
    .then((results: any[]) => {
      this.DOCUMENT_ATTECHED_LIST.push(...results);
      console.log('All files processed:', this.DOCUMENT_ATTECHED_LIST);
    })
    .catch((error) => {
      console.error('Error processing some files:', error);
    });
}
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input,"input")
    if (input.files) {
      const filesArray = input.files;
      console.log(filesArray,"filesArray")
      this.convertFilesToBase64(filesArray);
    }
  }

    GetRemoveBase64DocumnetExtension(data: any) {
    data.forEach((file: any) => {
      if (file.FILE_EXTENSION == "pdf") {
        file.DOC_BASE64 = file.DOC_BASE64.split('data:application/pdf;base64,').join('')
      } else if (file.FILE_EXTENSION == "jpg") {
        file.DOC_BASE64 = file.DOC_BASE64.split('data:image/jpg;base64,').join('')
      } else if (file.FILE_EXTENSION == "xlsx") {
        file.DOC_BASE64 = file.DOC_BASE64.replace(/^\s*[^,]+,\s*/, '').trim()
      } else if (file.FILE_EXTENSION == "png") {
        file.DOC_BASE64 = file.DOC_BASE64.split('data:image/png;base64,').join('')
      } else if (file.FILE_EXTENSION == "jpeg") {
        file.DOC_BASE64 = file.DOC_BASE64.split('data:image/jpeg;base64,').join('')
      } else if (file.FILE_EXTENSION == "docx") {
        file.DOC_BASE64 = file.DOC_BASE64.replace(/^\s*[^,]+,\s*/, '').trim()
      }
    });
    this.DOCUMENT_ATTECHED_LIST = data;
  }
 SaveConfirmationPopUpOpen() {

      //  this.SaveConfirmationPopUp = true;
    // Trigger form validation
    this.form.markAllAsTouched();

    // Stop if form is invalid
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }
    
  if (!this.form.get('DELIVERY_BY').value) {
      this.toast.error('Enter delivery by date');
      return;
    }
        if (!this.form.get('EST_HOURS').value) {
      this.toast.error('Please select estimated hours');
      return;
    }
       if (!this.form.get('RESOLUTION_CODE').value) {
      this.toast.error('Please select resolution');
      return;
    }
    // Conditional validations for CR type
    if (!this.form.get('DEVELOPER_COMMENT').value) {
      this.toast.error('Enter a developer comment');
      return;
    }

    // if (this.isDescofErrorCR && !this.form.get('DESC_ISSUE').value) {
    //   this.toast.error('Enter a Desc Issue');
    //   return;
    // }

    // Conditional validation for revert comment
  

  

    // ✅ All good — proceed
    this.SaveConfirmationPopUp = true;
  }
closeModel() {
    this.SaveConfirmationPopUp = false;
  }
  
 SAVE_PM_CONFIRMATION_MASTER() {

 

  console.log('SAVE_PM_CONFIRMATION_MASTER called');
  // return
    // 🚨 Validate form
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }

    // 🎯 Remove base64 extensions from documents
    this.GetRemoveBase64DocumnetExtension(this.DOCUMENT_ATTECHED_LIST);

    // 📅 Format DATE fields inside DOCUMENT_ATTECHED_LIST
    this.DOCUMENT_ATTECHED_LIST.forEach((element) => {
      if ('DATE' in element) {
        const dateObj = this.convertToDate(element.DATE as string);
        element.DATE = this.datepipe.transform(dateObj, 'yyyy-MM-dd');
      }
    });

  
// 🧾 Extract values from form


const formValues = this.form.value;
  let data = {
  "USER_ID": this.USER_ID,
  "ISSUE_NO": this.ISSUE_NO,
  "ISSUE_TYPE_CODE": this.ISSUE_TYPE_CODE,
  "PRIORITY_CODE": this.PRIORITY_CODE,
  "REASON_ISSUE_CR": this.REASON_ISSUE,
  "DESC_ISSUE_CR": this.DESC_ISSUE,
  "EST_HOURS": formValues.EST_HOURS,
  "CUST_REF_NO": this.CUST_REF_NO, 
  "RESOLUTION_CODE": formValues.RESOLUTION_CODE,
  "DEVELOPER_STATUS": formValues.DEVELOPER_STATUS,
  "DEVELOPER_COMMENT": formValues.DEVELOPER_COMMENT,
  "DOCUMENT_ATTECHED_LIST": this.DOCUMENT_ATTECHED_LIST,
  "DELIVERY_BY": this.datepipe.transform(formValues.DELIVERY_BY, 'yyyy-MM-dd')
}


    console.log('data', data);

    // 📤 API call
    this.http.PostRequest(this.apiurl.SaveIssueDeveloperConfirmation, data).then((res: any) => {
      if (res.Resultlist[0].FLAG === 1) {
        this.toast.success(res.Resultlist[0].MSG);
        this.router.navigate([`/pmconfirmation`]);
      } else {
        this.toast.error(res.Resultlist[0].MSG || 'Failed to save');
      }
    });
  }

  viewDocument(file: any) {
    console.log('View document', file);
  }

  goToList() {
    this.route.changeRoute('/pmconfirmation');
  }

  

}