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
  selector: 'app-sales-opportunity-log-list',
  templateUrl: './sales-opportunity-log-list.component.html',
  styleUrls: ['./sales-opportunity-log-list.component.css']
})
export class SalesOpportunityLogListComponent implements OnInit {

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private validationService: ValidationService) { }

  ngOnInit() {}

 

}
