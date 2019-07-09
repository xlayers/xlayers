import { inject, TestBed } from '@angular/core/testing';
import { SharedCodegen } from '../shared-codegen.service';
import { LitElementCodeGenService } from './lit-element.service';

describe('LitElementCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LitElementCodeGenService,
        {
          provide: SharedCodegen,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [LitElementCodeGenService],
    (service: LitElementCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
