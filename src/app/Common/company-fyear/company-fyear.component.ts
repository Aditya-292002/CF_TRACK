import { Component, ElementRef, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

declare var $: any;
@Component({
   selector: 'app-company-fyear',
  templateUrl: './company-fyear.component.html',
  styleUrls: ['./company-fyear.component.css']
})
export class CompanyFyearComponent implements OnInit {
  @ViewChild("companyid", { static: false }) companyid: ElementRef;
  spinner: boolean = true;
  form: FormGroup
 
  constructor(
    private authService: AuthServiceService,
    private sharedService: SharedServiceService,
    private route: RoutingService,
    private formBuilder: FormBuilder,
    private http: HttpRequestServiceService,
    private apiUrl: ApiUrlService
  ) { }

  company_list: Array<any>=[]
  location_list: Array<any>=[]
  fyear_list: Array<any>=[]

  ngOnInit() {
    this.form = this.formBuilder.group({
      COMPANY_CODE: ["", Validators.required],
      LOCATION_CODE: ["", Validators.required],
      FYEAR: ["", Validators.required],
    });

  }

  company_id: string = "";
  plant_id: string = "";
  fyear: string = "";

  ngAfterViewInit() {
    if (this.authService.isLoggedIn()) {
      this.companyid.nativeElement.focus();
      if(this.sharedService.loginUser[0].FYEAR == undefined){
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
        
       }
        this.form.get('FYEAR').setValue(this.sharedService.loginUser[0].FYEAR);
        this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
        this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh'); 
        }, 200);

    } else {
      this.authService.logout();
      return;
    }
    $('.selectpicker').selectpicker('refresh');  
    this.getFyear();
  }

  getFyear(){

    this.http.PostRequest(this.apiUrl.GetFyearList, {}).then(res => {
      if (res) {
        this.fyear_list = res.fyear_list;
        this.company_list = res.company_list;
        this.location_list = res.location_list;
        this.spinner = false;
        
        
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh'); 
      }, 100);
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  
  }
  onSubmitDetail() {
    if (this.form.valid) {
      this.sharedService.loginUser[0].FYEAR = this.form.getRawValue().FYEAR;
      this.sharedService.loginUser[0].COMPANY_CODE = this.form.getRawValue().COMPANY_CODE;
      this.sharedService.loginUser[0].LOCATION_CODE = this.form.getRawValue().LOCATION_CODE;
      
      this.fyear_list.forEach((element:any) => {
        if(element.FYEAR == this.form.getRawValue().FYEAR){
          this.sharedService.loginUser[0].FROM_DATE = element.FROM_DATE;
          this.sharedService.loginUser[0].TO_DATE = element.TO_DATE;
          this.sharedService.loginUser[0].FYEAR_DESC = element.FYEAR_DESC;
        }
      });
      this.SaveUserFyear();
      sessionStorage.setItem('user_detail', JSON.stringify(this.sharedService.loginUser))
      this.route.changeRoute('')
    }
  }

  SaveUserFyear(){
    let data = {
      COMPANY_CODE:this.form.getRawValue().COMPANY_CODE,
      LOCATION_CODE:this.form.getRawValue().LOCATION_CODE,
      FYEAR:this.form.getRawValue().FYEAR,
    }
    this.http.PostRequest(this.apiUrl.SaveUserFyear, data).then(res => {
      if (res) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh'); 
      }, 100);
      } else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }

  
  onDashboard(){
    this.route.changeRoute('')
  }

}
