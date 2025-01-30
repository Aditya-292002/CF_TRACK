import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePrintComponent } from './expense-print.component';

describe('ExpensePrintComponent', () => {
  let component: ExpensePrintComponent;
  let fixture: ComponentFixture<ExpensePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
