import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMonthComponent } from './employee-month.component';

describe('EmployeeMonthComponent', () => {
  let component: EmployeeMonthComponent;
  let fixture: ComponentFixture<EmployeeMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
