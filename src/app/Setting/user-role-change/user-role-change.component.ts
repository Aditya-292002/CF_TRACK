
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';

declare var $: any;

@Component({
  selector: "app-user-role-change",
  templateUrl: "./user-role-change.component.html",
  styleUrls: ["./user-role-change.component.css"],
})
export class UserRoleChangeComponent implements OnInit {
  EmpCommon_list: any;
  spinner: boolean = false;
  form: FormGroup;
  Role_list: any;
  Role_detail: any;
  result: any;

  constructor(
    public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.form = this.formBuilder.group({
      ROLE_CODE: ["", Validators.required],
      EMP_NO: ["", Validators.required],
    });

    this.sharedService.formName = "User Role Change";
    this.GetUserRoleCommonList();
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 210);
  }
  GetUserRoleCommonList() {
    console.log(
      "get leave common list ",
      this.sharedService.loginUser[0].EMP_CODE
    );
    let data = {
      LISTTYPE: "all",
      EMP_NO: this.sharedService.loginUser[0].EMP_CODE,
      // USER_NAME:this.sharedService.loginUser[0].USER_NAME
    };
    //return
    this.http.PostRequest(this.apiUrl.GetUserRoleCommonList, data).then(
      (res) => {
        if (res.flag) {
          this.EmpCommon_list = res.EmpCommon_list;
          console.log(res);

          this.Role_list = res.Role_list;
          //   this.LeaveType_list = res.LeaveType_list;
          //   this.f_fillFormData();
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

  GetUserRoleDetails(e: any) {
    // console.log('get leave common list ', this.sharedService.loginUser[0].EMP_CODE, e.target.value);
    let data = {
      EMP_NO: e.target.value,
      //: this.form.controls['EMP_NO'].value,
    };
    //this.form.controls['EMP_NO'].setValue( e.target.value);
    // console.log('DATA', data, this.form.controls['EMP_NO']);

    //return
    this.http.PostRequest(this.apiUrl.GetUserRoleDetails, data).then(
      (res) => {
        if (res.flag) {
          this.Role_detail = res.Role_detail;
          //  console.log(res);

          this.form.controls["ROLE_CODE"].setValue(this.Role_detail[0].ROLE_ID);
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
          // console.log('UU', this.Role_detail[0].ROLE_ID, this.form.controls['ROLE_CODE'].value);

          //   this.LeaveType_list = res.LeaveType_list;

          //   this.f_fillFormData();
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
  resetDropdown(VAL: any) {
    console.log("this.form", this.form.controls[VAL], this.form.get(VAL));

    $(".selectpicker").selectpicker("refresh");
    this.form.get(VAL).setValue("");
    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 10);
  }

  clear() {
    console.log("jj", this.form.controls["EMP_NO"].value);

    $(".selectpicker").selectpicker("refresh");
    this.form.get("EMP_NO").setValue("");

    $(".selectpicker").selectpicker("refresh");
    this.form.get("ROLE_CODE").setValue("");

    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 100);
  }

  updateRole() {
    // console.log('kk',this.form.getRawValue().ROLE_CODE);

    if (
      this.form.getRawValue().ROLE_CODE == "" &&
      this.form.getRawValue().EMP_NO == ""
    ) {
      this.toast.error("Please select employee");
      return;
    }
    if (
      this.form.getRawValue().ROLE_CODE == null ||
      this.form.getRawValue().ROLE_CODE == ""
    ) {
      this.toast.error("Please select Role");
      return;
    }
    let data = {
      ROLE_ID: this.form.getRawValue().ROLE_CODE,
      USERID: this.form.getRawValue().EMP_NO,
    };

    // console.log('updateRole', data);
    //return
    this.http.PostRequest(this.apiUrl.UpdateUserRoleDetails, data).then(
      (res) => {
        if (res.flag) {
          //console.log(res);
          this.result = res.result;
          this.toast.success(res.result[0].MSG);
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
  onChange(e: any) {
    //console.log(e.target.value,'kk');

    setTimeout(() => {
      $(".selectpicker").selectpicker("refresh").trigger("change");
    }, 210);
  }
}
