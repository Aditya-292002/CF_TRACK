import { Component, OnInit,ViewChild } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { RoutingService } from "src/app/services/routing.service";
import { log } from 'console';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { ApiUrlService } from 'src/app/services/api-url.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  bg_color: number = 0;
  CURRENT_YEAR: any = [
    {
      CURRENT_YEAR: "APR",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "10000",
      SALES_ACHIVE: "5%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "MAY",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "10000",
      SALES_ACHIVE: "5%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "JUN",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "15000",
      SALES_ACHIVE: "15%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "JUL",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "16000",
      SALES_ACHIVE: "20%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "AUG",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "17000",
      SALES_ACHIVE: "25%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "SEP",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "18000",
      SALES_ACHIVE: "35%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "OCT",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "19000",
      SALES_ACHIVE: "45%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "NOV",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "20000",
      SALES_ACHIVE: "55%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "DEC",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "10000",
      SALES_ACHIVE: "65%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "JAN",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "19000",
      SALES_ACHIVE: "45%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "FEB",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "20000",
      SALES_ACHIVE: "55%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
    {
      CURRENT_YEAR: "MAR",
      SALES_PLAN: "200000",
      SALES_ACTUALS: "10000",
      SALES_ACHIVE: "65%",
      COLLECTION_PLAN: "2500000",
      COLLECTION_ACTUALS: "150000",
      COLLECTION_ACHIVE: "7%",
    },
  ];
  CURRENT_VENDOR: any = [
    {
      VENDOR_NAME: "Vendor 1",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
    {
      VENDOR_NAME: "Vendor 2",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
    {
      VENDOR_NAME: "Vendor 3",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
  ];
  CURRENT_CUSTOMER: any = [
    {
      VENDOR_NAME: "Customer 1",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
    {
      VENDOR_NAME: "Customer 2",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
    {
      VENDOR_NAME: "Customer 3",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
    {
      VENDOR_NAME: "Customer 4",
      BILL_DATE: "21-01-2024",
      DUE_DATE: "21-02-2024",
      AMOUNT: "500000",
    },
  ];
  PROJECT_LIST: any = [
    {
      PROJ_CODE: "PRO-001",
      PROJ_NAME: "Office Management App",
      HOURS: "15",
      COST: "500000",
      DEADLINE: "12-01-2024",
      PRIORITY: "High",
    },
    {
      PROJ_CODE: "PRO-002",
      PROJ_NAME: "Educational Platform",
      HOURS: "15",
      COST: "550000",
      DEADLINE: "12-02-2024",
      PRIORITY: "Medium",
    },
    {
      PROJ_CODE: "PRO-003",
      PROJ_NAME: "Service Booking Software",
      HOURS: "15",
      COST: "650000",
      DEADLINE: "12-03-2024",
      PRIORITY: "Low",
    },
    {
      PROJ_CODE: "PRO-002",
      PROJ_NAME: "Educational Platform",
      HOURS: "15",
      COST: "550000",
      DEADLINE: "12-02-2024",
      PRIORITY: "Medium",
    },
    {
      PROJ_CODE: "PRO-002",
      PROJ_NAME: "Educational Platform",
      HOURS: "15",
      COST: "550000",
      DEADLINE: "12-02-2024",
      PRIORITY: "Medium",
    },
  ];
  EMPLOYEE_LIST: any = [
    {
      EMP_URL: "",
      EMP_NAME: "Priyanka Malgunkar",
      EMP_EMAIL: "priyanka.malgunkar@comflextech.com",
      EMP_DEPT: "UI/UX Designer",
      DEPT_CODE: "3",
    },
    {
      EMP_URL: "",
      EMP_NAME: "Manoj Sawant",
      EMP_EMAIL: "manoj.sawant@comflextech.com",
      EMP_DEPT: "Manager",
      DEPT_CODE: "1",
    },
    {
      EMP_URL: "",
      EMP_NAME: "Huzaifa Retiwala",
      EMP_EMAIL: "huzaifa.retiwala@comflextech.com",
      EMP_DEPT: "Team Lead",
      DEPT_CODE: "2",
    },
    // {EMP_URL:"",EMP_NAME:"Shwetal Pathak",EMP_EMAIL:"shwetal.pathak@comflextech.com",EMP_DEPT:"Tester",DEPT_CODE:"4"}
  ];
  BANK_LIST: any = [
    { BANK_NAME: "KOTAK", BANK_BAL: "50,00,000" },
    { BANK_NAME: "ICICI", BANK_BAL: "75,00,000" },
  ];
  DASHBOARD_CARD_DETAILS:any = [];
  login_user: string = "";
  profile_pic: string = "";
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions1>;
  userData: any;
  Username: any;
  Usernames: any;
  CURRENT_DATE: any;
  EMPLOYEE_TASK_LIST:any = [];
  ROLE_ID:any;

  constructor(
    public sharedService: SharedServiceService,
      private apiUrl: ApiUrlService,
      private http: HttpRequestServiceService,
      private formBuilder: FormBuilder,
      private route: RoutingService,
      private toast: ToastrService,
      private validationService: ValidationService,
      private router:Router,
      private datepipe:DatePipe
  ) {
    this.chartOptions = {
      series: [
        {
          name: "YMT",
          data: [44, 55, 57, 56, 61, 58],
        },
        {
          name: "Annual",
          data: [76, 85, 101, 98, 87, 105],
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["2020", "2021", "2022", "2023", "2024", "2025"],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    };
    this.chartOptions1 = {
      series: [
        {
          name: "KOTAK",
          data: [300000, 450000, 20008, 51000, 420000, 109000, 100000],
        },
        {
          name: "ICICI",
          data: [110000, 320000, 450000, 320000, 340000, 520000, 410000],
        },
      ],
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2024-01-19",
          "2024-02-19",
          "2024-03-19",
          "2024-04-19",
          "2024-05-19",
          "2024-06-19",
          "2024-07-19",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    };
 }


  ngOnInit() {
    this.sharedService.formName = "Dashboard";
    this.profile_pic = this.sharedService.profile_pic;
  //  console.log(' this.sharedService.loginUser', this.sharedService.user_detail);
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    //this.login_user = this.sharedService.loginUser.USER_NAME;
    //this.USER_ID = this.userData[0].USERID;
    this.ROLE_ID = this.userData[0].ROLE_ID;
    this.Username=this.userData[0].USER_NAME;
    this.Usernames=this.Username.split(" ");
    this.Username=this.Usernames[0];
    this.GetDashboardDetailsList();
  }

  ngAfterViewInit() {

  }

  GetDashboardDetailsList(){
    let data = {};
    this.http.PostRequest(this.apiUrl.GetDashboardDetailsList, data).then(
      (res:any) => {
        if (res.flag) {
          this.DASHBOARD_CARD_DETAILS = res.dashboard_details;
          this.EMPLOYEE_TASK_LIST= res.employee_task_list;
          this.EMPLOYEE_TASK_LIST.forEach((element:any)=>{
            element.PLANNED_START_DATE = this.datepipe.transform(element.PLANNED_START_DATE, 'dd-MMM-yyyy');
            element.COMPLETION_DATE = this.datepipe.transform(element.COMPLETION_DATE, 'dd-MMM-yyyy');
            element.ACTUAL_COMPLETION_DATE = this.datepipe.transform(element.ACTUAL_COMPLETION_DATE, 'dd-MMM-yyyy');
          })
          setTimeout(() => {
            $(".selectpicker").selectpicker("refresh").trigger("change");
          }, 100);
        } 
      }
    );
  }

  onbgcolorchange(para: number) {
    this.bg_color = para;
  }

  public generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  redirectBtn(value: any) {
    if (value === "customer") {
      this.route.changeRoute("/customer");
    } else {
      this.route.changeRoute("/project");
    }
  }
} 
