import { TestBed, inject } from '@angular/core/testing';
import { AngularIVyCodeGenService } from './angular-ivy.service';

describe('AngularIVyCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularIVyCodeGenService]
    });
  });

  it('should be created', inject([AngularIVyCodeGenService], (service: AngularIVyCodeGenService) => {
    expect(service).toBeTruthy();
  }));
});
