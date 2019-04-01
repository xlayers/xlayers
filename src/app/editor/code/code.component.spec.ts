import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeComponent } from './code.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('CodeComponent', () => {
  let component: CodeComponent;
  let fixture: ComponentFixture<CodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
