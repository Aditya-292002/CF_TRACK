import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderReleaseComponent } from './sales-order-release.component';

describe('SalesOrderReleaseComponent', () => {
  let component: SalesOrderReleaseComponent;
  let fixture: ComponentFixture<SalesOrderReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
