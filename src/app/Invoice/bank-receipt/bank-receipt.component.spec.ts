import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptComponent } from './bank-receipt.component';

describe('BankReceiptComponent', () => {
  let component: BankReceiptComponent;
  let fixture: ComponentFixture<BankReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
