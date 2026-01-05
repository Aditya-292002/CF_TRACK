import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOpportunityLogListComponent } from './sales-opportunity-log-list.component';

describe('SalesOpportunityLogListComponent', () => {
  let component: SalesOpportunityLogListComponent;
  let fixture: ComponentFixture<SalesOpportunityLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOpportunityLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOpportunityLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
