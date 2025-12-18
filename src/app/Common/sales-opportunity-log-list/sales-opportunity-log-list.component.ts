import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { ChangeDetectorRef } from '@angular/core';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sales-opportunity-log-list',
  templateUrl: './sales-opportunity-log-list.component.html',
  styleUrls: ['./sales-opportunity-log-list.component.css']
})
export class SalesOpportunityLogListComponent implements OnInit {
  all_log_detail:any=[]
  spinner: boolean;
  LISTTYPE: any;
  customer_list: any;
  company_list: any;
  opportunity_list: any;
  opportunity_activity_list: any;
  opportunity_status_list: any;
  opportunity_substatus_list: any;
  probability_list: any;
  Nextactivity_list: any;
  lead_list: any;
  selectedStatus: any;
  employee_list: any;
  selectedManager:any;
  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private validationService: ValidationService) { }

  ngOnInit() {
    this.sharedService.formName = "Sales Opportunity Log List";
    this.GetOpportunityLogCommonList();
    this.GetOpportunityLogList();
  }

 editOpportunity(data: any){
  // Implement the logic to edit the opportunity
 }
   GetOpportunityLogList() {
    // this.LISTTYPE = val;
    let data = {
      // LISTTYPE: this.LISTTYPE,
      STATUS: this.selectedStatus?this.selectedStatus:'',
      EMP_CODE: this.selectedManager?this.selectedManager:'',
      USERID:this.sharedService.loginUser[0].USERID,
    }

    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetOpportunityLogList, data).then(res => {
      if (res.flag) {
        this.all_log_detail = res.log_list;
        this.all_log_detail.forEach((element: any) => {
          element.LOG_DATE = this.datePipe.transform(element.LOG_DATE, 'dd-MMM-yyyy');
        });
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
        console.log(this.opportunity_status_list);
        
        this.opportunity_substatus_list = res.opportunity_substatus_list;
        this.probability_list = res.probability_list;
        this.Nextactivity_list = res.Nextactivity_list;
        this.lead_list = res.lead_list
        this.employee_list = res.employee_list; 
  
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
  clear(){
    this.selectedStatus = null; 
  }
  clearManager(){
    this.selectedManager = null;
  }
  getopportunityLogDetails(data:any){
    localStorage.setItem('OPPO_CODE',data.OPPO_CODE);
    this.router.navigate(['/salesOpportunityLogDetails']);
  }

  

}
