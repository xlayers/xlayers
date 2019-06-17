import { inject, TestBed } from '@angular/core/testing';
import { XamarinFormsCodeGenVisitor } from './xamarin-forms-codegenvisitor.service';

describe('XamarinFormsCodeGenVisitor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XamarinFormsCodeGenVisitor,
        {
          provide: XamarinFormsCodeGenVisitor,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [XamarinFormsCodeGenVisitor],
    (service: XamarinFormsCodeGenVisitor) => {
      expect(service).toBeTruthy();
    }
  ));
});
