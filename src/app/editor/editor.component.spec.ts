import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UiState } from '@app/core/state';
import { WINDOW_PROVIDERS } from '@app/core/window.service';
import { NgxsModule } from '@ngxs/store';
import { EditorComponent } from './editor.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditorComponent', () => {
  let fixture: ComponentFixture<EditorComponent>;
  let component: EditorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule, MatSnackBarModule, NgxsModule.forRoot([UiState]), RouterTestingModule.withRoutes([])],
      declarations: [EditorComponent],
      providers: [WINDOW_PROVIDERS]
    }).compileComponents();

    jest.useFakeTimers();
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.debugElement.componentInstance;
    jest.setTimeout(10);

  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set zoom in highlight option when zoomed in', () => {
    fixture.detectChanges();
    expect(component.zoomIn).toBeFalsy();
    component.ZoomIn();
    expect(component.zoomIn).toBeTruthy();
  });

  it('should unset zoom in highlight option when below our on reset level', () => {
    fixture.detectChanges();
    component.ZoomIn();
    component.ZoomIn();
    expect(component.zoomIn).toBeTruthy();
    component.ZoomReset();
    expect(component.zoomIn).toBeFalsy();
  });

  it('should set zoom out highlight option when zoomed out', () => {
    fixture.detectChanges();
    expect(component.zoomOut).toBeFalsy();
    component.ZoomOut();
    expect(component.zoomOut).toBeTruthy();
  });

  it('should unset zoom out highlighting option when above our on reset level', () => {
    fixture.detectChanges();
    component.ZoomOut();
    component.ZoomOut();
    expect(component.zoomOut).toBeTruthy();
    component.ZoomReset();
    expect(component.zoomOut).toBeFalsy();
  });


  it('should unset highlighting options when we are on reset level', () => {
    component.zoomIn = true;
    component.zoomOut = true;
    fixture.detectChanges();
    component.ZoomReset();
    expect(component.zoomOut).toBeFalsy();
    expect(component.zoomIn).toBeFalsy();
  });
});
