import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutNewComponent } from './layout-new.component';

describe('LayoutNewComponent', () => {
  let component: LayoutNewComponent;
  let fixture: ComponentFixture<LayoutNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
