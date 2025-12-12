
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
declare var $: any;

@Component({
  selector: 'app-opportunity-master',
  templateUrl: './opportunity-master.component.html',
  styleUrls: ['./opportunity-master.component.css']
})
export class OpportunityMasterComponent implements OnInit {

  form: FormGroup;
  maxDate: any = '';
  minDate: any = '';
  search_user: string|null= null;
  // search_opportunity: string = "";
  EXPECTED_CLOSURE:  string = "";
  expectedClosureMaxDate: any;
  spinner: boolean = false;
  isSubmited: boolean = false;
  isUpdate: boolean = false;
  radioSelected0: boolean = true;
  radioSelected1: boolean = false;
  ADD_RIGHTS: boolean = false;
  UPDATE_RIGHTS: boolean = false;
  NO_RIGHTS: boolean = false;
  isNewAdd: boolean = false;
  isEditModeFill: boolean = false;
  isEditMode: boolean = false;
  NoDocs: number = 0;
  SelectedFileName: string = "";
  PROJECT_DATE: any = this.sharedService.getDDMMMYYYY(new Date());
  uploadingFiles: Array<any> = [];
  uploadedDocument: Array<any> = [];
  partyType: any;

  regx_AlphaSpace: RegExp = new RegExp(/^[^<>]*$/);
  // regx_AlphaSpace: RegExp = new RegExp(/^[a-zA-Z0-9\s.,@&()_-]*$/);

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('email', { static: false }) email: ElementRef;

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private validationService: ValidationService) { }

  company_list: Array<any> = [];
  currency_list: Array<any> = [];
  division_list: Array<any> = [];
  opportunity_list: Array<any> = [];
  opportunity_activity_list: Array<any> = [];
  opportunity_status_list: Array<any> = [];
  opportunitytype_list: Array<any> = [];
  segment_list: Array<any> = [];
  project_list: Array<any> = [];
  probability_list: Array<any> = [];
  opportunity_substatus_list: Array<any> = [];
  customer_list: Array<any> = [];
  location_list: Array<any> = [];
  lead_list: Array<any> = [];
  customercontact_list: Array<any> = [];
  leadcontact_list: Array<any> = [];
  accountmgr_list: Array<any> = [];
  DOCUMENT_ATTECHED_LIST: any = [];
  RESOLVE_DOC_LIST: any = [];
  filteredCustomerContacts: any[] = [];
  filteredLeadContacts: any[] = [];
  filteredCustomerSegments: any[] = [];
  filteredLeadSegments: any[] = [];
  filteredCustomerAccountManager: any[] = [];
  filteredLeadAccountManager: any[] = [];
  filteredSubStatus: any[] = [];
  FYEAR: any;
  COMPANY_CODE: any;
  LOCATION_CODE: any;
  COMPANY_CURRENCY: any;

  // ngOnInit() {
  //   this.sharedService.formName = "Opportunity Master"
  //   // this.search_opportunity = "";
  //   this.form = this.formBuilder.group({
  //     COMPANY_CODE: ["1000",Validators.required],
  //     OPPO_TYPE: ["",Validators.required],
  //     PROJECT_DATE: [""],
  //     OPPO_CODE: "",
  //     OPPO_NAME: ["",Validators.required, Validators.pattern(this.regx_AlphaSpace)],
  //     REFPROJ_CODE: ["",Validators.required],
  //     REFPROJ_NAME: [{ value: '', disabled: true }],
  //     LOCATION_CODE: ["1100",Validators.required],
  //     CUST_CODE: ["",Validators.required],
  //     LEAD_CODE: ["",Validators.required],
  //     LEAD_CONTACT: ["",Validators.required],
  //     DIVISION_CODE: ["",Validators.required],
  //     EST_VALUE: [""],
  //     OPPO_CURRENCY: ["INR",Validators.required],
  //     OPPO_EXCHANGE_RATE: ["1"],
  //     ACCOUNT_MGR: [""],
  //     OPPO_STATUS: ["",Validators.required],
  //     OPPO_SUB_STATUS: ["",Validators.required],
  //     CUST_CONTACT: ["",Validators.required],
  //     OPPO_REMARKS: [""],
  //     OPPO_SEGMENT: ["",Validators.required],
  //     LEAD_SEGMENT: ["",Validators.required],
  //     SEGMENT_CODE: ["",Validators.required],
  //     CUST_SEGMENT: [""],
  //     EXPECTED_CLOSURE:[""],
  //     PARTY_TYPE:["C"],
  //     PROBABILITY:["",Validators.required],
  //     LEADORCUST:[""],
  //     LEAD_ACC_MANAGER:["",Validators.required],
  //   })

  //   // --------------------------------------------------
  //   const today = new Date();
  //   // ISO format for restrictions
  //   this.minDate = today.toISOString().substring(0, 10); // "2025-11-18"
  //   // Display format remains handled by date-picker internally
  //   this.expectedClosureMaxDate = null;
  //   console.log("Restrict Min Date:", this.minDate);
  //   // ---------------------------------------------------

  //   this.form.get('CUST_CODE').valueChanges.subscribe((custData: any) => {
  //   if (custData) {
  //     this.onCustomerChange(custData);
  //   } else {
  //     this.resetCustomerAutoFields();
  //   }
  // });
  //   this.form.get('LEAD_CODE').valueChanges.subscribe((leadData: any) => {
  //     console.log("Lead Code Changed: ", leadData);
  //     if (leadData) {
  //       this.onLeadChange(leadData);
  //     } else {
  //       this.resetLeadAutoFields();
  //     }
  // });
  //   this.GetOpportunityCommonList();
    // this.GetOpportunityList();
  //   this.GetOpportunityMasterDetails()
  //   // this.form.controls['ACCOUNT_MGR'].disable();
  // }

  //  ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     // if (this.sharedService.form_rights.ADD_RIGHTS) {
  //     //   this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
  //     // }
  //     // if (this.sharedService.form_rights.UPDATE_RIGHTS) {
  //     //   this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
  //     // }
  //     this.ADD_RIGHTS = !!this.sharedService.form_rights.ADD_RIGHTS;
  //     this.UPDATE_RIGHTS = !!this.sharedService.form_rights.UPDATE_RIGHTS;
  //     this.NO_RIGHTS = !(this.ADD_RIGHTS || this.UPDATE_RIGHTS);
  //     this.maxDate = this.sharedService.loginUser[0].TO_DATE;
  //     this.PROJECT_DATE = this.sharedService.getTodayDate();
  //     this.form.get('PROJECT_DATE').setValue(this.PROJECT_DATE);
  //     this.form.get('LEADORCUST').setValue(this.form.getRawValue().PARTY_TYPE);
  //   }, 150);
  // }

  // Old Woking Code
  //   f_searchUserData() {
  //   console.log("Selected OPPO_CODE:", this.search_user);

  //   if (!this.search_user) return;

  //   let data = {
  //     OPPO_CODE: this.search_user,
  //     USERID: this.sharedService.loginUser[0].USERID
  //   };

  //   this.http.PostRequest(this.apiUrl.GetOpportunityMasterDetails, data)
  //     .then((res: any) => {
  //       console.log("Opportunity Detail Response:", res);

  //       if (res.flag && res.opportunity_detail.length) {
  //         this.isUpdate = true;
  //         this.fillOpportunityMasterData(res.opportunity_detail);
  //       } else {
  //         this.isUpdate = false;
  //         alert("No data found for selected opportunity ");
  //       }

  //       // refresh UI
  //       setTimeout(() => {
  //         $('#search').selectpicker('refresh');
  //       }, 200);
  //     })
  //     .catch(err => console.error("Detail fetch failed:", err));
  // }

  // Working Code 19-11-2025 bewfoe New Code Block
  // f_searchUserData() {
  //   console.log("Selected OPPO_CODE:", this.search_user);

  //   if (!this.search_user) return;

  //   let data = {
  //     OPPO_CODE: this.search_user,
  //     USERID: this.sharedService.loginUser[0].USERID
  //   };

  //   this.http.PostRequest(this.apiUrl.GetOpportunityMasterDetails, data)
  //     .then((res: any) => {
  //       console.log("Raw Response:", res);

  //       // Parse the actual JSON from 'raw'
  //       let parsed;
  //       try {
  //         parsed = JSON.parse(res.raw);
  //       } catch (err) {
  //         console.error("Failed to parse raw JSON:", err);
  //         alert("Failed to load opportunity details ");
  //         return;
  //       }

  //       const details = parsed.Opportunity_Master_Details;
  //       if (parsed.flag && details.length) {
  //         this.isUpdate = true;
  //         this.fillOpportunityMasterData(details);
  //       } else {
  //         this.isUpdate = false;
  //         alert("No data found for selected opportunity ");
  //       }

  //       setTimeout(() => {
  //         $('#search').selectpicker('refresh');
  //       }, 200);
  //     })
  //     .catch(err => console.error("Detail fetch failed:", err));
  // }

  // SearchProject : boolean= false;

  // LEAD_CODE:string=""
  // CUST_CODE:string=""

  //   formatToDDMMMYYYY(date: Date): string {
  //   const months = ["Jan","Feb","Mar","Apr","May","Jun",
  //                   "Jul","Aug","Sep","Oct","Nov","Dec"];

  //   const dd = ("0" + date.getDate()).slice(-2);
  //   const MMM = months[date.getMonth()];
  //   const yyyy = date.getFullYear();

  //   return `${dd}-${MMM}-${yyyy}`;
  // }


  // filterLocation() {
  //   /**Filter location dropdown based on  */
  //   this.location_list = [];
  //   for (let data of this.all_location_list) {
  //     if (data.COMPANY_CODE == this.form.getRawValue().COMPANY_CODE) {
  //       this.location_list.push(data)
  //     }
  //   }
  // }

  // GetOpportunityCommonList() {
  //   let data = {
  //     LISTTYPE:'All',
  //     USERID:this.sharedService.loginUser[0].USERID,
  //   }
  //   this.http.PostRequest(this.apiUrl.GetOpportunityCommonList, data).then(res => {
  //     if (res.flag) {
  //       this.customer_list = res.customer_list;
  //       this.company_list = res.company_list;
  //       this.opportunity_list = res.OpportunityList;
  //       console.log("Rendered Options:", this.opportunity_list);

  //       setTimeout(() => {
  //         const selectElement = $('#search');
  //         selectElement.selectpicker('destroy'); // remove old structure
  //         selectElement.selectpicker('render');  // rebuild
  //         selectElement.selectpicker('refresh'); // show updated data
  //       }, 0);
  //       this.opportunity_activity_list = res.opportunity_activity_list;
  //       this.opportunity_status_list = res.opportunity_status_list;
  //       this.opportunity_substatus_list = res.opportunity_substatus_list;
  //       this.probability_list = res.probability_list;
  //       this.currency_list = res.currency_list;
  //       this.division_list = res.division_list;
  //       this.opportunitytype_list = res.opportunitytype_list;
  //       this.segment_list = res.segment_list;
  //       this.project_list = res.project_list;
  //       this.location_list = res.location_list;
  //       this.lead_list = res.lead_list;
  //       this.customercontact_list = res.customercontact_list;
  //       this.leadcontact_list = res.leadcontact_list;
  //       this.accountmgr_list=res.accountmgr_list;

  //       console.log("Lead Contact List :",this.leadcontact_list)
  //       console.log("controls :",this.form.controls)
  //       setTimeout(() => {
  //         $('.selectpicker').selectpicker('refresh').trigger('change');
  //       }, 100);
  //       this.spinner = false;
  //     } else {
  //       this.spinner = false;
  //     }
  //   }, err => {
  //     this.spinner = false;
  //   });
  // };

  // SaveOpportunityMaster(para: string = '') {

  //   this.isSubmited = true;
  //   //-------------------------------
  //    if (this.form.invalid) {
  //   return;
  // }
  // // Remove comma from EST_VALUE before save
  // const estControl = this.form.get('EST_VALUE');
  // if (estControl && estControl.value) {
  //   const cleanValue = estControl.value.toString().replace(/,/g, '');
  //   estControl.setValue(cleanValue, { emitEvent: false });
  // }
  //   //-------------------------------

  //   let _documents = [];
  //   for (let i = 0; i < this.uploadedDocument.length; i++) {
  //     // if (this.uploadedDocument[i].ISNEW == 1 || this.uploadedDocument[i].ACTIVE == 0) {
  //     _documents.push({
  //       OPPO_CODE:"",
  //       DOC_SRNO: '0',
  //       DOCUMENT_NAME: this.uploadedDocument[i].DOCUMENT_NAME,
  //       DOCUMENT_FILENAME: this.uploadedDocument[i].DOCUMENT_FILENAME,
  //       DOCUMENT_SYSFILENAME: this.uploadedDocument[i].DOCUMENT_SYSFILENAME,
  //       // UPLOAD_BY: this.uploadedDocument[i].UPLOAD_BY_USERID,
  //      // UPLOAD_BY_USERID: this.uploadedDocument[i].UPLOAD_BY_USERID,
  //       ACTIVE: this.uploadedDocument[i].ACTIVE,
  //       ISNEW: this.uploadedDocument[i].ISNEW,
  //      // ISNEW: this.uploadedDocument[i].ISNEW
  //     })
  //      //}
  //   }
  //   // if(this.f_validateForm()){
  //   let data = {
  //     USERID:this.sharedService.loginUser[0].USERID,
  //     CRM_OPPORTUNITY:this.form.value,
  //     OPPORTUNITY_DOCUMENT_LIST: _documents,
  //   }
  //   console.log(data)
  //   this.http.PostRequest(this.apiUrl.SaveOpportunityMaster, data).then(res => {
  //     console.log("SaveOpportunityMasterRes",res)
  //     if (res.flag) {
  //       this.toast.success(res.msg)
  //       this.GetOpportunityList();
  //       this.f_clearForm()
  //       this.spinner = false;
  //     } else {
  //       this.toast.warning(res.msg)
  //       this.spinner = false;
  //     }
  //     // 
  //     this.isSubmited = true;
  //     if (this.form.invalid) { return; }
  //     const rawValue = this.form.value;
  //     const numericValue = rawValue.EST_VALUE ? rawValue.EST_VALUE.replace(/,/g, '') : '';
  //     console.log('Clean numeric value:', numericValue);
  //      this.GetRemoveBase64DocumnetExtension(this.DOCUMENT_ATTECHED_LIST);
  //     // 
  //   }, err => {
  //     this.spinner = false;
  //   });
  // //  }
  // }

  //   GetOpportunityList() {
  //   let data = {
  //     USERID:this.sharedService.loginUser[0].USERID,
  //   }
  //   this.http.PostRequest(this.apiUrl.GetOpportunityList, data).then(res => {
  //     console.log(res)
  //     if (res.flag) {
  //       this.opportunity_list = res.Opportunity_List;
  //       this.fillOpportunityMasterData(res.opportunity_detail)
  //       this.spinner = false;
  //     } else {
  //       this.spinner = false;
  //     }
  //   }, err => {
  //     this.spinner = false;
  //   });
  // }


  // searchOpportunity() {
  //   this.isUpdate = false;
  //   if (this.search_opportunity != "" || this.search_opportunity != undefined) {
  //     this.isUpdate = true;
  //     this.GetOpportunityMasterDetails();
  //   } else {
  //     this.isUpdate = false;
  //     this.f_clearForm();
  //   }
  //   setTimeout(() => {
  //     $('.selectpicker').selectpicker('refresh').trigger('change');
  //   }, 150);
  // }

  // GetOpportunityList() {
  //   let data = {
  //     USERID: this.sharedService.loginUser[0].USERID,
  //   };

  //   this.http.PostRequest(this.apiUrl.GetOpportunityList, data)
  //     .then((res: any) => {

  //       console.log("🔥 GetOpportunityList CALLED");

  //       const parsed = typeof res.raw === "string"
  //         ? JSON.parse(res.raw.replace(/undefined/g, "null"))
  //         : res;

  //       this.opportunity_list = parsed.OpportunityList || [];
  //       console.log("Final Opportunity List:", this.opportunity_list);

  //       this.spinner = false;

  //       // ⏳ WAIT for Angular to render <option> elements
  //       setTimeout(() => {
  //         console.log("🔃 Refreshing selectpicker...");
  //         $('#search').selectpicker('destroy').selectpicker('refresh');
  //       }, 600);
  //     })
  //     .catch(err => {
  //       console.error("API Error:", err);
  //       this.spinner = false;
  //     });
  // }


  commentBreaker = "/* ******************************************************* */";
  // 20-11-2025 New Functions Block-------------------------------------------------------------------------------------
  ngOnInit() {
    this.sharedService.formName = "Opportunity Master";
    this.sharedService.form_rights=JSON.parse (sessionStorage.getItem("form_rights")) ;;
    // Init form
    this.form = this.formBuilder.group({
      COMPANY_CODE: ["", Validators.required],
      LOCATION_CODE: ["", Validators.required],
      OPPO_TYPE: ["", Validators.required],
      PROJECT_DATE: [""],
      OPPO_CODE: [""],
      OPPO_NAME: ["", [Validators.required, Validators.pattern(this.regx_AlphaSpace)]],
      REFPROJ_CODE: ["", Validators.required],
      REFPROJ_NAME: [{ value: '', disabled: true }],
      LEAD_CODE: [""],
      LEAD_CONTACT: [""],
      LEAD_SEGMENT: [""],
      LEAD_ACC_MANAGER: [""],
      CUST_CODE: [],
      CUST_CONTACT: [""],
      CUST_SEGMENT: [""],
      CUST_ACC_MANAGER: [""],
      DIVISION_CODE: [""],
      EST_VALUE: [""],
      OPPO_CURRENCY: ["INR"],
      OPPO_EXCHANGE_RATE: ["1"],
      ACCOUNT_MGR: [""],
      OPPO_STATUS: [""],
      OPPO_SUB_STATUS: [""],
      OPPO_REMARKS: [""],
      OPPO_SEGMENT: [""],
      SEGMENT_CODE: [""],
      EXPECTED_CLOSURE: [""],
      PARTY_TYPE: ["C"],
      PROBABILITY: [""],
      LEADORCUST: [""],
    });
    // Date restrictions
    const today = new Date();
    this.minDate = today.toISOString().substring(0, 10);
    // this.expectedClosureMaxDate = null;
    console.log("Restrict Min Date:", this.minDate);
    // PARTY_TYPE changes toggles validators and UI
    this.form.get('PARTY_TYPE').valueChanges.subscribe(type => {
      console.log("Switched PARTY_TYPE:", type);
      this.showContent(type);
    });
    // Conditionally listen for CUST_CODE or LEAD_CODE changes only when appropriate
    // this.form.get('CUST_CODE').valueChanges.subscribe((customerCode: any) => {
    //   if (this.form.get('PARTY_TYPE').value === 'C' && customerCode) {
    //     this.onCustomerChange(customerCode);
    //   } else if (this.form.get('PARTY_TYPE').value === 'C' && !customerCode) {
    //     this.resetCustomerAutoFields();
    //   }
    // });
    // this.form.get('LEAD_CODE').valueChanges.subscribe((leadCode: any) => {
    //   if (this.form.get('PARTY_TYPE').value === 'L' && leadCode) {
    //     // this.onLeadChange(leadCode);
    //   } else if (this.form.get('PARTY_TYPE').value === 'L' && !leadCode) {
    //     this.resetLeadAutoFields();
    //   }
    // });
    $('.selectpicker').selectpicker('refresh').trigger('change');
 
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
       if (this.sharedService.form_rights.ADD_RIGHTS) {
        this.ADD_RIGHTS = this.sharedService.form_rights.ADD_RIGHTS
      }
      if (this.sharedService.form_rights.UPDATE_RIGHTS) {
        this.UPDATE_RIGHTS = this.sharedService.form_rights.UPDATE_RIGHTS
      }
      this.NO_RIGHTS = this.ADD_RIGHTS || this.UPDATE_RIGHTS?false:true;
    }, 150);
    setTimeout(() => {
      this.maxDate = this.sharedService.loginUser[0].TO_DATE;
      this.FYEAR = this.sharedService.loginUser[0].FYEAR;
      this.COMPANY_CURRENCY = this.sharedService.loginUser[0].COMPANY_CURRENCY;
      this.form.get('PROJECT_DATE').setValue(this.sharedService.getTodayDate())
      this.PROJECT_DATE = this.sharedService.getTodayDate();
      this.GetOpportunityCommonList();
    }, 150);
    this.GetOpportunityList();
     $('.selectpicker').selectpicker('refresh').trigger('change');
  }

  SaveOpportunityMaster(para: string = '') {
  this.partyType = this.form.get('PARTY_TYPE').value;
  // 🔹 1️⃣ Apply correct validators based on selected mode
  this.updatePartyValidators();
  this.form.markAllAsTouched();
  this.isSubmited = true;
  // Debug: Check if wrong validators still exist
  console.log('Err(CUST):', this.form.get('CUST_SEGMENT').errors, this.form.get('CUST_ACC_MANAGER').errors);
  console.log('Party:', this.form.get('PARTY_TYPE').value);
  if (this.form.invalid) {
    console.warn("FORM ERRORS", this.form.errors);
    this.toast.warning("Some required fields are missing or invalid");
    return;
  }
  // 🔹 2️⃣ Auto-fill AFTER validators are set correctly
  if (this.partyType === 'C') {
    var custCode = this.form.get('CUST_CODE').value;
    if (custCode) {
      var cust = this.customer_list.find(function (x) { return x.CUST_CODE === custCode; });
      console.log("Cust :", cust);
      if (cust) {
        if (!this.form.get('CUST_SEGMENT').value) {
          this.form.get('CUST_SEGMENT').setValue(cust.CUST_SEGMENT || null);
        }
        const cEstControl = this.form.get('EST_VALUE');
        if (cEstControl && cEstControl.value) {
          const cleanValue = cEstControl.value.toString().replace(/,/g, '');
          cEstControl.setValue(Number(cleanValue), { emitEvent: false });
        }
        if (!this.form.get('CUST_ACC_MANAGER').value) {
          this.form.get('CUST_ACC_MANAGER').setValue(cust.ACCT_MANAGER || null);
        }
        // Autofill contact if empty
        if (!this.form.get('CUST_CONTACT').value) {
          var contact = this.customercontact_list.find(function (c) { return c.CUST_CODE === custCode; });
          this.form.get('CUST_CONTACT').setValue(contact ? contact.CUST_SRNO : null);
        }
      }
    }
  } else if (this.partyType === 'L') {
    var leadCode = this.form.get('LEAD_CODE').value;
    if (leadCode) {
    var leadObj = this.lead_list.find(function (x) { return x.LEAD_CODE === leadCode; });
    console.log("leadObj :", leadObj);
    this.form.get('LEAD_SEGMENT').setValue(leadObj.CUST_SEGMENT || null);
    const lEstControl = this.form.get('EST_VALUE');
    if (lEstControl && lEstControl.value) {
      const cleanValue = lEstControl.value.toString().replace(/,/g, '');
      lEstControl.setValue(Number(cleanValue), { emitEvent: false });
    }
    // Autofill Contact if empty
    if (!this.form.get('LEAD_CONTACT').value) {
      var lcontact = this.leadcontact_list.find(function (x) { return x.LEAD_CODE === leadCode; });
      this.form.get('LEAD_CONTACT').setValue(lcontact ? lcontact.LEAD_SRNO : null);
    }
    // Autofill Manager if empty
    if (!this.form.get('LEAD_ACC_MANAGER').value) {
      this.form.get('LEAD_ACC_MANAGER').setValue(leadObj && leadObj.EMP_NO ? leadObj.EMP_NO : null);
    }
  }
}
  // Final validation after auto-fill
  if (this.form.invalid) {
    this.toast.warning("Some required fields are missing or invalid");
    return;
  }
  // 🔹 3️⃣ Prepare Save Payload
  this.stripBase64FromDocuments();
  const selectedDate: Date = this.form.value.EXPECTED_CLOSURE;
  const formattedDate = this.datePipe.transform(selectedDate, 'dd-MMM-yyyy');
  var crmOpportunity = this.form.getRawValue();
  crmOpportunity.LEADORCUST = this.partyType;
  crmOpportunity.CUST_CONTACT = crmOpportunity.CUST_CONTACT || null;
  crmOpportunity.CUST_CODE = crmOpportunity.CUST_CODE || null;
  crmOpportunity.OPPO_BASEVALUE = Number(crmOpportunity.OPPO_BASEVALUE || 0);
  crmOpportunity.OPPO_EXCHANGE_RATE = Number(crmOpportunity.OPPO_EXCHANGE_RATE || 1);
  crmOpportunity.PROBABILITY = Number(crmOpportunity.PROBABILITY || 0);
  crmOpportunity.EXPECTED_CLOSURE = formattedDate;
  // Fix Dates
  // if (crmOpportunity.PROJECT_DATE) {
  //   crmOpportunity.PROJECT_DATE = new Date(crmOpportunity.PROJECT_DATE).toISOString().split("T")[0];
  // }
  //------------------------------
  // if (crmOpportunity.PROJECT_DATE) {
  // crmOpportunity.PROJECT_DATE =
  // this.normalizeDDMMMYYYY(crmOpportunity.PROJECT_DATE);
  // }
  //------------------------------
  // this.form.get('PROJECT_DATE').setValue(this.sharedService.getFormatedDate(data[0].PROJECT_DATE))

  var data = {
    USERID: this.sharedService.loginUser[0].USERID,
    CRM_OPPORTUNITY: crmOpportunity,
    DOCUMENT_ATTECHED_LIST: this.DOCUMENT_ATTECHED_LIST
  };
  console.log("SaveOpportunityMaster Save Payload: ", data);
  // return
  // 🔹 4️⃣ Call API
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.SaveOpportunityMaster, data).then(
    (res: any) => {
      this.spinner = false;
      if (res.flag) {
        this.toast.success(res.msg || "Saved successfully");
        this.GetOpportunityList();
        this.f_clearForm();
      } else {
        this.toast.warning(res.msg || "Save failed");
      }
    },
    (err) => {
      this.spinner = false;
      this.toast.error("Server error while saving.");
    }
  );
}

  // ============= GET LISTS =============
GetOpportunityList() {
  const data = { USERID: this.sharedService.loginUser[0].USERID };
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetOpportunityList, data).then(res => {
      if (res && res.flag === 1) {
        this.opportunity_list = res.OpportunityList || [];
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
      } 
    })
    .catch(err => {
      console.error('Error loading opportunity list:', err);
    })
    .finally(() => {
      this.spinner = false;
    });
}

GetOpportunityCommonList() {
  console.log('test1 ')
  let data = {
    LISTTYPE: 'All',
    USERID: this.sharedService.loginUser[0].USERID,
  };
  console.log("LoginUser:", this.sharedService.loginUser);
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.GetOpportunityCommonList, data).then(res => {
    this.spinner = false;
    if (res.flag) {
      this.customer_list = res.customer_list || [];
      this.company_list = res.company_list || [];
      this.opportunity_activity_list = res.opportunity_activity_list || [];
      this.opportunity_status_list = res.opportunity_status_list || [];
      this.opportunity_substatus_list = res.opportunity_substatus_list || [];
      this.probability_list = res.probability_list || [];
      this.currency_list = res.currency_list || [];
      this.division_list = res.division_list || [];
      this.opportunitytype_list = res.opportunitytype_list || [];
      this.segment_list = res.segment_list || [];
      this.project_list = res.project_list || [];
      this.location_list = res.location_list || [];
      this.lead_list = res.lead_list || [];
      this.customercontact_list = res.customercontact_list || [];
      this.leadcontact_list = res.leadcontact_list || [];
      this.accountmgr_list = res.accountmgr_list || [];
      this.form.get('COMPANY_CODE').setValue(this.company_list[0].COMPANY_CODE);
      this.form.get('LOCATION_CODE').setValue(this.location_list[0].LOCATION_CODE);
      // Refresh selects after lists loaded
      setTimeout(() => {
        this.refreshSelectPicker();
      }, 50);
    }
  }, err => {
    this.spinner = false;
  });
}

  // ============= SEARCH / LOAD =============
f_searchUserData() {
  console.log('test')
  this.isUpdate = false;
  if (this.search_user != "") {
    for (let i = 0; i < this.opportunity_list.length; i++) {
      if (this.search_user == this.opportunity_list[i].OPPO_CODE) {
        this.GetOpportunityMasterDetails();
        return;
      }
    }
    // Not found -> still attempt to fetch
    //this.GetOpportunityMasterDetails();
  } else {
    this.GetOpportunityMasterDetails();
  }
}

GetOpportunityMasterDetails() {
    debugger
  const data = {
    USERID: this.sharedService.loginUser[0].USERID,
    OPPO_CODE: this.search_user
  };
  this.spinner = true;
  console.log(" data ", JSON.stringify(data));
  this.http.PostRequest(this.apiUrl.GetOpportunityMasterDetails, data).then(res => {
    this.spinner = false;
    if (res.flag && res.Opportunity_Master_Details.length > 0) {
      console.log("res.Opportunity_Master_Details -> ", JSON.stringify(res.Opportunity_Master_Details));
      this.isUpdate = true; // 👈 Enable Update mode
      // Existing documents from DB must be included in the save payload
      this.DOCUMENT_ATTECHED_LIST = (res.iteamlist || []).map(d => ({
      DOCUMENT_NAME: d.DOCUMENT_NAME,
      DOCUMENT_FILENAME: d.DOCUMENT_FILENAME,
      DOCUMENT_SYSFILENAME: d.DOCUMENT_SYSFILENAME,
      FILE_EXTENSION: d.DOCUMENT_FILENAME.split('.').pop().toLowerCase(),
      ACTIVE: d.ACTIVE ? 1 : 0,
      ISNEW: 0,
      DOC_BASE64: null
    }));
    // IMPORTANT — UI list
    this.uploadedDocument = [...this.DOCUMENT_ATTECHED_LIST];
    this.NoDocs = this.uploadedDocument.filter(x => x.ACTIVE != 0).length;
      this.fillOpportunityMasterData(res.Opportunity_Master_Details);
      // Make sure correct auto-fill applies based on PARTY_TYPE
      setTimeout(() => {
        const partyType = this.form.get('PARTY_TYPE').value;
        if (partyType === 'C') {
          this.onCustomerChange(this.form.get('CUST_CODE').value);
        }
        if (partyType === 'L') {
          this.onLeadChange(this.form.get('LEAD_CODE').value);
            // this.isUpdate=true;
        }
        this.refreshSelectPicker();
      }, 300);
    } 
    // else {
    //   console.log("New Record Mode: No existing data.");
    //   this.isUpdate = false; // 👈 New record
    // }
  }, err => {
    console.error("Error fetching Opportunity:", err);
    this.spinner = false;
  });
}

// GetOpportunityMasterDetails() {
//   const data = {
//     USERID: this.sharedService.loginUser[0].USERID,
//     OPPO_CODE: this.search_user
//   };

//   this.spinner = true;

//   this.http.PostRequest(this.apiUrl.GetOpportunityMasterDetails, data).then(res => {
//     this.spinner = false;

//     if (res.flag && res.Opportunity_Master_Details.length) {
//       this.isUpdate = true;
//       this.fillOpportunityMasterData(res.Opportunity_Master_Details);

//       setTimeout(() => {
//         const party = this.form.get('PARTY_TYPE').value;
//         if (party === 'C') this.onCustomerChange(this.form.get('CUST_CODE').value);
//         if (party === 'L') this.onLeadChange(this.form.get('LEAD_CODE').value);

//         this.refreshSelectPicker();
//       }, 300);
//     }
//   }).catch(err => {
//     console.error("Error fetching Opportunity:", err);
//     this.spinner = false;
//   });
// }

fillOpportunityMasterData(data: any) {
if (!data || data.length === 0) return;
const row = data[data.length - 1]; // use last record
// PARTY TYPE
const party = (row.LEADORCUST || 'C').trim();  
// 1️⃣ Set PARTY_TYPE first
this.form.get('PARTY_TYPE').setValue(party, { emitEvent: false });
// 2️⃣ Apply validators (this resets validators only)
this.showContent(party);
// 3️⃣ Now set CUST / LEAD values AFTER showContent()
if (party === 'C') {
  this.form.get('CUST_CODE').setValue(row.CUST_CODE);
  this.onCustomerChange(row.CUST_CODE);
}
else if (party === 'L') {
  this.form.get('LEAD_CODE').setValue(row.LEAD_CODE);
  this.onLeadChange(row.LEAD_CODE);
}
this.isEditMode = true;
this.isEditModeFill = true;
this.form.get('COMPANY_CODE').setValue(this.company_list[0].COMPANY_CODE);
this.form.get('LOCATION_CODE').setValue(this.location_list[0].LOCATION_CODE);
this.form.get('OPPO_TYPE').setValue(row.PROJECT_TYPE || "");
this.form.get('PROJECT_DATE').setValue(row.PROJECT_DATE ? this.sharedService.getFormatedDate(row.PROJECT_DATE) : new Date());
this.form.get('OPPO_CODE').setValue(row.OPPO_CODE || '');
this.form.get('OPPO_NAME').setValue(row.OPPO_NAME || '');
this.form.get('REFPROJ_CODE').setValue(row.REFPROJ_CODE || '');
this.form.get('DIVISION_CODE').setValue(row.DIVISION_CODE || '');
// EST_VALUE formatting
let estValue = row.EST_VALUE;
if (estValue) {
  estValue = estValue.toString().replace(/[^0-9.]/g, '');
  this.form.get('EST_VALUE').setValue(Number(estValue).toLocaleString('en-IN'));
} else {
  this.form.get('EST_VALUE').setValue('');
}
this.form.get('OPPO_CURRENCY').setValue(row.OPPO_CURRENCY || 'INR');
this.form.get('OPPO_EXCHANGE_RATE').setValue(row.OPPO_EXCHANGE_RATE || '1');
this.form.get('ACCOUNT_MGR').setValue(row.ACCOUNT_MGR || '');
this.form.get('OPPO_STATUS').setValue(row.OPPO_STATUS || '');
this.form.get('OPPO_SUB_STATUS').setValue(row.OPPO_SUB_STATUS || '');
this.form.get('OPPO_REMARKS').setValue(row.OPPO_REMARKS || '');
this.form.get('PROBABILITY').setValue(row.PROBABILITY || '');
const raw = data[0].EXPECTED_CLOSURE; 
this.form.get('EXPECTED_CLOSURE').setValue(new Date(raw));
// Documents
if (Array.isArray(row.OPPORTUNITY_DOCUMENT_LIST)) {
  this.DOCUMENT_ATTECHED_LIST = row.OPPORTUNITY_DOCUMENT_LIST.map((d: any, idx: number) => ({
    DOC_SRNO: d.DOC_SRNO || (idx + 1),
    DOCUMENT_NAME: d.DOCUMENT_NAME || d.DOCUMENT_FILENAME || '',
    DOCUMENT_FILENAME: d.DOCUMENT_FILENAME || '',
    DOCUMENT_SYSFILENAME: d.DOCUMENT_SYSFILENAME || '',
    DOCUMENT_FILETYPE: (
      d.DOCUMENT_FILETYPE ||
      (d.DOCUMENT_FILENAME ? d.DOCUMENT_FILENAME.split('.').pop() : '')
    ).toLowerCase(),
    ACTIVE: d.ACTIVE || 1,
    ISNEW: 0,
    UPLOAD_BY: d.UPLOAD_BY || '',
    UPLOAD_BY_USERID: d.UPLOAD_BY_USERID || '',
    b64: d.b64 || ''
  }));
}
this.form.updateValueAndValidity();
console.log("LEADORCUST: ", row.LEADORCUST);
console.log("Current Form Log :", this.form.value);
setTimeout(() => {
  this.isEditModeFill = false;
  this.refreshSelectPicker();
}, 150);
// Normalize empty values but KEEP customer/lead fields safe
setTimeout(() => {
  this.isEditModeFill = false;
  this.refreshSelectPicker();
  const skipKeys = [
  
  ];
  Object.keys(this.form.controls).forEach(key => {
    console.log("Line 881 Key :", key);
    if (skipKeys.includes(key)) return; // don't overwrite filled values
    const ctrl = this.form.get(key);
    if (ctrl && ctrl.value === '') {
      ctrl.setValue(null);
    }
    ctrl.updateValueAndValidity();
  });
}, 150);
}

// fillOpportunityMasterData(data: any[]) {
//   if (!data || !data.length) return;

//   const row = data[data.length - 1];
//   const party = (row.LEADORCUST || 'C').trim();

//   // Set party first
//   this.setVal('PARTY_TYPE', party);
//   this.showContent(party);

//   // Apply Customer/Lead fill
//   if (party === 'C') {
//     this.setVal('CUST_CODE', row.CUST_CODE);
//     this.onCustomerChange(row.CUST_CODE);
//   } else {
//     this.setVal('LEAD_CODE', row.LEAD_CODE);
//     this.onLeadChange(row.LEAD_CODE);
//   }

//   // General fields
//   this.setVal('COMPANY_CODE', this.company_list[0].COMPANY_CODE);
//   this.setVal('LOCATION_CODE', this.location_list[0].LOCATION_CODE);

//   this.setVal('OPPO_TYPE', row.PROJECT_TYPE);
//   this.setVal('PROJECT_DATE', this.sharedService.getFormatedDate(row.PROJECT_DATE));
//   this.setVal('OPPO_CODE', row.OPPO_CODE);
//   this.setVal('OPPO_NAME', row.OPPO_NAME);
//   this.setVal('REFPROJ_CODE', row.REFPROJ_CODE);
//   this.setVal('DIVISION_CODE', row.DIVISION_CODE);

//   this.setVal('EST_VALUE', this.formatEstValue(row.EST_VALUE));

//   this.setVal('OPPO_CURRENCY', row.OPPO_CURRENCY || 'INR');
//   this.setVal('OPPO_EXCHANGE_RATE', row.OPPO_EXCHANGE_RATE || '1');
//   this.setVal('ACCOUNT_MGR', row.ACCOUNT_MGR);
//   this.setVal('OPPO_STATUS', row.OPPO_STATUS);
//   this.setVal('OPPO_SUB_STATUS', row.OPPO_SUB_STATUS);
//   this.setVal('OPPO_REMARKS', row.OPPO_REMARKS);
//   this.setVal('PROBABILITY', row.PROBABILITY);
//   this.setVal('EXPECTED_CLOSURE', new Date(data[0].EXPECTED_CLOSURE));

//   // Documents
//   if (Array.isArray(row.OPPORTUNITY_DOCUMENT_LIST)) {
//     this.DOCUMENT_ATTECHED_LIST = row.OPPORTUNITY_DOCUMENT_LIST.map((d, idx) => ({
//       DOC_SRNO: d.DOC_SRNO || (idx + 1),
//       DOCUMENT_NAME: d.DOCUMENT_NAME || d.DOCUMENT_FILENAME || '',
//       DOCUMENT_FILENAME: d.DOCUMENT_FILENAME,
//       DOCUMENT_SYSFILENAME: d.DOCUMENT_SYSFILENAME,
//       DOCUMENT_FILETYPE: (d.DOCUMENT_FILETYPE || (d.DOCUMENT_FILENAME.split('.').pop() || '')).toLowerCase(),
//       ACTIVE: d.ACTIVE || 1,
//       ISNEW: 0,
//       UPLOAD_BY: d.UPLOAD_BY,
//       UPLOAD_BY_USERID: d.UPLOAD_BY_USERID,
//       b64: d.b64
//     }));
//   }

//   // Normalize empty fields
//   setTimeout(() => {
//     this.normalizeForm();
//     this.refreshSelectPicker();
//   }, 200);
// }

showContent(para: string) {
  this.radioSelected0 = (para === 'C');
  this.radioSelected1 = (para === 'L');
  const custControls = ['CUST_CODE', 'CUST_CONTACT', 'CUST_SEGMENT', 'CUST_ACC_MANAGER'];
  const leadControls = ['LEAD_CODE', 'LEAD_CONTACT', 'LEAD_SEGMENT', 'LEAD_ACC_MANAGER'];
  // Clear validators + reset touched for all
  [...custControls, ...leadControls].forEach(name => {
    const ctrl = this.form.get(name);
    ctrl.clearValidators();
    ctrl.setErrors(null);
    ctrl.markAsUntouched();
    ctrl.markAsPristine();
    ctrl.updateValueAndValidity({ emitEvent: false });
  });
  // Apply required validators only to active party fields
  // if (para === 'C') {
  //   custControls.forEach(name => {
  //     this.form.get(name).setValidators([Validators.required]);
  //     this.form.get(name).updateValueAndValidity({ emitEvent: false });
  //   });
  // }
  // else if (para === 'L') {
  //   leadControls.forEach(name => {
  //     this.form.get(name).setValidators([Validators.required]);
  //     this.form.get(name).updateValueAndValidity({ emitEvent: false });
  //   });
  // }
  // Refresh UI
  setTimeout(() => this.refreshSelectPicker(), 50);
}

f_clearForm() {
  if (this.fileInput && this.fileInput.nativeElement) {
    this.fileInput.nativeElement.value = "";
  }
  this.isSubmited = false;
  this.search_user = "";
  this.form.reset();
  this.isUpdate = false;

  // reset defaults
  this.form.get('COMPANY_CODE').setValue("1000");
  this.form.get('LOCATION_CODE').setValue("1100");
  this.form.get('OPPO_EXCHANGE_RATE').setValue("1");
  this.form.get('OPPO_CURRENCY').setValue("INR");
  this.form.get('CUST_CODE').setValue("");
  this.form.get('PARTY_TYPE').setValue("C");
  this.form.get('PROJECT_DATE').setValue(this.sharedService.getTodayDate())
  this.PROJECT_DATE = this.sharedService.getTodayDate();
  this.uploadedDocument = [];
  this.DOCUMENT_ATTECHED_LIST = [];
  this.NoDocs = 0;

  setTimeout(() => this.refreshSelectPicker(), 80);
  // setTimeout(() => $('.selectpicker').selectpicker('refresh').trigger('change'), 100);
}

// applyCustomerDependencies(custCode: string) {
//   if (this.form.get('PARTY_TYPE').value === 'L') return;
//   const selectedCustomer = this.customer_list.find(c => c.CUST_CODE === custCode);
//   if (!selectedCustomer) return;

//   this.filteredCustomerContacts = this.customercontact_list.filter(c => c.CUST_CODE === custCode);
//   console.log("applyCustomerDependencies (filteredCustomerContacts) :", this.filteredCustomerContacts);
//   this.filteredCustomerSegments = this.segment_list.filter(s => s.OPPO_SEGMENT === selectedCustomer.CUST_SEGMENT);
//   this.filteredCustomerAccountManager = this.customer_list.filter(a => a.ACCT_MANAGER === selectedCustomer.ACCT_MANAGER);

//   if (this.filteredCustomerContacts.length > 0) {
//     // auto-select first contact code (depending on your UI)
//     this.form.get('CUST_CONTACT').setValue(this.filteredCustomerContacts[0].CUST_CODE || '');
//   } else {
//     this.form.get('CUST_CONTACT').reset();
//   }

//   // console.log("applyCustomerDependencies:",{ custCode, filteredCustomerContacts: this.filteredCustomerContacts });
//   console.log("Filtered contacts:");
//   this.filteredCustomerContacts.forEach(c => console.log(c));

//   if (this.filteredCustomerSegments.length > 0) {
//     this.form.get('OPPO_SEGMENT').setValue(this.filteredCustomerSegments[0].OPPO_SEGMENT);
//   };

//   setTimeout(() => this.refreshSelectPicker(), 60);
// }

// applyLeadDependencies(leadCode: string) {
//   if (this.partyType === 'C') return;
//   const selectedLead = this.lead_list.find(l => l.LEAD_CODE === leadCode);
//   if (!selectedLead) return;

//   // this.filteredLeadContacts = this.leadcontact_list.filter(c => c.LEAD_CODE === leadCode);
//   this.filteredLeadSegments = this.segment_list.filter(s => s.OPPO_SEGMENT === selectedLead.CUST_SEGMENT);
//   this.filteredLeadAccountManager = this.accountmgr_list.filter(a => a.EMP_NO === selectedLead.EMP_NO);
//   // ---------------------------
//   // Contacts
//   this.filteredLeadContacts = this.leadcontact_list.filter(c => c.LEAD_CODE === selectedLead.LEAD_CODE
//   );
//   if (this.filteredLeadContacts.length > 0) {
//     console.log("Filtered Lead Contacts:", this.filteredLeadContacts);
//     this.form.get('LEAD_CONTACT').setValue(this.filteredLeadContacts[0].LEAD_CODE || '');
//   } else {
//     this.form.get('LEAD_CONTACT').reset();
//   }
//   // ---------------------------
//   if (this.filteredLeadSegments.length > 0) {
//     this.form.get('LEAD_SEGMENT').setValue(this.filteredLeadSegments[0].CUST_SEGMENT);
//   } else {
//     this.form.get('LEAD_SEGMENT').reset();
//   }
//   if (this.filteredLeadAccountManager.length > 0) {
//     this.form.get('LEAD_ACC_MANAGER').setValue(this.filteredLeadAccountManager[0].EMP_NO);
//   } else {
//     this.form.get('LEAD_ACC_MANAGER').reset();
//   };

//   setTimeout(() => this.refreshSelectPicker(), 60);
// }
commentbreaker2 = "/* ******************************************************* */";

onCustomerChange(customerCode: any) {
  debugger;

  // 🔥 Clear previous filtered lists BEFORE applying new filters
  this.filteredCustomerSegments.length = 0;
  this.filteredCustomerAccountManager.length = 0;
  this.filteredCustomerContacts.length = 0;

  // 🔥 Optionally reset form fields
  this.form.get('CUST_CODE').reset();
  this.form.get('CUST_ACC_MANAGER').reset();
  this.form.get('CUST_SEGMENT').reset();
  this.form.get('CUST_CONTACT').reset();

  // Set CUST_CODE in form
  this.form.get('CUST_CODE').setValue(customerCode);

  // Filter Customer Master List
  this.customer_list.forEach((cElement: any) => {
    if (customerCode === cElement.CUST_CODE) {
      console.log("cElement:", cElement);

      this.filteredCustomerSegments.push(cElement);
      this.filteredCustomerAccountManager.push(cElement);

      this.form.get('CUST_ACC_MANAGER').setValue(cElement.ACCT_MANAGER);
      this.form.get('CUST_SEGMENT').setValue(cElement.CUST_SEGMENT);
    }
  });

  // Filter Customer Contact List
  this.customercontact_list.forEach((ccontact: any) => {
    if (customerCode === ccontact.CUST_CODE) {
      console.log("ccontact:", ccontact);

      this.filteredCustomerContacts.push(ccontact);
      this.form.get('CUST_CONTACT').setValue(ccontact.CUST_CODE);
    }
  });

  // Refresh dropdowns
  setTimeout(() => $('.selectpicker').selectpicker('refresh').trigger('change'), 100);
}

onLeadChange(leadCode: any) {
  debugger;

  // 🔥 Clear previous filtered lists BEFORE applying new filters
  this.filteredLeadSegments.length = 0;
  this.filteredLeadAccountManager.length = 0;
  this.filteredLeadContacts.length = 0;

  // 🔥 Optionally reset form fields
  this.form.get('LEAD_ACC_MANAGER').reset();
  this.form.get('LEAD_SEGMENT').reset();
  this.form.get('LEAD_CONTACT').reset();

  // Filter Lead Master List
  this.lead_list.forEach((lElement: any) => {
    if (leadCode === lElement.LEAD_CODE) {
      this.filteredLeadSegments.push(lElement);
      this.filteredLeadAccountManager.push(lElement);

      this.form.get('LEAD_ACC_MANAGER').setValue(lElement.EMP_NO);
      this.form.get('LEAD_SEGMENT').setValue(lElement.CUST_SEGMENT);
    }
  });

  // Set LEAD_CODE in form
  this.form.get('LEAD_CODE').setValue(leadCode);

  // Filter Lead Contact List
  this.leadcontact_list.forEach((lcontact: any) => {
    if (leadCode === lcontact.LEAD_CODE) {
      console.log("lcontact:", lcontact);

      this.filteredLeadContacts.push(lcontact);
      this.form.get('LEAD_CONTACT').setValue(lcontact.LEAD_CODE);
    }
  });

  // Refresh Bootstrap Select UI
  setTimeout(() => $('.selectpicker')
    .selectpicker('refresh')
    .trigger('change'), 100);
}

onSegmentChange() {
  setTimeout(() => $('.selectpicker').selectpicker('refresh').trigger('change'), 50);
}

onStatusChange(status: any) {
  debugger;
  // 🔥 Clear previous filtered lists BEFORE applying new filters
  this.filteredSubStatus.length = 0;
  // 🔥 Optionally reset form fields);
  this.form.get('OPPO_STATUS').reset();
  this.form.get('OPPO_SUB_STATUS').reset();
  // Set OPPO_STATUS in form
  this.form.get('OPPO_STATUS').setValue(status);
  // Filter Sub Status List
  this.filteredSubStatus = this.opportunity_substatus_list.filter(
    (sElement: any) => sElement.OPPO_STATUS === status
  );
  // 👉 Set the FIRST item of the filtered list (if exists)
  if (this.filteredSubStatus.length > 0) {
    this.form.get('OPPO_SUB_STATUS').setValue(this.filteredSubStatus[0].OPPO_SUB_STATUS);
  }
  // Refresh Bootstrap Select UI
  setTimeout(() => $('.selectpicker')
    .selectpicker('refresh')
    .trigger('change'), 100);
}
 
resetCustomerAutoFields() {
  this.isEditModeFill = true;
  this.form.get('CUST_CODE').reset('', { emitEvent: false });
  this.form.get('CUST_CONTACT').reset('', { emitEvent: false });
  this.filteredCustomerContacts = [];
  this.form.get('OPPO_SEGMENT').reset('', { emitEvent: false });
  this.filteredCustomerSegments = [];
  this.form.get('CUST_ACC_MANAGER').reset('', { emitEvent: false });
  this.filteredCustomerAccountManager = [];
  // this.form.get('OPPO_STATUS').reset('', {emitEvent: false});
  // this.filteredSubStatus = [];
  setTimeout(() => {
  this.isEditModeFill = false;
  this.refreshSelectPicker();
}, 60);
}

resetLeadAutoFields() {
this.isEditModeFill = true;
this.form.get('LEAD_CODE').reset('', { emitEvent: false });
this.form.get('LEAD_CONTACT').reset('', { emitEvent: false });
this.filteredLeadContacts = [];
this.form.get('LEAD_SEGMENT').reset('', { emitEvent: false });
this.filteredLeadSegments = [];
this.form.get('LEAD_ACC_MANAGER').reset('', { emitEvent: false });
this.filteredLeadAccountManager = [];
// this.form.get('OPPO_STATUS').reset('', {emitEvent: false});
// this.filteredSubStatus = [];
setTimeout(() => {
  this.isEditModeFill = false;
  this.refreshSelectPicker();
}, 70);
}

private updatePartyValidators() {
  const party = this.form.get('PARTY_TYPE').value;
  const custFields = ['CUST_CODE', 'CUST_CONTACT', 'CUST_SEGMENT', 'CUST_ACC_MANAGER'];
  const leadFields = ['LEAD_CODE', 'LEAD_CONTACT', 'LEAD_SEGMENT', 'LEAD_ACC_MANAGER'];
  // Clear all validators first
  [...custFields, ...leadFields].forEach(f => {
    this.form.get(f).clearValidators();
    this.form.get(f).updateValueAndValidity();
  });
  if (party === 'C') {
    custFields.forEach(f => {
      this.form.get(f).setValidators([Validators.required]);
    });
  } else if (party === 'L') {
    leadFields.forEach(f => {
      this.form.get(f).setValidators([Validators.required]);
    });
  }
  // Refresh only selected party group
  this.form.updateValueAndValidity();
}

  formatEstValue(event: any) {
  let value: string = event.target.value;
  // Only keep digits & decimal
  value = value.replace(/[^0-9.]/g, '');
  // Prevent lone decimal
  if (value === '.') {
    this.form.get('EST_VALUE').setValue('0.', { emitEvent: false });
    return;
  }
  // 🔥 Prevent multiple decimals
  if ((value.match(/\./g) || []).length > 1) {
    value = value.replace(/\.+$/, ""); // remove extra decimals
  }
  // Split into integer + decimal portion
  let [integerPart, decimalPart] = value.split('.');
  // Remove leading 0s except single 0
  integerPart = integerPart.replace(/^0+(?!$)/, '');
  // 🔥 Apply Indian formatting
  if (integerPart) {
    let lastThree = integerPart.slice(-3);
    let rest = integerPart.slice(0, -3);
    if (rest !== "") {
      integerPart =
        rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    }
  }
  let formattedValue = integerPart || '0';
  if (decimalPart !== undefined) {
    formattedValue += '.' + decimalPart;
  }
  this.form.get('EST_VALUE').setValue(formattedValue, { emitEvent: false });
}

  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt': return 'text/plain';
      default: return 'application/octet-stream';
    }
  }

  convertFilesToBase64(fileList: FileList) {
    const files = Array.from(fileList);
    const fileReadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64 = e.target.result;
          const fileData = {
            DOCUMENT_FILENAME: file.name,
            DOC_BASE64: base64,
            SR_NO: this.DOCUMENT_ATTECHED_LIST.length + 1,
            FILE_EXTENSION: fileExtension,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + fileExtension,
            DOCUMENT_NAME: file.name,
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID
          };
          resolve(fileData);
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', file.name, error);
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReadPromises)
      .then((results: any[]) => {
        // push to DOCUMENT_ATTECHED_LIST
        results.forEach(r => {
          this.DOCUMENT_ATTECHED_LIST.push({
            DOCUMENT_NAME: r.DOCUMENT_NAME,
            DOCUMENT_FILENAME: r.DOCUMENT_FILENAME,
            DOCUMENT_SYSFILENAME: r.DOCUMENT_SYSFILENAME,
            DOCUMENT_FILETYPE: r.FILE_EXTENSION,
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: r.UPLOAD_BY,
            UPLOAD_BY_USERID: r.UPLOAD_BY_USERID,
            DOC_BASE64: r.DOC_BASE64
          });
        });
        this.RESOLVE_DOC_LIST = this.DOCUMENT_ATTECHED_LIST;
        // update doc count
        this.NoDocs = this.DOCUMENT_ATTECHED_LIST.filter(d => d.ACTIVE != 0).length;
        console.log('All files processed:', this.DOCUMENT_ATTECHED_LIST);
      })
      .catch((error) => {
        console.error('Error processing some files:', error);
        this.toast.error('Error processing files');
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const allowedTypes: string[] = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      const filesArray: FileList = input.files;
      const invalidFiles: File[] = [];
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const fileType = file.type || this.getMimeType(file.name.split('.').pop() || '');
        if (!allowedTypes.includes(fileType)) {
          invalidFiles.push(file);
        }
      }

      if (invalidFiles.length > 0) {
        this.toast.error('Only PDF, Word, Excel, Text, and Image (JPG/PNG) files are allowed.', 'Invalid File Type');
        input.value = '';
        return;
      }

      // Convert valid files and push into DOCUMENT_ATTECHED_LIST
      this.convertFilesToBase64(filesArray);
      input.value = '';
    }
  }

  viewDocument(data: any) {
    if (!data.DOC_BASE64 || !data.FILE_EXTENSION) return;

    const base64Content = data.DOC_BASE64.includes(',')
      ? data.DOC_BASE64.split(',')[1]
      : data.DOC_BASE64;

    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.getMimeType(data.FILE_EXTENSION) });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

  /**
 * Normalize and prepare DOCUMENT_ATTECHED_LIST for saving.
 *
 * Rules:
 *  - Only new files (ISNEW === 1) should carry base64 content to the server.
 *  - For new files: normalize by removing any "data:...;base64," prefix.
 *  - For existing files (ISNEW !== 1): ensure DOC_BASE64 is null (do not send binary).
 *  - Support either `b64` (some code sets this) or `DOC_BASE64`.
 */
stripBase64FromDocuments() {
  this.DOCUMENT_ATTECHED_LIST.forEach(file => {
    
    // For old files → keep DOC_BASE64 null, but ensure FILE_EXTENSION exists
    if (file.ISNEW !== 1) {
      file.DOC_BASE64 = null;
      return;
    }

    // For new files → clean only the base64
    if (!file.DOC_BASE64) return;

    file.DOC_BASE64 = file.DOC_BASE64.replace(/^data:.*;base64,/, '').trim();
  });
}

  f_validateForm() {
    // debugger
    // Basic required checks, plus conditional party validation
    if (this.form.controls["COMPANY_CODE"].invalid) {
      this.toast.warning("Please select Company");
      return false;
    } else if (this.form.controls["OPPO_TYPE"].invalid) {
      this.toast.warning("Please select Project Type");
      return false;
    } else if (this.form.controls["OPPO_NAME"].invalid) {
      this.toast.warning("Please enter Project Name");
      return false;
    } else if (this.form.controls["LOCATION_CODE"].invalid) {
      this.toast.warning("Please select Location");
      return false;
    }

    // ---------------------
    // PARTY_TYPE VALIDATION
    // ---------------------
    this.partyType = this.form.get('PARTY_TYPE').value;

    // Customer Mode
    if (this.partyType === 'C') {
      if (this.form.get('CUST_CODE').invalid) {
        this.toast.warning("Please select Customer");
        return false;
      }
      if (this.form.get('CUST_CONTACT').invalid) {
        this.toast.warning("Please select Customer Contact");
        return false;
      }
      if (this.form.get('CUST_SEGMENT').invalid) {
        this.toast.warning("Please select Customer Segment");
        return false;
      }
      if (this.form.get('CUST_ACC_MANAGER').invalid) {
        this.toast.warning("Please select Customer Account Manager");
        return false;
      }
    }

    // Lead Mode
    if (this.partyType === 'L') {
      if (this.form.get('LEAD_CODE').invalid) {
        this.toast.warning("Please select Lead");
        return false;
      }
      if (this.form.get('LEAD_CONTACT').invalid) {
        this.toast.warning("Please select Lead Contact");
        return false;
      }
      if (this.form.get('LEAD_SEGMENT').invalid) {
        this.toast.warning("Please select Lead Segment");
        return false;
      }
      if (this.form.get('LEAD_ACC_MANAGER').invalid) {
        this.toast.warning("Please select Lead Account Manager");
        return false;
      }
    }

    if (this.form.controls["DIVISION_CODE"].invalid) {
      this.toast.warning("Please select Division");
      return false;
    } 
    // Segment validation should follow PARTY_TYPE
    if (this.partyType === 'C' && this.form.controls["CUST_SEGMENT"].invalid) {
      this.toast.warning("Please select Customer Segment");
      return false;
    } else if (this.form.controls["OPPO_CURRENCY"].invalid) {
      this.toast.warning("Please select Currency");
      return false;
    } else if (this.form.controls["OPPO_STATUS"].invalid) {
      this.toast.warning("Please select Status");
      return false;
    } else if (this.form.controls["OPPO_SUB_STATUS"].invalid) {
      this.toast.warning("Please select Sub Status");
      return false;
    } else if (this.form.controls["PROBABILITY"].invalid) {
      this.toast.warning("Please select Probability");
      return false;
    } else if (this.form.controls["PROJECT_DATE"].invalid) {
      this.toast.warning("Please enter Date");
      return false;
    } else if (this.form.controls["REFPROJ_CODE"].invalid) {
      this.toast.warning("Please enter Ref Project Name");
      return false;
    } else if (this.form.controls["LEAD_ACC_MANAGER"].invalid) {
      this.toast.warning("Please enter Lead Account Manager");
      return false;
    }
    return true;
  }

  refreshSelectPicker() {
    // Single consolidated refresh, called only when dataset changed
    setTimeout(() => {
      try {
        ($('.selectpicker') as any).selectpicker('refresh').trigger('change');
      } catch (err) {
        // swallow if selectpicker not available in some environments
        console.warn('selectpicker refresh failed', err);
      }
    }, 50);
  }

  updateLocationByCompany(companyCode: number) {
    const filtered = this.location_list.filter(
      loc => loc.COMPANY_CODE === companyCode
    );
    if (filtered.length > 0) {
      this.form.patchValue({
        LOCATION_CODE: filtered[0].LOCATION_CODE
      });
    } else {
      this.form.patchValue({
        LOCATION_CODE: null
      });
    }
  }

  // ---------------------------OLD Document Code Start---------------------------
  selectDocument(event: any) {
    this.uploadingFiles = [];
    let b64: string = "";
    let extension: string[] = [];
    let DOC_SRNO: string = "";

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
            OPPO_CODE: this.form.getRawValue().OPPO_CODE,
            DOCUMENT_NAME: event.target.files[i].name,
            DOC_SRNO: this.uploadingFiles.length + 1,
            DOCUMENT_FILENAME: event.target.files[i].name,
            DOCUMENT_SYSFILENAME: uuidv4() + '.' + extension[extension.length - 1],
            DOCUMENT_FILETYPE: extension[extension.length - 1].toUpperCase(),
            ISNEW: 1,
            ACTIVE: 1,
            UPLOAD_BY: this.sharedService.loginUser[0].USER_NAME,
            UPLOAD_BY_USERID: this.sharedService.loginUser[0].USERID,
            DOC_BASE64: b64

          }
        )
        this.uploadDoc();
      }
      // this.SelectedFileName = event.target.files.length > 1 ? event.target.files.length + " Files selected" : event.target.files[i].name;
    }
  }

  // uploadDoc() {
  //   for (let i = 0; i < this.uploadingFiles.length; i++) {
  //     this.uploadedDocument.push(this.uploadingFiles[i])
  //   }
  //   this.fileInput.nativeElement.value = "";
  //   this.uploadingFiles = []
  //   this.SelectedFileName = "";
  //   this.NoDocs = 0;
  //   this.uploadedDocument.forEach(element => {
  //     if(element.ACTIVE != 0){
  //       this.NoDocs += 1
  //     }
  //   });
  // }

  uploadDoc() {
  for (let i = 0; i < this.uploadingFiles.length; i++) {
    this.uploadedDocument.push(this.uploadingFiles[i]);
    this.DOCUMENT_ATTECHED_LIST.push({
    DOCUMENT_NAME: this.uploadingFiles[i].DOCUMENT_FILENAME,
    DOCUMENT_FILENAME: this.uploadingFiles[i].DOCUMENT_FILENAME,
    DOCUMENT_SYSFILENAME: this.uploadingFiles[i].DOCUMENT_SYSFILENAME,
    DOCUMENT_FILETYPE: this.uploadingFiles[i].DOCUMENT_FILETYPE,
    ISNEW: 1,
    ACTIVE: 1,
    UPLOAD_BY: this.uploadingFiles[i].UPLOAD_BY,
    UPLOAD_BY_USERID: this.uploadingFiles[i].UPLOAD_BY_USERID,
    DOC_BASE64: this.uploadingFiles[i].b64
  });
  }
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
  // ---------------------------OLD Document Code End---------------------------
  normalizeDDMMMYYYY(dateStr: string): string {
  if (!dateStr) return null;

  // Strip spaces, keep consistent format
  dateStr = dateStr.toString().trim();

  // Expected formats handled:
  // "31-Dec-2025"
  // "31-DEC-2025"
  // "31-dec-2025"
  // "31/Dec/2025"
  
  const monthMap: any = {
    Jan: "Jan", FEB: "Feb", MAR: "Mar", APR: "Apr", MAY: "May", JUN: "Jun",
    JUL: "Jul", AUG: "Aug", SEP: "Sep", OCT: "Oct", NOV: "Nov", DEC: "Dec"
  };

  // Replace / with -
  dateStr = dateStr.replace(/\//g, "-");

  let [dd, mm, yyyy] = dateStr.split("-");

  // Ensure day is always 2 digits
  dd = dd.padStart(2, "0");

  // Normalize month case (Dec → Dec, DEC → Dec, dec → Dec)
  mm = mm.charAt(0).toUpperCase() + mm.slice(1).toLowerCase();
  mm = monthMap[mm.substring(0, 3)] || mm; // ensure correct mapping

  return `${dd}-${mm}-${yyyy}`;
}

normalizeForm(skipKeys: string[] = []) {
  Object.keys(this.form.controls).forEach(key => {
    if (!skipKeys.includes(key)) {
      const ctrl = this.form.get(key);
      if (ctrl && ctrl.value === '') ctrl.setValue(null);
    }
  });
}

setVal(field: string, value: any) {
  var ctrl = this.form.get(field);
  if (ctrl) {
    ctrl.setValue(value != undefined ? value : null, { emitEvent: false });
  }
}

}