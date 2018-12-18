import { TestBed, inject } from '@angular/core/testing';
import { AngularCodeGenService } from './angular.service';

describe('AngularCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularCodeGenService]
    });
  });

  it('should be created', inject([AngularCodeGenService], (service: AngularCodeGenService) => {
    expect(service).toBeTruthy();
  }));
});
