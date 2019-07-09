import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { AngularCodeGenService } from './angular.service';

describe('AngularCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AngularCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [AngularCodeGenService],
    (service: AngularCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
