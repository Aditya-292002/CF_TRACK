import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { cloneElement } from 'preact';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  Report_ID:number;
  isShowFromDate:boolean = false;
  isShowToDate:boolean = false;
  spinner: boolean = false;
  isFilterSelection:boolean = false;
  isFilterCustomer:boolean = false;
  isFilterProject:boolean = false;
  isSubmited: boolean = false;
  isshowFilterSelection:boolean = false;
  isshowFilterTable:boolean = false;
  isShowAsOnDate:boolean = false;
  // Array declare
  fyear_list:Array<any> = [];
  company_list:Array<any> = [];
  location_list:Array<any> = [];
  _location_list:Array<any> = [];
  report_list:Array<any> = [];
  list1:Array<any> = [];
  list2:Array<any> = [];
  list3:Array<any> = [];
  header:Array<any> = [];
  detail:Array<any> = [];
// Any declare
  para4: any = '';
  para5: any = '';
  para6: any = '';
// date decare
_DATE: any = '';
TO_DATE: any = '';
maxdate = new Date();
today_date = new Date();
today_date_s : any;
min_date = new Date(new Date().getFullYear(), 0, 1);
  form: FormGroup;
  active = 1;
  BackCount: number = 0;
  paras = {
    "para1":"",
    "para2":"",
    "para3":"",
    "newpara1":"",
    "newpara2":"",
    "newpara3":"",
    "current_Report_ID":0,
    "last_Report_ID":0,
  }
  arrayPara = [{
    "para1":"",
    "para2":"",
    "para3":"",
    "newpara1":"",
    "newpara2":"",
    "newpara3":"",
    "current_Report_ID":0,
    "last_Report_ID":0,
  }];
Report_Name: string = "";
CaptionSelection1: string = "";
CaptionSelection2: string = "";
CaptionSelection3: string = "";
DETAIL_REPORT_ID: number = 0;
DETAIL_REPORT_COLUMN_NAME: string = "";
DETAIL_REPORT_PARA_NO: number = 0;
Last_Report_ID : number = 0;
FYEAR:any;
user_detail:any = {};

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private datepipe: DatePipe,
    public validationService: ValidationService) { }

  ngOnInit() {
    this.sharedService.formName = "Report"
    this.user_detail = JSON.parse(sessionStorage.getItem('user_detail'));
    this.FYEAR = this.user_detail[0].FYEAR
    this.form = this.formBuilder.group({
      Report_ID:["",Validators.required],
      COMPANY_CODE: ["",Validators.required],
      LOCATION_CODE:["",Validators.required],
      para1: ["",Validators.required],
      para2:["",Validators.required],
      para3:["",Validators.required],
      para4:[""],
      para5:[""],
      FYEAR: this.FYEAR,
    });
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ngAfterViewInit(){   
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
    
    setTimeout(() => {
      this.form.get('COMPANY_CODE').setValue(this.sharedService.loginUser[0].COMPANY_CODE);
      this.form.get('LOCATION_CODE').setValue(this.sharedService.loginUser[0].LOCATION_CODE);
      this.form.get('para4').setValue(this.datepipe.transform(new Date(this.min_date), 'dd-MMM-yyyy'))
      this.para4 =  this.datepipe.transform(new Date(this.min_date), 'dd-MMM-yyyy')
      this.form.get('para5').setValue(this.datepipe.transform(new Date(this.maxdate), 'dd-MMM-yyyy'))
      this.para5 = this.datepipe.transform(new Date(this.maxdate), 'dd-MMM-yyyy')
      this.GetReportList();
      this.GetFyearList();
      this.GetReportFilterList();
      $('.selectpicker').selectpicker('refresh').trigger('change');
    },150)
  }

  GetReportList(){
    this.spinner = true;
    this.http.PostRequest(this.apiUrl.GetReportList,{}).then(res =>{
   if(res.flag){
     this.report_list = res.report_list; 

     setTimeout(() => {
       $('.selectpicker').selectpicker('refresh').trigger('change');
     }, 100);
     this.spinner = false;
   }else{
     this.spinner = false;
   }
  },err =>{
   this.spinner = false;
  });

 }

changeReport(val:any,year:any){
  if(!this.sharedService.isValid(this.form.getRawValue().Report_ID)){
    this.form.get('FYEAR').setValue("");
      this.toast.error('Select a Report Name');
   return
  }
  this.isShowFromDate=false;
  this.isShowToDate = false;
  this.isShowAsOnDate = false;
    this.report_list.forEach(element => {
      if(element.Report_ID == this.form.getRawValue().Report_ID){
        this.Last_Report_ID = this.form.getRawValue().Report_ID;
        this.Report_Name = element.Report_Name;
        this.CaptionSelection1 = element.CaptionSelection1;
        this.CaptionSelection2 = element.CaptionSelection2;
        this.CaptionSelection3 = element.CaptionSelection3;
        this.DETAIL_REPORT_ID = element.DETAIL_REPORT_ID;
        this.DETAIL_REPORT_COLUMN_NAME = element.DETAIL_REPORT_COLUMN_NAME;
        this.DETAIL_REPORT_PARA_NO = element.DETAIL_REPORT_PARA_NO;
        this.form.get('para1').setValue("");
        this.form.get('para2').setValue("");
        this.form.get('para3').setValue("");
        if(element.DateSelType > 1){
          this.isShowFromDate=true;
          this.isShowToDate = true;
          let year = this.form.controls['FYEAR'].value;
          this.fyear_list.forEach((element:any)=>{
            if(element.FYEAR == year){
              this.form.get('para4').setValue(this.datepipe.transform(new Date(element.FROM_DATE), 'dd-MMM-yyyy'))
              this.para4 = this.datepipe.transform(new Date(element.FROM_DATE), 'dd-MMM-yyyy');
              let TO_DATE = new Date(this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy'));
              let CURRENT_DATE = new Date();
              if(CURRENT_DATE < TO_DATE){
                this.para5 = this.datepipe.transform(new Date(CURRENT_DATE), 'dd-MMM-yyyy') 
                return
              }else if(CURRENT_DATE > TO_DATE){
                 this.form.get('para5').setValue(this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy'))
                 this.para5 = this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy')
                 return
              }
            }
          });
        }else if(element.DateSelType == 1){
          this.isShowAsOnDate = true;
          if(this.form.controls['FYEAR'].value == ""){
            this.form.get('para4').setValue(this.datepipe.transform(new Date(this.min_date), 'dd-MMM-yyyy'))
            this.para4 =  this.datepipe.transform(new Date(this.min_date), 'dd-MMM-yyyy')
          }else {
            let year = this.form.controls['FYEAR'].value;
            this.fyear_list.forEach((element:any)=>{
              if(element.FYEAR == year){
                let TO_DATE = new Date(this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy'));
                let CURRENT_DATE = new Date();
                if(CURRENT_DATE < TO_DATE){
                  this.para4 = this.datepipe.transform(new Date(CURRENT_DATE), 'dd-MMM-yyyy') 
                  return
                }else if(CURRENT_DATE > TO_DATE){
                  this.form.get('para4').setValue(this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy'))
                  this.para4 = this.datepipe.transform(new Date(element.TO_DATE), 'dd-MMM-yyyy')
                   return
                }
              }
            });
          }
        } 

        this.showFilterSelection();
        this.GetReportFilterList();
      }
      setTimeout(() => {
        this.form.get('para1').setValue("");
        this.form.get('para2').setValue("");
        this.form.get('para3').setValue("");
        this.detail = [];
        this.header = [];
        this.isshowFilterTable = false;
          $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      });
  
 
}

GetFyearList(){
  let data = {
    "IS_ALL": 1
  }
  this.http.PostRequest(this.apiUrl.GetFyearList, data).then(res => {
    if (res) {
      this.fyear_list = res.fyear_list
      this.company_list = res.company_list
      this.location_list = res.location_list
      this._location_list = res.location_list
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

ExcelDownload(){

  let data = {
    data: this.detail
  }
  this.spinner = true;
  this.http.PostRequest(this.apiUrl.DownloadInExcelFromJSON, data).then(res => {
    
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
  
          saveAs(data, this.Report_Name + ".xlsx");
        }
      
      

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    
  }, err => {
    this.spinner = false;
  });
  
}

filterLocations(){
  if(this.form.getRawValue().COMPANY_CODE != "" && this.form.getRawValue().COMPANY_CODE != null){
    this._location_list = [];
    this.location_list.forEach(element => {
      if(Number(element.COMPANY_CODE) == Number(this.form.getRawValue().COMPANY_CODE)){
        this._location_list.push(element)
      }
    });
  } else {
    this._location_list = this.location_list
  }
   
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

showFilterSelection(){
  this.isFilterCustomer = false;
  this.isFilterProject = false;
  this.isFilterSelection = false;
  this.isshowFilterSelection = false;
  this.report_list.forEach(element => {
    if(element.Report_ID == this.form.getRawValue().Report_ID){
      if(element.SelectionNos == 3){
        this.isFilterCustomer=true;
        this.isFilterProject = true;
        this.isFilterSelection = true;
         this.isshowFilterSelection = true;
      }else if(element.SelectionNos == 2)                                
      {
        this.isFilterCustomer=true;
        this.isFilterProject = true;
         this.isshowFilterSelection = true;
      }
      else if(element.SelectionNos == 1)                                
      {
        this.isFilterCustomer=true;
         this.isshowFilterSelection = true;
      }
      else{
        this.isshowFilterSelection = true;
      }
    }
    });
  setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

showFilterSelectionTable(){
   this.isshowFilterTable = true;
   this.GetReportList();
   this.GetFetchReportData();
   this.GetReportFilterList();
    setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  }, 100);
}

GetReportFilterList(){
    let data = {
      Report_ID:this.form.getRawValue().Report_ID
    }
    this.http.PostRequest(this.apiUrl.GetReportFilterList, data).then(res => {
    if (res) {
      this.list1 = res.list1
      this.list2 = res.list2
      this.list3 = res.list3
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

GetFetchReportData(){
    let data = {
      Report_ID:this.form.getRawValue().Report_ID,
      para1:this.form.getRawValue().para1,
      para2:this.form.getRawValue().para2,
      para3:this.form.getRawValue().para3,
      para4:this.form.getRawValue().para4,
      para5:this.form.getRawValue().para5
    }
    // console.log(data)
    this.http.PostRequest(this.apiUrl.GetFetchReportData, data).then(res => {
    if (res) {
      console.log(res)
      this.BackCount =0;

      this.detail = res.detail
      this.header = res.header

      if(this.BackCount == 0){

        this.arrayPara[this.BackCount].para1 = this.form.getRawValue().para1;
        this.arrayPara[this.BackCount].para2 = this.form.getRawValue().para2;
        this.arrayPara[this.BackCount].para3 = this.form.getRawValue().para3;
        this.arrayPara[this.BackCount].newpara1 = "";
        this.arrayPara[this.BackCount].newpara2 = "";
        this.arrayPara[this.BackCount].newpara3 = "";
        this.arrayPara[this.BackCount].last_Report_ID = 0;
        this.arrayPara[this.BackCount].current_Report_ID = this.form.getRawValue().Report_ID;
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

GetFetchReportData_Detail(Report_ID,para1,ispara1,para2,ispara2,para3,ispara3){
  
  this.arrayPara.forEach((value: any, index: number) => {
    if (index == this.BackCount) {
      
      if(this.BackCount == 0){

        value.para1 = this.form.getRawValue().para1;
        value.para2 = this.form.getRawValue().para2;
        value.para3 = this.form.getRawValue().para3;
        value.newpara1 = (ispara1 == true?para1:"");
        value.newpara2 = (ispara2 == true?para2:"");
        value.newpara3 = (ispara3 == true?para3:"");
      }
      else if(this.BackCount >= 1){
        
        value.para1 = this.arrayPara[this.BackCount-1].newpara1;
        value.para2 = this.arrayPara[this.BackCount-1].newpara2;
        value.para3 = this.arrayPara[this.BackCount-1].newpara3;
        value.newpara1 = (ispara1 == true?para1:"");
        value.newpara2 = (ispara2 == true?para2:"");
        value.newpara3 = (ispara3 == true?para3:"");
      } 
    }
  });
    
  
  let data = {
    Report_ID:Report_ID,//form.getRawValue().Report_ID,
    para1:this.arrayPara[this.BackCount].para1,
    para2:this.arrayPara[this.BackCount].para2,
    para3:this.arrayPara[this.BackCount].para3,
    para4:this.form.getRawValue().para4,
    para5:this.form.getRawValue().para5,    
    newpara1:(ispara1 == true?para1:""),
    newpara2:(ispara2 == true?para2:""),
    newpara3:(ispara3 == true?para3:""),
  }

  
  

  // console.log(data)
  this.http.PostRequest((this.BackCount == 0?this.apiUrl.GetFetchReportData:this.apiUrl.GetFetchDrillReportData), data).then(res => {
  if (res) {
    // console.log(res)

    this.detail = res.detail
    this.header = res.header
    this.arrayPara.forEach((value: any, index: number) => {
      if (index == this.BackCount) {        
          value.last_Report_ID = Report_ID;
          value.current_Report_ID = (res.header[0].Report_ID == undefined?Report_ID:res.header[0].Report_ID);
      }
      
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

  ChangeDate(){
    this.para4 = this.datepipe.transform(new Date(this._DATE), 'dd-MMM-yyyy')
  
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  ChangeToDate(){
    this.para5 = this.datepipe.transform(new Date(this.TO_DATE), 'dd-MMM-yyyy')
  
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh').trigger('change');
    }, 100);
  }

  getData(data, label) {
    //console.log(data)
    //console.log(label)
    if (!data[label]) {
      for (var x in data) {
        if (typeof data[x] === 'object') {
          return this.getData(data[x], label)
        }
      }
    }
    return data[label]
  }

  DrillDown(col:any,item:any){
    console.log('col : ',col)
    console.log('item : ',item)
    if(item.DRILLPARA_NO != undefined){    
      if(item.DRILLPARA_NO > 0){

        this.BackCount++;

        this.arrayPara.push({
          "para1":"",
          "para2":"",
          "para3":"",
          "newpara1":"",
          "newpara2":"",
          "newpara3":"",
          "current_Report_ID":0,
          "last_Report_ID":0,
        });
        
        this.GetFetchReportData_Detail(
          (this.BackCount == 1? this.Last_Report_ID:this.arrayPara[this.BackCount-1].current_Report_ID) ,
          (item.DRILLPARA_NO == 1?col[item.Col_Name]:""),
          (item.DRILLPARA_NO == 1?true:false),
          (item.DRILLPARA_NO == 2?col[item.Col_Name]:""),
          (item.DRILLPARA_NO == 2?true:false),
          (item.DRILLPARA_NO == 3?col[item.Col_Name]:""),
          (item.DRILLPARA_NO == 3?true:false),
          )
      }

    }
  }

  changeReportTable(){
   this.isshowFilterTable = false
  }

  f_clearForm(){
    this.isSubmited = false;
    this.form.reset();
    this.detail = [];
    this.header = [];
  }

  back(){
    this.arrayPara.splice(this.BackCount,1);
    this.BackCount--;

        //this.arrayPara.push(this.paras);
        
        this.GetFetchReportData_Detail(
          (this.BackCount == 0? this.arrayPara[this.BackCount].current_Report_ID :this.arrayPara[this.BackCount-1].last_Report_ID),
          
          (this.BackCount > 1?this.arrayPara[this.BackCount].para1:this.arrayPara[this.BackCount].newpara1),
          ((this.BackCount > 1?this.arrayPara[this.BackCount].para1:this.arrayPara[this.BackCount].newpara1) == ""?false:true),
          (this.BackCount > 1?this.arrayPara[this.BackCount].para2:this.arrayPara[this.BackCount].newpara2),
          ((this.BackCount > 1?this.arrayPara[this.BackCount].para2:this.arrayPara[this.BackCount].newpara2) == ""?false:true),
          ((this.BackCount > 1?this.arrayPara[this.BackCount].para3:this.arrayPara[this.BackCount].newpara3)),
          ((this.BackCount > 1?this.arrayPara[this.BackCount].para3:this.arrayPara[this.BackCount].newpara3) == ""?false:true),
          )
  }

  ClearBackData(){
    this.BackCount = 0;
  }


}


