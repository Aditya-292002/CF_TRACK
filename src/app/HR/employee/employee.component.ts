import { Component, ElementRef, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { ValidationService } from 'src/app/services/validation.service';
import { MatCardLgImage } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('proInput', { static: false }) proInput: ElementRef;
  @ViewChild('per_email', { static: false }) per_email: ElementRef;
  @ViewChild('off_email', { static: false }) off_email: ElementRef;
  @ViewChild('emp_no', { static: false }) emp_no: ElementRef;

  bg_color: number = 0;
  spinner: boolean = false;
  min_joining_date = new Date(new Date().getFullYear(), 0, 1);
  form: FormGroup

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }


  empstatus_list: Array<any> = [];
  bloodgroup_list: Array<any> = [];
  location_list: Array<any> = [];
  company_list: Array<any> = [];
  emp_number_detail: Array<any> = [];
  division_list: Array<any> = [];
  reporting_to_list: Array<any> = [];
  marital_list: Array<any> = [];
  dept_list: Array<any> = [];
  vendor_list: Array<any> = [];

  DOB: string = ""
  DOS: string = ""
  DOR: string = ""
  DOJ: string = ""
  DESIGNATION_WEF: string = ""
  max_dob: any = "";
  EXP_DATE: string = '';

  ngOnInit() {
    this.sharedService.formName = "Employee Information"
    this.form = this.formBuilder.group({
      USERID: [""],
      LOGIN_ID: [""],
      EMP_NO: ["", Validators.required],
      FIRST_NAME: ["", Validators.required],
      MIDDLE_NAME: [""],
      LAST_NAME: ["", Validators.required],
      FULL_NAME: [""],
      EMPLOYMENT_TYPE: ["", Validators.required],
      DOB: ["", Validators.required],
      EMP_SEX: [""],
      EMP_MARITAL: ["", Validators.required],
      EMP_SPOUSE: [""],
      EMP_FATHER: [""],
      EMP_MOTHER: [""],

      EMP_EMAIL: ["", Validators.required],
      // EMP_MOB: ["", [Validators.required,Validators.maxLength(10),
      // Validators.minLength(10),
      // Validators.pattern(/^[0-9]*$/)]],
      EMP_PEMAIL: [""],
      // EMP_PMOB: ["",[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      EMP_MOB:[""],
      EMP_PMOB:[""],
      EMP_EMERGENCYCALL: [""],
      EMP_EMERGENCYNO: [""],
      EMP_ADDRESS1: [""],
      EMP_ADDRESS2: [""],
      DOR: [""],
      RELIGION: [""],
      CASTE: [""],
      NATIONALITY: [""],
      BLOOD_GROUP: [""],
      PROFILE_SYSFILENAME:[""],

      COMPANY_CODE: [""],
      LOCATION_CODE: [""],
      REPORTING_TO: [""],
      DESIGNATION: ["",Validators.required],
      DESIGNATION_WEF: [""],
      DIVISION_CODE: [""],
      BANK_IFSC: [""],
      BANK_ACCNO: [""],
      DOJ: ["",Validators.required],
      DOS: [""],
      EMP_STATUS: [""],
      DEPT_CODE: [""],
      VENDOR_NO: [""],
      EXPIRY_DATE:[""]
    });
    this.form.controls['EMP_NO'].disable();
    this.form.controls['EMP_EMAIL'].disable();
    $('.selectpicker').selectpicker('refresh');

    let today = new Date();
    today.setFullYear(today.getFullYear()-18);
    this.max_dob = today;
  }
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
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

      this.getEmpCommonList();
      this.getAllEmployee();
      this.getEmployeDetail();
      $(function () {
        $('[data-toggle="popover"]').popover()
      })
    }, 150);
  }

  onbgcolorchange(para: number) {
    this.bg_color = para;
  }

  getEmpCommonList() {

    this.http.PostRequest(this.apiUrl.GetEmpCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.location_list = res.location_list;
        this.bloodgroup_list = res.bloodgroup_list;
        this.empstatus_list = res.empstatus_list;
        this.division_list = res.division_list;
        this.marital_list = res.marital_list;
        this.dept_list = res.dept_list;
        this.vendor_list = res.vendor_list;
        
        
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

  all_employee_list: Array<any> = [];
  getAllEmployee() {
    let data = {
      LISTTYPE: "all"
    }

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(res => {
      if (res.flag) {
        this.all_employee_list = res.employee_list;
        this.reporting_to_list = res.employee_list;
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

  f_addNew(para: number) {
    if (para) {
      this.emp_number_detail.forEach(element => {
        element.EXPIRY_DATE = '';
        element.REF_NO = '';
      })
      this.isNewAdd=true;
      this.form.reset();
      this.uploadedDocument = [];
      this.profile_img = '';
      this.form.controls['EMP_NO'].enable();
      this.form.controls['EMP_EMAIL'].enable();
      this.form.get('USERID').setValue(0);
      this.form.get('EMP_SEX').setValue('M');
      this.form.get('EMPLOYMENT_TYPE').setValue('P');
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
    } else {
      this.isNewAdd=false;
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS;
      }
      
    this.form.controls['EMP_NO'].disable();
    this.form.controls['EMP_EMAIL'].disable();
      this.getEmployeDetail();
    }
  }
  isDOR: boolean = true;
  isDOS: boolean = true;
  statusChange() {
    if (this.form.value.EMP_STATUS == 'R') {
      this.isDOR = false;
      this.isDOS = true;
    } else if (this.form.value.EMP_STATUS == 'S') {
      this.isDOS = false;
      this.isDOR = true;
    } else {
      this.isDOR = true;
      this.isDOS = true;
    }
  }

  search_user: any = ""
  f_searchUserData() {
    this.isNewAdd = false;
    if (this.search_user != "") {
      for (let i = 0; i < this.all_employee_list.length; i++) {
        if (this.search_user == this.all_employee_list[i].USERID) {
          this.getEmployeDetail({ EMP_USERID: this.all_employee_list[i].USERID })
        }
      }
    } else {
      this.getEmployeDetail()
    }
  }
  employee_detail: Array<any> = [];
  getEmployeDetail(data: any = { EMP_USERID: this.sharedService.loginUser[0].USERID }) {

    this.http.PostRequest(this.apiUrl.GetEmployeeDetail, data).then(res => {
      if (res.flag) {
        this.employee_detail = res.employee_detail;
        this.emp_number_detail = res.emp_number_detail;
        this.uploadedDocument = res.emp_document_detail
        this.profile_img = res.b64;
        this.NoDocs = this.uploadedDocument.length;
        this.emp_number_detail.forEach(element => {
          element.EXPIRY_DATE = element.EXPIRY_DATE == null? '': element.EXPIRY_DATE;
        });

        this.f_fillFormData();
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_fillFormData() {
    this.spinner = true;
    this.form.get("USERID").setValue(this.employee_detail[0].USERID)
    this.form.get("LOGIN_ID").setValue(this.employee_detail[0].LOGIN_ID)
    this.form.get("EMP_NO").setValue(this.employee_detail[0].EMP_NO)
    this.form.get("COMPANY_CODE").setValue(this.employee_detail[0].COMPANY_CODE)
    this.form.get("LOCATION_CODE").setValue(this.employee_detail[0].LOCATION_CODE)
    this.form.get("FIRST_NAME").setValue(this.employee_detail[0].FIRST_NAME)
    this.form.get("MIDDLE_NAME").setValue(this.employee_detail[0].MIDDLE_NAME)
    this.form.get("LAST_NAME").setValue(this.employee_detail[0].LAST_NAME)
    this.form.get("FULL_NAME").setValue(this.employee_detail[0].FULL_NAME)
    this.form.get("EMPLOYMENT_TYPE").setValue(this.employee_detail[0].EMPLOYMENT_TYPE)
    this.form.get("DOB").setValue(this.employee_detail[0].DOB == null?'':this.employee_detail[0].DOB)
    this.form.get("EMP_SEX").setValue(this.employee_detail[0].EMP_SEX)
    this.form.get("EMP_MARITAL").setValue(this.employee_detail[0].EMP_MARITAL)
    this.form.get("EMP_SPOUSE").setValue(this.employee_detail[0].EMP_SPOUSE)
    this.form.get("EMP_FATHER").setValue(this.employee_detail[0].EMP_FATHER)
    this.form.get("EMP_MOTHER").setValue(this.employee_detail[0].EMP_MOTHER)
    this.form.get("EMP_EMAIL").setValue(this.employee_detail[0].EMP_EMAIL)
    this.form.get("EMP_MOB").setValue(this.employee_detail[0].EMP_MOB)
    this.form.get("EMP_PEMAIL").setValue(this.employee_detail[0].EMP_PEMAIL)
    this.form.get("EMP_PMOB").setValue(this.employee_detail[0].EMP_PMOB)
    this.form.get("EMP_EMERGENCYCALL").setValue(this.employee_detail[0].EMP_EMERGENCYCALL)
    this.form.get("EMP_EMERGENCYNO").setValue(this.employee_detail[0].EMP_EMERGENCYNO)
    this.form.get("EMP_ADDRESS1").setValue(this.employee_detail[0].EMP_ADDRESS1)
    this.form.get("EMP_ADDRESS2").setValue(this.employee_detail[0].EMP_ADDRESS2)
    this.form.get("DOJ").setValue(this.employee_detail[0].DOJ == null?'':this.employee_detail[0].DOJ)
    this.form.get("DOR").setValue(this.employee_detail[0].DOR == null?'':this.employee_detail[0].DOR)
    this.form.get("DOS").setValue(this.employee_detail[0].DOS == null?'':this.employee_detail[0].DOS)
    this.form.get("EMP_STATUS").setValue(this.employee_detail[0].EMP_STATUS)
    this.form.get("RELIGION").setValue(this.employee_detail[0].RELIGION)
    this.form.get("CASTE").setValue(this.employee_detail[0].CASTE)
    this.form.get("NATIONALITY").setValue(this.employee_detail[0].NATIONALITY)
    this.form.get("BLOOD_GROUP").setValue(this.employee_detail[0].BLOOD_GROUP)
    this.form.get("REPORTING_TO").setValue(this.employee_detail[0].REPORTING_TO)
    this.form.get("DESIGNATION").setValue(this.employee_detail[0].DESIGNATION)
    this.form.get("DESIGNATION_WEF").setValue(this.employee_detail[0].DESIGNATION_WEF)
    this.form.get("DIVISION_CODE").setValue(this.employee_detail[0].DIVISION_CODE)
    this.form.get("BANK_IFSC").setValue(this.employee_detail[0].BANK_IFSC)
    this.form.get("BANK_ACCNO").setValue(this.employee_detail[0].BANK_ACCNO)
    this.form.get("PROFILE_SYSFILENAME").setValue(this.employee_detail[0].PROFILE_SYSFILENAME)
    this.form.get("DEPT_CODE").setValue(this.employee_detail[0].DEPT_CODE)
    this.form.get("VENDOR_NO").setValue(this.employee_detail[0].VENDOR_NO)
    this.form.get("EXPIRY_DATE").setValue(this.employee_detail[0].EXPIRY_DATE == null?'':this.employee_detail[0].EXPIRY_DATE)
    
      
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
      this.spinner = false;
    }, 100);
  }
  isExpDisable: boolean = true;
  onChangeType(para: string = ''){

    if(para == 'N'){
      this.isExpDisable = false;
    } else {
      this.EXP_DATE = "";
      this.form.get("EXPIRY_DATE").setValue('')
      this.isExpDisable = true;
    }
  }
  selected_profile: string = ""
  profile_doc: Array<any> = [];
  profile_img: string = "";
  pro_uploadingFiles: Array<any> = [];
  selectProfile(event: any) {
    let b64: string = "";
    let extension: string[] = [];

    if(event.target.files.length) {
      extension = event.target.files[0].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase()

      if(_ext !== 'JPEG' && _ext !== 'JPG' && _ext !== 'PNG'){
        this.toast.warning("Please select valid image (JPEG/ JPG/ PNG)")
        return;
      } 

      let reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        let img = new Image();
        img.src = reader.result.toString();
        
        //Validate the File Height and Width.
      img.onload = () => {
        var width = img.naturalWidth,
            height = img.naturalHeight;
            if(width > 140 || height > 170){
              
              this.toast.warning("Please upload image 140px * 170px size");
              this.pro_uploadingFiles = []
              this.selected_profile = "";
              this.proInput.nativeElement.value = "";
              return;
            }
          }
        
        this.pro_uploadingFiles = []
        this.pro_uploadingFiles.push(
          {
            DOCUMENT_FILENAME: event.target.files[0].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_FILETYPE: extension[extension.length - 1].toUpperCase(),
            ISNEW: 1,
            b64: b64,
          }
        )
        this.uploadPro();
      }
      // this.selected_profile = event.target.files[0].name;
     
    }
  }
  uploadPro() {
    for (let i = 0; i < this.pro_uploadingFiles.length; i++) {
      this.profile_doc = []
        this.profile_doc.push(this.pro_uploadingFiles[i])
    }
    for (let i = 0; i < this.profile_doc.length; i++) {
      if (this.profile_doc[i].ISNEW == 1) {
        this.profile_img = this.profile_doc[i].b64;        
        this.form.get("PROFILE_SYSFILENAME").setValue(this.profile_doc[i].DOCUMENT_SYSFILENAME)
      }
    }
    
    this.pro_uploadingFiles = []
    this.selected_profile = "";
    this.proInput.nativeElement.value = "";
  }

  SelectedFileName: string = "";
  uploadingFiles: Array<any> = []
  uploadedDocument: Array<any> = []
  NoDocs: number = 0;
  selectDocument(event: any) {
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];

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
            DOCUMENT_NAME: "",
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
      this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
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

  validateEmail(para: number) {
    if (para == 1) {
      if (!this.validationService.emailValidator(this.form.getRawValue().EMP_EMAIL)) {
        this.form.get('EMP_EMAIL').setValue('')
        // this.off_email.nativeElement.focus()
      } else {
        this.f_Check_EmpNo_Email('EMAIL',1);
      }
    } else if (para == 2) {
      if (!this.validationService.emailValidator(this.form.getRawValue().EMP_PEMAIL)) {
        this.form.get('EMP_PEMAIL').setValue('')
        // this.per_email.nativeElement.focus()
      } else {
        this.f_Check_EmpNo_Email('EMAIL',2);
      }
    }
  }
  f_Check_EmpNo_Email(para: string = "",seq:number = 0){
    if(para == "")
      return;

    let data ={
        EMP_NO:para === 'EMPNO'?this.form.getRawValue().EMP_NO:"",
        EMAIL: para === 'EMAIL'?this.form.getRawValue().EMP_EMAIL:""
    }
    this.http.PostRequest(this.apiUrl.Check_EmpNo_Email, data).then(res => {
      if (res.flag) {        
        this.spinner = false;
      } else {
        this.spinner = false;        
        this.toast.warning(res.msg)
        if(para === 'EMPNO'){
          this.form.get('EMP_NO').setValue('')
        this.emp_no.nativeElement.focus()
        }else if(para === 'EMAIL'){
          if(seq==1){
            this.form.get('EMP_EMAIL').setValue('')
            this.off_email.nativeElement.focus()
          } if(seq==2){
            this.form.get('EMP_EMAIL').setValue('')
            this.per_email.nativeElement.focus()
          }
        }
      }
    }, err => {
      this.spinner = false;
    });

  }
  isSubmited: boolean = false;
  f_saveFormData(action: string = "") {
    this.isSubmited = true;
    let data = {}
    if (this.f_validateFormData()) {
      
      if(!this.validationService.ageValidator(this.form.getRawValue().DOB)){
        return;
      }

      let formData = this.form.getRawValue()

      if(formData.EMP_MARITAL == "M"){
        if(formData.EMP_SPOUSE == "" || formData.EMP_SPOUSE == null || formData.EMP_SPOUSE == undefined){
          this.toast.warning("Please enter spouse name");
          return;
        }
      }

      if((formData.EMP_FATHER == null || formData.EMP_FATHER == undefined || formData.EMP_FATHER == "") && (formData.EMP_MOTHER == null || formData.EMP_MOTHER == undefined || formData.EMP_MOTHER == "")){
        this.toast.warning("please enter Father or Mother name")
        return;
      }
      if(formData.EMPLOYMENT_TYPE == "N"){
        if(formData.VENDOR_NO == "" || formData.VENDOR_NO == undefined || formData.VENDOR_NO == null){
          this.toast.warning("Please select vendor name");
          return;
        }
        if(formData.EXPIRY_DATE == "" || formData.EXPIRY_DATE == null || formData.EXPIRY_DATE == undefined){
          this.toast.warning('Please select Expiry date of contract')
          return;
        }
      } 
      this.spinner = true
      let _documents = [];
      for (let i = 0; i < this.uploadedDocument.length; i++) {
        if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
          _documents.push({
            DOCUMENT_NAME: this.uploadedDocument[i].DOCUMENT_NAME,
            DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
            DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
            UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
            UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
            ACTIVE: this.uploadedDocument[i].ACTIVE,
            ISNEW: this.uploadedDocument[i].ISNEW
          })
        }
      }

      formData.DOJ = formData.DOJ == ''?null:formData.DOJ
      formData.DOR = formData.DOR == ''?null:formData.DOR
      formData.DESIGNATION_WEF = formData.DESIGNATION_WEF == ''?null:formData.DESIGNATION_WEF
      formData.DOS = formData.DOSD == ''?null:formData.DOS
      formData.EXPIRY_DATE = formData.EXPIRY_DATE == ""?null:formData.EXPIRY_DATE
      this.emp_number_detail.forEach(element => {
        element.EXPIRY_DATE = element.EXPIRY_DATE == ""?null:element.EXPIRY_DATE
      });
      data = {
        USERID: this.sharedService.loginUser[0].USERID,
        employee_detail: [formData],
        emp_document_detail: _documents,
        emp_number_detail: this.emp_number_detail,
        APP_URL: window.location.origin
      }

      this.http.PostRequest(this.apiUrl.SaveEmployeeDetail, data).then(res => {
        if (res.flag) {
          this.getEmployeDetail()
          this.getAllEmployee();
          this.search_user = "";
          $("#search").val('').selectpicker('refresh').trigger('change');          
          this.toast.success(res.msg)
          this.f_uploadFiles(this.uploadedDocument)
          this.spinner = false;
        } else {
          this.spinner = false;
          this.toast.warning(res.msg)
        }
      }, err => {
        this.spinner = false;
      });
    } else {
      // this.f_validateFormData();
      this.spinner=false;
    }
  }

  f_uploadFiles(fileArray: Array<any> = []) {
    let _documents: Array<any> = [];
    for (let i = 0; i < fileArray.length; i++) {
      if (fileArray[i].ISNEW == 1) {
        _documents.push({
          DOCUMENT_FILENAME: fileArray[i].DOCUMENT_FILENAME,
          DOCUMENT_SYSFILENAME: fileArray[i].DOCUMENT_SYSFILENAME,
          ACTIVE: fileArray[i].ACTIVE,
          ISNEW: fileArray[i].ISNEW,
          b64: fileArray[i].b64
        })
      }
    }
    let _profile: Array<any> = [];

    for (let i = 0; i < this.profile_doc.length; i++) {
      if (this.profile_doc[i].ISNEW == 1) {
        _profile.push(this.profile_doc[i])
      }
    }
    let isFileSave: boolean = false
    isFileSave = _documents.length > 0 ? true : _profile.length > 0 ? true : false;
    
    if (isFileSave)
      this.http.uploadFiles(this.apiUrl.SaveFile, { filedata: _documents, profiledata: _profile });
    
    this.f_addNew(0)
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

  f_validateFormData() {
    if (this.form.controls['EMP_NO'].invalid) {
      this.toast.warning('Please enter Employee no in Personal Information');
      return false;
    } else if (this.form.controls['FIRST_NAME'].invalid) {
      this.toast.warning('Please enter first name in Personal Information');
      return false;
    } else if (this.form.controls['LAST_NAME'].invalid) {
      this.toast.warning('Please enter last name in Personal Information');
      return false;
    } else if (this.form.controls['DOB'].invalid) {
      this.toast.warning('Please enter Date of Birth in Personal Information');
      return false;
    }else if (this.form.controls['EMP_MARITAL'].invalid) {
      this.toast.warning('Please select martial status in Personal Information');
      return false;
    }else if((this.form.value.EMP_FATHER == null || this.form.value.EMP_FATHER == undefined || this.form.value.EMP_FATHER == "") 
    && (this.form.value.EMP_MOTHER == null || this.form.value.EMP_MOTHER == undefined || this.form.value.EMP_MOTHER == "")){
      this.toast.warning("please enter Father or Mother name in Personal Information")
      return false;
    } else if(this.form.value.EMP_MARITAL == "M"){
      if(this.form.value.EMP_SPOUSE == "" || this.form.value.EMP_SPOUSE == null || this.form.value.EMP_SPOUSE == undefined){
        this.toast.warning("Please enter spouse name in Personal Information");
        return false;
      }
    }   else if (this.form.controls['EMP_EMAIL'].invalid) {
      this.toast.warning('Please enter official email in Personal Information');
      return false;
    } else if (this.form.controls['EMP_MOB'].invalid) {
      this.toast.warning('Please enter official mobile number in Personal Information');
      return false;
    } else if (this.form.controls['EMP_PMOB'].invalid) {
      this.toast.warning('Please enter personal mobile number in Personal Information');
      return false;
    }
    // company information validation message
    else if (this.form.controls['DOJ'].invalid) {
      this.toast.warning('Please enter date of joining in Company Information');
      return false;
    } else if (this.form.controls['DESIGNATION'].invalid) {
      this.toast.warning('Please enter designation in Company Information');
      return false;
    } else if(this.form.value.EMPLOYMENT_TYPE == "N"){
      if(this.form.value.VENDOR_NO == "" || this.form.value.VENDOR_NO == undefined || this.form.value.VENDOR_NO == null){
        this.toast.warning("Please select vendor name in Company Information");
        return false;
      } else if(this.form.value.EXPIRY_DATE == "" || this.form.value.EXPIRY_DATE == null || this.form.value.EXPIRY_DATE == undefined){
        this.toast.warning('Please select Expiry date of contract in Company Information')
        return false;
      }
    }
    return true;
  }

  f_clearForm() {    
    this.NoDocs= 0
    this.proInput.nativeElement.value = "";
    this.fileInput.nativeElement.value = "";
    this.DOB = ""
    this.DOS = ""
    this.DOR = ""
    this.DOJ = ""
    this.form.reset();
    this.uploadedDocument = [];
    this.profile_img = '';
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }
}
