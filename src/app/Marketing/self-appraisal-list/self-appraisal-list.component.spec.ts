import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAppraisalListComponent } from './self-appraisal-list.component';

describe('SelfAppraisalListComponent', () => {
  let component: SelfAppraisalListComponent;
  let fixture: ComponentFixture<SelfAppraisalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfAppraisalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfAppraisalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
