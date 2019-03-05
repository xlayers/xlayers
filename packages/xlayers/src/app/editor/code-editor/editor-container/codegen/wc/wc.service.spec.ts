import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { WCCodeGenService } from './wc.service';

describe('WCCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WCCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [WCCodeGenService],
    (service: WCCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
