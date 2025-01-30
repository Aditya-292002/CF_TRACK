import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pnf400Component } from './pnf400.component';

describe('Pnf400Component', () => {
  let component: Pnf400Component;
  let fixture: ComponentFixture<Pnf400Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pnf400Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pnf400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
