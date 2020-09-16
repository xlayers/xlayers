import { TestBed } from '@angular/core/testing';
import { TextService } from './text.service';

describe('TextService', () => {
  let service: TextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextService],
    });

    service = TestBed.inject(TextService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify current layer as text', () => {
    const data = {
      _class: 'text',
    } as any;
    const actual = service.identify(data);
    expect(actual).toBeTruthy();
  });

  it('should provide the attribute string', () => {
    const data = {
      _class: 'text',
      attributedString: { string: 'attr' },
    } as any;
    const actual = service.lookup(data);
    expect(actual).toEqual('attr');
  });
});
