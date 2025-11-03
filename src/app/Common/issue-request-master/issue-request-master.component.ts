
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
declare var $: any;
declare var jQuery: any;
interface Document {
  FILE_NAME: string;
  DOC_BASE64: string;
  SR_NO: number;
  FILE_EXTENSION: string;
  DATE?: string;
}
@Component({
  selector: 'app-issue-request-master',
  templateUrl: './issue-request-master.component.html',
  styleUrls: ['./issue-request-master.component.css']
})


export class IssueRequestMasterComponent implements OnInit {
  ISSUE_NO: any;
  REQUEST_DATE: any = '';
  REQUESTER: any;
  ISSUE_TYPE_CODE: any = '02';
  PRIORITY_CODE: any = "01";
  CODE: any;
  FUNCTION_DESC: any;
  ISSUE_SUBJECT: any;
  REASON_ISSUE: any = "";
  DESC_ISSUE: any = "";
  FILE_LIST: any = [];
  USER_ID: any;
  FUNCTION_CODE: any;
  USER_LIST: any = [];
  MODULE_LIST: any = [];
  PRIORITY_LIST: any = [];
  ISSUE_LIST: any = [];
  FUNCTION_LIST: any = [];
  USER_NAME: any;
  USERID: any ;
  Image: any;
  FILENAME: any;
  DOCUMENT_ATTECHED_LIST: Document[] = [];
  SRNO: any;
  Cust_REF_NO: any;

  ImageData: any;
  isReasonofErrorCR: boolean = true;
  isDescofErrorCR: boolean = true;
  isErrorLableChange: boolean = false;
  visibleFunction: boolean = false;
  visibleModule: boolean = false;
  MODULE_DESC: any;
  isUploadDocument: boolean = false;
  filename: boolean = false;
  fileextension: any;
  MODULE_CODE: any;
  ISSUE_FUNCTION_CODE: any;
  SearchVlaue: any;
  GET_DOCUMENT_LIST: any = [];
  MODE: any = 'A';
  IS_CANCEL: any;
  CANCEL_IND: any;
  STATUS_CODE: any;
  GET_STATUS_CODE: any;
  visibleHistoryFun: boolean = false;
  COMMENT_HISTORY: any = [{
    status: '',
    STATUS_COLOR_NAME: '',
    Status_Name: '',
    date: '',
    EST_HOURS: '',
    DELIVERY_BY: '',
    PROPOSE_HOURS: '',
    PROPOSE_DELIVERY_BY: '',
    comment: ''
  }];
  ISSUE_ID: any;
  SAMPEL_FUNCTION_LIST: any = [];
  IS_HISTORY: boolean = false;
  IS_UPDATE: boolean = false;
  STATUS_CODE_LIST: any = [];
  STATUS_NAME: any = "";
  IS_REVERT: any = 0;
  REVERT_COMMENT: any;
  messages: any = [];
  REQUESTER_NAME: any;
  SaveConfirmationPopUp: boolean = false;
  minDate: any = new Date()
  maxDate: any = new Date()
  DatePipe: any;
  selectedOption: string = '';
  PRIORITY: any
  SELF: boolean = true;
  OTHER: boolean = false;
  raisedBy: any;
  product_code: any;
  otherName: string = '';
  displayHistory: boolean = false;

  dropdownList: { PRIORITY_CODE: string; PRIORITY_DESC: string; }[];
  dropdownList1 = [
    { Value: 'A', Text: 'HOrizon ERP' },
    { Value: 'B', Text: 'Salary Processing Service' },
    // { Value: 'C', Text: 'Product C' },
    // { Value: 'D', Text: 'Product D' }
  ];
  // dropdownList1: { Value: string; Text: string; }[];

  uploadedFiles: any[] = [];
  userData: any;
  form: FormGroup;
  viewflag: boolean = false;
  historyData: { status: string; userName: string; time: string; comment: string; }[] = [];
  PROJECT_LIST: any;
RAISED_BY_NAME:any;

  deleteFile(index: number) {
    this.DOCUMENT_ATTECHED_LIST.splice(index, 1);
  }
  // constructor(private router: Router, private urlService: UrlService, private Cmmon: CommonService,
  //   private apiService: ApiService,private sharedservice: SharedService,private route:ActivatedRoute
  //   ,private Toastr:ToastrService,private MessageService:MessageService) { }

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
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
      const today1 = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.historyData = [
      { status: 'Open', userName: 'John Doe', time: '2025-10-09 10:00', comment: 'Initial issue raised' },
      { status: 'In Progress', userName: 'Jane Smith', time: '2025-10-09 12:30', comment: 'Working on the issue' },
      { status: 'Closed', userName: 'Admin', time: '2025-10-09 15:45', comment: 'Issue resolved' }
    ];

    this.form = this.formBuilder.group({
      ISSUE_NO: [{ value: '', disabled: true }],
      Cust_REF_NO: [{ value: '', disabled: this.viewflag }],
      REQUEST_DATE: [{ value: today1, disabled: this.viewflag }],
      PRODUCT_CODE: [{ value: '', disabled: this.viewflag }, Validators.required],
      RAISED_BY: ['SELF'],  // either SELF or OTHER
      SELF_NAME: [{ value: '', disabled: this.viewflag }],
      OTHER_NAME: [{ value: '', disabled: this.viewflag }],
      ISSUE_TYPE_CODE: [{ value: '02', disabled: this.viewflag }, Validators.required],
      ISSUE_SUBJECT: [{ value: '', disabled: this.viewflag }],
      MODULE_CODE: [{ value: '', disabled: this.viewflag }],
      ISSUE_FUNCTION_CODE: [{ value: '', disabled: this.viewflag }],
      PRIORITY_CODE: [{ value: '', disabled: this.viewflag }],
      REASON_ISSUE: [{ value: '', disabled: this.viewflag }],
      DESC_ISSUE: [{ value: '', disabled: this.viewflag }],
    });
    this.form.get('RAISED_BY').valueChanges.subscribe(value => {
      if (value === 'SELF') {

        this.form.get('OTHER_NAME').reset();  // Clear the name when "Self" is selected
      } 
      if (value === 'OTHER') {
        this.form.get('OTHER_NAME').setValue(this.RAISED_BY_NAME);
      }
    });
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.RAISED_BY_NAME = this.userData[0].USER_NAME;
    console.log('TEST', this.RAISED_BY_NAME);
    
    this.MODE = localStorage.getItem('MODE');
    console.log(' this.MODE', this.MODE);
    this.ISSUE_NO = sessionStorage.getItem('ISSUE_NO');
    console.log(' this.ISSUE_NO', this.ISSUE_NO);
    this.form.get('OTHER_NAME').setValue(this.RAISED_BY_NAME);
    // this.USER_ID = this.sharedservice.get_USER_ID();
    this.USER_ID = this.userData[0].LOGIN_ID;
    this.USERID = this.userData[0].LOGIN_ID;
    this.REQUESTER = this.userData[0].LOGIN_ID;
    this.USER_NAME = "" //this.sharedservice.get_USER_NAME();
    this.CANCEL_IND = localStorage.getItem('CANCEL_IND');
    this.ISSUE_NO = localStorage.getItem('ISSUE_NO');
    this.ISSUE_ID = localStorage.getItem('ISSUE_ID');
    this.IS_CANCEL = localStorage.getItem('IS_CANCEL');
    this.FUNCTION_CODE = localStorage.getItem('FUNCTION_CODE');
    this.GET_STATUS_CODE = localStorage.getItem('STATUS_CODE');
    this.IS_REVERT = localStorage.getItem('IS_REVERT');
    const today = new Date();
    // Format as yyyy-MM-dd because HTML date input requires this format
    this.REQUEST_DATE = new Date()
    this.GETISSUEREQUESTMASTER();

    this.dropdownList = [
      { PRIORITY_CODE: '01', PRIORITY_DESC: 'Low' },
      { PRIORITY_CODE: '02', PRIORITY_DESC: 'Medium' }
    ];


    if (this.MODE == 'A') {
      this.IS_UPDATE = true;
    }
    if (this.ISSUE_NO !== null && this.MODE === 'E') {
      this.viewflag = true;
      this.GETISSUERAISEDDETAILSBYISSUENO();
      // this.GETISSUERAISEDHISTORY(0);
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');

 this.USER_ID = this.userData[0].LOGIN_ID;
    this.USERID = this.userData[0].LOGIN_ID;
    console.log(' this.USER_ID', this.USER_ID);
    


    // this.GETISSUERAISEDHISTORY(0);

  }

  GETISSUEREQUESTMASTER() {
    let data = {
      "USER_ID": (+this.USERID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
      "COMPANY_CODE":this.userData[0].COMPANY_CODE
    }
    this.http.PostRequest(this.apiurl.GetIssueCommonList, data).then((res: any) => {
      this.FUNCTION_LIST = res.Functioncodelist;
      this.SAMPEL_FUNCTION_LIST = this.FUNCTION_LIST;
      this.MODULE_LIST = res.Moduleslist;
      this.ISSUE_LIST = res.issuelist;
      this.USER_LIST = res.Userlist;
      this.PROJECT_LIST = res.projectlist;
      this.STATUS_CODE_LIST = res.Statuscodelist;
      this.PRIORITY_LIST = res.prioritylist;
      this.REQUESTER = this.USER_NAME;
      console.log('THIS.PRIOTIY_LIST', this.PRIORITY_LIST, res.prioritylist);

      //  this.USER_LIST.forEach((user:any)=>{
      //   if(user.USERID == this.USER_ID){
      //   this.USERID = (+user.USERID);
      //   }
      //  });
    });
  }

  //  GETISSUERAISEDDETAILSBYISSUENO(){
  //   console.log('GETISSUERAISEDDETAILSBYISSUENO inside');

  //   let data = {
  //     "USER_ID": (+this.USERID),
  //     "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
  //     "ISSUE_NO":this.ISSUE_NO,
  //      "MODE":this.MODE,
  //   }
  //   // console.log('data ->' , JSON.stringify(data))
  //   this.http.PostRequest(this.apiurl.GETISSUERAISEDDETAILSBYISSUENO, data).then((res: any) => {
  //     // console.log('res ->' , res )
  //      this.IS_HISTORY = res.datalist[0].IS_HISTORY;
  //      this.ISSUE_NO = res.datalist[0].ISSSUE_NO;
  //      this.ISSUE_ID = res.datalist[0].ISSUE_ID;
  //      this.IS_UPDATE = res.datalist[0].IS_UPDATE;
  //      this.USERID = res.datalist[0].RAISED_BY;
  //      this.PRIORITY_CODE = res.datalist[0].PRIORITY_CODE;
  //      this.REQUESTER_NAME = res.datalist[0].REQUESTER_NAME;
  //      this.REQUESTER = res.datalist[0].REQUESTER_NAME;
  //      this.ISSUE_TYPE_CODE = res.datalist[0].ISSUE_TYPE_CODE;
  //      let request_date = res.datalist[0].REQUEST_DATE;
  //      this.REQUEST_DATE = new Date(request_date);
  //      this.MODULE_CODE = res.datalist[0].MODULE_CODE;
  //      this.MODULE_DESC = res.datalist[0].MODULE_DESC;
  //      this.ISSUE_FUNCTION_CODE = res.datalist[0].FUNCTION_CODE;
  //      this.FUNCTION_DESC = res.datalist[0].FUNCTION_DESC;
  //      this.ISSUE_SUBJECT = res.datalist[0].ISSUE_SUBJECT;
  //      this.REASON_ISSUE = res.datalist[0].ASREASON_OF_ISSUE_CR;
  //      this.DESC_ISSUE = res.datalist[0].DESC_OF_ISSUE_CR;
  //      this.ISSUE_ID = res.datalist[0].ISSUE_ID;
  //      this.STATUS_CODE = res.datalist[0].STATUS_CODE;
  //      this.STATUS_NAME = res.datalist[0].STATUS_NAME;
  //      this.product_code = res.datalist[0].PRODUCT_CODE;

  //     this.form.get("PRODUCT_CODE").setValue(this.product_code)
  //      setTimeout(() => {
  //       $('.selectpicker').selectpicker('refresh').trigger('change');
  //     }, 100);
  //     // this.form.get("USER_NAME").setValue(this.sharedService.loginUser[0].USER_NAME)

  //     //  this.dropdownList1.forEach((element:any) => {  
  //     //    if(element.Value == this.product_code){   
  //     //      this.product_code = element;
  //     //     } 
  //     //   });
  //       console.log('this.product_code',this.product_code);

  //      if(this.ISSUE_TYPE_CODE == '02'){
  //        this.isReasonofErrorCR = true;
  //        this.isErrorLableChange = true;
  //      }else if(this.ISSUE_TYPE_CODE == '01'){
  //        this.isErrorLableChange = false;
  //        this.isReasonofErrorCR = false;
  //      }
  //        this.GET_DOCUMENT_LIST = res.iteamlist;
  //      if(this.GET_DOCUMENT_LIST.length > 0){
  //        this.isUploadDocument = true;
  //        this.DOCUMENT_ATTECHED_LIST = this.GET_DOCUMENT_LIST;
  //      }
  //   //this.MessageService.add({severity:'warn', summary:'If you want to see current Status ',detail:"Please Check a History"});

  //   });

  //  }
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
      if (!response) return;

      // Save response values for non-form-related properties
      this.IS_HISTORY = response.IS_HISTORY;
      this.ISSUE_ID = response.ISSUE_ID;
      this.IS_UPDATE = response.IS_UPDATE;
      this.STATUS_CODE = response.STATUS_CODE;
      this.STATUS_NAME = response.STATUS_NAME;
      this.MODULE_DESC = response.MODULE_DESC;
      this.FUNCTION_DESC = response.FUNCTION_DESC;
      this.product_code = response.PRODUCT_CODE;

      // Fill the form using patchVa
      // //
      //  PRODUCT_CODE: response.PRODUCT_CODE,lue
      this.form.patchValue({
        ISSUE_NO: response.ISSSUE_NO,
        REQUEST_DATE: new Date(response.REQUEST_DATE),
        PRIORITY_CODE: response.PRIORITY_CODE,
        RAISED_BY: response.RAISED_BY === this.userData[0].LOGIN_ID || response.REQUESTER === this.userData[0].LOGIN_ID ? 'SELF' : 'OTHER',
        OTHER_NAME: response.REQUESTER !== this.userData[0].LOGIN_ID ? response.REQUESTER : '',
        ISSUE_TYPE_CODE: response.ISSUE_TYPE_CODE,
        ISSUE_SUBJECT: response.ISSUE_SUBJECT,
        MODULE_CODE: response.MODULE_CODE,
        ISSUE_FUNCTION_CODE: response.FUNCTION_CODE,
        REASON_ISSUE: response.ASREASON_OF_ISSUE_CR,
        DESC_ISSUE: response.DESC_OF_ISSUE_CR,
        Cust_REF_NO: response.CUST_REF_NO
      });

      this.form.get('PRODUCT_CODE').setValue(response.PRODUCT_CODE);


      // Handle dynamic fields (like ReasonOfErrorCR toggle)
      if (response.ISSUE_TYPE_CODE === '02') {
        this.isReasonofErrorCR = true;
        this.isErrorLableChange = true;
      } else if (response.ISSUE_TYPE_CODE === '01') {
        this.isReasonofErrorCR = false;
        this.isErrorLableChange = false;
      }

      // Handle attached documents
      this.GET_DOCUMENT_LIST = res.iteamlist || [];
      if (res.iteamlist.length > 0) {
        this.isUploadDocument = true;
        this.DOCUMENT_ATTECHED_LIST = res.iteamlist;
      }

          // Refresh selectpicker (if still using Bootstrap selectpicker)
      setTimeout(() => {
        this.form.get('PRODUCT_CODE').setValue(response.PRODUCT_CODE);
        this.form.get('PRIORITY_CODE').setValue(response.PRIORITY_CODE);
            this.form.get('ISSUE_TYPE_CODE').setValue(response.ISSUE_TYPE_CODE);
                // this.form.get('OTHER_NAME').setValue(this.RAISED_BY_NAME);
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
    });
  }

  GetissueSelect(code: any) {
    if (code == '01') {
      this.isReasonofErrorCR = false;
      this.isErrorLableChange = false;
      this.isDescofErrorCR = true;
      this.REASON_ISSUE = '';
      this.DESC_ISSUE = '';
    } else if (code == '02') {
      this.isReasonofErrorCR = true;
      this.isDescofErrorCR = true;
      this.isErrorLableChange = true;
      this.REASON_ISSUE = '';
      this.DESC_ISSUE = '';
    }
  }

  removeImage(data: any) {
    this.DOCUMENT_ATTECHED_LIST = this.DOCUMENT_ATTECHED_LIST.filter((item) => item !== data);;
    this.toast.success('Remove Document sucessfully');
  }

  // SaveConfirmationPopUpOpen(){

  //   console.log('SaveConfirmationPopUp',this.SaveConfirmationPopUp);

  //   if(!this.sharedService.isValid(this.REQUEST_DATE)){
  //     this.toast.error('Select a Request Date');
  //     return
  //   }
  //   if(!this.sharedService.isValid(this.USERID)){
  //     this.toast.error('Select a Raised By');
  //     return
  //   }
  //   if(!this.sharedService.isValid(this.ISSUE_TYPE_CODE)){
  //     this.toast.error('Select a Issue Type');
  //     return
  //   }
  //   if(!this.sharedService.isValid(this.PRIORITY_CODE)){
  //     this.toast.error('Select a Priority');
  //     return
  //   }
  //   if(!this.sharedService.isValid(this.ISSUE_SUBJECT)){
  //     this.toast.error('Enter a Issue Subject');
  //     return
  //   }

  // if(this.isReasonofErrorCR == true){
  //   if(!this.sharedService.isValid(this.REASON_ISSUE)){
  //     this.toast.error('Enter a Reason Issue');
  //     return
  //   }
  // }
  // if(this.isDescofErrorCR == true){
  //   if(!this.sharedService.isValid(this.DESC_ISSUE)){
  //     this.toast.error('Enter a Desc Issue');
  //     return
  //   }
  // }
  // if(this.IS_REVERT == 1){
  //   if(!this.sharedService.isValid(this.REVERT_COMMENT)){
  //     this.toast.error('Enter a Comment');
  //     return
  //   }
  // }
  //   this.SaveConfirmationPopUp = true;
  // // this.SaveConfirmationPopUp = true;
  // }

  SaveConfirmationPopUpOpen() {
    // Trigger form validation
    this.form.markAllAsTouched();

    // Stop if form is invalid
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }

    // Conditional validations for CR type
    if (this.isReasonofErrorCR && !this.form.get('REASON_ISSUE').value) {
      this.toast.error('Enter a Reason Issue');
      return;
    }

    // if (this.isDescofErrorCR && !this.form.get('DESC_ISSUE').value) {
    //   this.toast.error('Enter a Desc Issue');
    //   return;
    // }

    // Conditional validation for revert comment
    if (this.IS_REVERT === 1 && !this.form.get('REVERT_COMMENT').value) {
      this.toast.error('Enter a Comment');
      return;
    }

    // ✅ All good — proceed
    this.SaveConfirmationPopUp = true;
  }


  // SAVEISSUEREQUESTMASTER(){
  // this.GetRemoveBase64DocumnetExtension(this.DOCUMENT_ATTECHED_LIST)

  // this.DOCUMENT_ATTECHED_LIST.forEach((element:any)=>{
  // const keyToCheck = 'DATE';
  // if((keyToCheck in element)){
  //   const dateObj = this.convertToDate(element.DATE);
  //  let DATE = this.DatePipe.transform(dateObj,'yyyy-MM-dd');
  // element.DATE = DATE;
  // }
  // })


  //   let data = {
  //     "ISSUE_NO": this.ISSUE_NO,
  //     "DATE": this.datepipe.transform(this.REQUEST_DATE,'yyyy-MM-dd'),
  //     "REQUESTER": this.USER_ID,
  //     "PRODUCT_CODE":this.product_code,
  //     "USERID": this.USERID,
  //     "ISSUE_TYPE_CODE": this.ISSUE_TYPE_CODE,
  //     "PRIORITY_CODE": this.PRIORITY_CODE,
  //     "MODULE_CODE": this.MODULE_CODE,
  //     "FUNCTION_CODE": this.ISSUE_FUNCTION_CODE,
  //     "ISSUE_SUBJECT": this.ISSUE_SUBJECT,
  //     "REASON_ISSUE": this.REASON_ISSUE,
  //     // "DESC_ISSUE": this.DESC_ISSUE,
  //     "MODE": this.MODE,
  //     "STATUS_CODE": this.STATUS_CODE,
  //     "REVERT_COMMENT": this.REVERT_COMMENT,
  //     "DOCUMENT_ATTECHED_LIST": this.DOCUMENT_ATTECHED_LIST,

  //   }
  //     console.log('data ->' , data)

  //     this.http.PostRequest(this.apiurl.SaveIssueDetails, data).then((res: any) => {
  //     if (res.Resultlist[0].FLAG == 1) {
  // this.SaveConfirmationPopUp = false;

  //        this.toast.success(res.Resultlist[0].MSG)
  //        this.router.navigate([`/issuerequestlist`]);
  //     } else if (res.Resultlist[0].FLAG == 0) {
  //       this.toast.error(res.Resultlist[0].MSG);
  //     }
  //   });
  //  }
  SAVEISSUEREQUESTMASTER() {

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
    console.log('FormValues', formValues);

    const data = {
      ISSUE_NO: formValues.ISSUE_NO,
      DATE: this.datepipe.transform(formValues.REQUEST_DATE, 'yyyy-MM-dd'),
      // REQUESTER: this.USER_ID, // Can also come from login context
      REQUESTER: formValues.RAISED_BY === 'SELF' ? this.USER_ID : formValues.OTHER_NAME,
      PRODUCT_CODE: formValues.PRODUCT_CODE,
     //  USERID: formValues.RAISED_BY === 'SELF' ? this.USER_ID : formValues.OTHER_NAME,
      USERID: this.USERID,
      OTHER_NAME: formValues.OTHER_NAME,
      ISSUE_TYPE_CODE: formValues.ISSUE_TYPE_CODE,
      PRIORITY_CODE: formValues.PRIORITY_CODE,
      MODULE_CODE: formValues.MODULE_CODE,
      FUNCTION_CODE: formValues.ISSUE_FUNCTION_CODE,  
      ISSUE_SUBJECT: formValues.ISSUE_SUBJECT,
      REASON_ISSUE: formValues.REASON_ISSUE,
      DESC_ISSUE: formValues.DESC_ISSUE,
      CUST_REF_NO:formValues.Cust_REF_NO, 
      MODE: this.MODE,
      STATUS_CODE: this.STATUS_CODE,
      REVERT_COMMENT: this.REVERT_COMMENT,
      
      DOCUMENT_ATTECHED_LIST: this.DOCUMENT_ATTECHED_LIST,

    };

    console.log('data ->', data);
// return
    // 📤 API call
    this.http.PostRequest(this.apiurl.SaveIssueDetails, data).then((res: any) => {
      if (res.Resultlist[0].FLAG === 1) {
        this.SaveConfirmationPopUp = false;
        this.toast.success(res.Resultlist[0].MSG);
        this.router.navigate([`/issuerequestlist`]);
      } else {
        this.toast.error(res.Resultlist[0].MSG || 'Failed to save');
      }
    });
  }


  showFunctionDialog() {
    this.visibleFunction = true;
  }

  AddFunCode(data: any) {
    this.visibleFunction = false;
    this.FUNCTION_DESC = data.FUNCTION_NAME;
    this.ISSUE_FUNCTION_CODE = data.FUNCTION_CODE;
    this.SearchVlaue = '';
    this.MODULE_LIST.forEach((element: any) => {
      if (element.CODE == data.FUNCTION_GROUP) {
        this.MODULE_DESC = element.DESCRIPTION;
        this.MODULE_CODE = element.CODE;
      }
    })
  }

  showModuleDialog() {
    this.visibleModule = true;
  }

  AddModuleCode(data: any) {
    // console.log('data ->' , data)
    this.visibleModule = false;
    this.MODULE_DESC = data.DESCRIPTION;
    this.MODULE_CODE = data.CODE;
    this.SearchVlaue = '';
    this.FUNCTION_LIST = [];
    this.SAMPEL_FUNCTION_LIST.forEach((element: any) => {
      if (element.FUNCTION_GROUP == data.CODE) {
        this.FUNCTION_LIST.push(element)
      }
    })
  }

  BackToList() {
    this.router.navigate([`/issuerequestlist`]);
  }

  CheckUploadDocument(event: any) {
    if (event == true) {
      this.isUploadDocument = true;
    } else if (event == false) {
      this.isUploadDocument = false;
      this.DOCUMENT_ATTECHED_LIST = [];
    }
  }

  DownloadDocument(base64: string, name: string) {
    const link = document.createElement('a');
    link.href = base64;
    link.target = '_blank';
    link.download = name; // Optional: suggest downloading the file
    link.click();
  }

  viewDocument(file: Document) {
  const { DOC_BASE64, FILE_EXTENSION, FILE_NAME } = file;

  // Get the appropriate MIME type
  const mimeType = this.getMimeType(file.FILE_EXTENSION);

  if (!mimeType) {
    console.error('Unsupported file type:', FILE_EXTENSION);
    return;
  }

  // Check if DOC_BASE64 already includes data URI prefix
  const base64Data = DOC_BASE64.startsWith('data:')
    ? DOC_BASE64
    : `data:${mimeType};base64,${DOC_BASE64}`;

  // Open in a new tab using <embed> to display the content
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head><title>${FILE_NAME}</title></head>
        <body style="margin:0">
          <embed src="${base64Data}" type="${mimeType}" width="100%" height="100%" />
        </body>
      </html>
    `);
    newWindow.document.close();
  } else {
    console.error('Popup blocked. Please allow popups for this site.');
  }
}


  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



  // convertFilesToBase64(files: File[]) {
  //   files.forEach((file, index) => {
  //     let name = file.name.split('.').pop();
  //     const mimeType = this.getMimeType(name);
  //     const reader = new FileReader();
  //     reader.onload = (e:any) => {
  //       this.DOCUMENT_ATTECHED_LIST.push({
  //         FILE_NAME: file.name,
  //         DOC_BASE64: e.target?.result,
  //         SR_NO: this.DOCUMENT_ATTECHED_LIST.length + 1, 
  //         FILE_EXTENSION: file.name.split('.').pop() 
  //       });
  //     };
  //     reader.readAsDataURL(file); 
  //   });
  // }
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



  getMimeType(extension: any): any {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream'; // Fallback for unknown types
    }
  }

  onKeyPressModule(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      this.visibleModule = true;
    }
  }

  onKeyPressFunction(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      this.visibleFunction = true;
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

  CANCELISSUERAISED() {
    let data = {
      "USER_ID": (+this.USER_ID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
      "ISSUE_NO": this.ISSUE_NO
    }
    // this.apiService.post(this.urlService.CANCELISSUERAISED, data).then((res: any) => {
    //   if (res.Resultlist[0].FLAG == 1) {
    //     this.Toastr.success(res.Resultlist[0].MSG)
    //     this.router.navigate([`/issuerequestlist`]);
    //  } else if (res.Resultlist[0].FLAG == 0) {
    //    this.Toastr.error(res.Resultlist[0].MSG);
    //  }
    // });
  }

  GETISSUERAISEDHISTORY(val: any) {
    let data = {
      "USER_ID": (+this.USER_ID),
      "ISSUE_ID": this.ISSUE_ID,
      "ISSUE_NO": this.ISSUE_NO,
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
    }
    // console.log('data ->' , JSON.stringify(data))
    // return
    this.http.PostRequest(this.apiurl.GetDeveloperHistoryList, data).then((res: any) => {
    if(res.flag == 1){
      this.COMMENT_HISTORY = res.Datalist;
      // this.MessageService.add({severity:'warn', summary:res.Datalist.RootElement[0].Status_Name,detail:res.Datalist.RootElement[0].comment});
      if(val == 1){
        this.visibleHistoryFun = true;
      }
    }else if(res.flag == 0){
      return
    }
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

  openImageInNewWindow(image: string) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';  // Ensure it's on top of other content

    // Create an img element inside the modal
    const imgElement = document.createElement('img');
    imgElement.src = image;
    imgElement.alt = 'Preview Image';
    imgElement.style.maxWidth = '80%';  // Optional: Set maximum image width
    imgElement.style.maxHeight = '80%';  // Optional: Set maximum image height
    imgElement.style.transition = 'transform 0.3s ease';  // Smooth transition for zoom effect
    imgElement.style.cursor = 'zoom-in'; // Cursor to indicate zoom functionality

    // Append the image to the modal
    modal.appendChild(imgElement);
    document.body.appendChild(modal);

    // Zoom in effect when hovered
    imgElement.addEventListener('mouseenter', () => {
      imgElement.style.transform = 'scale(1.5)'; // Zoom in by 1.5x when mouse enters
      imgElement.style.cursor = 'zoom-out'; // Change cursor to zoom-out when zoomed in
    });

    // Zoom out effect when mouse leaves
    imgElement.addEventListener('mouseleave', () => {
      imgElement.style.transform = 'scale(1)'; // Reset zoom when mouse leaves
      imgElement.style.cursor = 'zoom-in'; // Reset cursor to zoom-in
    });

    // Close the modal when clicked
    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
  getvalue() {
    console.log(this.PRIORITY, 'getvalue');

  }
  UserId() { }

  onRaisedByChange(type: string) {
    if (type === 'SELF') {
      this.SELF = true;
      this.OTHER = false;
      this.raisedBy = 'SELF';
      this.otherName = ''; // Clear input when switching to SELF
    } else {
      this.SELF = false;
      this.OTHER = true;
      this.raisedBy = 'OTHER';
    }
  }

  selectedFileName: string | null = null;

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFileName = input.files[0].name;
  //     // You can also store the file object itself if needed:
  //     // this.selectedFile = input.files[0];
  //   }
  // }

  //  onFileSelected(event: any) {
  //     const file = event.target.files[0];
  //     if (file) {
  //       this.DOCUMENT_ATTECHED_LIST.push(file);
  //     }
  //   }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = input.files;
      this.convertFilesToBase64(filesArray);
    }
  }
  showHistoryDialog() {
    console.log("calling")
    // this.displayHistory = true;
  }

  goToList() {
    localStorage.setItem('MODE', 'A')
    localStorage.setItem('FUNCTION_CODE', '')
    localStorage.setItem('ISSUE_NO', '')

    this.route.changeRoute('/issuerequestlist');
  }
  closeModel() {
    this.SaveConfirmationPopUp = false;
  }
}

