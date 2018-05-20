import { TestBed, inject } from '@angular/core/testing';

import { AngularSketchViewerService } from './angular-sketch-viewer.service';

describe('AngularSketchViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularSketchViewerService]
    });
  });

  it('should be created', inject([AngularSketchViewerService], (service: AngularSketchViewerService) => {
    expect(service).toBeTruthy();
  }));
});
