import { inject, TestBed } from '@angular/core/testing';
import { WCCodeGenService } from './wc.service';

describe('WCCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WCCodeGenService]
    });
  });

  it('should be created', inject(
    [WCCodeGenService],
    (service: WCCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
