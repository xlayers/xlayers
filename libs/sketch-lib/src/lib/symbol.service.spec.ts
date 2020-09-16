import { TestBed } from '@angular/core/testing';
import { SymbolService } from './symbol.service';

describe('SymbolService', () => {
  let service: SymbolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SymbolService],
    });

    service = TestBed.inject(SymbolService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify current layer as a symbol', () => {
    const data = {
      _class: 'symbolInstance',
    } as any;
    const actual = service.identify(data);
    expect(actual).toBeTruthy();
  });

  it('should look for the symbol', () => {
    const data = {
      _class: 'symbolInstance',
      symbolID: 'ID1',
      document: {
        foreignSymbols: [
          { symbolMaster: { symbolID: 'ID1' } },
          { symbolMaster: { symbolID: 'ID2' } },
        ],
      },
    } as any;
    const actual = service.lookup(data, data);
    expect(actual).toEqual({ symbolID: 'ID1' });
  });

  it('should not find the symbol with incorrect ref', () => {
    const data = {
      _class: 'symbolInstance',
      symbolID: 'ID2',
      document: {
        foreignSymbols: [{ symbolMaster: { symbolID: 'ID1' } }],
      },
    } as any;
    const actual = service.lookup(data, data);
    expect(actual).toBe(undefined);
  });
});
