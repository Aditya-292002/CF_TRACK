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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('email', { static: false }) email: ElementRef;

  spinner: boolean = false;
  form: FormGroup
  maxDate: any ='';
   project_assign_emp_detail:any = [];
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private validationService: ValidationService) { } 

  company_list: Array<any> = [];
  currency_list: Array<any> = [];
  division_list: Array<any> = [];
  location_list: Array<any> = [];
  proj_sub_status_list: Array<any> = [];
  proj_status_list: Array<any> = [];
  proj_type_list: Array<any> = [];
  segment_list: Array<any> = [];
  project_list: Array<any> = [];
  technical_owner_list: Array<any> = [];
  all_location_list: Array<any> = [];
  all_proj_sub_status_list: Array<any> = [];
  all_emp_list: Array<any> = [];

  search_project: string = "";

  PO_DATE: string = "";
  PROJECT_DATE: any = this.sharedService.getDDMMMYYYY(new Date());
  VALID_UPTO: string = "";
  EXP_CLOSURE: string = "";
  selected_emp:any;
  ngOnInit() {
    this.sharedService.formName = "Project Information"
    this.form = this.formBuilder.group({
      data: [""],
      COMPANY_CODE: ["",Validators.required],
      PROJECT_TYPE: ["",Validators.required],
      PROJECT_DATE: [""],
      PROJ_CODE: [{ value: '', disabled: true }],
      PROJ_NAME: ["",Validators.required],
      REFPROJ_CODE: [""],
      REFPROJ_NAME: [{ value: '', disabled: true }],
      LOCATION_CODE: ["",Validators.required],
      CUST_CODE: ["",Validators.required],
      DIVISION_CODE: ["",Validators.required],
      // PO_NO: [""],
      // PO_DATE: [""],
      // PO_VALUE: [""],
      // PO_CURRENCY: ["INR"],
      // PO_EXCHANGE_RATE: ["1"],
      PROJ_MGR: ["",Validators.required],
      ACCOUNT_MGR: [""],
      SUPPORT_MANAGER:[""],
      PROJ_STATUS: ["",Validators.required],
      SUB_STATUS: ["",Validators.required],
      CUST_CONTACT: ["",Validators.required],
      PROJ_REMARKS: [""],
      BILLED_VALUE: [null],
      PROJ_SEGMENT: ["",Validators.required],
      EXP_CLOSURE:[""],
      // VALID_UPTO:[""],
      TECHNICAL_OWNER:[""]
    })

    this.form.controls['ACCOUNT_MGR'].disable();
    this.form.controls['ACCOUNT_MGR'].disable();
    this.form.controls['ACCOUNT_MGR'].disable();
    $('.selectpicker').selectpicker('refresh');
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

      this.form.get('PROJECT_DATE').setValue(this.sharedService.getTodayDate())
      this.PROJECT_DATE = this.sharedService.getTodayDate();
      this.GetProjCommonList();
      this.GetProjectList();
      this.GetCustomerList();
      this.getEmployee();

    }, 150);
  }

  GetProjCommonList() {
    let data = {
      LISTTYPE: ""
    }
    this.http.PostRequest(this.apiUrl.GetProjCommonList, data).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.currency_list = res.currency_list;
        this.division_list = res.division_list;
        this.location_list = res.location_list;
        this.proj_status_list = res.proj_status_list;
        this.proj_sub_status_list = res.proj_sub_status_list;
        this.proj_type_list = res.proj_type_list;
        this.segment_list = res.segment_list;
        this.all_emp_list = res.all_emp_list;

        this.all_location_list = res.location_list;
        this.all_proj_sub_status_list = res.proj_sub_status_list;

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
  GetProjectList() {
    let data = {
      LISTTYPE: "all"
    }
    this.http.PostRequest(this.apiUrl.GetProjectList, data).then(res => {
      if (res.flag) {
        this.project_list = res.project_list
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
  project_manager_list: Array<any> = [];
  Account_manager_list: Array<any> = [];
  all_Account_manager_list: Array<any> = [];
  getEmployee() {
    let data = {
      LISTTYPE: ""
    }

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(res => {
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
  customer_list: Array<any> = [];
  GetCustomerList() {
    let data = {
      LISTTYPE: "all"
    }
    this.http.PostRequest(this.apiUrl.GetCustomerList, data).then(res => {
      if (res.flag) {
        this.customer_list = res.customer_list;

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
  searchProject() {
    this.isUpdate = false;
    if (this.search_project != "" || this.search_project != undefined) {
      this.isUpdate = true;
      this.GetProjectDetail();
    } else {
      this.isUpdate = false;
      this.f_clearForm();
    }
  }
  project_payment_detail: Array<any> = [];
  GetProjectDetail() {
    let data = {
      PROJ_CODE: this.search_project
    }
    this.http.PostRequest(this.apiUrl.GetProjectDetail, data).then(res => {
      if (res.flag) {
        this.project_assign_emp_detail = res.project_payment_detail;
        this.f_fillData(res.project_detail)
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
  f_fillData(data: any = []) {
    console.log(data[0])
    this.form.get('COMPANY_CODE').setValue(data[0].COMPANY_CODE)
    this.form.get('PROJECT_TYPE').setValue(data[0].PROJECT_TYPE)
    this.form.get('PROJECT_DATE').setValue(this.sharedService.getFormatedDate(data[0].PROJECT_DATE))
    this.form.get('PROJ_CODE').setValue(data[0].PROJ_CODE)
    this.form.get('PROJ_NAME').setValue(data[0].PROJ_NAME)
    this.form.get('REFPROJ_CODE').setValue(data[0].REFPROJ_CODE)
    this.form.get('LOCATION_CODE').setValue(data[0].LOCATION_CODE)
    this.form.get('PROJ_SEGMENT').setValue(data[0].PROJ_SEGMENT)
    this.form.get('CUST_CODE').setValue(data[0].CUST_CODE)
    this.form.get('DIVISION_CODE').setValue(data[0].DIVISION_CODE)
    // this.form.get('PO_NO').setValue(data[0].PO_NO)
    // this.form.get('PO_DATE').setValue(data[0].PO_DATE)
    // this.form.get('PO_VALUE').setValue(data[0].PO_VALUE)
    // this.form.get('PO_CURRENCY').setValue(data[0].PO_CURRENCY)
    // this.form.get('PO_EXCHANGE_RATE').setValue(data[0].PO_EXCHANGE_RATE)
    this.form.get('PROJ_MGR').setValue(data[0].PROJ_MGR)
    this.form.get('ACCOUNT_MGR').setValue(data[0].ACCOUNT_MGR)
     this.form.get('SUPPORT_MANAGER').setValue(data[0].SUPPORT_MANAGER)
    this.form.get('PROJ_STATUS').setValue(data[0].PROJ_STATUS)
    this.form.get('SUB_STATUS').setValue(data[0].SUB_STATUS)
    this.form.get('CUST_CONTACT').setValue(data[0].CUST_CONTACT)
    this.form.get('PROJ_REMARKS').setValue(data[0].PROJ_REMARKS)
    this.form.get('BILLED_VALUE').setValue(data[0].BILLED_VALUE)
    // this.form.get('VALID_UPTO').setValue(data[0].VALID_UPTO)
    this.form.get('TECHNICAL_OWNER').setValue(data[0].TECHNICAL_OWNER)
    this.GetCustomerDetail();
    
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 120);

  }

  customer_contact_detail: Array<any> = [];
  GetCustomerDetail(){
    let data = {
      CUST_CODE: this.form.getRawValue().CUST_CODE
    }

    this.http.PostRequest(this.apiUrl.GetCustomerDetail, data).then(res => {
      if (res.flag) {
        this.customer_contact_detail = res.customer_contact_detail;
        
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

  onChangeProject(){
    this.form.get('REFPROJ_NAME').setValue('');
    for (let data of this.project_list) {
      if (data.PROJ_CODE == this.form.getRawValue().REFPROJ_CODE) {
        this.form.get('REFPROJ_NAME').setValue(data.PROJ_DESC);
      }
    }
  }
  filterLocation() {
    /**Filter location dropdown based on  */
    this.location_list = [];
    for (let data of this.all_location_list) {
      if (data.COMPANY_CODE == this.form.getRawValue().COMPANY_CODE) {
        this.location_list.push(data)
      }
    }

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }
  filterSubStatus() {
    /**Filter Sub Status dropdown based on Status */
    this.proj_sub_status_list = [];
    for (let data of this.all_proj_sub_status_list) {
      if (data.PROJECT_STATUS == this.form.getRawValue().PROJ_STATUS) {
        this.proj_sub_status_list.push(data)
      }
    }

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);

  }
  // filterAccountMgr() {
  //   /**Filter Account manager Dropdown and auto Set Based on Customer Selection and also set Segment */
  //   this.Account_manager_list = [];
  //   let acct_mgr_id = 0;
  //   let seg_id = 0;

  //   for(let data of this.customer_list){
  //     if(data.CUST_CODE == this.form.getRawValue().CUST_CODE){
  //       acct_mgr_id = data.ACCT_MANAGER
  //       seg_id = data.CUST_SEGMENT
  //     }
  //   }
    
  //   for (let data of this.all_Account_manager_list) {
  //     if (data.USERID == acct_mgr_id) {
  //       this.Account_manager_list.push(data)
  //       this.form.get('SUPPORT_MANAGER').setValue(data.USERID)
  //     }
  //   }
    
  //   for (let data of this.segment_list) {
  //     if (data.SEGMENT_CODE == seg_id) {
  //       this.form.get('PROJ_SEGMENT').setValue(data.SEGMENT_CODE)
  //     }
  //   }

  //   setTimeout(() => {
  //     $('.selectpicker').selectpicker('refresh').trigger('change');
  //   }, 100);

  // }

  
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
  isSubmited: boolean = false;
  saveFormData(para: string = '') {
    this.isSubmited = true;
    if (this.form.valid) {
      // if(this.form.getRawValue().PO_VALUE > 0 && this.form.getRawValue().PO_VALUE != undefined && this.form.getRawValue().PO_VALUE != null){
      //   let exp_val_total = 0;
      //   for(let data of this.project_payment_detail){
      //     if(data.EXPECTED_VALUE >0 && data.EXPECTED_VALUE != undefined && data.EXPECTED_VALUE != undefined){
      //       exp_val_total += parseFloat(data.EXPECTED_VALUE);
      //     }
      //   }

      //   if(exp_val_total > this.form.getRawValue().PO_VALUE){
      //     this.toast.warning("Total of Expected value is greater than PO Value");
      //     return;
      //   } else if(exp_val_total < this.form.getRawValue().PO_VALUE){
      //     this.toast.warning("Total of Expected value is less than PO Value");
      //     return;
      //   }
      // }
      let _formData = this.form.getRawValue();
      // if(_formData.PO_EXCHANGE_RATE == "" || _formData.PO_EXCHANGE_RATE == undefined)
      //   _formData.PO_EXCHANGE_RATE = null;

      //   _formData.PO_VALUE = _formData.PO_VALUE == ""? null:_formData.PO_VALUE

      let data = {
        USERID:this.sharedService.loginUser[0].USERID,
        PROJECT_CODE:this.form.get('PROJ_CODE').value,
        project_detail: _formData,
        project_payment_detail: this.project_payment_detail,
        project_assign_emp_detail:this.project_assign_emp_detail
      }
      console.log(data,'data');
      
       return
      this.http.PostRequest(this.apiUrl.SaveProjectDetail, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.GetProjectList();
          this.f_clearForm()
          this.spinner = false;
        } else {
          this.toast.warning(res.msg)
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      });
    } else {
      this.f_validateForm();
    }

  }
  // addRow(){
  //   if(this.form.getRawValue().PO_VALUE > 0 && this.form.getRawValue().PO_VALUE != undefined && this.form.getRawValue().PO_VALUE != null){
    
  //   this.project_payment_detail.push({
  //     PROJ_SRNO:0,
  //     MILESTONE_DESC:"",
  //     EXPECTED_DATE:"",
  //     EXPECTED_VALUE:"",
  //     BILL_VALUE:"",
  //     ACTIVE:1
  //   })
  // } else {
  //   this.toast.warning("Please enter PO value first")
  // }
  // }
  f_clearForm() {
    this.fileInput.nativeElement.value = "";
    this.isSubmited = false;
    this.form.reset();
    this.uploadedDocument = [];
    this.project_payment_detail=[];
    this.search_project = "";
    this.isUpdate= false;
    this.form.get('PO_EXCHANGE_RATE').setValue("1")
    this.form.get('PO_CURRENCY').setValue("INR")
    this.form.get('PROJECT_DATE').setValue(this.sharedService.getTodayDate())
    this.PROJECT_DATE = this.sharedService.getTodayDate();
    this.project_assign_emp_detail=[]
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  f_validateForm() { 
    if(this.form.controls["COMPANY_CODE"].invalid){
      this.toast.warning("Please select Company");
    } else if(this.form.controls["PROJECT_TYPE"].invalid){
      this.toast.warning("Please select Project Type");
    } else if(this.form.controls["PROJ_NAME"].invalid){
      this.toast.warning("Please enter Project Name");
    } else if(this.form.controls["LOCATION_CODE"].invalid){
      this.toast.warning("Please select Location");
    } else if(this.form.controls["CUST_CODE"].invalid){
      this.toast.warning("Please select Customer");
    } else if(this.form.controls["DIVISION_CODE"].invalid){
      this.toast.warning("Please select Division");
    } else if(this.form.controls["PROJ_SEGMENT"].invalid){
      this.toast.warning("Please select Segment");
    } 
    // else if(this.form.controls["PO_CURRENCY"].invalid){
    //   this.toast.warning("Please select Currency");
    // } 
    else if(this.form.controls["PROJ_MGR"].invalid){
      this.toast.warning("Please select Project Manager");
    } else if(this.form.controls["PROJ_STATUS"].invalid){
      this.toast.warning("Please select Status");
    } else if(this.form.controls["SUB_STATUS"].invalid){
      this.toast.warning("Please select Sub Status");
    } else if(this.form.controls["CUST_CONTACT"].invalid){
      this.toast.warning("Please select Customer Contact");
    } else if(this.form.controls["PROJECT_DATE"].invalid){
      this.toast.warning("Please enter Date");
    }  else if(this.form.controls["REFPROJ_CODE"].invalid){
      this.toast.warning("Please enter Ref Project Name");
    }  
    // else if(this.form.controls["PO_NO"].invalid){
    //   this.toast.warning("Please enter PO No");
    // } 
    // else if(this.form.controls["PO_DATE"].invalid){
    //   this.toast.warning("Please enter PO Date");
    // }
    //  else if(this.form.controls["PO_VALUE"].invalid){
    //   this.toast.warning("Please enter PO Value");
    // } 
    // else if(this.form.controls["ACCOUNT_MGR"].invalid){
    //   this.toast.warning("Please enter Account Manager");
    // }  
    else if(this.form.controls["PROJ_REMARKS"].invalid){
      this.toast.warning("Please enter Remarks");
    }  
    // else if(this.form.controls["VALID_UPTO"].invalid){
    //   this.toast.warning("Please enter Valid Upto");
    // }
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
onManagerChange(manager: any) {

  // Check if already added
  const exists = this.project_assign_emp_detail.some(
    emp => emp.EMP_CODE === manager
  );

  if (exists) {
    this.toast.error('This user already added');
    return;
  }

  // Find employee in manager list
  const user = this.Account_manager_list.find(
    emp => emp.EMP_CODE === manager
  );

  if (!user) {
    return;
  }

  const emp_details = {
    ACTIVE: true,
    EMP_CODE: user.EMP_CODE,
    FULL_NAME: user.USER_NAME
  };

  this.project_assign_emp_detail.push(emp_details);
  
}
remove(emp_no: string,name:string) {
  console.log('INSIDE REMOCVE ',name,emp_no);
  
  this.project_assign_emp_detail = this.project_assign_emp_detail.filter(
    emp => emp.EMP_CODE !== emp_no
  );
  
console.log('this.project_assign_emp_detail',this.project_assign_emp_detail);

  this.form.controls[name].reset();
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

  UpdateTaskEmployeeDetails() {
    console.log('project_assign_emp_detail',this.project_assign_emp_detail);
  }
}
 