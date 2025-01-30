import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private toast: ToastrService,
    private sharedService: SharedServiceService) { }

  emailValidator(value:string)
  {   
    if(value == "" || value == null || value == undefined)
      return;
      
      let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value != "" && (value.length <= 5 || !EMAIL_REGEXP.test(value))) {
        this.toast.warning('Please enter valid email') ; 
        return false;
      }else{
        return true;
      }    
  }

  ageValidator(DOB: string = "01/01/1999",minAge: number = 18): boolean{
    let _DOB: string = "";
    _DOB = this.sharedService.getFormatedDate(DOB,'MM/DD/YYYY')
    let timeDiff = Math.abs(Date.now() - new Date(_DOB).getTime());
    let current_age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
    if(current_age >= minAge){
      return true;
    } else {
      this.toast.warning("Your age is not greater than 18")
      return false;
    }
  }

}
