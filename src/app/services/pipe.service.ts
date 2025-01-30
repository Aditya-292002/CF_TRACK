import { Injectable } from '@angular/core';
import { CostFilterPipe } from 'src/app/resources/filter.pipe';

@Injectable({
    providedIn: 'root'
  })

  
export class PipeService {

    constructor(private currencyPipe: CostFilterPipe) { }
   
    setCommaseprated(pdata: any) {
        let rtn_pdata;
        rtn_pdata = this.currencyPipe.transform(pdata);
        return rtn_pdata;
    }

    removeCommaseprated(pdata: any) {
        let rtn_pdata;
        rtn_pdata = this.currencyPipe.parse(pdata);
        return rtn_pdata;
    }
  }