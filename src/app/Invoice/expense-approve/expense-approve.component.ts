import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { truncate } from 'fs';
import { fadeOutCollapseOnLeaveAnimation } from 'angular-animations';
import { PipeService } from 'src/app/services/pipe.service';
import { log } from 'console';
declare var $: any;

@Component({
  selector: 'app-expense-approve',
  templateUrl: './expense-approve.component.html',
  styleUrls: ['./expense-approve.component.css']
})
export class ExpenseApproveComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  spinner: boolean = false;
  form: FormGroup;
  EXPENSE_DATE: string = "";
  PO_DATE: string = ""
  BILL_DATE: string = ""
  DUE_DATE: string = "";
  isSubmited: boolean = false;
  PAY_TO: string = "E";
  VENDOR_STATE: number = 0;
  VENDOR_COUNTRY: string = "";
  GST_CLASS: boolean = false;
  TDS_CODE: string = "";
  TDSAPPLICABLE: boolean = false;
  LOCATION_STATE: number = 0;
  LOCATION_COUNTRY: string = "";
  maxdate = new Date();
  today_date = new Date();
  today_date_s: any;
  min_date = new Date(new Date().getFullYear(), 0, 1);
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;
  radioSelected: boolean = true
  VENDOR_NO: string = ""
  EMP_NO: string = ""
  _location_list: Array<any> = []
  expense_detail: Array<any> = [];
  _expense_detail: Array<any> = [];
  company_list: Array<any> = [];
  doc_type_list: Array<any> = [];
  employee_list: Array<any> = [];
  currency_list: Array<any> = [];
  exphead_list: Array<any> = [];
  location_list: Array<any> = [];
  customer_list: Array<any> = [];
  fyear_list: Array<any> = [];
  tds_code_list: Array<any> = [];
  vendor_list: Array<any> = [];
  project_list: Array<any> = [];
  all_expense_detail: Array<any> = [];
  isViewExpense: boolean = false;
  expense_header: Array<any> = [];
  _DATE: any = ''
  _DATE1: any = ''
  isCancel: boolean = false;
  isExchangeRate: boolean = false;
  COMPANY_CURRENCY: any;
  uploadedDocument: any = [];
  uploadingFiles: any = [];
  SelectedFileName: any = '';
  sampel_exphead_list: any = [];
  private _expense_detail_copy: any[];
  expenseHeader: any;
  LISTTYPE:any;
  IS_UPDATE:any = 0;

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    public validationService: ValidationService,
    public datepipe: DatePipe,
   private pipeService:PipeService) { }

  ngOnInit() {
    this.sharedService.formName = "Expense Approve"
    this.form = new FormGroup({
      EXP_ID: new FormControl(""),
      COMPANY_CODE: new FormControl(["", Validators.required]),
      LOCATION_CODE: new FormControl(["", Validators.required]),
      CURRENCY_CODE: new FormControl(["INR", Validators.required]),

      DOCTYPE_CODE: new FormControl(""),
      EMP_CODE: new FormControl(""),
      VENDOR_NO: new FormControl(""),
      TDS_CODE: new FormControl(""),

      FYEAR: new FormControl("2024"),
      EXP_TYPE: new FormControl(""),
      EXPENSE_NO: new FormControl(""),
      EXPENSE_DATE: new FormControl(""),

      DUE_DATE: new FormControl(""),
      PO_ID: new FormControl(""),
      PAY_TO: new FormControl("V"),
      EMP_NO: new FormControl(""),

      BILL_NO: new FormControl(""),
      BILL_DATE: new FormControl(""),
      EXPENSE_AMT: new FormControl("1"),
      SGST_AMT: new FormControl(""),

      CGST_AMT: new FormControl(""),
      IGST_AMT: new FormControl(""),
      ROUNDOFF: new FormControl(""),
      TOTAL_BILL: new FormControl(""),

      EXCHANGE_RATE: new FormControl("1"),
      BASE_BILL: new FormControl(""),
      TDS_ON: new FormControl("1"),
      TDS_RATE: new FormControl("0"),

      TDS_AMT: new FormControl("0"),
      REMARKS: new FormControl(""),
      CANCEL_IND: new FormControl(""),
      PO_DATE: new FormControl(""),
      TDS_APPLICABLE: new FormControl("")
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // if (this.sharedService.form_rights.ADD_RIGHTS) {
      //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      // }
      // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
      //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      // }
      // this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
      if (this.sharedService.loginUser[0].FYEAR == undefined) {
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []
      }
      this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
      this.COMPANY_CURRENCY = this.sharedService.loginUser[0].COMPANY_CURRENCY;
      this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
      if (this.today_date_s > this.sharedService.loginUser[0].TO_DATE) {
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.sharedService.loginUser[0].TO_DATE;
      }
      else {
        this.min_date = this.sharedService.loginUser[0].FROM_DATE;
        this.maxdate = this.today_date_s;
      }
      this.GetExpenseCommonList();
      this.GetExpenseList('P');
    }, 150)
  }

  // @HostListener('click', ['$event.target'])
  showContent(para: any) {
    this.PAY_TO = para;
    if (para == 'V') {
      this.radioSelected = false;
      this.form.get('EMP_NO').setValue("");
    }
    else {
      this.radioSelected = true;
    }
    if (para == 'E') {
      this.radioSelected = false;
      this.form.get('VENDOR_NO').setValue("");
      // this.GST_CLASS == false;
      // this.VENDOR_STATE = 0;
      // this.VENDOR_COUNTRY = null;
      // this.TDS_CODE= null;
      // this.TDSAPPLICABLE= false;
      this.GST_CLASS == false;
      this.VENDOR_STATE = 0;
      this.VENDOR_COUNTRY = "";
      this.TDS_CODE = "";
      this.TDSAPPLICABLE = false;
      this.form.get('TDS_CODE').setValue("");
      this.ChangeExpenseHead();
      this.ChangeTDS();
    }
    else {
      this.radioSelected = true;
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GetExpenseCommonList() {
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetExpenseCommonList, {}).then(res => {
      if (res.flag) {
        this.company_list = res.company_list;
        this.currency_list = res.currency_list;
        this.customer_list = res.customer_list;
        this.doc_type_list = res.doc_type_list;
        this.employee_list = res.employee_list;
        this.location_list = res.location_list;
        this._location_list = res.location_list;
        this.sampel_exphead_list = res.exphead_list;
        this.exphead_list = res.exphead_list;
        this.fyear_list = res.fyear_list;
        this.tds_code_list = res.tds_code_list;
        this.vendor_list = res.vendor_list;
        // this.PAY_TO = res.radioSelected;
        if (this.form.controls['CURRENCY_CODE'].value == this.COMPANY_CURRENCY) {
          this.isExchangeRate = true;
        }
        this.f_addRow();
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

  filterLocations() {
    if (this.form.getRawValue().COMPANY_CODE != "" && this.form.getRawValue().COMPANY_CODE != null) {
      this._location_list = [];
      this.location_list.forEach(element => {
        if (Number(element.COMPANY_CODE) == Number(this.form.getRawValue().COMPANY_CODE)) {
          this._location_list.push(element)
        }
      });
    } else {
      this._location_list = this.location_list
    }
    this.GetProjectList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  SaveExpense(val: any) {
    let TYPE = ""
    if (val == 0) {
      TYPE = "APPROVE";
    } else if (val == 1) {
      TYPE = "CANCLE";
    }
    //console.log('this.form.value',this.form.value);
   this.expenseHeader=this.form.value
   this.expenseHeader.BASE_BILL=this.pipeService.removeCommaseprated(this.expenseHeader.BASE_BILL);
   this.expenseHeader.EXPENSE_AMT=this.pipeService.removeCommaseprated(this.expenseHeader.EXPENSE_AMT);
   this.expenseHeader.TDS_APPLICABLE=this.pipeService.removeCommaseprated(this.expenseHeader.TDS_APPLICABLE);
   this.expenseHeader.TOTAL_BILL=this.pipeService.removeCommaseprated(this.expenseHeader.TOTAL_BILL);
   // this._expense_detail_copy=[];
   // this._expense_detail_copy=this._expense_detail;
   //console.log('this.form.value', this.expenseHeader);

    if (this.f_validateForm()) {
      let data = {
        TYPE: TYPE,
        Expense: this.form.value,
        expense_detail: this._expense_detail_copy,
        IS_CANCLE: val,
        IS_UPDATE: this.IS_UPDATE,
        EXPENSE_DOCUMENT: this.uploadedDocument
      }
      // console.log('data ->' , JSON.stringify(data))
      // return
      this.http.PostRequest(this.apiUrl.SaveExpense, data).then(res => {
        if (res.flag) {
          this.toast.success(res.msg)
          this.f_clearForm();
          this.isViewExpense = false;
          this.GetExpenseList('P');
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
          this.spinner = false;
        } else {
          this.toast.warning(res.msg)
          this.spinner = false;
        }
      }, err => {
        this.spinner = false;
      });
    }
  }

  GetProjectList() {
    let data = {
      LISTTYPE: "customerwise",
      COMPANY_CODE: this.form.getRawValue().COMPANY_CODE,
    }
    this.http.PostRequest(this.apiUrl.GetProjectList, data).then(res => {
      if (res.flag) {
        this.project_list = res.project_list
        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  f_addRow() {
    this._expense_detail.push({
      SRNO: 0,
      PO_SRNO: "0",
      EXPENSE_HEAD: "",
      HSN_CODE: "",
      EXPENSE_GL: "0",
      REMARKS: "",
      TDS_ON: "",
      SGST_RATE: "0",
      SGST_AMOUNT: "0",
      CGST_RATE: "0",
      CGST_AMOUNT: "0",
      IGST_RATE: "0",
      IGST_AMOUNT: "0",
      TOTAL_AMOUNT: "0",
      EXPENSE_AMOUNT: "0",
      QTY: "0",
      PRICE: "0",
      PROJ_CODE: "",
      Active: 1
    })

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  };

  f_validateForm() {
    // console.log('PAY_TO ->' , this.PAY_TO)
    if (!this.sharedService.isValid(this.form.controls['EXP_TYPE'].value)) {
      this.toast.error('Select a Doc type');
      return false;
    } else if (this.PAY_TO == 'V' && !this.sharedService.isValid(this.form.controls["VENDOR_NO"].value)) {
      this.toast.error('Select a Vendor');
      return false;
    } else if (this.PAY_TO == 'E' && !this.sharedService.isValid(this.form.controls["EMP_NO"].value)) {
      this.toast.error('Select a Employee ');
      return false;
    } else if (!this.sharedService.isValid(this.form.controls["BILL_NO"].value)) {
      this.toast.error('Enter a Bill no');
      return false;
    } else if (!this.sharedService.isValid(this.form.controls["BILL_DATE"].value)) {
      this.toast.error('Select a Bill date');
      return false;
    } else if (!this.sharedService.isValid(this.form.controls["DUE_DATE"].value)) {
      this.toast.error('Select a Pay by date');
      return false;
    } else if (!this.sharedService.isValid(this.form.controls["CURRENCY_CODE"].value)) {
      this.toast.error('Select a Currency');
      return false;
    } else if (this.form.controls["EXCHANGE_RATE"].value <= 0) {
      this.toast.error('Enter a Exchange rate is greater than zero.');
      return false;
    } else if (!this.sharedService.isValid(this.form.controls["REMARKS"].value)) {
      this.toast.error('Enter a Remarks');
      return false;
    }
    for (const element of this._expense_detail) {
      if (!this.sharedService.isValid(element.EXPENSE_HEAD)) {
        this.toast.error('Select a Exp head');
        return false;
      }
      if (element.QTY <= 0) {
        this.toast.error('Enter a Quantity is greater than zero.');
        return false;
      }
      if (element.PRICE <= 0) {
        this.toast.error('Enter a Price is greater than zero.');
        return false;
      }
      if (!this.sharedService.isValid(element.PROJ_CODE)) {
        this.toast.error('Select a Project');
        return false;
      }
    };
    this._expense_detail_copy=this._expense_detail;
    this._expense_detail_copy.forEach((element)=>{
      element.PRICE=this.pipeService.removeCommaseprated( element.PRICE)
      element.EXPENSE_AMOUNT=this.pipeService.removeCommaseprated( element.EXPENSE_AMOUNT)
    })
    return true;
  }

  CalculateFinalAmount() {
    var EXPENSE_AMOUNT = 0;
    var SGST_VALUE = 0;
    var CGST_VALUE = 0;
    var IGST_VALUE = 0;
    var TOT_VALUE = 0;
    var FINAL_TOTAL_ROUND = 0;
    var ROUNDOFF = 0;

    this._expense_detail.forEach(element => {
      element.PRICE=this.pipeService.removeCommaseprated(element.PRICE);
      element.EXPENSE_AMOUNT=this.pipeService.removeCommaseprated(element.EXPENSE_AMOUNT);
      element.EXPENSE_AMOUNT = element.QTY * element.PRICE;
      EXPENSE_AMOUNT += parseFloat(element.EXPENSE_AMOUNT);
      if (Number(element.SGST_AMOUNT) == 0) {
        element.SGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.SGST_RATE) / 100).toFixed(2);
      }
      if (element.CGST_AMOUNT == 0) {
        element.CGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.CGST_RATE) / 100).toFixed(2);
      }
      if (element.IGST_AMOUNT == 0) {
        element.IGST_AMOUNT = (parseFloat(element.EXPENSE_AMOUNT) * parseFloat(element.IGST_RATE) / 100).toFixed(2);
      }
      element.TOTAL_AMOUNT = (EXPENSE_AMOUNT + parseFloat(element.SGST_AMOUNT) + parseFloat(element.CGST_AMOUNT) + parseFloat(element.IGST_AMOUNT)).toFixed(2);
      element.BASE_VALUE = (this.form.getRawValue().EXCHANGE_RATE * EXPENSE_AMOUNT).toFixed(2);
      SGST_VALUE += parseFloat(element.SGST_AMOUNT);
      CGST_VALUE += parseFloat(element.CGST_AMOUNT);
      IGST_VALUE += parseFloat(element.IGST_AMOUNT);
      TOT_VALUE += parseFloat(element.TOTAL_AMOUNT);
      element.EXPENSE_AMOUNT=this.pipeService.setCommaseprated((+ element.EXPENSE_AMOUNT).toFixed(2));
      //element.PRICE=this.pipeService.setCommaseprated((+ element.PRICE).toFixed(2));
    });
    this.form.get('EXPENSE_AMT').setValue(this.pipeService.setCommaseprated((+EXPENSE_AMOUNT).toFixed(2)));
    this.form.get('TDS_APPLICABLE').setValue((this.pipeService.setCommaseprated((+EXPENSE_AMOUNT).toFixed(2))));
    this.form.get('SGST_AMT').setValue(this.pipeService.setCommaseprated((SGST_VALUE).toFixed(2)));
    this.form.get('CGST_AMT').setValue(this.pipeService.setCommaseprated((CGST_VALUE).toFixed(2)));
    this.form.get('IGST_AMT').setValue((IGST_VALUE).toFixed(2));
    FINAL_TOTAL_ROUND = Math.round((TOT_VALUE));
    ROUNDOFF = FINAL_TOTAL_ROUND - TOT_VALUE;
    if (Number(ROUNDOFF) == 0) {
      this.form.get('ROUNDOFF').setValue((ROUNDOFF).toFixed(2));
    }
    this.form.get('TOTAL_BILL').setValue(this.pipeService.setCommaseprated((+FINAL_TOTAL_ROUND).toFixed(2)));
    var FINAL_BASE_VALUE = (FINAL_TOTAL_ROUND * this.form.getRawValue().EXCHANGE_RATE);
    this.form.get('BASE_BILL').setValue(this.pipeService.setCommaseprated((+FINAL_BASE_VALUE).toFixed(2)));

  }

  ChangeExpenseHead() {
    var i = 0;
    this._expense_detail.forEach((ele: any) => {
      ele.SGST_RATE = 0;
      ele.CGST_RATE = 0;
      ele.IGST_RATE = 0;
      ele.PROJ_CODE = ele.PROJ_CODE;
      document.getElementById('sgst_val_' + i).setAttribute("disabled", "true");
      document.getElementById('cgst_val_' + i).setAttribute("disabled", "true");
      document.getElementById('igst_val_' + i).setAttribute("disabled", "true");
      this.exphead_list.forEach((element: any) => {
        if (ele.EXPENSE_HEAD == element.EXPENSE_HEAD) {
          //console.log(element.DEFAULT_PROJECT);
          // ele.PROJ_CODE = element.DEFAULT_PROJECT;
          ele.HSN_CODE = element.HSN_CODE;
          ele.EXPENSE_GL = element.EXPENSE_GL;
        }
        if (this.GST_CLASS == true) {
          if (this.LOCATION_COUNTRY == this.VENDOR_COUNTRY) {
            if (element.EXPENSE_HEAD == ele.EXPENSE_HEAD) {
              if (this.LOCATION_STATE == this.VENDOR_STATE) {
                ele.SGST_RATE = element.SGST_RATE;
                ele.CGST_RATE = element.CGST_RATE;
                document.getElementById('sgst_val_' + i).removeAttribute("disabled")
                document.getElementById('cgst_val_' + i).removeAttribute("disabled")
              } else {
                ele.IGST_RATE = element.IGST_RATE;
                document.getElementById('igst_val_' + i).removeAttribute("disabled")
              }
            }
          }
        }
      });
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 200);

  }

  SelectState() {
    if (this.form.getRawValue().LOCATION_CODE != "" && this.form.getRawValue().LOCATION_CODE != null) {
      this.location_list.forEach(element => {
        if (Number(element.LOCATION_CODE) == Number(this.form.getRawValue().LOCATION_CODE)) {
          this.LOCATION_COUNTRY = element.LOCATION_COUNTRY;
          this.LOCATION_STATE = element.LOCATION_STATE;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
        }
      });
    }
  }

  SelectVendor() {
    if (this.form.getRawValue().VENDOR_NO != "" && this.form.getRawValue().VENDOR_NO != null) {
      this.vendor_list.forEach(element => {
        if (Number(element.VENDOR_NO) == Number(this.form.getRawValue().VENDOR_NO)) {
          this.VENDOR_STATE = element.VENDOR_STATE;
          this.VENDOR_COUNTRY = element.VENDOR_COUNTRY + "";
          this.GST_CLASS = element.GST_CLASS;
          this.TDS_CODE = element.TDS_CODE;
          this.TDSAPPLICABLE = element.TDSAPPLICABLE;
          this.form.get('TDS_CODE').setValue(element.TDS_CODE);
          this.ChangeExpenseHead();
          this.ChangeTDS();
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh').trigger('change');
          }, 100);
        }
      });
    }
  }

  ChangeTDS() {
    if (this.form.getRawValue().TDS_CODE != "" && this.form.getRawValue().TDS_CODE != null) {
      this.tds_code_list.forEach(element => {
        if (element.TDS_CODE == this.form.getRawValue().TDS_CODE) {
          this.form.get('TDS_RATE').setValue(element.TDS_PERCENT);
          var TDS_AMT = (Math.ceil((parseFloat(this.form.getRawValue().TDS_RATE) * this.pipeService.removeCommaseprated(this.form.getRawValue().TDS_APPLICABLE) / 100))).toFixed(2);
          this.form.get('TDS_AMT').setValue(TDS_AMT);
          var BASE_BILL =  this.pipeService.removeCommaseprated(this.form.getRawValue().TOTAL_BILL) - this.pipeService.removeCommaseprated(this.form.getRawValue().TDS_AMT);
          this.form.get('BASE_BILL').setValue(this.pipeService.setCommaseprated((+BASE_BILL).toFixed(2)));
        }
      });
    }
  }

  GetExpenseList(val: any) {
    this.LISTTYPE = val;
    let data = {
      LISTTYPE: this.LISTTYPE,
    }

    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetExpenseList, data).then(res => {
      if (res.flag) {
        this.all_expense_detail = res.expense_list;
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

  ExpenseList() {
    this.isViewExpense = !this.isViewExpense;
    this.isCancel = false;
    this.GetExpenseList('P');
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  editExpence(data: any) {
    // console.log('data ->', data)
    this.GetProjectList();
    this.isViewExpense = true;
    this.isCancel = true;
    this.GetExpenseDetail(data.EXP_ID);
    if(this.LISTTYPE == 'A'){
      this.IS_UPDATE = 1;
    }else if(this.LISTTYPE == 'P'){
      this.IS_UPDATE = 0;
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  GetExpenseDetail(EXP_ID: any) {
    let data = {
      EXP_ID: EXP_ID
    }

    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetExpenseDetail, data).then(res => {
      this.spinner = false;
      this._expense_detail = res.expense_detail;
      this._expense_detail.forEach(element => {
       // element.PRICE=this.pipeService.setCommaseprated((+element.PRICE).toFixed(2));
        element.PRICE =this.pipeService.setCommaseprated((+element.PRICE).toFixed(2))
     //   element.TOTAL_AMOUNT=this.pipeService.setCommaseprated((+element.TOTAL_AMOUNT).toFixed(2));
        element.EXPENSE_AMOUNT =this.pipeService.setCommaseprated((+element.EXPENSE_AMOUNT).toFixed(2))
      });
      this.expense_header = res.expense_header;
      this.uploadedDocument = res.expense_document_detail;
      this.f_fillFormData();
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
        this.spinner = false;
        this.ChangeTDS();
      }, 100);
      this.spinner = false;
    }, err => {
      this.spinner = false;
    });

  }

  f_fillFormData() {
    // console.log('INSIDE f_fillFormData ');

    this.spinner = true;
    this.form.get("EXP_ID").setValue(this.expense_header[0].EXP_ID)
    // this.form.get("EMP_CODE").setValue(this.expense_header[0].EMP_CODE)
    this.filterLocations();
    this.form.get("EXPENSE_NO").setValue(this.expense_header[0].EXPENSE_NO)
    this.form.get("EXPENSE_DATE").setValue(this.expense_header[0].EXPENSE_DATE)
    this.form.get("PAY_TO").setValue(this.expense_header[0].PAY_TO)
    this.showContent(this.expense_header[0].PAY_TO);
    this.form.get("PO_ID").setValue(this.expense_header[0].PO_ID)
    // this.form.get("PO_DATE").setValue(this.expense_header[0].PO_DATE == null?'':this.expense_header[0].PO_DATE)
    this.form.get("PO_DATE").setValue(this.expense_header[0].EXPENSE_DATE)
    this.form.get("BILL_NO").setValue(this.expense_header[0].BILL_NO)
    this.form.get("BILL_DATE").setValue(this.expense_header[0].BILL_DATE)
    this.form.get("DUE_DATE").setValue(this.expense_header[0].DUE_DATE)
    this.form.get("CURRENCY_CODE").setValue(this.expense_header[0].CURRENCY_CODE)
    this.form.get("EXCHANGE_RATE").setValue(this.expense_header[0].EXCHANGE_RATE)
    this.form.get("REMARKS").setValue(this.expense_header[0].REMARKS)
    this.form.get("EXPENSE_AMT").setValue(this.pipeService.setCommaseprated((+this.expense_header[0].EXPENSE_AMT).toFixed(2)))
    this.form.get("CGST_AMT").setValue(this.expense_header[0].CGST_AMT)
    this.form.get("SGST_AMT").setValue(this.expense_header[0].SGST_AMT)
    this.form.get("IGST_AMT").setValue(this.expense_header[0].IGST_AMT)
    this.form.get("ROUNDOFF").setValue(this.expense_header[0].ROUNDOFF)
    this.form.get("TOTAL_BILL").setValue(this.pipeService.setCommaseprated((+this.expense_header[0].TOTAL_BILL).toFixed(2)))
    this.form.get("TDS_APPLICABLE").setValue(this.pipeService.setCommaseprated((+this.expense_header[0].EXPENSE_AMT).toFixed(2)))
    this.form.get("TDS_CODE").setValue(this.expense_header[0].TDS_CODE)
    this.form.get("TDS_RATE").setValue(this.expense_header[0].TDS_RATE) 
    this.form.get("TDS_AMT").setValue(this.expense_header[0].TDS_AMT)
    this.form.get("BASE_BILL").setValue(this.pipeService.setCommaseprated((this.expense_header[0].BASE_BILL).toFixed(2)))
    this.form.get("FYEAR").setValue(this.expense_header[0].FYEAR)

    this.SelectState();
    setTimeout(() => {
      this.form.get("COMPANY_CODE").setValue(this.expense_header[0].COMPANY_CODE)
      this.GetProjectList();
      this.form.get("LOCATION_CODE").setValue(Number(this.expense_header[0].LOCATION_CODE))
      this.form.get("EXP_TYPE").setValue(this.expense_header[0].EXP_TYPE)
      this.form.get("TDS_CODE").setValue(this.expense_header[0].TDS_CODE)
      this.form.get("VENDOR_NO").setValue(this.expense_header[0].VENDOR_NO)
      this.form.get("EMP_NO").setValue(this.expense_header[0].EMP_NO)
      // this.SelectVendor();
      // this.ChangeExpenseHead();
      $('.selectpicker').selectpicker('refresh').trigger('change');

     // this.CalculateFinalAmount();
    }, 100);

    // console.log('fORM',this.form);
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  addNew() {
    this.isViewExpense = !this.isViewExpense;
    this.f_clearForm();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  // clear form 
  f_clearForm() {
    this.form.reset();
    this._expense_detail = [];
    this.form.get('CURRENCY_CODE').setValue('INR');
    this.form.get('EXCHANGE_RATE').setValue(1);
    this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
    this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
    this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
    this.form.get('CURRENCY_CODE').setValue('INR');
    this.form.get('TDS_RATE').setValue(0);
    this.form.get('TDS_AMT').setValue(0);
    this.form.get('PAY_TO').setValue('V');
    this._DATE = '';
    this._DATE1 = '';
    this.f_addRow();
    setTimeout(() => {
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
      this.GetProjectList();
      this.SelectState();
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 300);
  }

  ChangeDate() {
    this.EXPENSE_DATE = this.datePipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ChangeDate1() {
    this.DUE_DATE = this.datePipe.transform(new Date(this._DATE1), 'dd-MMM-yyyy')

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ViewExpenseList() {
    this.isViewExpense = false;
    this.GetExpenseList('P');
  }

  GetSelectCurrency(code: any) {
    // console.log('code ->' , code)
    // console.log('COMPANY_CURRENCY ->' , this.COMPANY_CURRENCY)
    if (this.COMPANY_CURRENCY == code) {
      this.isExchangeRate = true;
      this.form.get('EXCHANGE_RATE').setValue('1');
      this.CalculateFinalAmount();
    } else {
      this.isExchangeRate = false;
    }
    // console.log('isExchangeRate ->' , this.isExchangeRate)
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  selectDocument(event: any) {

    if (this.uploadedDocument.length > 4) {
      this.toast.warning('Upload your expense images & pdf valid only five');
      return
    }

    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];

    for (let i = 0; i < event.target.files.length; i++) {
      extension = event.target.files[i].name.split(".");
      let _ext = extension[extension.length - 1].toUpperCase()

      if (_ext === 'BAT' || _ext === 'GIF' || _ext === 'JAVA' || _ext === 'XML' || _ext === 'ZIP'
        || _ext === 'RAR' || _ext === 'JAR' || _ext === 'EXE' || _ext === 'DOCS' || _ext === 'XLSX' || _ext === 'TEXT ') {
        this.toast.warning("Please select valid document PDF & Image.)")
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        b64 = reader.result.toString().split(",")[1];
        extension = event.target.files[i].name.split(".");
        this.uploadingFiles.push(
          {
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOC_SRNO: this.uploadedDocument.length + 1,
            DOCUMENT_TYPE: '.' + extension[extension.length - 1],
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            BASE64: b64
          }
        )
        this.uploadedDocument.forEach((element: any) => {
          if (element.DOCUMENT_FILENAME == event.target.files[i].name) {
            this.toast.warning('This expense documnet added previously');
            return
          } else {
            return true
          }
        })
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
  }

  removeDoc(fileIndex: number) {
    this.uploadedDocument.splice(fileIndex, 1);
  }

  f_downloadDocument(file: any) {
    if (file != undefined && file != null && file != "") {
      this.spinner = true;
      this.http.PostRequest(this.apiUrl.GetFile, { DOCUMENT_FILENAME: file.DOCUMENT_FILENAME }).then(res => {

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

  RemoveExpenseIndex(index: any) {
    this._expense_detail.forEach((element: any, index1: any) => {
      if (index == index1) {
        this._expense_detail.splice(index1, 1)
      }
    });
  }

  FilterExpHead(code: any) {
    this.exphead_list = [];
    this.sampel_exphead_list.forEach((element: any) => {
      if (element.DOCTYPE_CODE == code) {
        this.exphead_list.push(element);
      }
    })
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }


}
