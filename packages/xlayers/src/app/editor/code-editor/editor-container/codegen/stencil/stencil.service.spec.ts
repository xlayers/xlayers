import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { StencilCodeGenService } from './stencil.service';

describe('ReactCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StencilCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [StencilCodeGenService],
    (service: StencilCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
