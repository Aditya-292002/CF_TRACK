import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-pm-confirmation',
  templateUrl: './pm-confirmation.component.html',
  styleUrls: ['./pm-confirmation.component.css']
})
export class PmConfirmationComponent implements OnInit {

  form: FormGroup;
  DEVELOPER_STATUS_SELECTED: string = ''
  statusflag:boolean=false;
  // Options for dropdowns
  RESOLUTION_LIST: { RESOLUTION_CODE: string, RESOLUTION_NAME: string }[] = [];
  
  // Uploaded document list
  DEVELOPER_DOCUMENT_LIST: { FILE_NAME: string, FILE_EXTENSION: string, DOC_BASE64: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: RoutingService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
    
          DEVELOPER_STATUS: ["OK"],
      DEVELOPER_COMMENT: [''],
      DELIVERY_BY: [null],
      EST_HOURS: [null, [Validators.min(0), Validators.max(999)]],
      RESOLUTION_CODE: ['']
    });
console.log(this.form.get('DEVELOPER_STATUS').value,"value");
this.DEVELOPER_STATUS_SELECTED =this.form.get('DEVELOPER_STATUS').value
if(this.DEVELOPER_STATUS_SELECTED=='OK'){

  this.statusflag=true;
  }else{
    this.statusflag=false;
  }
    // Subscribe to changes and update our variable
    // this.form.get('DEVELOPER_STATUS').valueChanges.subscribe(value => {
    //   this.DEVELOPER_STATUS_SELECTED =this.form.get('DEVELOPER_STATUS').value;
    //   console.log('Status', value);

    //   // Reset fields based on status
      
    // });

    

    console.log('Developer',this.DEVELOPER_STATUS_SELECTED,this.statusflag);
  }
  // File upload
  onFileSelectedUploadDocument(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.DEVELOPER_DOCUMENT_LIST.push({
          FILE_NAME: file.name,
          FILE_EXTENSION: file.name.split('.').pop()!.toLowerCase(),
          DOC_BASE64: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadDoc(file: any) {
    this.DEVELOPER_DOCUMENT_LIST = this.DEVELOPER_DOCUMENT_LIST.filter(f => f !== file);
  }

  viewDocument(file: any) {
    console.log('View document', file);
  }

  goToList() {
    this.route.changeRoute('/pmconfirmation');
  }



}