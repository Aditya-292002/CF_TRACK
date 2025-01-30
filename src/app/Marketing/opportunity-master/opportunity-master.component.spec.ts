import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityMasterComponent } from './opportunity-master.component';

describe('OpportunityMasterComponent', () => {
  let component: OpportunityMasterComponent;
  let fixture: ComponentFixture<OpportunityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
