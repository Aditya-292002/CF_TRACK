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
  maxDate: any ='';
  isViewOpportunity:boolean = false;

  selectedCust : boolean = true
  selectedEmp : boolean = false
  dropdownSelected1 : boolean = true
  dropdownSelected2 : boolean = false
  OPPO_CODE : any = '';

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
    this.GetOpportunityLogCommonList();
   this.OPPO_CODE= localStorage.getItem('OPPO_CODE');
       if(localStorage.getItem('OPPO_CODE') != '' && localStorage.getItem('OPPO_CODE') != null || localStorage.getItem('OPPO_CODE') != undefined){
        this.form.get('OPPO_CODE').setValue(this.OPPO_CODE);
        this.isUpdate = true;
      this.GetOpportunityLogDetails();
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

      this.maxDate = this.sharedService.loginUser[0].TO_DATE;

      this.LOG_DATE = this.sharedService.getTodayDate();

      this.form.get('LOG_DATE').setValue(this.LOG_DATE)

      this.NEXT_FOLLOWUP = this.sharedService.getTodayDate();

      this.form.get('NEXT_FOLLOWUP').setValue(this.NEXT_FOLLOWUP)

      $('.selectpicker').selectpicker('refresh').trigger('change');

      // this.GetOpportunityLogCommonList() 
      this
      
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
    this.form.get('CRMACTIVITY_CODE').setValue(data[0].CRMACTIVITY_CODE)
    this.form.get('NEXT_CRMACTIVITY').setValue(data[0].NEXTACTIVITY_CODE)
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

  SaveSalesOpportunityLog(para: string = '') {
    this.isSubmited = true;
    // if(this.f_validateForm()){
    let data = {
      USERID:this.sharedService.loginUser[0].USERID,
      CRM_OPPO_LOG:this.form.value,
    }
    console.log(data)
    this.http.PostRequest(this.apiUrl.SaveSalesOpportunityLog, data).then(res => {
      console.log(res)
      if (res.flag) {
        this.toast.success(res.msg)
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

        this.spinner = false;
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
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
  
}

