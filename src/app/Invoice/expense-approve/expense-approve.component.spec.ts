import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseApproveComponent } from './expense-approve.component';

describe('ExpenseApproveComponent', () => {
  let component: ExpenseApproveComponent;
  let fixture: ComponentFixture<ExpenseApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
