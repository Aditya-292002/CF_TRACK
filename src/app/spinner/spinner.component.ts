import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  
  @Input() startSpinner: boolean = false;

  constructor(private spinner: NgxSpinnerService) {
    
   }

  ngOnInit() {
    
  }
  ngAfterViewInit(){
    // if(this.startSpinner)
    this.startSpinner = true;  
      this.spinner.show()
  }

  ngOnDestroy(){  
    this.startSpinner = false;  
    this.spinner.hide()
  }

}
