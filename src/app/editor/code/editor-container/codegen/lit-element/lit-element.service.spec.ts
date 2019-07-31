import { inject, TestBed } from '@angular/core/testing';
import { LitElementCodeGenService } from './lit-element.service';

describe('LitElementCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LitElementCodeGenService]
    });
  });

  it('should be created', inject(
    [LitElementCodeGenService],
    (service: LitElementCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
