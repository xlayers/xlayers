import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveBgComponent } from './interactive-bg.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('InteractiveBgComponent', () => {
  let component: InteractiveBgComponent;
  let fixture: ComponentFixture<InteractiveBgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InteractiveBgComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
