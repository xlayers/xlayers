import { TestBed, inject } from '@angular/core/testing';

import { NgxSketchViewerService } from './ngx-sketch-viewer.service';

describe('NgxSketchViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxSketchViewerService]
    });
  });

  it('should be created', inject([NgxSketchViewerService], (service: NgxSketchViewerService) => {
    expect(service).toBeTruthy();
  }));
});
