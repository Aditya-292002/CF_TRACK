import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmConfirmationComponent } from './pm-confirmation.component';

describe('PmConfirmationComponent', () => {
  let component: PmConfirmationComponent;
  let fixture: ComponentFixture<PmConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
