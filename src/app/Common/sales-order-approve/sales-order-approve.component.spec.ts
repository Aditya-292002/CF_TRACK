import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderApproveComponent } from './sales-order-approve.component';

describe('SalesOrderApproveComponent', () => {
  let component: SalesOrderApproveComponent;
  let fixture: ComponentFixture<SalesOrderApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
