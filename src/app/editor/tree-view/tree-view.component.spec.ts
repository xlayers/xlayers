import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewComponent } from './tree-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { Store, NgxsModule, State } from '@ngxs/store';
import { XStore } from '../../core/state/state.mock';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
 // TODO: this helper should be in @angular/platform-browser-dynamic/testing
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch {
  // Ignore exceptions when calling it multiple times.
}

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTreeModule, NgxsModule.forRoot([XStore])],
      declarations: [ TreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
