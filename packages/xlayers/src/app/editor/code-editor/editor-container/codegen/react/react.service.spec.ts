import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { ReactCodeGenService } from './react.service';

describe('ReactCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReactCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [ReactCodeGenService],
    (service: ReactCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
