import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackblitzContainerComponent } from './stackblitz-container.component';

describe('StackblitzContainerComponent', () => {
  let component: StackblitzContainerComponent;
  let fixture: ComponentFixture<StackblitzContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackblitzContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackblitzContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
