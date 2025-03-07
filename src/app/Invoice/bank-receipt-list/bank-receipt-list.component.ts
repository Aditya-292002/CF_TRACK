import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-bank-receipt-list',
  templateUrl: './bank-receipt-list.component.html',
  styleUrls: ['./bank-receipt-list.component.css']
})
export class BankReceiptListComponent implements OnInit {
   @ViewChild('ViewBankReceiptPdf', { static: false }) modal: ElementRef;
  BANK_RECEIPT_LIST:any = [];
  PDF_BASE64:any;
  RECEIPT_NO:any;

  constructor(public sharedService: SharedServiceService,
      private apiUrl: ApiUrlService,
      private http: HttpRequestServiceService,
      private formBuilder: FormBuilder,
      private toast: ToastrService,
      private datePipe: DatePipe,
      public validationService: ValidationService,
      private pipeService: PipeService,
      public datepipe: DatePipe,
      private currencyPipe: CostFilterPipe) { }
      

  ngOnInit() {
    this.GetBankReceiptList();
  }

  ngAfterViewInit(){    
    setTimeout(() => { 
      if(this.sharedService.loginUser[0].FYEAR == undefined){
        this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
       }
    this.GetBankReceiptList();
    }, 100);
  }

  GetBankReceiptList(){
    let data = {
      USERID: this.sharedService.loginUser[0].USERID,
      FYEAR: this.sharedService.loginUser[0].FYEAR,
    }

    this.http.PostRequest(this.apiUrl.GetBankReceiptList, data).then(res => {
      if (res.flag) {
        this.BANK_RECEIPT_LIST = res.bank_receipt_list;
        this.BANK_RECEIPT_LIST.forEach((element:any)=>{
          element.RECEIPT_DATE = this.datepipe.transform(element.RECEIPT_DATE, 'dd-MMM-yyyy');
        })
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
      } else {
        this.toast.warning(res.msg)
      }
    });
  }

  ViewBankReceiptPdfBase64(val:any){
    this.RECEIPT_NO = val.RECEIPT_NO
    let data = {
      RECEIPT_NO: this.RECEIPT_NO,
    }
    // console.log('data ->' , JSON.stringify(data))
    // return
    this.PDF_BASE64 = "";
    this.http.PostRequest(this.apiUrl.ViewBankReceiptPdfBase64, data).then(res => {
      if (res.flag) {
        this.PDF_BASE64 = "data:application/pdf;base64," + res.pdfBase64;
        const modalElement = document.getElementById('ViewBankReceiptPdf');
        if (modalElement) {
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
        }
      } else {
        this.toast.warning(res.msg)
      }
    });
  }

  ReceiptDownload(){
    const link = document.createElement('a');
    link.href = this.PDF_BASE64;  // Use the base64 string as the href
    link.download = this.RECEIPT_NO + '.pdf';  // Specify the name of the downloaded file
    link.click(); 
  }

  CloseViewBankReceiptPdf(){
    const modalElement = document.getElementById('ViewBankReceiptPdf');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

}
