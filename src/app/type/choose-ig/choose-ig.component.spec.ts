import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseIgComponent } from './choose-ig.component';

describe('ChooseIgComponent', () => {
  let component: ChooseIgComponent;
  let fixture: ComponentFixture<ChooseIgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseIgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseIgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
