import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private router: Router) { }    
   logout() :void {    
    sessionStorage.setItem('isLoggedIn','false');    
    sessionStorage.removeItem('companyDetail');        
    sessionStorage.removeItem('user_detail');        
    sessionStorage.removeItem('access_token');   
    sessionStorage.clear();     
    this.router.navigate(['/login']); 
   }   
      clientLogout() :void {    
    sessionStorage.setItem('isLoggedIn','false');    
    sessionStorage.removeItem('companyDetail');        
    sessionStorage.removeItem('user_detail');        
    sessionStorage.removeItem('access_token');   
    sessionStorage.clear();     
    this.router.navigate(['/login']); 
   }   
   public isLoggedIn(): boolean {
      let status = false;
      if (sessionStorage.getItem('access_token') !== null && sessionStorage.getItem('access_token') !== "") {
          status = true;
      }
      else {
          status = false;
      }
      return status;
  }
}
