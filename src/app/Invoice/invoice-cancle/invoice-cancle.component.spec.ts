import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCancleComponent } from './invoice-cancle.component';

describe('InvoiceCancleComponent', () => {
  let component: InvoiceCancleComponent;
  let fixture: ComponentFixture<InvoiceCancleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCancleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCancleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
