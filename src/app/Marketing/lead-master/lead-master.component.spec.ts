import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadMasterComponent } from './lead-master.component';

describe('LeadMasterComponent', () => {
  let component: LeadMasterComponent;
  let fixture: ComponentFixture<LeadMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
