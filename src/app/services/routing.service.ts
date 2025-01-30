import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export  class RoutingService {
  
  currentRoute: string = '';
  constructor(
    private router: Router
    
  ) { 
    
  }


/** The current URL. */
get url(): string{
  return
};

  public changeRoute(newRoute:string = ""){ 
    sessionStorage.setItem('route',newRoute)
    this.router.navigate([newRoute]);
  }

  public getPreviousRoute(): string{
    if(sessionStorage.getItem('route')){
      return sessionStorage.getItem('route')
    }
    else{
      return '/login'
    }
      
  }
}
