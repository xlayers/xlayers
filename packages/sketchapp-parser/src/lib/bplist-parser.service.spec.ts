import { BinaryPropertyListParserService } from './bplist-parser.service';
import { async, TestBed } from '@angular/core/testing';

describe('BPListParserService', () => {
  let binaryPropertyListParserService: BinaryPropertyListParserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [BinaryPropertyListParserService]
    });
  }));

  beforeEach(() => {
    binaryPropertyListParserService = TestBed.get(BinaryPropertyListParserService);
  });

  it('should create', () => {
    expect(BinaryPropertyListParserService).toBeTruthy();
  });

  it('should parse 64 content', () => {
    spyOn<any>(binaryPropertyListParserService, 'doParse').and.returnValue('parsed content');
    const content = binaryPropertyListParserService.parse64Content('YnBsaXN0MDDUAQIDBAUGFxhYJHZlcnNpb25YJG9iamVjdHNZJGFyY2'
    + 'hpdmVyVCR0b3ASAAGGoKMHCBFVJG51bGzUCQoLDA0ODxBaTlNUYWJTdG9wc1tOU0FsaWdubWVudF8QH05TQWxsb3dzVGlnaHRlb'
    + 'mluZ0ZvclRydW5jYXRpb25WJGNsYXNzgAAQBBABgALSEhMUFVokY2xhc3NuYW1lWCRjbGFzc2VzXxAQTlNQYXJhZ3JhcGhTdHls'
    + 'ZaIUFlhOU09iamVjdF8QD05TS2V5ZWRBcmNoaXZlctEZGlRyb290gAEIERojLTI3O0FKVWGDioyOkJKXoqu+wcrc3+QAAAAAAAA'
    + 'BAQAAAAAAAAAbAAAAAAAAAAAAAAAAAAAA5g==');
    expect(binaryPropertyListParserService['content']).toEqual('parsed content');
  });

  it('should fail on non base64 string', () => {
    spyOn<any>(binaryPropertyListParserService, 'doParse').and.stub();
    expect(() => binaryPropertyListParserService.parse64Content('unknow-format')).toThrowError(DOMException);
  });

  it('should parse data', () => {
    const content = binaryPropertyListParserService.parse64Content('YnBsaXN0MDDUAQIDBAUGFxhYJHZlcnNpb25YJG9iamVjdHNZJGFyY2'
    + 'hpdmVyVCR0b3ASAAGGoKMHCBFVJG51bGzUCQoLDA0ODxBaTlNUYWJTdG9wc1tOU0FsaWdubWVudF8QH05TQWxsb3dzVGlnaHRlb'
    + 'mluZ0ZvclRydW5jYXRpb25WJGNsYXNzgAAQBBABgALSEhMUFVokY2xhc3NuYW1lWCRjbGFzc2VzXxAQTlNQYXJhZ3JhcGhTdHls'
    + 'ZaIUFlhOU09iamVjdF8QD05TS2V5ZWRBcmNoaXZlctEZGlRyb290gAEIERojLTI3O0FKVWGDioyOkJKXoqu+wcrc3+QAAAAAAAA'
    + 'BAQAAAAAAAAAbAAAAAAAAAAAAAAAAAAAA5g==');
    spyOn<any>(binaryPropertyListParserService, 'visit').and.stub();
    expect(binaryPropertyListParserService['objectRefSize']).toEqual(1);
    expect(binaryPropertyListParserService['offsetTable']).toEqual([
      8, 17, 26, 35, 45, 50, 55, 59, 65, 74, 85, 97, 131,
      138, 140, 142, 144, 146, 151, 162, 171, 190, 193,
      202, 220, 223, 228
    ]);
  });
});
