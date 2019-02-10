import { TestBed, inject } from '@angular/core/testing';
import { StencilCodeGenService } from './stencil.service';

describe('ReactCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StencilCodeGenService]
    });
  });

  it('should be created', inject([StencilCodeGenService], (service: StencilCodeGenService) => {
    expect(service).toBeTruthy();
  }));
});
