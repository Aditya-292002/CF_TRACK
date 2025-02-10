import { forEach } from '@angular-devkit/schematics';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { HttpRequestServiceService } from 'src/app/services/http-request-service.service';
import { PipeService } from 'src/app/services/pipe.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ValidationService } from 'src/app/services/validation.service';
declare var $: any;

@Component({
  selector: 'app-role-rights',
  templateUrl: './role-rights.component.html',
  styleUrls: ['./role-rights.component.css']
})
export class RoleRightsComponent implements OnInit {

  spinner:boolean = false;
  ROLE_RIGHTS_LIST:any={};
  userData:any = {};
  Username:string=''
  USER_ID:any;
  ROLE_ID:any;
  user_role_list:any
  ROLE_RIGHTS_DETAILS:any = [];
  savingData:any=[]
  Usernames: string[];
  ROLEWISE_LIST: any;
  copyROLE_RIGHTS_LIST: void;

  constructor(public sharedService: SharedServiceService,
    private apiUrl: ApiUrlService,
    private http: HttpRequestServiceService,
    private toast: ToastrService,
    public validationService: ValidationService,
    private pipeService: PipeService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.sharedService.formName = "Role & Rights";9
    this.GetRoleList();
     this.GetRoleRightsMasterList(); 
     this.getUserRoleList();
    setTimeout(() => {
    $('.selectpicker').selectpicker('refresh').trigger('change');
  },210);
    this.userData = JSON.parse(sessionStorage.getItem('user_detail'));
    this.USER_ID = this.userData[0].USERID;
    this.Username=this.userData[0].USER_NAME;
    this.Usernames=this.Username.split(" ");
    this.Username=this.Usernames[0];
  }

  async GetFilterMenuDisplay(arr: any){
    const itemMap = {};
    let roots = [];
    let counter=1
    arr.forEach((item:any) => {
       if(item.FUNCTION_CODE != 0){
        itemMap[item.FUNCTION_CODE] = {
          key: '',
          data: {
              FUNCTION_NAME: item.FUNCTION_DESC,
              FUNCTION_CODE: item.FUNCTION_CODE,
              MODULE_CODE: item.MODULE_CODE,
              VIEW_RIGHTS: false,
              ADD_RIGHTS: false,
              UPDATE_RIGHTS: false,
              DELETE_RIGHTS: false,
              FORM_NAME: false
          },
          children: []
      };
       }else{
        item.FUNCTION_CODE=counter;
        itemMap[item.FUNCTION_CODE] = {
          key: '',
          data: {
              FUNCTION_NAME: item.FUNCTION_DESC,
              FUNCTION_CODE: item.FUNCTION_CODE,
              MODULE_CODE: item.MODULE_CODE,
              VIEW_RIGHTS: false,
              ADD_RIGHTS: false,
              UPDATE_RIGHTS: false,
              DELETE_RIGHTS: false,
              FORM_NAME: false,
          },
          children: []
      };
       }
       counter++;
    });
    arr.forEach((item:any, index:any) => {
        const node = itemMap[item.FUNCTION_CODE];
      if(item.MODULE_CODE == ""){
        node.key = item.FUNCTION_CODE ? `${itemMap[item.FUNCTION_CODE].key}-${itemMap[item.FUNCTION_CODE].children.length}` : `${index}`;
      }else{
        node.key = item.MODULE_CODE ? `${itemMap[item.MODULE_CODE].key}-${itemMap[item.MODULE_CODE].children.length}` : `${index}`;
      }
        if (item.MODULE_CODE) {
            if (itemMap[item.MODULE_CODE]) {
               itemMap[item.MODULE_CODE].children.push(node);
            } 
        } else {
           roots.push(node);
        }
    });
    this.ROLE_RIGHTS_LIST = roots;
    // console.log('ROLE_RIGHTS_LIST ->' , this.ROLE_RIGHTS_LIST)
    // console.log('roots ->' , roots)
    return roots;
   
  }

GetViewRights(functionCode:any){
  this.ViewRights(this.ROLE_RIGHTS_LIST,functionCode);
}

ViewRights(data:any,functionCode:any){
  data.forEach((item:any) => {
    if (item.data.FUNCTION_CODE == functionCode) {
      if(item.data.VIEW_RIGHTS == true){
        item.data.ADD_RIGHTS = true;
        item.data.UPDATE_RIGHTS = true;
        item.data.DELETE_RIGHTS = true;
        item.children.forEach((element:any)=>{
          element.data.VIEW_RIGHTS = true;
          element.data.UPDATE_RIGHTS = true;
          element.data.ADD_RIGHTS = true;
          element.data.DELETE_RIGHTS = true;
      });
      }
      if(item.data.VIEW_RIGHTS == false){
        item.data.ADD_RIGHTS = false;
        item.data.UPDATE_RIGHTS = false;
        item.data.DELETE_RIGHTS = false;
        item.children.forEach((element:any)=>{
          element.data.VIEW_RIGHTS = false;
          element.data.UPDATE_RIGHTS = false;
          element.data.ADD_RIGHTS = false;
          element.data.DELETE_RIGHTS = false;
      });
      }
    }
  item.children.forEach((element:any)=>{
    if(element.data.FUNCTION_CODE == functionCode){
      if(element.data.VIEW_RIGHTS == true){
        element.data.ADD_RIGHTS = true;
        element.data.UPDATE_RIGHTS = true;
        element.data.DELETE_RIGHTS = true;
        item.data.VIEW_RIGHTS = true;
        item.data.UPDATE_RIGHTS = true;
      }
      if(element.data.VIEW_RIGHTS == false){
        element.data.ADD_RIGHTS = false;
        element.data.UPDATE_RIGHTS = false;
        element.data.DELETE_RIGHTS = false;
      }
    }
    });
  });
}

GetCreateRights(functionCode:any){
  this.CreateRights(this.ROLE_RIGHTS_LIST,functionCode);
}

CreateRights(data:any,functionCode:any){
  data.forEach((item:any) => {
    if (item.data.FUNCTION_CODE == functionCode) {
      if(item.data.ADD_RIGHTS == true){
        item.data.ADD_RIGHTS != item.data.ADD_RIGHTS;
        item.data.VIEW_RIGHTS = true;
      }
    }
  item.children.forEach((element:any)=>{
    if(element.data.FUNCTION_CODE == functionCode){
      if(element.data.ADD_RIGHTS == true){
        element.data.ADD_RIGHTS != element.data.ADD_RIGHTS;
        element.data.VIEW_RIGHTS = true;
        item.data.VIEW_RIGHTS = true;
        item.data.UPDATE_RIGHTS = true;
      }
    }
    });
  });
  if(functionCode == 'HC002'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC002"){
        if(item.data.ADD_RIGHTS == false){
      item.children.forEach((element:any)=>{
          element.data.ADD_RIGHTS = false;
      });
      }
      if(item.data.ADD_RIGHTS == true){
        item.children.forEach((element:any)=>{
              element.data.ADD_RIGHTS = true;
              element.data.VIEW_RIGHTS = true;
          });
      }
    }
  });
  }
  if(functionCode == 'HC003'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC003"){
        if(item.data.ADD_RIGHTS == false){
          item.children.forEach((element:any)=>{
                element.data.ADD_RIGHTS = false;
            });
        }
        if(item.data.ADD_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.ADD_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
  if(functionCode == 'HC011'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC011"){
        if(item.data.ADD_RIGHTS == false){
          item.children.forEach((element:any)=>{
              element.data.ADD_RIGHTS = false;
            });
        }
        if(item.data.ADD_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.ADD_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
}

GetEditRights(functionCode:any){
  this.EditRights(this.ROLE_RIGHTS_LIST,functionCode);
}

EditRights(data:any,functionCode:any){
  // console.log('functionCode ->' , functionCode)
  data.forEach((item:any) => {
    if (item.data.FUNCTION_CODE == functionCode) {
      if(item.data.UPDATE_RIGHTS == true){
        item.data.UPDATE_RIGHTS != item.data.UPDATE_RIGHTS;
        item.data.VIEW_RIGHTS = true;
        // item.data.IS_SELECTED = true;
      }
    }
    item.children.forEach((element:any)=>{
      if(element.data.FUNCTION_CODE == functionCode){
        if(element.data.UPDATE_RIGHTS == true){
          element.data.UPDATE_RIGHTS != element.data.UPDATE_RIGHTS;
          element.data.VIEW_RIGHTS = true;
          item.data.VIEW_RIGHTS = true;
          item.data.UPDATE_RIGHTS = true;
          // element.data.IS_SELECTED = true;
        }
      }
    });
  });

  if(functionCode == 'HC002'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC002"){
        if(item.data.UPDATE_RIGHTS == false){
      item.children.forEach((element:any)=>{
          element.data.UPDATE_RIGHTS = false;
          element.data.VIEW_RIGHTS = false;
          element.data.ADD_RIGHTS = false;
          element.data.DELETE_RIGHTS = false;
      });
         }
         if(item.data.UPDATE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.UPDATE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
       }
  });
  }
  if(functionCode == 'HC003'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC003"){
        if(item.data.UPDATE_RIGHTS == false){
          item.children.forEach((element:any)=>{
                element.data.UPDATE_RIGHTS = false;
            });
        }
        if(item.data.UPDATE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.UPDATE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
  if(functionCode == 'HC011'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC011"){
        if(item.data.UPDATE_RIGHTS == false){
          item.children.forEach((element:any)=>{
              element.data.UPDATE_RIGHTS = false;
            });
        }
        if(item.data.UPDATE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.UPDATE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
}

GetCancelRights(functionCode:any){
  this.CancelRights(this.ROLE_RIGHTS_LIST,functionCode);
}

CancelRights(data:any,functionCode:any){
  data.forEach((item:any) => {
    if (item.data.FUNCTION_CODE == functionCode) {
      if(item.data.DELETE_RIGHTS == true){
        item.data.DELETE_RIGHTS != item.data.DELETE_RIGHTS;
        item.data.VIEW_RIGHTS = true;
        // item.data.IS_SELECTED = true;
      }
    }
  item.children.forEach((element:any)=>{
    if(element.data.FUNCTION_CODE == functionCode){
      if(element.data.DELETE_RIGHTS == true){
        element.data.DELETE_RIGHTS != element.data.DELETE_RIGHTS;
        element.data.VIEW_RIGHTS = true;
        item.data.VIEW_RIGHTS = true;
        item.data.UPDATE_RIGHTS = true;
        // element.data.IS_SELECTED = true;
      }
    }
    });
  });

  if(functionCode == 'HC002'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC002"){
        if(item.data.DELETE_RIGHTS == false){
      item.children.forEach((element:any)=>{
          element.data.DELETE_RIGHTS = false;
      });
         }
         if(item.data.DELETE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.DELETE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
       }
  });
  }
  if(functionCode == 'HC003'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC003"){
        if(item.data.DELETE_RIGHTS == false){
          item.children.forEach((element:any)=>{
                element.data.DELETE_RIGHTS = false;
            });
        }
        if(item.data.DELETE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.DELETE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
  if(functionCode == 'HC011'){
    data.forEach((item:any) => {
      if(item.data.FUNCTION_CODE == "HC011"){
        if(item.data.DELETE_RIGHTS == false){
          item.children.forEach((element:any)=>{
              element.data.DELETE_RIGHTS = false;
            });
        }
        if(item.data.DELETE_RIGHTS == true){
          item.children.forEach((element:any)=>{
                element.data.DELETE_RIGHTS = true;
                element.data.VIEW_RIGHTS = true;
            });
        }
      }
  });
  }
}

async GetRoleRightsMasterList(){
  let data = {
    USER_ID: this.USER_ID,
    ROLE_ID: this.ROLE_ID
  }
  this.spinner = true;
  await this.http.PostRequest(this.apiUrl.GetRoleRightsMasterList, data).then((res:any) => {
      this.ROLE_RIGHTS_LIST = res.role_rights_list
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
  });
  await this.GetFilterMenuDisplay(this.ROLE_RIGHTS_LIST);
}

GetRoleList(){  
  let data = {
    USER_ID: this.USER_ID
  }
  this.http.PostRequest(this.apiUrl.GetMasterRoleCommonList, data).then(res => {
    if (res.flag) {
      this.user_role_list = res.Role_list
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    } else {
      this.spinner = false;
    }
  });
  
}

async getUserRoleList(){
  let data = {
    USER_ID: this.USER_ID,
    ROLE_ID: this.ROLE_ID
  }
  
   this.http.PostRequest(this.apiUrl.GETROLELIST, data).then(res => {
    //console.log(res,'res getUserRoleList');
    // if (res.flag) {
     
      this.ROLEWISE_LIST = res.role_list
      //
      this.updateMenuList();
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    // } else {
      this.spinner = false;
    // }
  });
}
async updateMenuList(){

  await this.GetRoleRightsMasterList(); 
 // console.log('this.ROLEWISE_LIST',this.ROLEWISE_LIST);
  this.copyROLE_RIGHTS_LIST=this.ROLE_RIGHTS_LIST;
 // console.log('this.ROLE_RIGHTS_LIST',this.ROLE_RIGHTS_LIST);
  this.ROLE_RIGHTS_LIST.forEach((b:any) => {
    this.ROLEWISE_LIST.forEach((a:any) => {
    if(a.MODULE_CODE=='' && a.FUNCTION_CODE==b.data.FUNCTION_CODE){
      b.data.DELETE_RIGHTS=a.DELETE_RIGHTS;
      b.data.ADD_RIGHTS=a.ADD_RIGHTS; 
      b.data.UPDATE_RIGHTS=a.UPDATE_RIGHTS;
      b.data.VIEW_RIGHTS=a.VIEW_RIGHTS;
    }
    // b.children[0].data.MODULE_CODE && a.FUNCTION_CODE==b.children[0].data.FUNCTION_CODE
    if(a.MODULE_CODE!='' ){
      for (let index = 0; index <b.children.length; index++) {
        if(a.MODULE_CODE== b.children[index].data.MODULE_CODE && a.FUNCTION_CODE==b.children[index].data.FUNCTION_CODE){
          b.children[index].data.DELETE_RIGHTS=a.DELETE_RIGHTS;
          b.children[index].data.ADD_RIGHTS=a.ADD_RIGHTS;
          b.children[index].data.UPDATE_RIGHTS=a.UPDATE_RIGHTS;
          b.children[index].data.VIEW_RIGHTS=a.VIEW_RIGHTS;
        }
      }
    }
    });
  });
}

saveData()
{
  this.spinner = true;
  this.savingData=[]
  this.ROLE_RIGHTS_LIST.forEach(element => {
  this.savingData.push(element.data)
  if(element.children.length>0){
    for (let index = 0; index <element.children.length; index++) {
      this.savingData.push(element.children[index].data)
      }
    }
  });
  let data={
    USER_ID: this.USER_ID,
    ROLE_ID:this.ROLE_ID,
    ROLE_RIGHTS_LIST:this.savingData
  }
  // console.log('savingData',data);
  // return
  this.http.PostRequest(this.apiUrl.SaveEmployeeRoleRights, data).then(res => {
    //console.log(res,'res getUserRoleList');
     if (res.flag) {
      this.ROLEWISE_LIST = res.role_list
      this.toast.success(res.msg)
     // this.updateMenuList();
     }
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh').trigger('change');
      }, 100);
      this.spinner = false;
    // } else {
      this.spinner = false;
    // }
  });
}



}
