import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAppraisalComponent } from './self-appraisal.component';

describe('SelfAppraisalComponent', () => {
  let component: SelfAppraisalComponent;
  let fixture: ComponentFixture<SelfAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
