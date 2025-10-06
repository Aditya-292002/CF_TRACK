
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-issue-request-master',
  templateUrl: './issue-request-master.component.html',
  styleUrls: ['./issue-request-master.component.css']
})
export class IssueRequestMasterComponent implements OnInit {
  ISSUE_NO:any;
  REQUEST_DATE:any = new Date();
  REQUESTER:any;
  ISSUE_TYPE_CODE:any = '02';
  PRIORITY_CODE:any = '03';
  CODE:any;
  FUNCTION_DESC:any;
  ISSUE_SUBJECT:any;
  REASON_ISSUE:any  = "";
  DESC_ISSUE:any  = "";
  FILE_LIST:any = [];
  USER_ID:any;
  FUNCTION_CODE:any;
  USER_LIST:any =[];
  MODULE_LIST:any=[];
  PRIORITY_LIST:any=[];
 ISSUE_LIST:any=[];
 FUNCTION_LIST:any=[];
 USER_NAME:any;
 USERID:any="";
 Image:any;
 FILENAME:any;
 DOCUMENT_ATTECHED_LIST:any=[];
 SRNO:any;

 ImageData:any;
 isReasonofErrorCR:boolean = true;
 isDescofErrorCR:boolean = true;
 isErrorLableChange:boolean = false;
 visibleFunction:boolean = false;
 visibleModule:boolean = false;
 MODULE_DESC:any;
 isUploadDocument:boolean = false;
 filename:boolean = false;
 fileextension:any;
 MODULE_CODE:any;
 ISSUE_FUNCTION_CODE:any;
 SearchVlaue:any;
 GET_DOCUMENT_LIST:any = [];
 MODE:any = 'A';
 IS_CANCEL:any;
 CANCEL_IND:any;
 STATUS_CODE:any;
 GET_STATUS_CODE:any;
 visibleHistoryFun:boolean = false;
 COMMENT_HISTORY:any = [{
  status:'',
  STATUS_COLOR_NAME:'',
  Status_Name:'',
  date:'',
  EST_HOURS:'',
  DELIVERY_BY:'',
  PROPOSE_HOURS:'',
  PROPOSE_DELIVERY_BY:'',
  comment:''
 }];
 ISSUE_ID:any;
 SAMPEL_FUNCTION_LIST:any = [];
 IS_HISTORY:boolean = false;
 IS_UPDATE:boolean = false;
 STATUS_CODE_LIST:any = [];
 STATUS_NAME:any = "";
 IS_REVERT:any = 0;
 REVERT_COMMENT:any;
 messages:any = [];
 REQUESTER_NAME:any;
 SaveConfirmationPopUp:boolean = false;
 minDate:any =new Date()
 maxDate:any = new Date()
DatePipe: any;
selectedOption: string = '';
PRIORITY:any
  dropdownList: { Value: string; Text: string; }[];
  // constructor(private router: Router, private urlService: UrlService, private Cmmon: CommonService,
  //   private apiService: ApiService,private sharedservice: SharedService,private route:ActivatedRoute
  //   ,private Toastr:ToastrService,private MessageService:MessageService) { }
    
      constructor(
        private authService: AuthServiceService,
        private route: RoutingService,
        private formBuilder: FormBuilder,
        private http: HttpRequestServiceService,
        private sharedService: SharedServiceService,
        private toast: ToastrService,
        private apiurl: ApiUrlService,
        private validationService: ValidationService,
        private encr: EncryptionService,
        private router: Router,
        private datepipe:DatePipe
      ) { }
   
   ngOnInit(): void {
    this.USER_ID =""//this.sharedservice.get_USER_ID();
    this.USER_NAME="" //this.sharedservice.get_USER_NAME();
    this.CANCEL_IND = localStorage.getItem('CANCEL_IND');
    this.ISSUE_NO = localStorage.getItem('ISSUE_NO');
    this.ISSUE_ID = localStorage.getItem('ISSUE_ID');
    this.IS_CANCEL = localStorage.getItem('IS_CANCEL');
    this.FUNCTION_CODE = localStorage.getItem('FUNCTION_CODE');
    this.GET_STATUS_CODE = localStorage.getItem('STATUS_CODE'); 
    this.IS_REVERT = localStorage.getItem('IS_REVERT');
    this.GETISSUEREQUESTMASTER();

    this.dropdownList = [
    { Value: 'A', Text: 'Option A' },
    { Value: 'B', Text: 'Option B' },
    { Value: 'C', Text: 'Option C' }
  ];
    if(this.MODE == 'A'){
       this.IS_UPDATE = true;
    }
    if(this.ISSUE_NO !== null){
      this.MODE = 'E';
      this.GETISSUERAISEDDETAILSBYISSUENO();
      this.GETISSUERAISEDHISTORY(0);
    }
  }
  

  GETISSUEREQUESTMASTER() {
   let data = {
     "USER_ID": (+this.USER_ID),
     "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
   }
  //  this.apiurl.post(this.urlService.GETISSUEREQUESTMASTER, data).then((res: any) => {
  //      this.FUNCTION_LIST =res.Functioncodelist;
  //      this.SAMPEL_FUNCTION_LIST = this.FUNCTION_LIST;
  //      this.MODULE_LIST =res.Moduleslist;
  //      this.ISSUE_LIST= res.Issuelist;
  //      this.USER_LIST = res.Userlist;
  //      this.STATUS_CODE_LIST = res.Statuscodelist;
  //      this.PRIORITY_LIST = res.Prioritylist;
  //      this.REQUESTER= this.USER_NAME;
  //      this.USER_LIST.forEach((user:any)=>{
  //       if(user.USERID == this.USER_ID){
  //       this.USERID = (+user.USERID);
  //       }
  //      });
  //  });
 }

 GETISSUERAISEDDETAILSBYISSUENO(){
  let data = {
    "USER_ID": (+this.USER_ID),
    "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
    "ISSUE_NO": this.ISSUE_NO
  }
  // console.log('data ->' , JSON.stringify(data))
  // this.apiService.post(this.urlService.GETISSUERAISEDDETAILSBYISSUENO, data).then((res: any) => {
  //   // console.log('res ->' , res )
  //    this.IS_HISTORY = res.datalist[0].IS_HISTORY;
  //    this.ISSUE_NO = res.datalist[0].ISSSUE_NO;
  //    this.ISSUE_ID = res.datalist[0].ISSUE_ID;
  //    this.IS_UPDATE = res.datalist[0].IS_UPDATE;
  //    this.USERID = res.datalist[0].RAISED_BY;
  //    this.PRIORITY_CODE = res.datalist[0].PRIORITY_CODE;
  //    this.REQUESTER_NAME = res.datalist[0].REQUESTER_NAME;
  //    this.REQUESTER = res.datalist[0].REQUESTER_NAME;
  //    this.ISSUE_TYPE_CODE = res.datalist[0].ISSUE_TYPE_CODE;
  //    let request_date = res.datalist[0].REQUEST_DATE;
  //    this.MODULE_CODE = res.datalist[0].MODULE_CODE;
  //    this.MODULE_DESC = res.datalist[0].MODULE_DESC;
  //    this.ISSUE_FUNCTION_CODE = res.datalist[0].FUNCTION_CODE;
  //    this.FUNCTION_DESC = res.datalist[0].FUNCTION_DESC;
  //    this.REQUEST_DATE = new Date(request_date);
  //    this.ISSUE_SUBJECT = res.datalist[0].ISSUE_SUBJECT;
  //    this.REASON_ISSUE = res.datalist[0].ASREASON_OF_ISSUE_CR;
  //    this.DESC_ISSUE = res.datalist[0].DESC_OF_ISSUE_CR;
  //    this.ISSUE_ID = res.datalist[0].ISSUE_ID;
  //    this.STATUS_CODE = res.datalist[0].STATUS_CODE;
  //    this.STATUS_NAME = res.datalist[0].STATUS_NAME;
  //    if(this.ISSUE_TYPE_CODE == '02'){
  //      this.isReasonofErrorCR = true;
  //      this.isErrorLableChange = true;
  //    }else if(this.ISSUE_TYPE_CODE == '01'){
  //      this.isErrorLableChange = false;
  //      this.isReasonofErrorCR = false;
  //    }
  //      this.GET_DOCUMENT_LIST = res.iteamlist;
  //    if(this.GET_DOCUMENT_LIST.length > 0){
  //      this.isUploadDocument = true;
  //      this.DOCUMENT_ATTECHED_LIST = this.GET_DOCUMENT_LIST;
  //    }
  // //this.MessageService.add({severity:'warn', summary:'If you want to see current Status ',detail:"Please Check a History"});

  // });

 }

GetissueSelect(code:any){
  if(code == '01'){
     this.isReasonofErrorCR = false;
     this.isErrorLableChange = false;
     this.isDescofErrorCR = true;
     this.REASON_ISSUE = '';
     this.DESC_ISSUE = '';
  }else if(code == '02'){
    this.isReasonofErrorCR = true;
    this.isDescofErrorCR = true;
    this.isErrorLableChange = true;
    this.REASON_ISSUE = '';
    this.DESC_ISSUE = '';
  }
}

removeImage(data:any){
  this.DOCUMENT_ATTECHED_LIST = this.DOCUMENT_ATTECHED_LIST.filter((item:any) => item !== data);;
  this.toast.success('Remove Document sucessfully');
}

SaveConfirmationPopUpOpen(){
  // if(!this.Cmmon.isValid(this.REQUEST_DATE)){
  //   this.Toastr.error('Select a Request Date');
  //   return
  // }
  // if(!this.Cmmon.isValid(this.USERID)){
  //   this.Toastr.error('Select a Raised By');
  //   return
  // }
//   if(!this.Cmmon.isValid(this.ISSUE_TYPE_CODE)){
//     this.Toastr.error('Select a Issue Type');
//     return
//   }
//   if(!this.Cmmon.isValid(this.PRIORITY_CODE)){
//     this.Toastr.error('Select a Priority');
//     return
//   }
//   if(!this.Cmmon.isValid(this.ISSUE_SUBJECT)){
//     this.Toastr.error('Enter a Issue Subject');
//     return
//   }
  
// if(this.isReasonofErrorCR == true){
//   if(!this.Cmmon.isValid(this.REASON_ISSUE)){
//     this.Toastr.error('Enter a Reason Issue');
//     return
//   }
// }
// if(this.isDescofErrorCR == true){
//   if(!this.Cmmon.isValid(this.DESC_ISSUE)){
//     this.Toastr.error('Enter a Desc Issue');
//     return
//   }
// }
// if(this.IS_REVERT == 1){
//   if(!this.Cmmon.isValid(this.REVERT_COMMENT)){
//     this.Toastr.error('Enter a Comment');
//     return
//   }
// }
this.SaveConfirmationPopUp = true;
}

SAVEISSUEREQUESTMASTER(){
this.GetRemoveBase64DocumnetExtension(this.DOCUMENT_ATTECHED_LIST)

this.DOCUMENT_ATTECHED_LIST.forEach((element:any)=>{
const keyToCheck = 'DATE';
if((keyToCheck in element)){
  const dateObj = this.convertToDate(element.DATE);
///  let DATE = this.DatePipe.transform(dateObj,'yyyy-MM-dd');
// element.DATE = DATE;
}
})


  let data = {
    "ISSUE_NO": this.ISSUE_NO,
    "DATE": this.datepipe.transform(this.REQUEST_DATE,'yyyy-MM-dd'),
    "REQUESTER": this.USER_ID,
    "USERID": this.USERID,
    "ISSUE_TYPE_CODE": this.ISSUE_TYPE_CODE,
    "PRIORITY_CODE": this.PRIORITY_CODE,
    "MODULE_CODE": this.MODULE_CODE,
    "FUNCTION_CODE": this.ISSUE_FUNCTION_CODE,
    "ISSUE_SUBJECT": this.ISSUE_SUBJECT,
    "REASON_ISSUE": this.REASON_ISSUE,
    "DESC_ISSUE": this.DESC_ISSUE,
    "MODE": this.MODE,
    "STATUS_CODE": this.STATUS_CODE,
    "REVERT_COMMENT": this.REVERT_COMMENT,
    DOCUMENT_ATTECHED_LIST: this.DOCUMENT_ATTECHED_LIST,
  }
  //  console.log('data ->' , JSON.stringify(data))
  // return 
//    this.apiService.post(this.urlService.SAVEISSUEREQUEST, data).then((res: any) => {
//     if (res.Resultlist[0].FLAG == 1) {
// this.SaveConfirmationPopUp = false;

//        this.Toastr.success(res.Resultlist[0].MSG)
//        this.router.navigate([`/issuerequestlist`]);
//     } else if (res.Resultlist[0].FLAG == 0) {
//       this.Toastr.error(res.Resultlist[0].MSG);
//     }
//   });
 }
 
 showFunctionDialog(){
    this.visibleFunction = true;
 }

 AddFunCode(data:any){
  this.visibleFunction = false;
  this.FUNCTION_DESC = data.FUNCTION_NAME;
  this.ISSUE_FUNCTION_CODE = data.FUNCTION_CODE;
  this.SearchVlaue = '';
  this.MODULE_LIST.forEach((element:any) => {
    if(element.CODE == data.FUNCTION_GROUP){
      this.MODULE_DESC = element.DESCRIPTION;
      this.MODULE_CODE = element.CODE;
    }
  })
 }

 showModuleDialog(){
  this.visibleModule = true;
}

 AddModuleCode(data:any){
  // console.log('data ->' , data)
  this.visibleModule = false;
  this.MODULE_DESC = data.DESCRIPTION;
  this.MODULE_CODE = data.CODE;
  this.SearchVlaue = '';
  this.FUNCTION_LIST = [];
  this.SAMPEL_FUNCTION_LIST.forEach((element:any) => {
    if(element.FUNCTION_GROUP == data.CODE){
       this.FUNCTION_LIST.push(element)
    }
  })
 }
 
 BackToList(){
  this.router.navigate([`/issuerequestlist`]);
 }

 CheckUploadDocument(event:any){
  if(event == true){
     this.isUploadDocument = true;
  }else if(event == false){
    this.isUploadDocument = false;
    this.DOCUMENT_ATTECHED_LIST = [];
  }
 }

 DownloadDocument(base64: string, name: string){
  const link = document.createElement('a');
  link.href = base64;
  link.target = '_blank';
  link.download = name; // Optional: suggest downloading the file
  link.click();
 }

 viewDocument(base64: string, name: string) {
  const link = document.createElement('a');
  link.href = base64;
  link.target = '_blank';
  window.open(link.href, '_blank');
}

 onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
 
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.convertFilesToBase64(filesArray);
    }
  }
  
  convertFilesToBase64(files: File[]) {
    files.forEach((file, index) => {
      let name = file.name.split('.').pop();
      const mimeType = this.getMimeType(name);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.DOCUMENT_ATTECHED_LIST.push({
          // FILE_NAME: file.name,
          // DOC_BASE64: e.target?.result,
          // SR_NO: this.DOCUMENT_ATTECHED_LIST.length + 1, 
          // FILE_EXTENSION: file.name.split('.').pop() 
        });
      };
      reader.readAsDataURL(file); 
    });
  }

  getMimeType(extension: any): any {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream'; // Fallback for unknown types
    }
  }

  onKeyPressModule(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault(); 
      this.visibleModule = true; 
    }
  }

  onKeyPressFunction(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault(); 
      this.visibleFunction = true; 
    }
  }

  GetRemoveBase64DocumnetExtension(data:any){
  data.forEach((file:any) => {
   if(file.FILE_EXTENSION == "pdf"){
    file.DOC_BASE64 = file.DOC_BASE64.split('data:application/pdf;base64,').join('')
   }else if(file.FILE_EXTENSION == "jpg"){
    file.DOC_BASE64 = file.DOC_BASE64.split('data:image/jpg;base64,').join('')
   }else if(file.FILE_EXTENSION == "xlsx"){
    file.DOC_BASE64 = file.DOC_BASE64.replace(/^\s*[^,]+,\s*/, '').trim()
   }else if(file.FILE_EXTENSION == "png"){
    file.DOC_BASE64 = file.DOC_BASE64.split('data:image/png;base64,').join('')
   }else if(file.FILE_EXTENSION == "jpeg"){
    file.DOC_BASE64 = file.DOC_BASE64.split('data:image/jpeg;base64,').join('')
   }else if(file.FILE_EXTENSION == "docx"){
    file.DOC_BASE64 = file.DOC_BASE64.replace(/^\s*[^,]+,\s*/, '').trim()
   }
  });
  this.DOCUMENT_ATTECHED_LIST = data;
  }

  CANCELISSUERAISED(){
    let data = {
      "USER_ID": (+this.USER_ID),
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
      "ISSUE_NO": this.ISSUE_NO
    }
    // this.apiService.post(this.urlService.CANCELISSUERAISED, data).then((res: any) => {
    //   if (res.Resultlist[0].FLAG == 1) {
    //     this.Toastr.success(res.Resultlist[0].MSG)
    //     this.router.navigate([`/issuerequestlist`]);
    //  } else if (res.Resultlist[0].FLAG == 0) {
    //    this.Toastr.error(res.Resultlist[0].MSG);
    //  }
    // });
  }

  GETISSUERAISEDHISTORY(val:any){
    let data = {
      "USER_ID": (+this.USER_ID),
      "ISSUE_ID": this.ISSUE_ID,
      "ISSUE_NO": this.ISSUE_NO,
      "FUNCTION_CODE": ((this.FUNCTION_CODE == undefined || this.FUNCTION_CODE == null) ? "" : this.FUNCTION_CODE),
    }
    // console.log('data ->' , JSON.stringify(data))
    // return
    // this.apiService.post(this.urlService.GETISSUERAISEDHISTORYLIST, data).then((res: any) => {
    // if(res.flag == 1){
    //   this.COMMENT_HISTORY = res.Datalist.RootElement;
    //   this.MessageService.add({severity:'warn', summary:res.Datalist.RootElement[0].Status_Name,detail:res.Datalist.RootElement[0].comment});
    //   if(val == 1){
    //     this.visibleHistoryFun = true;
    //   }
    // }else if(res.flag == 0){
    //   return
    // }
    // });
   }

   convertToDate(dateString: string): Date {
    const [datePart, timePart, period] = dateString.split(' '); // split date and time
    
    const [day, month, year] = datePart.split('-').map(Number); // split day, month, year
    let [hours, minutes, seconds] = timePart.split(':').map(Number); // split time into hours, minutes, seconds

    if (period === 'PM' && hours < 12) {
      hours += 12; // Convert PM hours to 24-hour format
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to 00:00
    }

    // Create a new Date object in 'yyyy-MM-ddTHH:mm:ss' format
    const formattedDate = new Date(year, month - 1, day, hours, minutes, seconds);

    return formattedDate;
  }
  
  openImageInNewWindow(image: string) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';  // Ensure it's on top of other content
  
    // Create an img element inside the modal
    const imgElement = document.createElement('img');
    imgElement.src = image;
    imgElement.alt = 'Preview Image';
    imgElement.style.maxWidth = '80%';  // Optional: Set maximum image width
    imgElement.style.maxHeight = '80%';  // Optional: Set maximum image height
    imgElement.style.transition = 'transform 0.3s ease';  // Smooth transition for zoom effect
    imgElement.style.cursor = 'zoom-in'; // Cursor to indicate zoom functionality
  
    // Append the image to the modal
    modal.appendChild(imgElement);
    document.body.appendChild(modal);
  
    // Zoom in effect when hovered
    imgElement.addEventListener('mouseenter', () => {
      imgElement.style.transform = 'scale(1.5)'; // Zoom in by 1.5x when mouse enters
      imgElement.style.cursor = 'zoom-out'; // Change cursor to zoom-out when zoomed in
    });
  
    // Zoom out effect when mouse leaves
    imgElement.addEventListener('mouseleave', () => {
      imgElement.style.transform = 'scale(1)'; // Reset zoom when mouse leaves
      imgElement.style.cursor = 'zoom-in'; // Reset cursor to zoom-in
    });
  
    // Close the modal when clicked
    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
getvalue(){
  console.log(this.PRIORITY,'getvalue');
  
}
UserId() {}

}

