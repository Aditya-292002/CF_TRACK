import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOpportunityLogComponent } from './sales-opportunity-log.component';

describe('GetOpportunityLogCommonList', () => {
  let component: SalesOpportunityLogComponent;
  let fixture: ComponentFixture<SalesOpportunityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOpportunityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOpportunityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
