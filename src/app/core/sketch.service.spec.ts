import { inject, TestBed } from '@angular/core/testing';
import { SketchService } from './sketch.service';

describe('SketchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SketchService]
    });
  });

  it('should be created', inject(
    [SketchService],
    (service: SketchService) => {
    expect(service).toBeTruthy();
  }));
});
