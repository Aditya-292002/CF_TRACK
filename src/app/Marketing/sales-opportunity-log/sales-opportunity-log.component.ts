import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sales-opportunity-log',
  templateUrl: './sales-opportunity-log.component.html',
  styleUrls: ['./sales-opportunity-log.component.css']
})
export class SalesOpportunityLogComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  form: FormGroup;
  spinner: boolean = false;

  isSubmited: boolean = false;
  minDate: any ='';
  maxDate: any ='';
  isViewOpportunity:boolean = false;
  displayHistory: boolean = false;

  selectedCust : boolean = true
  selectedEmp : boolean = false
  dropdownSelected1 : boolean = true
  dropdownSelected2 : boolean = false
  OPPO_CODE : any = '';
  LOGID : any = '';
  NoDocs: number = 0;
  DOCUMENT_ATTECHED_LIST: any = [];

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    public validationService: ValidationService,
    private pipeService: PipeService,
    public router: Router,
    public datepipe: DatePipe) { }

    customer_list: Array<any> = [];
    company_list:Array<any>=[];
    opportunity_list: Array<any> = [];
    opportunity_activity_list: Array<any> =[];
    opportunity_status_list: Array<any> =[];
    opportunity_substatus_list: Array<any> =[];
    probability_list: Array<any> =[];
    Nextactivity_list: Array<any> =[];
    log_view_list: Array<any> = []
    lead_list: Array<any> = [];
    document_List: Array<any> = [];
    uploadedDocument: Array<any> = [];
    uploadingFiles: Array<any> = [];

    // NEXT_FOLLOWUP: string = "";
    // LOG_DATE: string = "";

    NEXT_FOLLOWUP : any = this.sharedService.getDDMMMYYYY(new Date());

    LOG_DATE: any = this.sharedService.getDDMMMYYYY(new Date());


  ngOnInit() {
     
    this.sharedService.formName = "Sales Opportunity Log"
    this.form = this.formBuilder.group({
      OPPO_CODE: ["", Validators.required],
      COMPANY_CODE: ["", Validators.required],
      CUST_CODE: [""],
      LEAD_CODE :[""],
      LOG_DATE: ["", Validators.required],
      CRMACTIVITY_CODE: [""],
      REMARKS: ["", Validators.required],
      REVISED_ORDERVALUE: [""],
      REVISED_PROBABILITY: ["", Validators.required],
      NEXT_FOLLOWUP: ["", Validators.required],
      NEXT_CRMACTIVITY:[""],
      REVISED_STATUS:[""],
      REVISED_SUBSTATUS:[""],
      CONTACT_PERSONS:[""],
      
    });
    const today = new Date();
    this.minDate = today.toISOString().substring(0, 10);
    this.GetOpportunityLogCommonList();
    this.OPPO_CODE= localStorage.getItem('OPPO_CODE');
    if(localStorage.getItem('OPPO_CODE') != '' && localStorage.getItem('OPPO_CODE') != null || localStorage.getItem('OPPO_CODE') != undefined){
      this.form.get('OPPO_CODE').setValue(this.OPPO_CODE);
      this.isUpdate = true;
      this.GetOpportunityLogDetails();
      this.GetLogDetailsView();
    }

    $('.selectpicker').selectpicker('refresh').trigger('change');

  }


  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  NO_RIGHTS: boolean = false;
  isNewAdd: boolean = false;


  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      }

      this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;

      // this.maxDate = this.sharedService.loginUser[0].TO_DATE;

      this.LOG_DATE = this.sharedService.getTodayDate();

      this.form.get('LOG_DATE').setValue(this.LOG_DATE)

      this.NEXT_FOLLOWUP = this.sharedService.getTodayDate();

      this.form.get('NEXT_FOLLOWUP').setValue(this.NEXT_FOLLOWUP)

      $('.selectpicker').selectpicker('refresh').trigger('change');

      // this.GetOpportunityLogCommonList() 
    }, 200);
  }

  GetOpportunityLogCommonList() {
    let data = {
      // LISTTYPE:'All',
      USERID:this.sharedService.loginUser[0].USERID,
    }
    this.http.PostRequest(this.apiUrl.GetOpportunityLogCommonList, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.customer_list = res.customer_list;
        this.company_list = res.company_list;
        this.opportunity_list = res.opportunity_list;
        this.opportunity_activity_list = res.opportunity_activity_list;
        this.opportunity_status_list = res.opportunity_status_list;
        this.opportunity_substatus_list = res.opportunity_substatus_list;
        this.probability_list = res.probability_list;
        this.Nextactivity_list = res.Nextactivity_list;
        this.lead_list = res.lead_list
        this.form.get('COMPANY_CODE').setValue(this.company_list[0].COMPANY_CODE);
      // this.form.get('LOCATION_CODE').setValue(this.location_list[0].LOCATION_CODE);
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 150);
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  searchOpportunity() {
    this.isUpdate = false;
    if (this.form.getRawValue().OPPO_CODE != "" || this.form.getRawValue().OPPO_CODE!= undefined) {
      this.isUpdate = true;
      this.GetOpportunityLogDetails();
      this.isViewOpportunity = false;
    } else {
      this.isUpdate = false;
      this.f_clearForm();
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  }

  GetOpportunityLogDetails() {
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      OPPO_CODE: this.form.getRawValue().OPPO_CODE,
    }
    console.log(data)
    this.http.PostRequest(this.apiUrl.GetOpportunityMasterLogDetails, data).then(res => {
      console.log('GetOpportunityLogDetails',res)
      if (res.flag) {
      // Existing documents from DB must be included in the save payload
      this.DOCUMENT_ATTECHED_LIST = (res.iteamlist || []).map(d => ({
      DOCUMENT_NAME: d.DOCUMENT_NAME,
      DOCUMENT_FILENAME: d.DOCUMENT_FILENAME,
      DOCUMENT_SYSFILENAME: d.DOCUMENT_SYSFILENAME,
      FILE_EXTENSION: d.DOCUMENT_FILENAME.split('.').pop().toLowerCase(),
      ACTIVE: d.ACTIVE ? 1 : 0,
      ISNEW: 0,
      DOC_BASE64: d.DOC_BASE64
    }));
        this.uploadedDocument = [...this.DOCUMENT_ATTECHED_LIST];
        this.updateNoDocsCount();
        this.f_fillData(res.Opportunity_Master_Log_Details)
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_fillData(data: Array<any> = []) {
    this.form.get('LEAD_CODE').reset();
        this.form.get('CUST_CODE').reset();
           this.form.get('OPPO_CODE').reset();
    console.log(data[0])
    this.form.get('COMPANY_CODE').setValue(data[0].COMPANY_CODE)
    // this.form.get('CUST_CODE').setValue(data[0].CUST_CODE)
    this.form.get('OPPO_CODE').setValue(data[0].OPPO_CODE)
    this.form.get('CONTACT_PERSONS').setValue(data[0].CONTACT_PERSONS)
    this.form.get('REMARKS').setValue(data[0].REMARKS)
    this.form.get('REVISED_ORDERVALUE').setValue(data[0].REVISED_ORDERVALUE)
    this.form.get('REVISED_PROBABILITY').setValue(data[0].REVISED_PROBABILITY)
    this.form.get('REVISED_STATUS').setValue(data[0].REVISED_STATUS)
    this.form.get('REVISED_SUBSTATUS').setValue(data[0].REVISED_SUBSTATUS)

    if(data[0].LEADORCUST === "L"){
      this.selectedCust = false;
      this.selectedEmp = true;
      this.dropdownSelected1 = false;
      this.dropdownSelected2 = true;  
      this.form.get('LEAD_CODE').setValue(data[0].LEAD_NAME)
      this.form.get('CUST_CODE').setValue("");
    }else{
      this.form.get('CUST_CODE').reset();
      this.selectedCust = true;
      this.selectedEmp = false;
      this.dropdownSelected1 = true;
      this.dropdownSelected2 = false;  
      this.form.get('CUST_CODE').setValue(data[0].CUST_CODE)
      this.form.get('LEAD_CODE').setValue("");
    }
    // this.form.get('LOG_DATE').setValue(this.sharedService.getFormatedDate(data[0].LOG_DATE))
    // this.form.get('NEXT_FOLLOWUP').setValue(this.sharedService.getFormatedDate(data[0].NEXT_FOLLOWUP))

    this.LOG_DATE = this.sharedService.getTodayDate();

    this.form.get('LOG_DATE').setValue(this.LOG_DATE)

    this.NEXT_FOLLOWUP = this.sharedService.getTodayDate();

    this.form.get('NEXT_FOLLOWUP').setValue(this.NEXT_FOLLOWUP)

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);

  }

  private applyLatestLogActivity(list: any[]): void {
  if (!Array.isArray(list) || list.length === 0) {
    return;
  }
  const sortedList = [...list].sort((a, b) =>
    Number(b.LOGID) - Number(a.LOGID)
  );
  const latest = sortedList[0];
  this.form.get('CRMACTIVITY_CODE').setValue(latest.CRMACTIVITY_CODE);
  this.form.get('NEXT_CRMACTIVITY').setValue(latest.NEXT_CRMACTIVITY);
}

  f_downloadDocument(file: any) {
    console.log(file,'file');
      this.http.PostRequest(this.apiUrl.GetOppMasterFile, { DOCUMENT_SYSFILENAME: file.DOCUMENT_SYSFILENAME }).then(res => {
        if (res.flag) {
          const byteString = atob(res.b64);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const int8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
           }
          const data: Blob = new Blob([int8Array]);
          saveAs(data, file.DOCUMENT_FILENAME);
         }
        this.spinner = false;
      })
  }

  GetDocumentListByLogId() {
    let data = {
      LOGID: this.LOGID?this.LOGID:'',
      OPPO_CODE: this.form.getRawValue().OPPO_CODE,
    }
    console.log("GetDocumentListByLogId Data :", data)
    this.http.PostRequest(this.apiUrl.GetDocumentListByLogId, data).then(res => {
      console.log('GetDocumentListByLogId :',res)
              this.document_List=[];
      if (res.flag) {

        this.document_List = res.document_List;
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  SaveSalesOpportunityLog(para: string = '') {
    this.isSubmited = true;
    // if(this.f_validateForm()){
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      CRM_OPPO_LOG:this.form.value,
      DOCUMENT_ATTECHED_LIST: this.uploadedDocument,
      OPPO_CODE: this.form.getRawValue().OPPO_CODE,
    }
    console.log('data',data)
    // return
    this.http.PostRequest(this.apiUrl.SaveSalesOpportunityLog, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.toast.success(res.msg)
        // this.f_clearForm()
        this.GetLogDetailsView();
        this.spinner = false;
      } else {
        this.toast.warning(res.msg)
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  //  }
  }

  viewOpportunity(){
    this.isViewOpportunity = !this.isViewOpportunity;
    this.GetLogDetailsView();
    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  }

  GetLogDetailsView() {
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      OPPO_CODE: this.form.getRawValue().OPPO_CODE,
    }
    console.log(data)
    this.http.PostRequest(this.apiUrl.GetLogDetailsView, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.log_view_list = res.LogDetailsView_List
        if (res.LogDetailsView_List && res.LogDetailsView_List.length > 0) {
         // this.LOGID = res.LogDetailsView_List[0].LOGID;
        }
        console.log("this.LOGID :", this.LOGID);
        this.GetDocumentListByLogId();
        this.applyLatestLogActivity(res.LogDetailsView_List);
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  viewDocument(val:any){
  console.log('viewDocument',val);
  this.LOGID = val;
  this.GetDocumentListByLogId();
  this.displayHistory=true
  console.log('displayHistory',this.displayHistory);
}

  f_clearForm() {
    this.isSubmited = false;
    this.form.reset();
    this.isUpdate= false;

    this.form.get('LOG_DATE').setValue(this.sharedService.getTodayDate())
    this.LOG_DATE = this.sharedService.getTodayDate();

    this.form.get('NEXT_FOLLOWUP').setValue(this.sharedService.getTodayDate())
    this.NEXT_FOLLOWUP = this.sharedService.getTodayDate();
    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  }

  f_validateForm() { 
    if(this.form.controls["COMPANY_CODE"].invalid){
      this.toast.warning("Please select Company.");
      return false;
    } else if(this.form.controls["OPPO_CODE"].invalid){
      this.toast.warning("Please select Opportunity Name.");
      return false;
      
    } else if(this.form.controls["CUST_CODE"].invalid){
      this.toast.warning("Please select Customer Name.");
      return false;

    } else if(this.form.controls["LOG_DATE"].invalid){
      this.toast.warning("Please select Log Date.");
      return false;

    } else if(this.form.controls["CRMACTIVITY_CODE"].invalid){
      this.toast.warning("Please select Activity.");
      return false;

    } else if(this.form.controls["CONTACT_PERSON"].invalid){
      this.toast.warning("Please Enter Contac Person.");
      return false;

    } else if(this.form.controls["REMARKS"].invalid){
      this.toast.warning("Please Enter Remarks.");
      return false;

    } else if(this.form.controls["REVISED_ORDERVALUE"].invalid){
      this.toast.warning("Please Enter Revised Value.");
      return false;

    } else if(this.form.controls["REVISED_PROBABILITY"].invalid){
      this.toast.warning("Please select Probability.");
      return false;

    } else if(this.form.controls["NEXT_FOLLOWUP"].invalid){
      this.toast.warning("Please select Next Follow Up.");
      return false;

    } else if(this.form.controls["NEXT_CRMACTIVITY"].invalid){
      this.toast.warning("Please select Next Activity.");
      return false;

    } else if(this.form.controls["REVISED_STATUS"].invalid){
      this.toast.warning("Please select Status.");
      return false;

    } else if(this.form.controls["REVISED_SUBSTATUS"].invalid){
      this.toast.warning("Please Select Sub Status.");
      return false;

    }  else if(this.form.controls["CONTACT_PERSONS"].invalid){
      this.toast.warning("Please enter Contact Persons Name.");
      return false;

    }
    return true;
  }
  navigateToList(){
    this.router.navigate(['/salesopportunitylog']);
  }

  removeDoc(fileIndex: number = null) {
    if (this.uploadedDocument[fileIndex].ISNEW == 1) {
      this.uploadedDocument.splice(fileIndex, 1);
    } else if (this.uploadedDocument[fileIndex].ACTIVE == 1) {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    } else {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    }
    this.NoDocs = 0;
    this.uploadedDocument.forEach(element => {
      if(element.ACTIVE != 0){
        this.NoDocs += 1
      }
    });
  }

  selectDocument(event: any) {
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];
    let DOC_SRNO: string = "";

    for (let i = 0; i < event.target.files.length; i++) {
      extension = event.target.files[i].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase()
      
      if(_ext === 'BAT' || _ext === 'GIF' || _ext === 'PNG' || _ext === 'JAVA' || _ext === 'XML' || _ext === 'ZIP' 
      || _ext === 'RAR' || _ext === 'JAR' || _ext === 'EXE'){
        this.toast.warning("Please select valid document (XLSX/ DOCS/ PDF/ TEXT File/ Image)")
        return;
      } 
      
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        extension = event.target.files[i].name.split(".");

        this.uploadingFiles.push(
          {
            OPPO_CODE: this.form.getRawValue().OPPO_CODE,
            DOCUMENT_NAME: event.target.files[i].name,
            DOC_SRNO: this.uploadingFiles.length + 1,
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_FILETYPE:  '.' + extension[extension.length - 1],
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            DOC_BASE64: b64,
            // REMARKS: this.REMARKS

          }
        )
        // this.uploadDoc();
        // this.NoDocs == 1;
        this.updateNoDocsCount();
      }
      // this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
    }
  }

  updateNoDocsCount() {
  this.NoDocs = (this.uploadedDocument || [])
    .filter(d => d.ACTIVE !== 0)
    .length;
}

uploadDoc() {

    // if(this.REMARKS==""){
    //   this.toast.warning("Please enter remarks for the document");
    //   return;
    // }
    // this.displayHistory=false;
    // this.REMARKS="";
  for (let i = 0; i < this.uploadingFiles.length; i++) {
    this.uploadedDocument.push(this.uploadingFiles[i]);
    this.DOCUMENT_ATTECHED_LIST.push({
    OPPO_CODE: this.form.getRawValue().OPPO_CODE,
    DOCUMENT_NAME: this.uploadingFiles[i].DOCUMENT_FILENAME,
    DOCUMENT_FILENAME: this.uploadingFiles[i].DOCUMENT_FILENAME,
    DOCUMENT_SYSFILENAME: this.uploadingFiles[i].DOCUMENT_SYSFILENAME,
    DOCUMENT_FILETYPE: this.uploadingFiles[i].DOCUMENT_FILETYPE,
    ISNEW: 1,
    ACTIVE: 1,
    UPLOAD_BY: this.uploadingFiles[i].UPLOAD_BY,
    UPLOAD_BY_USERID: this.uploadingFiles[i].UPLOAD_BY_USERID,
    DOC_BASE64: this.uploadingFiles[i].b64,
    // REMARKS: this.uploadingFiles[i].REMARKS
  });
  }
  console.log("DOCUMENT_ATTECHED_LIST :", this.DOCUMENT_ATTECHED_LIST);
  console.log("Uploaded Document List :", this.uploadedDocument);
}

getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt': return 'text/plain';
      default: return 'application/octet-stream';
    }
  }

  convertFilesToBase64(fileList: FileList) {
    const files = Array.from(fileList);
    const fileReadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64 = e.target.result;
          const fileData = {
            DOCUMENT_FILENAME: file.name,
            DOC_BASE64: base64,
            SR_NO: this.DOCUMENT_ATTECHED_LIST.length + 1,
            FILE_EXTENSION: fileExtension,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + fileExtension,
            DOCUMENT_NAME: file.name,
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID
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
        // push to DOCUMENT_ATTECHED_LIST
        results.forEach(r => {
          this.DOCUMENT_ATTECHED_LIST.push({
            DOCUMENT_NAME: r.DOCUMENT_NAME,
            DOCUMENT_FILENAME: r.DOCUMENT_FILENAME,
            DOCUMENT_SYSFILENAME: r.DOCUMENT_SYSFILENAME,
            DOCUMENT_FILETYPE: r.FILE_EXTENSION,
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: r.UPLOAD_BY,
            UPLOAD_BY_USERID: r.UPLOAD_BY_USERID,
            DOC_BASE64: r.DOC_BASE64
          });
        });
        // update doc count
        this.NoDocs == 1;
        this.NoDocs = this.DOCUMENT_ATTECHED_LIST.filter(d => d.ACTIVE != 0).length;
        console.log('All files processed:', this.DOCUMENT_ATTECHED_LIST);
      })
      .catch((error) => {
        console.error('Error processing some files:', error);
        this.toast.error('Error processing files');
      });
  }

  stripBase64FromDocuments() {
  this.DOCUMENT_ATTECHED_LIST.forEach(file => {
    
    // For old files → keep DOC_BASE64 null, but ensure FILE_EXTENSION exists
    if (file.ISNEW !== 1) {
      file.DOC_BASE64 = null;
      return;
    }

    // For new files → clean only the base64
    if (!file.DOC_BASE64) return;

    file.DOC_BASE64 = file.DOC_BASE64.replace(/^data:.*;base64,/, '').trim();
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
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const fileType = file.type || this.getMimeType(file.name.split('.').pop() || '');
        if (!allowedTypes.includes(fileType)) {
          invalidFiles.push(file);
        }
      }

      if (invalidFiles.length > 0) {
        this.toast.error('Only PDF, Word, Excel, Text, and Image (JPG/PNG) files are allowed.', 'Invalid File Type');
        input.value = '';
        return;
      }

      // Convert valid files and push into DOCUMENT_ATTECHED_LIST
      this.convertFilesToBase64(filesArray);
      input.value = '';
    }
  }

  onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  Array.from(input.files).forEach(file => {
    const ext = file.name.split('.').pop().toUpperCase();

    const blocked = ['BAT','GIF','JAVA','XML','ZIP','RAR','JAR','EXE'];
    if (blocked.includes(ext)) {
      this.toast.warning('Invalid file type');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.toString().split(',')[1];

      this.uploadedDocument.push({
        DOCUMENT_FILENAME: file.name,
        DOCUMENT_SYSFILENAME: uuidv4() + '.' + ext,
        DOCUMENT_FILETYPE: '.' + ext,
        DOC_BASE64: base64,
        ISNEW: 1,
        ACTIVE: 1,
        UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
        UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID
      });

      this.updateNoDocsCount();
    };

    reader.readAsDataURL(file);
  });

  // reset input so same file can be reselected
  input.value = '';
}

  
}

