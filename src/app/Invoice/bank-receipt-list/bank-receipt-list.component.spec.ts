import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptListComponent } from './bank-receipt-list.component';

describe('BankReceiptListComponent', () => {
  let component: BankReceiptListComponent;
  let fixture: ComponentFixture<BankReceiptListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankReceiptListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
