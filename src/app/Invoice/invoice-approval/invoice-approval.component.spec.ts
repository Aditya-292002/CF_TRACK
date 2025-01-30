import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceApprovalComponent } from './invoice-approval.component';

describe('InvoiceApprovalComponent', () => {
  let component: InvoiceApprovalComponent;
  let fixture: ComponentFixture<InvoiceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
