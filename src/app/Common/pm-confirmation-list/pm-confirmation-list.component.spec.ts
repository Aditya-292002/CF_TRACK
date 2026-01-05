import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmConfirmationListComponent } from './pm-confirmation-list.component';

describe('PmConfirmationListComponent', () => {
  let component: PmConfirmationListComponent;
  let fixture: ComponentFixture<PmConfirmationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmConfirmationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmConfirmationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
