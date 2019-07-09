import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { VueCodeGenService } from './vue.service';

describe('VueCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VueCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [VueCodeGenService],
    (service: VueCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
