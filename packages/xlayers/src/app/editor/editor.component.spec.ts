import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { XStore } from '@app/core/state/state.mock';
import { WINDOW_PROVIDERS } from '@app/core/window.service';
import { NgxsModule } from '@ngxs/store';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule, NgxsModule.forRoot([XStore])],
      declarations: [EditorComponent],
      providers: [WINDOW_PROVIDERS]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(EditorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
