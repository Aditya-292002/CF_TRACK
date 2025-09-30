import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueRequestMasterComponent } from './issue-request-master.component';

describe('IssueRequestMasterComponent', () => {
  let component: IssueRequestMasterComponent;
  let fixture: ComponentFixture<IssueRequestMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueRequestMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueRequestMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
