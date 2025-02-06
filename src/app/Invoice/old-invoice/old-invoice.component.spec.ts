import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldInvoiceComponent } from './old-invoice.component';

describe('OldInvoiceComponent', () => {
  let component: OldInvoiceComponent;
  let fixture: ComponentFixture<OldInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
