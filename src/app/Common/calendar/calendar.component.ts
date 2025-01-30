import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

declare var $: any;

interface Month_Object{
  weekday:string,
  full_date:string,
  Date:number,
  status:string
}

// const month_data: Array<any> = [
//   {
//     weekday:"2",
//     full_date:"01-Feb-2021",
//     Date:1,
//     holiday_text:"Holi",
//     status:"P",
//     status_text:"Present"
//   },{
//     weekday:"3",
//     full_date:"02-Feb-2021",
//     Date:2,
//     holiday_text:"",
//     status:"A",
//     status_text:"Not-Attendance"
//   },{
//     weekday:"4",
//     full_date:"03-Feb-2021",
//     Date:3,
//     holiday_text:"",
//     status:"A",
//     status_text:"Not-Attendance"
//   },{
//     weekday:"5",
//     full_date:"04-Feb-2021",
//     Date:4,
//     holiday_text:"",
//     status:"P",
//     status_text:"Present"
//   },{
//     weekday:"6",
//     full_date:"05-Feb-2021",
//     Date:5,
//     holiday_text:"",
//     status:"P",
//     status_text:"Present"
//   },{
//     weekday:"7",
//     full_date:"06-Feb-2021",
//     Date:6,
//     holiday_text:"",
//     status:"P",
//     status_text:"Present"
//   },{
//     weekday:"1",
//     full_date:"07-Feb-2021",
//     Date:7,
//     holiday_text:"",
//     status:"W",
//     status_text:""
//   },{
//     weekday:"2",
//     full_date:"08-Feb-2021",
//     Date:8,
//     holiday_text:"",
//     status:"L",
//     status_text:"Leave"
//   },{
//     weekday:"3",
//     full_date:"09-Feb-2021",
//     Date:9,
//     holiday_text:"",
//     status:"L",
//     status_text:"Leave"
//   },{
//     weekday:"4",
//     full_date:"10-Feb-2021",
//     Date:10,
//     holiday_text:"",
//     status:"P",
//     status_text:""
//   },{
//     weekday:"5",
//     full_date:"11-Feb-2021",
//     Date:11,
//     holiday_text:"",
//     status:"P",
//     status_text:""
//   },{
//     weekday:"6",
//     full_date:"12-Feb-2021",
//     Date:12,
//     holiday_text:"",
//     status:"T",
//     status_text:""
//   },{
//     weekday:"7",
//     full_date:"13-Feb-2021",
//     Date:13,
//     holiday_text:"",
//     status:"P",
//     status_text:""
//   },{
//     weekday:"1",
//     full_date:"14-Feb-2021",
//     Date:14,
//     holiday_text:"",
//     status:"W",
//     status_text:""
//   },{
//     weekday:"2",
//     full_date:"15-Feb-2021",
//     Date:15,
//     holiday_text:"",
//     status:"T",
//     status_text:""
//   },{
//     weekday:"3",
//     full_date:"16-Feb-2021",
//     Date:16,
//     holiday_text:"",
//     status:"L",
//     status_text:""
//   },{
//     weekday:"4",
//     full_date:"17-Feb-2021",
//     Date:17,
//     holiday_text:"",
//     status:"L"
//   },{
//     weekday:"5",
//     full_date:"18-Feb-2021",
//     Date:18,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"6",
//     full_date:"19-Feb-2021",
//     Date:19,
//     holiday_text:"Chatrapati Shivaji Maharaj Jayanti",
//     status:"",
//     status_text:""
//   },{
//     weekday:"7",
//     full_date:"20-Feb-2021",
//     Date:20,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"1",
//     full_date:"21-Feb-2021",
//     Date:21,
//     holiday_text:"",
//     status:"W",
//     status_text:""
//   },{
//     weekday:"2",
//     full_date:"22-Feb-2021",
//     Date:22,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"3",
//     full_date:"23-Feb-2021",
//     Date:23,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"4",
//     full_date:"24-Feb-2021",
//     Date:24,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"5",
//     full_date:"25-Feb-2021",
//     Date:25,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"6",
//     full_date:"26-Feb-2021",
//     Date:26,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"7",
//     full_date:"27-Feb-2021",
//     Date:27,
//     holiday_text:"",
//     status:"",
//     status_text:""
//   },{
//     weekday:"1",
//     full_date:"28-Feb-2021",
//     Date:28,
//     holiday_text:"",
//     status:"W",
//     status_text:""
//   }

// ]

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor(
    private route: RoutingService,
    public sharedService: SharedServiceService,
    private http: HttpRequestServiceService,
    private apiUrl: ApiUrlService,
    private datePipe: DatePipe
  ) { }

  isPopupSceen:boolean = false;
  birthdate:string;
  weekday_header: Array<any> = [];
  strt_week_day: number;
  last_month_day: number;
  month:string;
  today: string;
  selected: string;
  total_block: number;
  week_end: number;
  Month_dates:Array<any> = []; 
  spinner: boolean = false;
  date:any;
  empbirthdate:boolean = false;
  ngOnInit() { 


    $('.popper').popover({
      placement: 'bottom',
      container: 'body',
      html: true,
      content: function () {
          return $(this).next('.popper-content').html();
      }
  });
   }

  ngAfterViewInit(){
    setTimeout(() => {
  
      
      this.GetCalendarData();
    }, 150);
  }
  _Month_dates: Array<any>=[];
  isLargeGrid: boolean = false;

  getMonth(){
    this.weekday_header = this.calendarData[0].header;
    // this.strt_week_day = this.calendar_data[0].start_weekday;
    // this.last_month_day = this.calendar_data[0].last_month_day;
    //  this.month = this.calendar_data[0].month;
    // this.today = this.calendar_data[0].today;
    // this.week_end = this.calendar_data[0].week_end;
    // this.selected = this.today;
    // this.total_block = Number(this.calendar_data[0].total_block)
   
    this.isLargeGrid = this.total_block > 35?true:false;
  
    this._Month_dates = this.month_data;
    this.SetMonth();
  }

  SetMonth(){
    this.Month_dates = [];
    let _blank_start:Array<any> = [];
    let _blank_end:Array<any> = [];

    for(let i=1; i< Number(this.strt_week_day); i++){
      _blank_start.push({
        weekday:"",
        full_date:"",
        Date:"",
        holiday_text:"",
        status:""      
      })
    }
    let _total_last_blank = this.total_block - (_blank_start.length + this._Month_dates.length)
    for(let i=1; i<= _total_last_blank; i++){
      _blank_end.push({
        weekday:"",
        full_date:"",
        Date:"",
        holiday_text:"",
        status:""
      })
    }

    let first_half = _blank_start.concat(this._Month_dates)
    this.Month_dates = first_half.concat(_blank_end)

    

    
    setTimeout(() => {
      $('[data-toggle="popover"]').popover();


    }, 100);
  }

  dayClick(day: any = null){
    if(day != null ){
      let selected_date = typeof(day)=='string'?JSON.parse(day):day
      this.selected = selected_date.full_date;
      this.sharedService.timesheet_date = this.selected;
      this.route.changeRoute('/timesheet')
      console.log(day)
    }
  }
  monthChange(para: string = ''){
    if(para != ''){

      if(para == 'P'){
        console.log(para)
      } else if(para == 'N'){
        console.log(para)
    }

    }
  } 
  current : Number =0;
  monthPrevious(){
    this.current = Number(this.current) -1
    //cal api get calenders
    this.GetCalendarData();
  }
  monthNext(){
    this.current = Number(this.current) +1
    this.GetCalendarData();
  }
  monthToday(){
    this.current = 0
    //cal api get calenders
    this.GetCalendarData();
  }
  // new code
  month_data: Array<string> = [];
  calendar_data: Array<any> = [];
  calendarData: Array<any> =[{
    header: ["Sun","Mon","Tue","Wed","Thus","Fri","Sat"]
  }]

  timesheet_data: Array<any> =[{
    time_in: "10:00",
    time_out: "18:30",
    clock :  "8:30"
  }]
  GetCalendarData(){ 
    this.spinner = true; 
    let data = {
      USERID:this.sharedService.loginUser[0].USERID ,
      CURRENT:this.current
    }

    this.http.PostRequest(this.apiUrl.GetCalendarData,data).then(res => {
      if (res.flag) {
        // this.calendar_data = res.calendar_data;
        this.month_data = res.month_data;
        // this.weekday_header = res.calendar_data[0].HEADER;

        this.strt_week_day = res.calendar_data[0].start_weekday;
        // this.last_month_day = this.calendar_data[0].last_month_day;
        this.month = res.calendar_data[0].month;
        this.today = res.calendar_data[0].today;
        this.week_end = res.calendar_data[0].week_end;
        this.selected = this.today;
        this.total_block = Number(res.calendar_data[0].total_block);
        this.birthdate = res.month_data[0].birthdate;
        this.date = res.month_data[0].date;
        this.getMonth();
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh').trigger('change');
        }, 100);
        this.spinner = false;
      }else {
        this.spinner = false;
      }
    }, err => {
      this.spinner = false;
    });
  }
}


