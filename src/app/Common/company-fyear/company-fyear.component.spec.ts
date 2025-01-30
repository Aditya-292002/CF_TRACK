import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFyearComponent } from './company-fyear.component';

describe('CompanyFyearComponent', () => {
  let component: CompanyFyearComponent;
  let fixture: ComponentFixture<CompanyFyearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFyearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
