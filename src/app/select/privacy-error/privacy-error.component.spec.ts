import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyErrorComponent } from './privacy-error.component';

describe('PrivacyErrorComponent', () => {
  let component: PrivacyErrorComponent;
  let fixture: ComponentFixture<PrivacyErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
