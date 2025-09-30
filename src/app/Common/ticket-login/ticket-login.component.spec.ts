import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketLoginComponent } from './ticket-login.component';

describe('TicketLoginComponent', () => {
  let component: TicketLoginComponent;
  let fixture: ComponentFixture<TicketLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
