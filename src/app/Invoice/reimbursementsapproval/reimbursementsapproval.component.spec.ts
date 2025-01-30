import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementsapprovalComponent } from './reimbursementsapproval.component';

describe('ReimbursementsapprovalComponent', () => {
  let component: ReimbursementsapprovalComponent;
  let fixture: ComponentFixture<ReimbursementsapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementsapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementsapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
