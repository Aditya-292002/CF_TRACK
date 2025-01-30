import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestChangeComponent } from './invoice-request-change.component';

describe('InvoiceRequestChangeComponent', () => {
  let component: InvoiceRequestChangeComponent;
  let fixture: ComponentFixture<InvoiceRequestChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRequestChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRequestChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
