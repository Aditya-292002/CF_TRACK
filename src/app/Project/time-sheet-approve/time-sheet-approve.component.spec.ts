import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetApproveComponent } from './time-sheet-approve.component';

describe('TimeSheetApproveComponent', () => {
  let component: TimeSheetApproveComponent;
  let fixture: ComponentFixture<TimeSheetApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
