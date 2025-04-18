import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

declare var $: any;
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild("Task_Summery_PopUp", { static: false }) Task_Summery_PopUp: ElementRef;
  @ViewChild("Task_Details_PopUp", { static: false }) Task_Details_PopUp: ElementRef;
  @ViewChild("emp", { static: false }) emp: ElementRef;

  spinner: boolean = false;
  form: FormGroup;
  PLANNED_START_DATE: any = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  COMPLETION_DATE: any = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  project_list: Array<any> = [];
  task_status_list: Array<any> = [];
  task_type_list: Array<any> = [];
  task_list: Array<any> = [];
  all_emp_list: Array<any> = [];
  search_task_id: string = "";
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  isAdd: boolean = false;
  NO_RIGHTS: boolean = false;
  isNewAdd: boolean = false;
  buisness_owner_list: Array<any> = [];
  technical_owner_list: Array<any> = [];
  project_assign_emp_detail: Array<any> = [];
  _technical_owner_list: Array<any> = [];
  emp_list: Array<any> = [];
  SelectedFileName: string = "";
  uploadingFiles: Array<any> = [];
  uploadedDocument: Array<any> = [];
  NoDocs: number = 0;
  selected_emp: any = "";
  last_row: number = 0;
  isSubmited: boolean = false;
  textBoxDisabled: boolean  = true;
  TASKID:any;
  maxdate = new Date();
  min_date = new Date(new Date().getFullYear(), 0, 1);
  IS_VIEW:any = 0;
  IS_ADD:any;
  EMPLOYEE_TASK_SUMMERY:any = [];
  EMPLOYEE_TASK_DETAILS:any = [];

  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private validationService: ValidationService,
    private router:Router,
    private datepipe:DatePipe
  ) {}

  ngOnInit() {
    // this.sharedService.formName = "Add Task";
    this.form = this.formBuilder.group({
      TASKID: [0],
      COMPANY: [{ value: "", disabled: true }],
      CUSTOMER: [{ value: "", disabled: true }],
      BRM_POINT: [0],
      BUSINESS_OWNER: [""],
      CLIENT_OWNER: [""],
      CLIENT_REFNO: [""],
      PROJ_CODE: ["", Validators.required],
      TASK_DESC: ["", Validators.required],
      ESTIMATED_HOURS: ["", Validators.required],
      TASK_DETAILS: [""],
      TASK_NO: ["", Validators.required],
      TASK_STATUS: [""],
      TASK_TYPE: ["", Validators.required],
      TECHNICAL_OWNER: [""],
      PRIORITY: ["N"],
      PLANNED_START_DATE: [""],
      COMPLETION_DATE: [""],
      CHARGEABLE: ["0", Validators.required],
      QUOTED_MANDAYS: ["", Validators.required],
    });
      $(".selectpicker").selectpicker("refresh").trigger("change");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.TASKID = localStorage.getItem('TASKID');
      this.IS_VIEW = localStorage.getItem('IS_VIEW');
      this.IS_ADD = localStorage.getItem('IS_ADD');
      this.form.get("PROJ_CODE").setValue(localStorage.getItem('PROJ_CODE'));
      this.search_task_id = this.TASKID;
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS;
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS;
      }

      this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS ? false : true;
      this.GetTaskCommonList();
      this.GetTaskList();
      // this.getEmployee();
      if (this.TASKID != null) {
        this.searchTask(1);
      }
      // if (this.sharedService.commonData.length > 0) {
      //   this.search_task_id = this.sharedService.commonData[0].TASKID;
      //   this.searchTask();
      // }
      // this.form
      //   .get("PLANNED_START_DATE")
      //   .setValue(this.sharedService.getTodayDate());
      // this.PLANNED_START_DATE = this.sharedService.getTodayDate();
      // this.form
      //   .get("COMPLETION_DATE")
      //   .setValue(this.sharedService.getTodayDate());
      // this.COMPLETION_DATE = this.sharedService.getTodayDate();
      this.form.get("QUOTED_MANDAYS").setValue(0);
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 150);
  }

  GetTaskCommonList() {
    this.http.PostRequest(this.apiUrl.GetTaskCommonList, {}).then(
      (res) => {
        if (res.flag) {
          this.project_list = res.project_list;
          this.task_status_list = res.task_status_list;
          this.task_type_list = res.task_type_list;
          this.all_emp_list = res.employee_list;
          this.buisness_owner_list = res.employee_list;
          this.technical_owner_list = res.employee_list;
          this.setCompany();
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  GetTaskList() {
    let data = {
      LISTTYPE: "all",
    };
    this.http.PostRequest(this.apiUrl.GetTaskList, data).then(
      (res) => {
        if (res.flag) {
          this.task_list = res.task_list;
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  // getEmployee() {
  //   let data = {
  //     LISTTYPE: "",
  //   };

  //   this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(
  //     (res) => {
  //       if (res.flag) {
  //         this.all_emp_list = res.employee_list;
  //         this.buisness_owner_list = res.employee_list;
  //         this.technical_owner_list = res.employee_list;
  //         this.filterEmployee();
  //         this.spinner = false;
  //       } else {
  //         this.spinner = false;
  //       }
  //     },
  //     (err) => {
  //       this.spinner = false;
  //     }
  //   );
  // }

  searchTask(val:any) {
    if (this.search_task_id != "" || this.search_task_id != undefined) {
      if(val == 1){
        this.isUpdate = true;
      }
      this.GetTaskDetail();
    } else {
      this.isUpdate = false;
      this.f_clearForm();
    }
  }

  GetTaskDetail() {
    let data = {
      TASKID: this.search_task_id,
    };
    this.http.PostRequest(this.apiUrl.GetTaskDetail, data).then(
      (res) => {
        if (res.flag) {
          this.project_assign_emp_detail = res.project_assign_emp_detail;
          this.f_fillFormData(res.task_detail);
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  GetTaskDetailSummery(val:any){
    let data = {
      TASKID: this.search_task_id,
    };
    this.http.PostRequest(this.apiUrl.GetTaskDetailSummery, data).then(
      (res) => {
        if (res.flag) {
          this.EMPLOYEE_TASK_DETAILS = res.employee_task_detail;
          this.EMPLOYEE_TASK_SUMMERY = res.employee_task_summery;
          this.f_M_H_D(this.EMPLOYEE_TASK_SUMMERY)
          this.EMPLOYEE_TASK_DETAILS.forEach((element:any)=>{
             element.ATTN_DATE = this.datepipe.transform(element.ATTN_DATE, 'dd-MMM-yyyy')
          })
          if(val == 1){
            $(this.Task_Summery_PopUp.nativeElement).modal("show");
          }else if(val == 0){
            $(this.Task_Details_PopUp.nativeElement).modal("show");
          }
          // console.log('EMPLOYEE_TASK_DETAILS ->' , this.EMPLOYEE_TASK_DETAILS)
          // console.log('EMPLOYEE_TASK_SUMMERY ->' , this.EMPLOYEE_TASK_SUMMERY)
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  f_fillFormData(data: Array<any> = []) {
    this.form.get("TASKID").setValue(this.search_task_id);
    this.form.get("BRM_POINT").setValue(data[0].BRM_POINT);
    this.form.get("BUSINESS_OWNER").setValue(data[0].BUSINESS_OWNER);
    this.form.get("CLIENT_OWNER").setValue(data[0].CLIENT_OWNER);
    this.form.get("CLIENT_REFNO").setValue(data[0].CLIENT_REFNO);
    this.form.get("PROJ_CODE").setValue(data[0].PROJ_CODE);
    this.form.get("ESTIMATED_HOURS").setValue(this.f_M_H(data[0].ESTIMATED_HOURS));
    this.form.get("TASK_DESC").setValue(data[0].TASK_DESC);
    this.form.get("TASK_DETAILS").setValue(data[0].TASK_DETAILS);
    this.form.get("TASK_NO").setValue(data[0].TASK_NO);
    this.form.get("TASK_STATUS").setValue(data[0].TASK_STATUS);
    this.form.get("TASK_TYPE").setValue(data[0].TASK_TYPE);
    this.form.get("TECHNICAL_OWNER").setValue(data[0].TECHNICAL_OWNER);
    this.form.get("QUOTED_MANDAYS").setValue(data[0].QUOTED_MANDAYS);
    this.form.get("COMPLETION_DATE").setValue(this.datepipe.transform(data[0].COMPLETION_DATE, 'dd-MMM-yyyy'));
    this.form.get("PLANNED_START_DATE").setValue(this.datepipe.transform(data[0].PLANNED_START_DATE, 'dd-MMM-yyyy'));
    this.form.get("CHARGEABLE").setValue(data[0].CHARGEABLE);
    this.form.get("PRIORITY").setValue(data[0].PRIORITY);
    this.setCompany();
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 250);
    this.filterEmployee();
  }

  setCompany() {
    for (let data of this.project_list) {
      //if(this.form.getRawValue().TECHNICAL_OWNER != "" || this.form.getRawValue().TECHNICAL_OWNER != null){
      if (data.PROJ_CODE == this.form.getRawValue().PROJ_CODE) {
        this.form.get("COMPANY").setValue(data.COMPANY_NAME);
        this.form.get("CUSTOMER").setValue(data.CUST_NAME);
        this.form.get("TECHNICAL_OWNER").setValue(data.TECHNICAL_OWNER);
        this.isUpdate = true;
        setTimeout(() => {
          $(".selectpicker").selectpicker("refresh").trigger("change");
        }, 150);
        break;
      }
      //}
    }

    // if(this.form.getRawValue().PROJ_CODE != "" && this.form.getRawValue().PROJ_CODE != null){
    //   this._technical_owner_list = [];
    //   this.technical_owner_list.forEach(element => {
    //     if(Number(element.TECH_OWNER) == Number(this.form.getRawValue().PROJ_CODE)){
    //       this._technical_owner_list.push(element)
    //     }
    //   });
    // } else {
    //   this._technical_owner_list = this.technical_owner_list
    // }
  }

  filterEmployee() {
    this.emp_list = [];
    let isAssign: boolean = false;
    for (let emp of this.all_emp_list) {
      for (let save_emp of this.project_assign_emp_detail) {
        if (emp.EMP_CODE == save_emp.EMP_NO) {
          isAssign = true;
          break;
        } else {
          isAssign = false;
        }
      }
      if (!isAssign) {
        this.emp_list.push(emp);
      }
    }

    this.selected_emp = "";
    $("#emp").selectpicker("refresh").trigger("change");
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  selectDocument(event: any) {
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      extension = event.target.files[i].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase();
      if (
        _ext === "BAT" ||
        _ext === "GIF" ||
        _ext === "PNG" ||
        _ext === "JAVA" ||
        _ext === "XML" ||
        _ext === "ZIP" ||
        _ext === "RAR" ||
        _ext === "JAR" ||
        _ext === "EXE"
      ) {
        this.toast.warning(
          "Please select valid document (XLSX/ DOCS/ PDF/ TEXT File/ Image)"
        );
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        extension = event.target.files[i].name.split(".");
        this.uploadingFiles.push({
          DOCUMENT_NAME: "",
          DOCUMENT_FILENAME: event.target.files[i].name,
          DOCUMENT_SYSFILENAME:
            uuidv4() + "." + extension[extension.length - 1],
          DOCUMENT_FILETYPE: extension[extension.length - 1].toUpperCase(),
          ISNEW: 1,
          ACTIVE: 1,
          UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
          UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
          b64: b64,
        });
        this.uploadDoc();
      };
      // this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
    }
  }

  uploadDoc() {
    for (let i = 0; i < this.uploadingFiles.length; i++) {
      this.uploadedDocument.push(this.uploadingFiles[i]);
    }
    // this.fileInput.nativeElement.value = "";
    this.uploadingFiles = [];
    this.SelectedFileName = "";
    this.NoDocs = 0;
    this.uploadedDocument.forEach((element) => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1;
      }
    });
  }

  removeDoc(fileIndex:any) {
    if (this.uploadedDocument[fileIndex].ISNEW == 1) {
      this.uploadedDocument.splice(fileIndex, 1);
    } else if (this.uploadedDocument[fileIndex].ACTIVE == 1) {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    } else {
      this.uploadedDocument[fileIndex].ACTIVE = 0;
    }
    this.NoDocs = 0;
    this.uploadedDocument.forEach((element) => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1;
      }
    });
  }

  addRow() {
    if(!this.sharedService.isValid(this.selected_emp)){
        this.toast.error('Select a Employee');
        return
    }
    let selected: boolean = false;
    if (this.project_assign_emp_detail.length) {
      if (this.selected_emp != "") {
        let _emp =
          typeof this.selected_emp == "object"
            ? this.selected_emp.EMP_CODE
            : JSON.parse(this.selected_emp);
        for (let data of this.project_assign_emp_detail) {
          if (data.EMP_NO == _emp.EMP_CODE) {
            selected = true;
          }
        }
        if (!selected) {
          this.project_assign_emp_detail.push({
            TASK_ID: this.search_task_id == "" ? 0 : this.search_task_id,
            EMP_NO: _emp.EMP_CODE,
            FULL_NAME: _emp.USER_NAME,
            ACTIVE: 1,
          });
        }
        selected = false;
        this.selected_emp = "";
        $("#emp").selectpicker("refresh").trigger("change");
      }
    } else {
      if (this.selected_emp != "") {
        this.project_assign_emp_detail = [];
        this.project_assign_emp_detail.push({
          TASK_ID: this.search_task_id == "" ? 0 : this.search_task_id,
          EMP_NO:
            typeof this.selected_emp == "object"
              ? this.selected_emp.EMP_CODE
              : JSON.parse(this.selected_emp).EMP_CODE,
          FULL_NAME:
            typeof this.selected_emp == "object"
              ? this.selected_emp.USER_NAME
              : JSON.parse(this.selected_emp).USER_NAME,
          ACTIVE: 1,
        });
      }
    }
    this.selected_emp = "";
    $("#emp").selectpicker("refresh").trigger("change");
    this.filterEmployee();
  }

  removeRow(data:any) {
    this.project_assign_emp_detail.forEach((element:any,index:any)=>{
      if(element.EMP_NO == data.EMP_NO){
         this.project_assign_emp_detail.splice(index,1)
      } 
    })
    this.selected_emp = "";
    // this.filterEmployee();
  }

  saveFormData(para:any) {
    this.isSubmited = true;
    if (this.form.valid) {
      let _formData = this.form.getRawValue();
      if (
        this.form.getRawValue().CLIENT_REFNO == "" ||
        this.form.getRawValue().CLIENT_REFNO == null ||
        this.form.getRawValue().CLIENT_REFNO == undefined
      )
        _formData.CLIENT_REFNO = 0;
      _formData.ESTIMATED_HOURS = this.f_H_M(_formData.ESTIMATED_HOURS);

      let data = {
        task_detail: _formData,
        project_assign_emp_detail: this.project_assign_emp_detail,
        STATUS_UPDATE: para,
      };
      // console.log('data ->' , JSON.stringify(data));
      // return
      this.http.PostRequest(this.apiUrl.SaveTaskDetail, data).then(
        (res:any) => {
          if (res.flag) {
            // console.log(res);
            this.toast.success(res.msg);
            this.GetTaskList();
            this.f_clearForm();
            this.spinner = false;
            this.router.navigate(['/taskassign'])
          } else {
            this.toast.warning(res.msg);
            this.spinner = false;
            this.router.navigate(['/taskassign'])
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
    } else {
      this.f_formValidation();
    }
  }

  f_downloadDocument(file: any) {
    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http
        .PostRequest(this.apiUrl.GetFile, {
          DOCUMENT_SYSFILENAME: file.DOCUMENT_SYSFILENAME,
        })
        .then((res) => {
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
        });
    }
  }

  f_clearForm() {
    this.form.reset();
    // this.fileInput.nativeElement.value = "";
    this.isSubmited = false;
    this.search_task_id = "";
    this.form.get("TASKID").setValue(0);
    this.project_assign_emp_detail = [];
    this.isUpdate = false;
    this.form.get("CHARGEABLE").setValue(0);
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  f_H_M(hours:any): any {
    let col = [];
    let H = 0;
    let M = 0;
    let time: any = null;
    if (hours != "" && hours != undefined && hours != null) {
      col = hours.split(":");
      H = +col[0] || 0;
      M = +col[1] || 0;
      time = H * 60 + M;
    }
    return time;
  }

  f_M_H(minutes:any): any {
    let hour = null;
    if (minutes != "" && minutes != undefined && minutes != null) {
      const H = Math.floor(minutes / 60);
      const M = minutes % 60;
      // hour = `${H}:${M.toString().padStart(2, "0")}`;
      hour = `${H}:${M}`;
    }
    return hour;
  }

  f_formValidation() {
    if (this.form.controls["PROJ_CODE"].invalid) {
      this.toast.warning("Please select Project");
    } else if (this.form.controls["TASK_NO"].invalid) {
      this.toast.warning("Please enter Task No");
    } else if (this.form.controls["TASK_TYPE"].invalid) {
      this.toast.warning("Please select Task Type");
    } else if (this.form.controls["TASK_DESC"].invalid) {
      this.toast.warning("Please enter Task Description");
    // } else if (
    //   this.form.controls["ESTIMATED_HOURS"].invalid &&
    //   this.form.getRawValue().CHARGEABLE == "1"
    // ) {
    //   this.toast.warning("Please enter Est.Hours");
    } else if (this.form.controls["BUSINESS_OWNER"].invalid) {
      this.toast.warning("Please enter Business Owner");
    } else if (this.form.controls["CLIENT_OWNER"].invalid) {
      this.toast.warning("Please enter Client Reporter");
    } else if (this.form.controls["CLIENT_REFNO"].invalid) {
      this.toast.warning("Please enter Client Referance");
    } else if (this.form.controls["TASK_DETAILS"].invalid) {
      this.toast.warning("Please enter Detail Description");
    } else if (this.form.controls["TASK_STATUS"].invalid) {
      this.toast.warning("Please enter Task Status");
    } else if (this.form.controls["TECHNICAL_OWNER"].invalid) {
      this.toast.warning("Please enter Tech Owner");
    }
  }

  onChangeType(para:any) {
    if (para == "0") {
      this.textBoxDisabled = true;
      this.form.get("QUOTED_MANDAYS").setValue(0);
    } else {
      this.textBoxDisabled = false;
    }

    if (para == "1") {
      this.form.get("QUOTED_MANDAYS").setValue("");
    }
  }

  CancleForm(){
    this.f_clearForm();
    this.router.navigate(['/taskassign'])
  }

  ChangeDate(){
    this.COMPLETION_DATE = this.datepipe.transform(new Date(this.COMPLETION_DATE), 'dd-MMM-yyyy')
    this.PLANNED_START_DATE = this.datepipe.transform(new Date(this.PLANNED_START_DATE), 'dd-MMM-yyyy')
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  f_M_H_D(array: any = []): any {
    for (let data of array) {
      const H = Math.floor(data.TOTAL_MIN / 60);
      const M = data.TOTAL_MIN % 60;
      data.TOTAL_MIN = `${H}:${M.toString().padStart(2, "0")}`;
    }
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }
  
  closeModal(val:any){
    if(val == 1){
      $(this.Task_Summery_PopUp.nativeElement).modal("hide");
    }else if(val == 0){
      $(this.Task_Details_PopUp.nativeElement).modal("hide");
    }
  }

  ExcelDownload(){
    // console.log(' EMPLOYEE_TASK_DETAILS ->', this.EMPLOYEE_TASK_DETAILS)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.EMPLOYEE_TASK_DETAILS);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob: Blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'EMPLOYEE_TASK_DETAILS.xlsx';
    link.click(); 
  }

  s2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

}
