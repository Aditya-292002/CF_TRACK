
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;

@Component({
  selector: 'app-opportunity-master',
  templateUrl: './opportunity-master.component.html',
  styleUrls: ['./opportunity-master.component.css']
})
export class OpportunityMasterComponent implements OnInit {

  spinner: boolean = false;
  form: FormGroup;

  maxDate: any ='';
  isSubmited: boolean = false;
  NoDocs: number = 0;
  SelectedFileName: string = "";
  uploadingFiles: Array<any> = []
  uploadedDocument: Array<any> = []

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('email', { static: false }) email: ElementRef;

  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private validationService: ValidationService) { }

    company_list: Array<any> = [];
    currency_list: Array<any> = [];
    division_list: Array<any> = [];
    opportunity_list: Array<any> = [];
    opportunity_activity_list: Array<any> = [];
    opportunity_status_list: Array<any> = [];
    opportunitytype_list: Array<any> = [];
    segment_list: Array<any> = [];
    project_list: Array<any> = [];
    probability_list: Array<any> = [];
    opportunity_substatus_list: Array<any> = [];
    customer_list: Array<any>= [];
    location_list: Array<any> = [];
    lead_list: Array<any> = [];
    customercontact_list: Array<any> = [];
    accountmgr_list: Array<any> = [];

    
    // search_opportunity: string = "";
  
    PROJECT_DATE: any = this.sharedService.getDDMMMYYYY(new Date());
    VALID_UPTO: string = "";
    EXPECTED_CLOSURE: string = "";

  ngOnInit() {
    this.sharedService.formName = "Opportunity Master"
    // this.search_opportunity = "";
    this.form = this.formBuilder.group({
      COMPANY_CODE: ["",Validators.required],
      OPPO_TYPE: ["",Validators.required],
      PROJECT_DATE: [""],
      OPPO_CODE: "",
      OPPO_NAME: ["",Validators.required],
      REFPROJ_CODE: ["",Validators.required],
      REFPROJ_NAME: [{ value: '', disabled: true }],
      LOCATION_CODE: ["",Validators.required],
      CUST_CODE: ["",Validators.required],
      LEAD_CODE: ["",Validators.required],
      DIVISION_CODE: ["",Validators.required],
      EST_VALUE: [""],
      OPPO_CURRENCY: ["INR",Validators.required],
      OPPO_EXCHANGE_RATE: ["1"],
      ACCOUNT_MGR: [""],
      OPPO_STATUS: ["",Validators.required],
      OPPO_SUB_STATUS: ["",Validators.required],
      CUST_CONTACT: ["",Validators.required],
      OPP_REMARKS: [""],
      OPPO_SEGMENT: ["",Validators.required],
      EXPECTED_CLOSURE:[""],
      PARTY_TYPE:["C"],
      PROBABILITY:["",Validators.required],
      LEADORCUST:""
    })
    // this.form.controls['ACCOUNT_MGR'].disable();
    // this.form.controls['ACCOUNT_MGR'].disable();
    // this.form.controls['ACCOUNT_MGR'].disable();

    // $('.selectpicker').selectpicker('refresh').trigger('change');
    $('.selectpicker').selectpicker('refresh');
    
  }

  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  // isUpdate: boolean = false;
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

      this.maxDate = this.sharedService.loginUser[0].TO_DATE;

      this.PROJECT_DATE = this.sharedService.getTodayDate();

      this.form.get('PROJECT_DATE').setValue(this.PROJECT_DATE)
      
      this.form.get('LEADORCUST').setValue(this.form.getRawValue().PARTY_TYPE)


      $('.selectpicker').selectpicker('refresh').trigger('change');
    
      this.GetOpportunityCommonList();
      this.GetOpportunityList();


    }, 150);
  }


  radioSelected0:boolean = true;
  radioSelected1:boolean = false;

  // SearchProject : boolean= false;

  // LEAD_CODE:string=""
  // CUST_CODE:string=""


  showContent(para: string = ''){
    if(para == 'C'){
      console.log(para)
      this.radioSelected0 = true;
      this.radioSelected1 = false;
      this.form.get('LEAD_CODE').setValue("");
      this.form.get('LEADORCUST').setValue(para)
    } 
     if(para == 'L'){
       console.log(para)
      this.radioSelected1 = true;
      this.radioSelected0 = false;
      this.form.get('CUST_CODE').setValue("");
      this.form.get('LEADORCUST').setValue(para)
    }
     
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }


  // filterLocation() {
  //   /**Filter location dropdown based on  */
  //   this.location_list = [];
  //   for (let data of this.all_location_list) {
  //     if (data.COMPANY_CODE == this.form.getRawValue().COMPANY_CODE) {
  //       this.location_list.push(data)
  //     }
  //   }
  // }

  GetOpportunityCommonList() {
    let data = {

      LISTTYPE:'All',
      USERID:this.sharedService.loginUser[0].USERID,
    
    }

    this.http.PostRequest(this.apiUrl.GetOpportunityCommonList, data).then(res => {
      if (res.flag) {
        this.customer_list = res.customer_list;
        this.company_list = res.company_list;
        // this.opportunity_list = res.opportunity_list;
        this.opportunity_activity_list = res.opportunity_activity_list;
        this.opportunity_status_list = res.opportunity_status_list;
        this.opportunity_substatus_list = res.opportunity_substatus_list;
        this.probability_list = res.probability_list;
        this.currency_list = res.currency_list;
        this.division_list = res.division_list;
        this.opportunitytype_list = res.opportunitytype_list;
        this.segment_list = res.segment_list;
        this.project_list = res.project_list;
        this.location_list = res.location_list;
        this.lead_list = res.lead_list;
        this.customercontact_list = res.customercontact_list;
        this.accountmgr_list=res.accountmgr_list;

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
  
  };

  SaveOpportunityMaster(para: string = '') {

    this.isSubmited = true;

      
    let _documents = [];
    for (let i = 0; i < this.uploadedDocument.length; i++) {
      // if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
      _documents.push({
        OPPO_CODE:"",
        DOC_SRNO: '0',
        DOCUMENT_NAME: this.uploadedDocument[i].DOCUMENT_NAME,
        DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
        DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
        // UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
       // UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
        ACTIVE: this.uploadedDocument[i].ACTIVE,
        ISNEW: this.uploadedDocument[i].ISNEW,
       // ISNEW: this.uploadedDocument[i].ISNEW
      })
       //}
    }
    // if(this.f_validateForm()){
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      CRM_OPPORTUNITY:this.form.value,
      OPPORTUNITY_DOCUMENT_LIST: _documents,
    }
    console.log(data)
    this.http.PostRequest(this.apiUrl.SaveOpportunityMaster, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.toast.success(res.msg)
        this.GetOpportunityList();
        this.f_clearForm()
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


    GetOpportunityList() {
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
    }
    this.http.PostRequest(this.apiUrl.GetOpportunityList, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.opportunity_list = res.Opportunity_List;
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }


  // searchOpportunity() {
  //   this.isUpdate = false;
  //   if (this.search_opportunity != "" || this.search_opportunity != undefined) {
  //     this.isUpdate = true;
  //     this.GetOpportunityMasterDetails();
  //   } else {
  //     this.isUpdate = false;
  //     this.f_clearForm();
  //   }
  //   setTimeout(() => {
  //     $('.selectpicker').selectpicker('refresh').trigger('change');
  //   }, 150);
  // }

  
  // GetOpportunityMasterDetails() {
  //   let data = {
  //     USERID:this.sharedService.loginUser[0].USERID,
  //     OPPO_CODE: this.search_opportunity,
  //   }
  //   this.http.PostRequest(this.apiUrl.GetOpportunityMasterDetails, data).then(res => {
  //     console.log(res)
  //     if (res.flag) {
  //       this.f_fillData(res.Opportunity_Master_Details)
  //       this.spinner = false;
  //     } else {
  //       this.spinner = false;
  //     }
  //   }, err => {
  //     this.spinner = false;
  //   });
  // }

  // f_fillData(data: Array<any> = []) {
  //   console.log(data[0])
  //   this.form.get('COMPANY_CODE').setValue(data[0].COMPANY_CODE)
  //   this.form.get('OPPO_TYPE').setValue(data[0].PROJECT_TYPE)
  //   this.form.get('PROJECT_DATE').setValue(this.sharedService.getFormatedDate(data[0].PROJECT_DATE))
  //   this.form.get('OPPO_CODE').setValue(data[0].OPPO_CODE)
  //   this.form.get('OPPO_NAME').setValue(data[0].OPPO_NAME)
  //   this.form.get('REFPROJ_CODE').setValue(data[0].REFPROJ_CODE)
  //   this.form.get('LOCATION_CODE').setValue(data[0].LOCATION_CODE)
  //   this.form.get('OPPO_SEGMENT').setValue(data[0].OPPO_SEGMENT)
  //   this.form.get('CUST_CODE').setValue(data[0].CUST_CODE)
  //   this.form.get('DIVISION_CODE').setValue(data[0].DIVISION_CODE)
  //   this.form.get('EST_VALUE').setValue(data[0].EST_VALUE)
  //   this.form.get('OPPO_CURRENCY').setValue(data[0].OPPO_CURRENCY)
  //   this.form.get('OPPO_EXCHANGE_RATE').setValue(data[0].OPPO_EXCHANGE_RATE)
  //   this.form.get('ACCOUNT_MGR').setValue(data[0].ACCOUNT_MGR)
  //   this.form.get('OPPO_STATUS').setValue(data[0].OPPO_STATUS)
  //   this.form.get('OPPO_SUB_STATUS').setValue(data[0].OPPO_SUB_STATUS)
  //   this.form.get('CUST_CONTACT').setValue(data[0].CUST_CONTACT)
  //   this.form.get('OPP_REMARKS').setValue(data[0].OPPO_REMARKS)
  //   this.form.get('LEAD_CODE').setValue(data[0].LEAD_CODE)
  //   this.form.get('PROBABILITY').setValue(data[0].PROBABILITY)
  //   this.form.get('EXPECTED_CLOSURE').setValue(this.sharedService.getFormatedDate(data[0].EXPECTED_CLOSURE))
  //   this.form.get('PARTY_TYPE').setValue(data[0].LEADORCUST)
  //   // this.GetCustomerDetail();
    
  //   setTimeout(() => {
  //     $('.selectpicker').selectpicker('refresh').trigger('change');
  //   }, 120);

  // }


  // onChangeProject(){
  //   this.form.get('REFPROJ_NAME').setValue('');
  //   for (let data of this.project_list) {
  //     if (data.PROJ_CODE == this.form.getRawValue().REFPROJ_CODE) {
  //       this.form.get('REFPROJ_NAME').setValue(data.PROJ_DESC);
  //     }
  //   }
  // }

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
            DOCUMENT_NAME: "",
            DOC_SRNO: "",
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_FILETYPE: extension[extension.length - 1].toUpperCase(),
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            b64: b64

          }
        )
        this.uploadDoc();
      }
      // this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
    }
  }

  uploadDoc() {
    for (let i = 0; i < this.uploadingFiles.length; i++) {
      this.uploadedDocument.push(this.uploadingFiles[i])
    }

    this.fileInput.nativeElement.value = "";
    this.uploadingFiles = []
    this.SelectedFileName = "";
    this.NoDocs = 0;
    this.uploadedDocument.forEach(element => {
      if(element.ACTIVE != 0){
        this.NoDocs += 1
      }
    });
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

  f_downloadDocument(file: any) {

    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetFile, { DOCUMENT_SYSFILENAME: file.DOCUMENT_SYSFILENAME }).then(res => {

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
  }


  f_clearForm() {
    this.fileInput.nativeElement.value = "";
    this.isSubmited = false;
    this.form.reset();
    // this.search_opportunity = "";
    // this.isUpdate= false;
    this.form.get('OPPO_EXCHANGE_RATE').setValue("1")
    this.form.get('OPPO_CURRENCY').setValue("INR")
    this.form.get('PARTY_TYPE').setValue("C");
    this.form.get('PROJECT_DATE').setValue(this.sharedService.getTodayDate())
    this.PROJECT_DATE = this.sharedService.getTodayDate();
    this.uploadedDocument = [];
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 150);
  }

  f_validateForm() { 
    if(this.form.controls["COMPANY_CODE"].invalid){
      this.toast.warning("Please select Company");
      return false;
    } else if(this.form.controls["OPPO_TYPE"].invalid){
      this.toast.warning("Please select Project Type");
      return false;
      
    } else if(this.form.controls["OPPO_NAME"].invalid){
      this.toast.warning("Please enter Project Name");
      return false;

    } else if(this.form.controls["LOCATION_CODE"].invalid){
      this.toast.warning("Please select Location");
      return false;

    } else if(this.form.controls["CUST_CODE"].invalid){
      this.toast.warning("Please select Customer");
      return false;

    } else if(this.form.controls["DIVISION_CODE"].invalid){
      this.toast.warning("Please select Division");
      return false;

    } else if(this.form.controls["OPPO_SEGMENT"].invalid){
      this.toast.warning("Please select Segment");
      return false;

    } else if(this.form.controls["OPPO_CURRENCY"].invalid){
      this.toast.warning("Please select Currency");
      return false;

    } else if(this.form.controls["OPPO_STATUS"].invalid){
      this.toast.warning("Please select Status");
      return false;

    } else if(this.form.controls["OPPO_SUB_STATUS"].invalid){
      this.toast.warning("Please select Sub Status");
      return false;

    } else if(this.form.controls["PROBABILITY"].invalid){
      this.toast.warning("Please select Probability");
      return false;

    } else if(this.form.controls["CUST_CONTACT"].invalid){
      this.toast.warning("Please select Customer Contact");
      return false;

    } else if(this.form.controls["PROJECT_DATE"].invalid){
      this.toast.warning("Please enter Date");
      return false;

    }  else if(this.form.controls["REFPROJ_CODE"].invalid){
      this.toast.warning("Please enter Ref Project Name");
      return false;

    } else if(this.form.controls["ACCOUNT_MGR"].invalid){
      this.toast.warning("Please enter Account Manager");
      return false;

    } else if(this.form.controls["LEAD_CODE"].invalid){
      this.toast.warning("Please enter Lead Name");
      return false;
    }
    return true;
  }

}
