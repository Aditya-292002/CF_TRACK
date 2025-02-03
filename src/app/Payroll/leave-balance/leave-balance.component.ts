import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: "app-leave-balance",
  templateUrl: "./leave-balance.component.html",
  styleUrls: ["./leave-balance.component.css"],
})
export class LeaveBalanceComponent implements OnInit {
  leaveDetailList: any;
  form: FormGroup;
  Employee_Name: any;
  Payroll_Year: any;
  Leave_Code: any;
  Leaves_Pending: any;
  Leaves_Used: any;
  Leaves_Earned: any;
  EmpCommon_list: any;
  Leave_list: any;
  LeaveType_list: any;
  Pending_Leave_Count_list: any;
  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService,
    private cdr: ChangeDetectorRef
  ) {}

  spinner: boolean = false;

  ngOnInit() {
    this.form = this.formBuilder.group({
      EMP_NO: ["", Validators.required],
      REQUEST_DATE: ["", Validators.required],
      LEAVE_TYPE: ["", Validators.required],
      LEAVE_CODE: ["", Validators.required],
      LEAVE_BALANCE: "",
      HR_APPROVED_LEAVE: 0,
      LEAVE_PENDING_FOR_HR_APPROVAL: 0,
      LEAVE_PENDING_FOR_PM_APPROVAL: 0,
      REASON: ["", Validators.required],
      FROM_DATE: ["", Validators.required],
      TO_DATE: ["", Validators.required],
      FYEAR: [""],
      REQ_ID: "0",
    });
    this.GetLeaveCommonList();
    this.sharedService.formName = "Leave Balance";
    this.getLeaveDetails();
  }

  getLeaveDetails() {
    let data = {
      // REQ_ID:this.Employee_list[this.selectedINDEX].REQ_ID,
      //  Type:"HR Approval"
    };
    // console.log('data RejectLeave',JSON.stringify(data));
    //return
    this.http.PostRequest(this.apiUrl.GetLeaveBalanceDetails, data).then(
      (res) => {
        console.log("GetLeaveBalanceDetails", res);
        if (res.flag) {
          //this.toast.success(res.msg)
          //console.log(data);
          this.leaveDetailList = res.v_leave_balance_details;

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
  }
  viewDetails(data: any) {
    console.log("viewDetails", data);
    $(".selectpicker").selectpicker("refresh");
    this.form.get("LEAVE_CODE").setValue(data.LEAVE_CODE);

    $(".selectpicker").selectpicker("refresh");
    this.form.get("EMP_NO").setValue(data.EMP_CODE);
    //console.log('ff', this.form.controls['LEAVE_CODE'].value);
    //console.log('f2', this.form.controls['EMP_NO'].value);

    this.Employee_Name = data.USER_NAME;
    this.Payroll_Year = data.PYEAR;
    // this.Leave_Code=data.LEAVE_CODE;
    this.Leaves_Pending = data.LEAVES_PENDING;
    this.Leaves_Used = data.TOTAL_LEAVES_APPLIED;
    this.Leaves_Earned = data.LEAVE_EARNED;
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  clear() {
    $(".selectpicker").selectpicker("refresh");
    this.form.get("LEAVE_CODE").setValue("");

    $(".selectpicker").selectpicker("refresh");
    this.form.controls["EMP_NO"].setValue("");

    this.Employee_Name = "";
    this.Payroll_Year = "";
    this.Leave_Code = "";
    this.Leaves_Pending = "";
    this.Leaves_Used = "";
    this.Leaves_Earned = "";
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  GetLeaveCommonList() {
    let data = {
      LISTTYPE: "all",
      EMP_NO: this.sharedService.loginUser[0].EMP_CODE,
      // USER_NAME:this.sharedService.loginUser[0].USER_NAME
    };
    this.http.PostRequest(this.apiUrl.GetLeaveCommonList, data).then(
      (res) => {
        if (res.flag) {
          this.EmpCommon_list = res.EmpCommon_list;
          this.Leave_list = res.Leave_list;
          this.LeaveType_list = res.LeaveType_list;

          this.f_fillFormData();
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

  f_fillFormData() {
    this.form.get("EMP_NO").setValue(this.sharedService.loginUser[0].EMP_CODE);
    // this.form.get("USER_NAME").setValue(this.sharedService.loginUser[0].USER_NAME
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 10);
  }
  // changeViewList(){
  //  // this.GetLeaveList();
  // // this.GetLeaveBalance();
  // //  this.GetLeaveCommonList();
  //   this.getLeaveDetails()
  //   setTimeout(() => {
  //     $('.selectpicker').selectpicker('refresh').trigger('change');
  //   },
  //   100);
  //  }

  resetDropdown(VAL: any) {
    this.form.controls[VAL].setValue("");
    $(".selectpicker").selectpicker("refresh");
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 10);
  }
}
