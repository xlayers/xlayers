import { ViewerModule } from './viewer.module';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';
 // TODO: this helper should be in @angular/platform-browser-dynamic/testing
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch {
  // Ignore exceptions when calling it multiple times.
}

describe('ViewerModule', () => {
  let viewerModule: ViewerModule;

  beforeEach(() => {
    viewerModule = new ViewerModule();
  });

  it('should create an instance', () => {
    expect(viewerModule).toBeTruthy();
  });
});
