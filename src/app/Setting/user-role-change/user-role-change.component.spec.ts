import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleChangeComponent } from './user-role-change.component';

describe('UserRoleChangeComponent', () => {
  let component: UserRoleChangeComponent;
  let fixture: ComponentFixture<UserRoleChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
