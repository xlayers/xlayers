import { TestBed, inject } from '@angular/core/testing';

import { SourceCodeService } from './source-code.service';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
 // TODO: this helper should be in @angular/platform-browser-dynamic/testing
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch {
  // Ignore exceptions when calling it multiple times.
}

describe('SourceCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SourceCodeService]
    });
  });

  it('should be created', inject([SourceCodeService], (service: SourceCodeService) => {
    expect(service).toBeTruthy();
  }));
});
