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
});
