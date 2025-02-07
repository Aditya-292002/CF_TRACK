import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
declare var $: any;
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild("emp", { static: false }) emp: ElementRef;

  spinner: boolean = false;
  form: FormGroup;
  PLANNED_START_DATE: any = new Date();
  COMPLETION_DATE: any = new Date();
  
  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private validationService: ValidationService
  ) {}

  project_list: Array<any> = [];
  task_status_list: Array<any> = [];
  task_type_list: Array<any> = [];
  task_list: Array<any> = [];
  all_emp_list: Array<any> = [];

  search_task_id: string = "";

  ngOnInit() {
    this.sharedService.formName = "Task";
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
      PRIORITY: [""],
      PLANNED_START_DATE: [""],
      COMPLETION_DATE: [""],
      CHARGEABLE: ["0", Validators.required],
      QUOTED_MANDAYS: ["", Validators.required],
    });
    $(".selectpicker").selectpicker("refresh").trigger("change");
  }

  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  isUpdate: boolean = false;
  isAdd: boolean = false;
  NO_RIGHTS: boolean = false;
  isNewAdd: boolean = false;
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS;
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS;
      }

      this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS ? false : true;
      this.GetTaskCommonList();
      this.GetTaskList();
      this.getEmployee();

      if (this.sharedService.commonData.length > 0) {
        this.search_task_id = this.sharedService.commonData[0].TASKID;
        this.searchTask();
      }
      // this.form
      //   .get("PLANNED_START_DATE")
      //   .setValue(this.sharedService.getTodayDate());
      // this.PLANNED_START_DATE = this.sharedService.getTodayDate();
      // this.form
      //   .get("COMPLETION_DATE")
      //   .setValue(this.sharedService.getTodayDate());
      // this.COMPLETION_DATE = this.sharedService.getTodayDate();
      this.form.get("QUOTED_MANDAYS").setValue(0);
    }, 150);
  }

  GetTaskCommonList() {
    this.http.PostRequest(this.apiUrl.GetTaskCommonList, {}).then(
      (res) => {
        if (res.flag) {
          this.project_list = res.project_list;
          this.task_status_list = res.task_status_list;
          this.task_type_list = res.task_type_list;

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

  buisness_owner_list: Array<any> = [];
  technical_owner_list: Array<any> = [];
  getEmployee() {
    let data = {
      LISTTYPE: "",
    };

    this.http.PostRequest(this.apiUrl.GetEmployeeList, data).then(
      (res) => {
        if (res.flag) {
          this.all_emp_list = res.employee_list;
          this.buisness_owner_list = res.employee_list;
          this.technical_owner_list = res.employee_list;

          this.filterEmployee();

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
  searchTask() {
    if (this.search_task_id != "" || this.search_task_id != undefined) {
      this.isUpdate = true;
      this.GetTaskDetail();
      this.onChangeType();
    } else {
      this.isUpdate = false;
      this.f_clearForm();
    }
  }
  project_assign_emp_detail: Array<any> = [];
  GetTaskDetail() {
    let data = {
      TASKID: this.search_task_id,
    };
    this.http.PostRequest(this.apiUrl.GetTaskDetail, data).then(
      (res) => {
        if (res.flag) {
          this.project_assign_emp_detail = res.project_assign_emp_detail;
          this.setCompany();
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
  f_fillFormData(data: Array<any> = []) {
    this.form.get("TASKID").setValue(this.search_task_id);
    this.form.get("BRM_POINT").setValue(data[0].BRM_POINT);
    this.form.get("BUSINESS_OWNER").setValue(data[0].BUSINESS_OWNER);
    this.form.get("CLIENT_OWNER").setValue(data[0].CLIENT_OWNER);
    this.form.get("CLIENT_REFNO").setValue(data[0].CLIENT_REFNO);
    this.form.get("PROJ_CODE").setValue(data[0].PROJ_CODE);
    this.form
      .get("ESTIMATED_HOURS")
      .setValue(this.f_M_H(data[0].ESTIMATED_HOURS));
    this.form.get("TASK_DESC").setValue(data[0].TASK_DESC);
    this.form.get("TASK_DETAILS").setValue(data[0].TASK_DETAILS);
    this.form.get("TASK_NO").setValue(data[0].TASK_NO);
    this.form.get("TASK_STATUS").setValue(data[0].TASK_STATUS);
    this.form.get("TASK_TYPE").setValue(data[0].TASK_TYPE);
    this.form.get("TECHNICAL_OWNER").setValue(data[0].TECHNICAL_OWNER);
    this.form.get("QUOTED_MANDAYS").setValue(data[0].QUOTED_MANDAYS);
    this.form.get("CHARGEABLE").setValue(data[0].CHARGEABLE);
    // this.setCompany();
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 250);
    this.filterEmployee();
  }

  _technical_owner_list: Array<any> = [];
  setCompany() {
    for (let data of this.project_list) {
      //if(this.form.getRawValue().TECHNICAL_OWNER != "" || this.form.getRawValue().TECHNICAL_OWNER != null){
      if (data.PROJ_CODE == this.form.getRawValue().PROJ_CODE) {
        this.form.get("COMPANY").setValue(data.COMPANY_NAME);
        this.form.get("CUSTOMER").setValue(data.CUST_NAME);
        this.form.get("TECHNICAL_OWNER").setValue(data.TECHNICAL_OWNER);
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
  emp_list: Array<any> = [];
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

  SelectedFileName: string = "";
  uploadingFiles: Array<any> = [];
  uploadedDocument: Array<any> = [];
  NoDocs: number = 0;
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

    this.fileInput.nativeElement.value = "";
    this.uploadingFiles = [];
    this.SelectedFileName = "";
    this.NoDocs = 0;
    this.uploadedDocument.forEach((element) => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1;
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
    this.uploadedDocument.forEach((element) => {
      if (element.ACTIVE != 0) {
        this.NoDocs += 1;
      }
    });
  }

  selected_emp: any = "";
  last_row: number = 0;
  addRow() {
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
  removeRow(index: number = null) {
    this.project_assign_emp_detail.splice(index, 1);
    this.filterEmployee();
  }

  isSubmited: boolean = false;
  saveFormData(para: string = "") {
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
      };
      this.http.PostRequest(this.apiUrl.SaveTaskDetail, data).then(
        (res) => {
          if (res.flag) {
            // console.log(res);
            this.toast.success(res.msg);
            this.GetTaskList();
            this.f_clearForm();
            this.spinner = false;
          } else {
            this.toast.warning(res.msg);
            this.spinner = false;
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
    this.fileInput.nativeElement.value = "";
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

  f_H_M(hours: string = ""): any {
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
  f_M_H(minutes: any = null): any {
    let hour = null;
    if (minutes != "" && minutes != undefined && minutes != null) {
      const H = Math.floor(minutes / 60);
      const M = minutes % 60;
      hour =
        ("0000" + H.toString()).slice(-4) +
        ":" +
        ("00" + M.toString()).slice(-2);
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
    } else if (
      this.form.controls["ESTIMATED_HOURS"].invalid &&
      this.form.getRawValue().CHARGEABLE == "1"
    ) {
      this.toast.warning("Please enter Est.Hours");
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

  textBoxDisabled = true;

  // toggle(){
  //   this.textBoxDisabled = !this.textBoxDisabled;
  // }

  onChangeType(para: string = "") {
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
}
