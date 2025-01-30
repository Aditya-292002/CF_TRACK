import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ise500Component } from './ise500.component';

describe('Ise500Component', () => {
  let component: Ise500Component;
  let fixture: ComponentFixture<Ise500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ise500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ise500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
