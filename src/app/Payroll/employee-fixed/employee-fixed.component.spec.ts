import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFixedComponent } from './employee-fixed.component';

describe('EmployeeFixedComponent', () => {
  let component: EmployeeFixedComponent;
  let fixture: ComponentFixture<EmployeeFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
