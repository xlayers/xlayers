import { inject, TestBed } from '@angular/core/testing';
import { VueCodeGenService } from './vue.service';

describe('VueCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VueCodeGenService]
    });
  });

  it('should be created', inject(
    [VueCodeGenService],
    (service: VueCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
