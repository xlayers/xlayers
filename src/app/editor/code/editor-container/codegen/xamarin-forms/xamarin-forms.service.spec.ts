import { inject, TestBed } from '@angular/core/testing';
import { XamarinFormsCodeGenVisitor } from './codegen/xamarin-forms-codegenvisitor.service';
import { XamarinFormsCodeGenService } from './xamarin-forms.service';

describe('XamarinFormsCodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XamarinFormsCodeGenService,
        {
          provide: XamarinFormsCodeGenVisitor,
          useValue: {}
        }
      ]
    });
  });

  it('should be created', inject(
    [XamarinFormsCodeGenService],
    (service: XamarinFormsCodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
