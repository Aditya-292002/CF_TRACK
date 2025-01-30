import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceProcessApproveComponent } from './attendance-process-approve.component';

describe('AttendanceProcessApproveComponent', () => {
  let component: AttendanceProcessApproveComponent;
  let fixture: ComponentFixture<AttendanceProcessApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceProcessApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceProcessApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
