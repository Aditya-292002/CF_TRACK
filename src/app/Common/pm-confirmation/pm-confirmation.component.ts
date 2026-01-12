import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Console } from 'console';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-pm-confirmation',
  templateUrl: './pm-confirmation.component.html',
  styleUrls: ['./pm-confirmation.component.css']
})
export class PmConfirmationComponent implements OnInit {

  form: FormGroup;
  DEVELOPER_STATUS_SELECTED: string = ''
  DOCUMENT_ATTECHED_LIST: any = []
  DOCUMENT_ATTECHED_LIST1: any = []
  statusflag: boolean = false;
  // Options for dropdowns
  // RESOLUTION_LIST: { RESOLUTION_CODE: string, RESOLUTION_NAME: string }[] = [];
  RESOLUTION_LIST: any = [];
  ProjectList: any = [];
  StatusList: any = [];
  natureIssueList: any = [];

  // Uploaded document list
  DEVELOPER_DOCUMENT_LIST: { FILE_NAME: string, FILE_EXTENSION: string, DOC_BASE64: string }[] = [];
  userData: any;
  MODE: any;
  PROJ_NAME: any;
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
  REQUEST_DATE: any = '';
  CREATEDBY: any;
  REQUESTER: any;
  ISSUE_TYPE_DESC: any;
  PRIORITY_DESC: any;
  MODULE_CODE: any;
  ISSUE_SUBJECT: any;
  ISSSUE_NO: any;
  NATURE_ID: any;
  DatePipe: any;
  developerStatus: any = "OK";
  search_project: string = "";
  selected_emp:any;
  EST_HOURS: any;
  DEVELOPER_DOCUMENT_LIST1: any;
  RESOLUTION_CODE: any;
  DELIVERY_BY: any;
  DEVELOPER_STATUS: any;
  ISSUE_TYPE_CODE: any;
  PRIORITY_CODE: any;
  REASON_ISSUE: any;
  DESC_ISSUE: any;
  DEVELOPER_COMMENT: any;
  SaveConfirmationPopUp: boolean = false;
  CR_ISSUE_REASON: any;
  CUST_REF_NO: any;
  viewflag: boolean = false;
  liststatus: any = "Pending";
  isDisableRadioBtn: boolean = false
  minDate: any
  displayHistory: boolean = false;
  spinner: boolean = false;
  COMMENT_HISTORY: any
  INITIAL_DOC_LIST: any = [];
  RESOLVE_DOC_LIST: any = [];

  CLOSED_STATUS_LIST: any = [];
  RESOLVED_STATUS_LIST: any = [];
  project_assign_emp_detail:any = [];
  project_manager_list: Array<any> = [];
  Account_manager_list: Array<any> = [];
  all_Account_manager_list: Array<any> = [];
  technical_owner_list: Array<any> = [];
  project_payment_detail: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private route: RoutingService,
    private http: HttpRequestServiceService,
    private apiurl: ApiUrlService,
    private toast: ToastrService,
    private datepipe: DatePipe,
    private router: Router,
    public sharedService: SharedServiceService,



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

  //  this.DATE = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
  ngOnInit(): void {
    const today1 = new Date().toISOString().split('T')[0];
    const thisDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy')
    console.log(today1, thisDate, "today1")
    this.minDate = today1;
    this.form = this.fb.group({
      ISSUE_NO: [{ value: '', disabled: true }],
      REQUEST_DATE: [{ value: thisDate, disabled: true }],
      CUST_REF_NO: [{ value: '', disabled: true }],
      PROJ_NAME: [{ value: '', disabled: true }],
      RAISED_BY_NAME: [{ value: '', disabled: true }],
      ISSUE_TYPE_DESC: [{ value: '', disabled: true }],
      PRIORITY_DESC: [{ value: '', disabled: true }],
      ISSUE_SUBJECT: [{ value: '', disabled: true }],
      MODULE_CODE: [{ value: '', disabled: true }],
      FUNCTION_CODE: [{ value: '', disabled: true }],
      CREATEDBY: [{ value: '', disabled: true }],
      ASREASON_OF_ISSUE_CR: [{ value: '', disabled: true }],
      DEVELOPER_STATUS: ["OK"],
      DEVELOPER_COMMENT: [''],
      DELIVERY_BY: [null],
      EST_HOURS: [null, [Validators.min(0), Validators.max(999)]],
      RESOLUTION_CODE: [''],
      NATURE_ID: [''],
      PROJ_CODE: [{ value: '', disabled: true }],
    });

    console.log(this.form.get('DEVELOPER_STATUS').value, "value");
    this.DEVELOPER_STATUS_SELECTED = this.form.get('DEVELOPER_STATUS').value
    if (this.DEVELOPER_STATUS_SELECTED == 'OK') {

      this.statusflag = true;
    } else {
      this.statusflag = false;
    }
    // Subscribe to changes and update our variable
    // this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
    //   this.DEVELOPER_STATUS_SELECTED =this.form.get('DEVELOPER_STATUS').value;
    //   console.log('Status', value);

    //   // Reset fields based on status

    // });

    this.GetPMConfirmationList()
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.MODE = localStorage.getItem('MODE');
    console.log(' this.MODE', this.MODE);
    this.ISSUE_NO = localStorage.getItem('ISSUE_NO');
    this.USER_ID = localStorage.getItem('USERID');
    console.log(' this.ISSUE_NO', this.ISSUE_NO);


    if (this.ISSUE_NO !== null && this.MODE === 'E') {

      this.GETISSUERAISEDDETAILSBYISSUENO();
      this.GET_PM_COMMON_LIST();
      this.getEmployee();
      this.GetProjectDetail();
      // this.GETISSUERAISEDHISTORY(0);
    }

    this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
      console.log(value, "value")
      if (value === "") {
        this.developerStatus = "OK"
      } else if (value === undefined) {
        this.developerStatus = "OK"
      } else {
        this.developerStatus = value
      }

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
    });
  }

  showHistoryDialog() {
    console.log("calling")
    this.displayHistory = true;
  }

  ChangeFDate() {
    this.DELIVERY_BY = this.datepipe.transform(new Date(this.DELIVERY_BY), 'dd-MMM-yyyy')
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GetPMConfirmationList() {
    this.http.PostRequest(this.apiurl.GetIssueHelpDeskMasterList, {}).then((res: any) => {
      this.RESOLUTION_LIST = res.Resolution;
      this.CLOSED_STATUS_LIST = res.statuslist;
      this.RESOLVED_STATUS_LIST = res.closestatuslist;
      this.natureIssueList = res.natureIssueList;
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GET_PM_COMMON_LIST() {
  let data = {
    "USER_ID": (+this.userData[0].USERID),
    "EMP_CODE": (+this.userData[0].EMP_CODE),
  }
  this.http.PostRequest(this.apiurl.GetPMCommonList, data).then((res: any) => {
    this.ProjectList = res.ProjectList;
    this.StatusList = res.StatusList;
    this.natureIssueList = res.natureIssueList;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 100);
  });
}

  addRow() {
    if(!this.sharedService.isValid(this.selected_emp)){
        this.toast.error('Select a Employee');
        return
    }
    let data = JSON.parse(this.selected_emp)
    for (let i = 0; i < this.project_assign_emp_detail.length; i++) {
      const user = this.project_assign_emp_detail[i];
      if(user.EMP_NO == data.EMP_CODE) {
        this.toast.error('This user already added');
        return; 
      }
    }
    console.log('project_assign_emp_detail',this.project_assign_emp_detail);
    
    this.selected_emp = "";
    let emp_details = {};
      emp_details = {
        ACTIVE: true,
        EMP_CODE: data.EMP_CODE,
        FULL_NAME: data.USER_NAME,

        // TASKID: this.TASK_ID,
      }
    this.project_assign_emp_detail.push(emp_details)
    $("#emp").selectpicker("refresh").trigger("change");
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  removeRow(data:any) {
    this.selected_emp = "";
    this.project_assign_emp_detail.forEach((element:any,index:any)=>{
      if(element.EMP_CODE == data.EMP_CODE){
          this.project_assign_emp_detail.splice(index,1)
          // element.ACTIVE=false;
      } 
    })
    $("#emp").selectpicker("refresh").trigger("change");
  }
  get activeEmployees() {
  return this.project_assign_emp_detail.filter(emp => emp.ACTIVE);
}

  GetProjectDetail() {
    let data = {
      PROJ_CODE: this.search_project
    }
    this.http.PostRequest(this.apiurl.GetProjectDetail, data).then(res => {
      if (res.flag) {
        this.project_assign_emp_detail = res.project_payment_detail;
        // this.f_fillData(res.project_detail)
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  searchProject() {
    // this.isUpdate = false;
    if (this.search_project != "" || this.search_project != undefined) {
      // this.isUpdate = true;
      this.GetProjectDetail();
    } else {
      // this.isUpdate = false;
      this.f_clearForm();
    }
  }

  f_clearForm() {
    // this.GetProjectList();
    // this.f_clearForm()
    // this.fileInput.nativeElement.value = "";
    // this.isSubmited = false;
    this.form.reset();
    // this.uploadedDocument = [];
    // this.project_payment_detail=[];
    this.search_project = "";
    // this.isUpdate= false;
    // this.PROJECT_DATE = this.sharedService.getTodayDate();
    this.project_assign_emp_detail=[]
    setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');}, 100);
  }

  GET_PM_HISTORY() {

    const data = {
      ISSUE_ID: localStorage.getItem("ISSUE_ID")
    }
    this.http.PostRequest(this.apiurl.GetDeveloperHistoryList, data).then((res: any) => {
      console.log(res, "GetDeveloperHistoryList : ")
      if (res.flag == 1) {
        this.COMMENT_HISTORY = res.Datalist;
      } else {
        this.COMMENT_HISTORY = []
      }
    });
  }

  getEmployee() {
    let data = {
      LISTTYPE: ""
    }
    this.http.PostRequest(this.apiurl.GetEmployeeList, data).then(res => {
      if (res.flag) {
        this.project_manager_list = res.employee_list;
        this.Account_manager_list = res.employee_list;
        this.all_Account_manager_list = res.employee_list;
        this.technical_owner_list = res.employee_list;
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

  GETISSUERAISEDDETAILSBYISSUENO() {
    console.log('GETISSUERAISEDDETAILSBYISSUENO inside');

    const data = {
      USER_ID: +this.USER_ID,
      FUNCTION_CODE: (this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE,
      ISSUE_NO: this.ISSUE_NO,
      MODE: this.MODE
    };

    this.http.PostRequest(this.apiurl.GETISSUERAISEDDETAILSBYISSUENO, data).then((res: any) => {
      const response = res.datalist[0];
      console.log(response, "response")
      if (!response) return;
      this.IS_HISTORY = response.IS_HISTORY;
      this.ISSSUE_NO = response.ISSSUE_NO;
      // const REQUEST_DATE = this.formatDate(response.REQUEST_DATE as string);
      console.log(this.datepipe.transform(new Date(response.REQUEST_DATE), 'dd-MMM-yyyy'))
      this.REQUEST_DATE = this.datepipe.transform(new Date(response.REQUEST_DATE), 'dd-MMM-yyyy');
      this.CREATEDBY = response.CREATEDBY;
      this.REQUESTER = response.REQUESTER;
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
      this.NATURE_ID = response.NATURE_ID;
      this.product_code = response.PRODUCT_CODE;
      this.PRIORITY_CODE = response.PRIORITY_CODE;
      this.ISSUE_TYPE_CODE = response.ISSUE_TYPE_CODE;
      this.DESC_ISSUE = response.DESC_OF_ISSUE_CR;
      this.REASON_ISSUE = response.ASREASON_OF_ISSUE_CR;
      this.PROJ_NAME = response.PROJ_NAME;
      this.CR_ISSUE_REASON = response.ASREASON_OF_ISSUE_CR;
      this.CUST_REF_NO = response.CUST_REF_NO;


      this.form.patchValue({
        ISSUE_NO: response.ISSSUE_NO,
        REQUEST_DATE: this.datepipe.transform(new Date(response.REQUEST_DATE), 'dd-MMM-yyyy'),
        PRIORITY_CODE: response.PRIORITY_CODE,
        RAISED_BY_NAME: response.REQUESTER_NAME,
        ISSUE_TYPE_DESC: response.ISSUE_TYPE_DESC,
        PRIORITY_DESC: response.PRIORITY_DESC,
        FUNCTION_CODE: response.FUNCTION_CODE,
        CREATEDBY: response.CREATEDBY,
        ASREASON_OF_ISSUE_CR: response.ASREASON_OF_ISSUE_CR,
        OTHER_NAME: response.REQUESTER !== this.userData[0].LOGIN_ID ? response.REQUESTER : '',
        ISSUE_TYPE_CODE: response.ISSUE_TYPE_CODE,
        ISSUE_SUBJECT: response.ISSUE_SUBJECT,
        MODULE_CODE: response.MODULE_CODE,
        ISSUE_FUNCTION_CODE: response.FUNCTION_CODE,
        REASON_ISSUE: response.ASREASON_OF_ISSUE_CR,
        DESC_ISSUE: response.DESC_OF_ISSUE_CR,
        CUST_REF_NO: response.CUST_REF_NO,
        PROJ_NAME: response.PROJ_NAME,
      });


      if (response.STATUS_CODE == '42') {
        this.developerStatus = 'CLOSE'
        this.isDisableRadioBtn = true
        console.log(this.isDisableRadioBtn, " console.log(this.isDisableRadioBtn)")
      } else if (response.STATUS_CODE == '40') {
        this.developerStatus = 'OK'
        this.isDisableRadioBtn = true
        console.log(this.isDisableRadioBtn, " console.log(this.isDisableRadioBtn)")
      } else if (response.STATUS_CODE == '00') {
        this.isDisableRadioBtn = false
        console.log(this.isDisableRadioBtn, " console.log(this.isDisableRadioBtn)")
      }


      this.DEVELOPER_DOCUMENT_LIST1 = res.iteamlist || [];
      // this.GetRemoveBase64DocumnetExtension(this.DEVELOPER_DOCUMENT_LIST1);
      // console.log('GETISSUERAISEDDETAILSBYISSUENO response', response);
      if (res.iteamlist.length > 0) {
        this.INITIAL_DOC_LIST = res.iteamlist.filter((x: any) => x.TYPE === 'I');
        this.RESOLVE_DOC_LIST = res.iteamlist.filter((x: any) => x.TYPE === 'R');
      } else {
        this.INITIAL_DOC_LIST = [];
        this.RESOLVE_DOC_LIST = [];
      }
      if (response.DELIVERY_BY != "") {
        var deliveryDate1 = this.datepipe.transform(new Date(response.DELIVERY_BY), 'dd-MMM-yyyy')
      }

      this.form.patchValue({
        DELIVERY_BY: deliveryDate1,
        EST_HOURS: response.EST_HOURS,
        RESOLUTION_CODE: response.RESOLUTION_CODE,
        DEVELOPER_COMMENT: response.DEVELOPER_COMMENT,
        DEVELOPER_STATUS: this.developerStatus
      });
      setTimeout(() => {
        this.form.get('DEVELOPER_COMMENT').setValue(response.DEVELOPER_COMMENT);
        //  this.form.get('RESOLUTION_CODE').setValue(response.RESOLUTION_CODE);
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
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

  deleteFile(index: number, fileInput?: HTMLInputElement): void {
    // Remove the file from the list
    this.DOCUMENT_ATTECHED_LIST.splice(index, 1);
    console.log('After delete:', this.DOCUMENT_ATTECHED_LIST);

    // ✅ Force reset of file input so the same file can be re-uploaded
    if (fileInput) {
      fileInput.type = 'text';  // temporarily change the type
      fileInput.type = 'file';  // revert it back to file (forces DOM refresh)
    }
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
        this.RESOLVE_DOC_LIST = this.DOCUMENT_ATTECHED_LIST
        console.log('All files processed:', this.DOCUMENT_ATTECHED_LIST);
      })
      .catch((error) => {
        console.error('Error processing some files:', error);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const allowedTypes: string[] = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      const filesArray: FileList = input.files;
      const invalidFiles: File[] = [];

      // Iterate over each file
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const fileType = file.type || this.getMimeType(file.name.split('.').pop() || '');

        if (!allowedTypes.includes(fileType)) {
          invalidFiles.push(file);
        }
      }

      if (invalidFiles.length > 0) {
        // Show Toastr error
        this.toast.error('Only PDF, Word, Excel, Text, and Image (JPG/PNG) files are allowed.', 'Invalid File Type');

        // Reset the input
        input.value = '';
        return;
      }

      // If all files are valid, proceed with conversion
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

    this.form.get('DEVELOPER_STATUS').value
    console.log(this.developerStatus, "this.developerStatus")
    //  this.SaveConfirmationPopUp = true;
    // Trigger form validation
    this.form.markAllAsTouched();

    // Stop if form is invalid
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }
    if (this.developerStatus == 'OK') {
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
    } else {
      if (!this.form.get('DEVELOPER_COMMENT').value) {
        this.toast.error('Enter a developer comment');
        return;
      }

    }


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

    let _formData = this.form.getRawValue();
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
      "DELIVERY_BY": this.datepipe.transform(formValues.DELIVERY_BY, 'yyyy-MM-dd'),
      "PROJECT_CODE":this.form.get('PROJ_CODE').value,
      "project_detail": _formData,
      "project_assign_emp_detail": this.project_assign_emp_detail,
        // "project_payment_detail": this.project_payment_detail,
    }


    console.log('data', data);
    //  return 
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

  goToList() {
    this.route.changeRoute('/pmconfirmation');
  }

  viewDocument(data: any) {
    if (!data.DOC_BASE64 || !data.FILE_EXTENSION) return;

    const base64Content = data.DOC_BASE64.includes(',')
      ? data.DOC_BASE64.split(',')[1]
      : data.DOC_BASE64;

    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.getMimeType(data.FILE_EXTENSION) });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

  downloadDocument(data: any) {
    if (!data.DOC_BASE64 || !data.FILE_EXTENSION) return;

    const byteCharacters = atob(data.DOC_BASE64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.getMimeType(data.FILE_EXTENSION) });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.FILE_NAME;
    link.click();
  }

  private getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }

  GET_PM_CONFIRMATION_LIST() {
    let data = {
      "USER_ID": (+this.USER_ID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
      "LISTSTATUS": (this.liststatus == "Pending") ? "P" : "C",
    }
  }

  setStatus(value: string) {
    this.liststatus = value;
    // you can also filter your data or call API here
    console.log('Selected Status:', this.liststatus);

    this.GET_PM_CONFIRMATION_LIST();
  }

  isPending(): boolean {
    return this.liststatus === 'P';
  }

}