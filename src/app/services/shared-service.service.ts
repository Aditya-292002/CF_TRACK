import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { AppSetting } from '../../files/app.setting';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  public URL: string = "";
  settings: any;
  constructor( private http: HttpClient) {
  }
  
  public _temp_user_data: string = "";
  public loginUser: any=[{}]
  public formName: string;
  public form_rights: any = {};
  public profile_pic: string = "";
  public timesheet_date: string = '';
  public commonData: Array<any> = [];
  public tabList:any = [];
  activeId:any = 0;

  /** Developement */
  
  public TOKEN_URL: string = AppSetting.defaultApiUrl + '/token'
  public API_URL: string =  AppSetting.defaultApiUrl + '/api';

  
  /** Production */

  getTodayDate(format: string='DD-MMM-YYYY'): string{
    return (moment(new Date()).format(format)).toString();;
  }
  getFormatedDate(_date: any=new Date(),dateFormat:string="DD-MMM-YYYY"):string{    
    if(_date == null || _date == undefined || _date == "")
      return "";
    return (moment(this.getDDMMMYYYY(_date)).format(dateFormat)).toString();
  }

  getDDMMMYYYY(_date: any) {
    try{
      let stringdate: any = new Date(_date).toLocaleDateString()
      let date = stringdate.toString().split(/[-\/]/);
      if(date.length > 1){
        var map = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};

        return new Date(date[2], date[1] in map? map[date[1]] : date[1]-1, date[0]);
      } else if(date.length > 0){
        this.getDDMMMYYYY(new Date(_date).toLocaleDateString())
      }
    } catch(e){
      console.log("DateParsingError : "+e);
      return ""
    }
    
   
  }
  
  addTabs(path:any,index:any){
    for(let i=0;i<this.tabList.length;i++){
      if(this.tabList[i].path == path){
        return [];
      }
    }
    this.activeId = index
    this.tabList.push({ title: path, fragment: index, path:  path,show: true})
    console.log(this.tabList,"list")
    return this.tabList;
  }

  isValid(inputValue:any){
    if(inputValue == '' || inputValue == null || inputValue == undefined || inputValue == 'undefined'){
      return false
    }else {
      return true
    }
  }
  
}
