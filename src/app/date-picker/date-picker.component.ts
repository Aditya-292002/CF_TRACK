import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor  {
  @Input() public placeholder: string = null;
  @Input() private format = 'DD-MMM-YYYY';
  @Input() public maxdate = null;
  @Input() public mindate = null;
  @Input() public isDisable: boolean = false;

  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
  @Input() _dateValue: string = "";



  get dateValue() {
    return moment(this._dateValue, this.format);
}

set dateValue(val) {
    this._dateValue = moment(val).format(this.format);
    this.propagateChange(this._dateValue);
}
addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this.dateValue = moment(event.value, this.format);
}

writeValue(value: any) {
  if (value !== undefined && value != null && value != "") {
    this.dateValue = moment(value, this.format);
  }
}
propagateChange = (_: any) => {};

registerOnChange(fn) {
  this.propagateChange = fn;
}

registerOnTouched() {}

constructor() {
  this.maxdate = new Date();
 }
  ngOnInit() {
  }

  dateClick(){
  }
}
