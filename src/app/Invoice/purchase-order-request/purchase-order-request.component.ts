import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-purchase-order-request',
  templateUrl: './purchase-order-request.component.html',
  styleUrls: ['./purchase-order-request.component.css']
})
export class PurchaseOrderRequestComponent implements OnInit {

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService) { }

    spinner: boolean = false;

  ngOnInit() {
    this.sharedService.formName = "PO Request"
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }

}
