import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CostFilterPipe } from './filter.pipe';

@Directive({
  selector: '[InputType]'
})
export class InputType {
  @Input('InputType') InputFormat;

  constructor(private el: ElementRef,private control : NgControl) { }

  private regx_AlphaOnly: RegExp = new RegExp(/[^a-zA-Z]+$/g);
  private regx_AlphaSpace: RegExp = new RegExp(/[^a-zA-Z\s]+$/g);
  private regx_AlphaNumSpace: RegExp = new RegExp(/[^a-zA-Z0-9\s]+$/g);
  private regx_AlphaNum: RegExp = new RegExp(/[^a-zA-Z0-9]+$/g);
  private regx_AlphaDashSpace: RegExp = new RegExp(/[^a-zA-Z\_\-\  ]+$/g);

  private regx_Address: RegExp = new RegExp(/[^a-zA-Z0-9\,\-\/\(\)\s]+$/g);
  // private regx_AlphaDashSpace: RegExp = new RegExp(/[^a-zA-Z\_\-\  ]+$/g);

  @HostListener('input', ['$event'])
  onInputChange(event) {

    const initalValue = this.el.nativeElement.value;
    let e = <KeyboardEvent>event;

    if (this.InputFormat == 'AlphaOnly') {

      this.el.nativeElement.value = initalValue.replace(this.regx_AlphaOnly, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }

    } else if (this.InputFormat == 'AlphaSpace') {

      this.el.nativeElement.value = initalValue.replace(this.regx_AlphaSpace, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }

    } else if (this.InputFormat == 'AlphaNumSpace') {

      this.el.nativeElement.value = initalValue.replace(this.regx_AlphaNumSpace, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }

    } else if (this.InputFormat == 'AlphaNum') {

      this.el.nativeElement.value = initalValue.replace(this.regx_AlphaNum, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }

    } else if (this.InputFormat == 'AlphaDashSpace') {

      this.el.nativeElement.value = initalValue.replace(this.regx_AlphaDashSpace, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }

    } else if (this.InputFormat == 'Address') {

      this.el.nativeElement.value = initalValue.replace(this.regx_Address, '');
      this.control.control.setValue(this.el.nativeElement.value)
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }
}


@Directive({
  selector: '[Uppercase]'
})
export class UppercaseDirective {

  constructor(private el: ElementRef,private control : NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event) {

    const initalValue = this.el.nativeElement.value;
    let e = <KeyboardEvent>event;

      this.el.nativeElement.value = initalValue.toString().toUpperCase();
      this.control.control.setValue(this.el.nativeElement.value);
  }
}


@Directive({
  selector: 'input[DecimalDigit]'
})
export class DecimalDigitDirective {
  @Input('DecimalDigit') DecimalDigit;

  constructor(private el: ElementRef,private control : NgControl) { }
  private regex_twoDigit: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private regex_fourDigit: RegExp = new RegExp(/^\d*\.?\d{0,4}$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (this.DecimalDigit == 4) {

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_fourDigit)) {
        event.preventDefault();
      }

    } else {

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_twoDigit)) {
        event.preventDefault();
      }
    }

  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (this.DecimalDigit == 4) {

      let _s = this.el.nativeElement.value.split('.');
      if (_s.length > 1) {
        _s[0] = Number(_s[0]) > 0 ? _s[0] : "00";
        _s[1] = _s.length > 1 ? _s[1] : '';
        this.el.nativeElement.value = _s[0].toString().length == 0 ? "00" : _s[0].toString() + '.' + (_s.length > 1 ? _s[1] : '')
      }

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_fourDigit)) {
        event.preventDefault();
      }

    } else {

      let _s = this.el.nativeElement.value.split('.');
      if (_s.length > 1) {
        _s[0] = Number(_s[0]) > 0 ? _s[0] : "00";
        _s[1] = _s.length > 1 ? Number(_s[1]) > 99 ? 99 : _s[1] : '';
        this.el.nativeElement.value = ("00" + _s[0].toString()).slice(-2) + '.' + (_s.length > 1 ? _s[1] : '')
      }

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_twoDigit)) {
        event.preventDefault();
      }
    }

  }

  @HostListener('focusout', ['$event'])
  onBlur(event: KeyboardEvent) {
    if (this.DecimalDigit == 4) {

      let _s = this.el.nativeElement.value.split('.');
      _s[0] = Number(_s[0]) > 0 ? _s[0] : "00";
      _s[1] = _s.length > 1 ? _s[1] : '';

      let _int = _s[0].toString().length >= 1 ? _s[0].toString() : "0";
      let _dec = _s.length > 1 ? (_s[1].length >= 1 ? _s[1] : _s[1] + '0') : _s[1]

      this.el.nativeElement.value = _int + '.' + _dec

    } else {

      let _s = this.el.nativeElement.value.split('.');
      _s[0] = Number(_s[0]) > 0 ? _s[0] : "00";
      _s[1] = _s.length > 1 ? _s[1] : '';

      let _int = _s[0].toString().length >= 1 ? _s[0].toString() : "0";
      let _dec = _s.length > 1 ? (_s[1].length == 1 ? _s[1] + '0' : _s[1].length == 2 ? _s[1] : '00') : '00'

      this.el.nativeElement.value = _int + '.' + _dec

    }

  }
}



@Directive({
  selector: 'input[MaxValueTo]'
})
export class MaxValueToDirective {

  @Input('MaxValueTo') limitTo;

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event) {

    const initalValue = +this._el.nativeElement.value;
    var limit = +this.limitTo;

    if (initalValue > limit) {
      this._el.nativeElement.value = limit;
      event.preventDefault()
    }
  }

}

@Directive({
  selector: 'input[LengthTo]'
})
export class LengthToDirective {
  @Input('LengthTo') LengthTo;

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event) {

    var limit = +this.LengthTo;

    if (this._el.nativeElement.value.length > limit) {
      event.preventDefault()
    }
  }
}

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  constructor(private el: ElementRef,private control : NgControl) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }
}

/********* HHHH:MM time controller */
@Directive({
  selector: '[TimeOnly]'
})
export class TimeDirective {
  @Input('TimeOnly') TimeOnly;

  private regex_HHHH_MM: RegExp = new RegExp(/^\d{0,4}(\:\d{0,2})?$/g);
  private regex_HH_MM: RegExp = new RegExp(/^\d{0,2}(\:\d{0,2})?$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef,private control : NgControl) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (this.TimeOnly == 'HHHH:MM') {

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Colon' ? ':' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_HHHH_MM)) {
        event.preventDefault();
      }

    } else {

      let current: string = this.el.nativeElement.value;
      const position = this.el.nativeElement.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Colon' ? ':' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex_HH_MM)) {
        event.preventDefault();
      }

    }

  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;

    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Colon' ? ':' : event.key, current.slice(position)].join('');

    if (this.TimeOnly == 'HHHH:MM') {

      if (this.el.nativeElement.value.length == 4) {
        let _s = this.el.nativeElement.value.split(':');
        // _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
        _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';
        this.el.nativeElement.value = ("0000" + _s[0].toString()).slice(-4) + ':' + (_s.length > 1 ? _s[1] : '')
      }
      if (this.el.nativeElement.value.length >= 6) {
        let _s = this.el.nativeElement.value.split(':');
        // _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
        _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';
        this.el.nativeElement.value = ("0000" + _s[0].toString()).slice(-4) + ':' + (_s.length > 1 ? _s[1] : '')
      }
      if (next && !String(next).match(this.regex_HHHH_MM)) {
        event.preventDefault();
      }

    } else {

      if (this.el.nativeElement.value.length == 2) {

        let _s = this.el.nativeElement.value.split(':');
        _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
        _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';
        this.el.nativeElement.value = ("00" + _s[0].toString()).slice(-2) + ':' + (_s.length > 1 ? _s[1] : '')

      }
      if (this.el.nativeElement.value.length >= 4) {

        let _s = this.el.nativeElement.value.split(':');
        _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
        _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';
        this.el.nativeElement.value = ("00" + _s[0].toString()).slice(-2) + ':' + (_s.length > 1 ? _s[1] : '')
      }

      if (next && !String(next).match(this.regex_HH_MM)) {
        event.preventDefault();
      }
    }
  }

  @HostListener('focusout', ['$event'])
  onBlur(event: KeyboardEvent) {
    let _s = this.el.nativeElement.value.split(':');

    if (this.TimeOnly == 'HHHH:MM') {

      // _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
      _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';

      let _h = ("0000" + _s[0].toString()).slice(-4);
      let _m = _s.length > 1 ? (_s[1].length > 0 ? _s[1] : '00') : '00';

      this.el.nativeElement.value = _h + ':' + ('00' + _m.toString()).slice(-2);
    } else {

      _s[0] = Number(_s[0]) > 23 ? 23 : _s[0];
      _s[1] = _s.length > 1 ? Number(_s[1]) > 59 ? 59 : _s[1] : '';

      let _h = ("00" + _s[0].toString()).slice(-2);
      let _m = _s.length > 1 ? (_s[1].length > 0 ? _s[1] : '00') : '00';

      this.el.nativeElement.value = _h + ':' + ('00' + _m.toString()).slice(-2);
    }

  }

}


@Directive({ selector: "[costInput]" })
export class CurrencyInputDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CostFilterPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    
    this.el.value = this.currencyPipe.transform(this.el.value);
      
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.transform(value);
  }

}