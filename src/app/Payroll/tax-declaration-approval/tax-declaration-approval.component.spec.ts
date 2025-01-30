import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDeclarationApprovalComponent } from './tax-declaration-approval.component';

describe('TaxDeclarationApprovalComponent', () => {
  let component: TaxDeclarationApprovalComponent;
  let fixture: ComponentFixture<TaxDeclarationApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDeclarationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDeclarationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
