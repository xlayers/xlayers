import { inject, TestBed } from '@angular/core/testing';
import { ReactCodeGenService } from './react.service';

describe('ReactCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactCodeGenService]
    });
  });

  it('should be created', inject(
    [ReactCodeGenService],
    (service: ReactCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
