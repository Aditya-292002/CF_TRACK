import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;
@Component({
  selector: 'app-expense-print',
  templateUrl: './expense-print.component.html',
  styleUrls: ['./expense-print.component.css']
})
export class ExpensePrintComponent implements OnInit {

 
  constructor(private sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public validationService: ValidationService , 
    private pipeService: PipeService,
    public datepipe: DatePipe) { }

    spinner: boolean = false;
    isSearchList: boolean = false;                                                                                                                                               
    FROM_DATE: string = ""
    TO_DATE: string = "";
    maxdate = new Date();
    today_date = new Date();
    today_date_s : any;
    min_date = new Date(new Date().getFullYear(), 0, 1);
    _DATE1: any = '';
    _DATE2: any = '';
    form: FormGroup;
    all_expense_detail:Array<any>=[];
  ngOnInit() {
    this.sharedService.formName = "Expense Print"
    this.form = this.formBuilder.group({
      REQ_NO: [""],
      FROM_DATE:  ["",Validators.required],
      TO_DATE:  ["",Validators.required],
    })
    if(this.sharedService.loginUser[0].FYEAR == undefined){
      this.sharedService.loginUser = sessionStorage.getItem('user_detail') ? JSON.parse(sessionStorage.getItem('user_detail')):[]
      
     }

     this.today_date_s = this.datepipe.transform(this.today_date, 'yyyy-MM-dd')
     if(this.today_date_s > this.sharedService.loginUser[0].TO_DATE){
      this.min_date = this.sharedService.loginUser[0].FROM_DATE;
      this.maxdate = this.sharedService.loginUser[0].TO_DATE;
    }
    else{      
      this.min_date = this.sharedService.loginUser[0].FROM_DATE;
      this.maxdate = this.today_date;
    }
    this.form.get('FROM_DATE').setValue(this.sharedService.getTodayDate())
    this.FROM_DATE = this.sharedService.getTodayDate()
    this.form.get('TO_DATE').setValue(this.sharedService.getTodayDate())
    this.TO_DATE = this.sharedService.getTodayDate()
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }


  searchList(){
    this.isSearchList = true;
    this.GetExpensePrintList();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  
  GetExpensePrintList(){
    let data = {
      FROM_DATE: this.form.getRawValue().FROM_DATE,
      TO_DATE: this.form.getRawValue().TO_DATE,
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetExpensePrintList, data).then(res => {
      if (res.flag) {
        console.log(res)
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


  ChangeFormDate(){
    this.FROM_DATE = this.datepipe.transform(new Date(this._DATE1), 'dd-MMM-yyyy')
    console.log(this.FROM_DATE)
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ChangeToDate(){
    this.TO_DATE = this.datepipe.transform(new Date(this._DATE2), 'dd-MMM-yyyy')
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  
  Print(p_data){
    let data = {
      EXP_ID:p_data.EXP_ID
    }
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.PrintExpenseVoucher, data).then(res => {
      this.spinner = false;
        console.log(res.data);
        console.log(res.filename);
        if(res.data != ""){
            const byteString = atob(res.data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
              int8Array[i] = byteString.charCodeAt(i);
            }
            const data: Blob = new Blob([int8Array]);
            var file = new Blob([int8Array], { type: 'application/pdf;base64' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
                    
            //saveAs(data, res.filename);
          }
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      
    }, err => {
      this.spinner = false;
    });
  }

}
