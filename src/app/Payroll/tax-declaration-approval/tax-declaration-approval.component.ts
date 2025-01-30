import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-tax-declaration-approval',
  templateUrl: './tax-declaration-approval.component.html',
  styleUrls: ['./tax-declaration-approval.component.css']
})
export class TaxDeclarationApprovalComponent implements OnInit {
  spinner: boolean = true;
  items_List = [{ "HSG_LOAN": 1, "HSG_DESC": "Yes" }, { "HSG_LOAN": 0, "HSG_DESC": "No" }];
  Tax_Regime_List = [{ "REGIME_CODE": 1, "REGIME_DESC": "NEW" }, { "REGIME_CODE": 0, "REGIME_DESC": "Old" }];
  Rent_List = [{ "PAY_RENT": 1, "RENT_DESC": "Yes" }, { "PAY_RENT": 0, "RENT_DESC": "No" }];
  HSG_LOAN: any;
  REGIME_CODE: any = 1;
  PAY_RENT: any;
  isLoanDisabled: boolean = true;
  search_user: any;
  NUMBER_OF_CHILDREN: any;
  ANNUAL_RENT: any;
  isRentDisabled: boolean = true;
  LOAN_SANCTION_DATE: any=new Date();
  _DATE1: any
  LOAN_AMOUNT: any;
  VALUE_AGREEMENT: any;
  NUMBER_HOUSE_OWNED: any;
  LOAN_INTEREST_ANNUAL: any;
  AMOUNT: any;
  OTHER_CODE: any;
  EMPLOYER_TAXABLE: any;
  // onSubmitButtonHideShow: boolean = true;
  isConfiemTaxRegimeShowHide: boolean = false;
  employeeNameShowHide: boolean = true;
  emp_number_detail: Array<any> = [];
  EMPLOYER_TAX_PAID: any;
  userDetails: any = [];
  ROLE_NAME: any
  EMP_CODE: any;
  allDisableButtonSave: boolean = false;
  EMPLOYEE_NAME: any;
  Section_List: any = [];

  isValidateDate:boolean=false
  v_save_data: any = {};
  Tax_Dec_Header_List: any = {};
  _80c_Detail_List: any = {};
  Other_Detail_List: any = {};
  FYEAR: any;
  today = new Date();
  visible: boolean;
  flag: boolean;
  isHighLightPrevEmployerTaxable: string = "No";
  isHighLightPrevEmployerTaxPaid: string = "No";
  Other_List: any = [];
  IsModel:boolean=false;
  Section_Api_List: any = [];
  DRAFT: boolean = true;
  all_employee_list: Array<any> = [];

  constructor(private sharedService: SharedServiceService, private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    private datepipe: DatePipe,
    public validationService: ValidationService) { }

  ngOnInit() {
    this.sharedService.formName = "Tax Declaration Approved";
    this.userDetails = JSON.parse(sessionStorage.getItem("user_detail"))
    let user_detail = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')) : []
    this.LOAN_SANCTION_DATE = this.datepipe.transform(new Date(this.LOAN_SANCTION_DATE), 'dd-MMM-yyyy')
        // console.log('userDetails',this.userDetails)
    this.EMPLOYEE_NAME = user_detail[0].EMP_CODE + " - " + user_detail[0].USER_NAME

    this.ROLE_NAME = this.userDetails[0].ROLE_NAME;

    $('.selectpicker').selectpicker('refresh');
    this.getAllEmployee();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  getAllEmployee() {
    let data = {
      LISTTYPE: "all",

    }

    this.http.PostRequest(this.apiUrl.GetTaxDecalarationEmployeeList, data).then(res => {
      if (res.flag) {
        this.all_employee_list = res.employee_list;



        this.search_user = this.all_employee_list[0].USERID;
        this.EMP_CODE=this.all_employee_list[0].EMP_CODE
        // console.log('PRANAY', this.EMP_CODE);
        this.FYEAR = this.all_employee_list[0].LATEST_FYEAR;

       // console.log("employe name", this.FYEAR)

       this. f_searchUserData();
        if (this.ROLE_NAME == "EMPLOYEE" ) {
          this.employeeNameShowHide = true;
        }
        else {
          this.employeeNameShowHide = false;
        }
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

  rentChange() {
    //console.log("RENT_CODE", this.PAY_RENT)
    this.isRentDisabled = true;
    if (this.PAY_RENT == 1) {
      this.isRentDisabled = false;
    }
  }

  houseLoanClick() {
    //console.log("HOUSE_CODE", this.HSG_LOAN)
    this.isLoanDisabled = true;
    if (this.HSG_LOAN == 1) {
      this.isLoanDisabled = false;
    }
  }
  onRegimeChange() {
    this.isConfiemTaxRegimeShowHide = true;
    if (this.REGIME_CODE == 1) {
      this.isConfiemTaxRegimeShowHide = false;
    }
  }
  f_searchUserData() {
    if (this.search_user != "") {
      for (let i = 0; i < this.all_employee_list.length; i++) {
        if (this.search_user == this.all_employee_list[i].USERID) {
          this.GetTaxDeclrationDetailList()
          // console.log("Search user", this.all_employee_list[i].EMP_CODE)
        }
      }

    }
  }
  GetTaxDeclrationDetailList() {
    let data = {
      "EMP_NO": this.EMP_CODE,
      "FYEAR":  this.FYEAR
    }
    this.http.PostRequest(this.apiUrl.GetTaxDeclrationApprovalDetailList, data).then(res => {
      //console.log('res', res)
      this.Tax_Dec_Header_List = res.Tax_Dec_Header_List;
      this.Section_List = res._80c_Detail_List;
      this.Other_List = res.Other_Detail_List;

      if (this.Tax_Dec_Header_List.length > 0) {
        this.REGIME_CODE = this.Tax_Dec_Header_List[0].REGIME_CODE
        this.EMPLOYER_TAXABLE = this.Tax_Dec_Header_List[0].PREV_EMPLOYER_TAXABLE
        this.EMPLOYER_TAX_PAID = this.Tax_Dec_Header_List[0].PREV_EMPLOYER_TAXPAID
        this.NUMBER_OF_CHILDREN = this.Tax_Dec_Header_List[0].NO_CHILDREN
        this.PAY_RENT = this.Tax_Dec_Header_List[0].PAY_RENT
        this.ANNUAL_RENT = this.Tax_Dec_Header_List[0].ANNUAL_RENT
        this.HSG_LOAN = this.Tax_Dec_Header_List[0].HSG_LOAN
        this.LOAN_SANCTION_DATE = this.Tax_Dec_Header_List[0].LOAN_SANCTION_DATE
        this.LOAN_SANCTION_DATE = this.datepipe.transform(new Date(this.LOAN_SANCTION_DATE), 'dd-MMM-yyyy')

        this.LOAN_AMOUNT = this.Tax_Dec_Header_List[0].LOAN_SANCTION_VALUE
        this.VALUE_AGREEMENT = this.Tax_Dec_Header_List[0].PROPERTY_VALUE
        this.NUMBER_HOUSE_OWNED = this.Tax_Dec_Header_List[0].NO_HOUSES
        this.LOAN_INTEREST_ANNUAL = this.Tax_Dec_Header_List[0].HSGLOAN_INT
        this.DRAFT = this.Tax_Dec_Header_List[0].DRAFT
      }
      this.onRegimeChange();
      this.rentChange();
      this.houseLoanClick()
      this.spinner = false;

    }, err => {
      this.spinner = false;
    });
  }


  f_saveFormData(drft: boolean) {

    //console.log("draft", this.DRAFT)
    this.Section_List.forEach((element: any) => {
      element.AMOUNT = (+element.AMOUNT)
    })

    this.Other_List.forEach((element: any) => {
      element.OTHER_CODE = (+element.OTHER_CODE)
    })

    var toDate = this.datepipe.transform(new Date(this.LOAN_SANCTION_DATE), 'yyyy-MM-dd')

    this.v_save_data.TAX_DECLARATION_HEADER = [{
      "EMP_NO": this.EMP_CODE,
      "REGIME_CODE": this.REGIME_CODE,
      "PREV_EMPLOYER_TAXABLE": (+this.EMPLOYER_TAXABLE),
      "PREV_EMPLOYER_TAXPAID": (+this.EMPLOYER_TAX_PAID),
      "NO_CHILDREN": ((this.REGIME_CODE == 1 || this.NUMBER_OF_CHILDREN == undefined) ? 0 : (+this.NUMBER_OF_CHILDREN)),
      "PAY_RENT": ((this.REGIME_CODE == 1 || this.PAY_RENT == undefined) ? "" : this.PAY_RENT),
      "ANNUAL_RENT": ((this.REGIME_CODE == 1 || this.ANNUAL_RENT == undefined) ? 0 : (+this.ANNUAL_RENT)),
      "HSG_LOAN": ((this.REGIME_CODE == 1 || this.HSG_LOAN == undefined) ? "" : this.HSG_LOAN),
      "LOAN_SANCTION_DATE": ((this.REGIME_CODE == 1 || toDate == undefined) ? "" : toDate),
      "LOAN_SANCTION_VALUE": ((this.REGIME_CODE == 1 || this.LOAN_AMOUNT == undefined) ? 0 : (+this.LOAN_AMOUNT)),
      "PROPERTY_VALUE": ((this.REGIME_CODE == 1 || this.VALUE_AGREEMENT == undefined) ? 0 : (+this.VALUE_AGREEMENT)),
      "NO_HOUSES": ((this.REGIME_CODE == 1 || this.NUMBER_HOUSE_OWNED == undefined) ? 0 : (+this.NUMBER_HOUSE_OWNED)),
      "HSGLOAN_INT": ((this.REGIME_CODE == 1 || this.LOAN_INTEREST_ANNUAL == undefined) ? 0 : (+this.LOAN_INTEREST_ANNUAL)),
      "DRAFT": drft,
      // "SUBMITTEDBY": "",
      // "SUBMITTEDON": "",
      // "HRAPPROVEDBY": "",
      // "HRAPPROVEDON": "",
      // "APPROVED": ""

    }]
      this.v_save_data.SECTION_80C_LIST = this.Section_List,
      this.v_save_data.OTHER_LIST = this.Other_List


    console.log("v_save_data", this.v_save_data)


    this.http.PostRequest(this.apiUrl.SaveTaxDeclarationApproval, this.v_save_data).then(res => {
      if (res.flag == true) {
       // console.log("save file", res)
        this.GetTaxDeclrationDetailList()
        this.getAllEmployee();
         this.onClearData();

        $("#search").val('').selectpicker('refresh').trigger('change');
        this.toast.success(res.msg);

        this.spinner = false;
      } else {

        this.spinner = false;
        this.toast.warning(res.msg)
      }
    }, err => {
      this.spinner = false;
    });
  }

  prevEmployerTaxChange() {
    if (this.EMPLOYER_TAXABLE < this.EMPLOYER_TAX_PAID) {
      this.toast.warning("should be less then employer taxable.")
      this.EMPLOYER_TAX_PAID = 0;
      return
    }
  }
  ChangeReceiptDate() {
    this.LOAN_SANCTION_DATE = this.datepipe.transform(new Date(this._DATE1), 'dd-MMM-yyyy')

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }
  onClearData() {
    this.EMPLOYER_TAXABLE = "";
    this.EMPLOYER_TAX_PAID = "";
    this.NUMBER_OF_CHILDREN = "";
    this.PAY_RENT = "";
    this.ANNUAL_RENT = "";
    this.HSG_LOAN = "";
    this.LOAN_SANCTION_DATE = new Date();
    this.LOAN_AMOUNT = "";
    this.VALUE_AGREEMENT = "";
    this.NUMBER_HOUSE_OWNED = "";
    this.LOAN_INTEREST_ANNUAL = "";
    this.AMOUNT = "";
  }

}
