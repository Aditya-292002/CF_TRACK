import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMultiPaymentComponent } from './bank-multi-payment.component';

describe('BankMultiPaymentComponent', () => {
  let component: BankMultiPaymentComponent;
  let fixture: ComponentFixture<BankMultiPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankMultiPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankMultiPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
