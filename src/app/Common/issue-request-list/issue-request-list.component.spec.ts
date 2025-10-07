import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueRequestListComponent } from './issue-request-list.component';

describe('IssueRequestListComponent', () => {
  let component: IssueRequestListComponent;
  let fixture: ComponentFixture<IssueRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
