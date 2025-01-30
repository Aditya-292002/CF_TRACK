import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryProcessApproveComponent } from './salary-process-approve.component';

describe('SalaryProcessApproveComponent', () => {
  let component: SalaryProcessApproveComponent;
  let fixture: ComponentFixture<SalaryProcessApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryProcessApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryProcessApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
