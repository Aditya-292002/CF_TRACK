import { Pipe, PipeTransform } from '@angular/core';
import {AppSetting} from '../../files/app.setting'

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} searchColumn
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {
      try{
        if (!items) {
            return [];
          }
          if (!searchText) {
            return items;
          }
      
          searchText = searchText.toLowerCase();
      
          return items.filter(it => {
            return JSON.stringify(it).toLowerCase().includes(searchText);
          });
      } catch (e){
        console.log("EXCEPTION in FilterPipe", e)
      }
    
  }
}



const PADDING = "000000";

@Pipe({ name: "costFilter" })
export class CostFilterPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor() {
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = ".";
    this.THOUSANDS_SEPARATOR = ",";
  }

  transform(value: number | string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").toString()
      .split(this.DECIMAL_SEPARATOR);

    fraction = fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";
      
      if(integer != "" && integer != null && integer != undefined)
      {
        if(AppSetting.currencyFormatter == "INR"){
          if(integer.length <= 3){
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
          }
          else{

            integer = (integer.slice(0,-3)).replace(/\B(?=(\d{2})+(?!\d))/g, this.THOUSANDS_SEPARATOR)+","+(integer.slice(-3));
          }
        } else {
          integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
        }
      }
      else{
        return integer;
      }
      

    return integer?integer + fraction:'';
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").split(this.DECIMAL_SEPARATOR);

    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";
    
    return integer?integer + fraction:'';
  }

}


@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value) : any {
    return Object.keys(value);
  }
}
