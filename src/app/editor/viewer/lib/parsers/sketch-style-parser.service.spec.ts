import { async, TestBed } from '@angular/core/testing';
import { SketchStyleParserService } from './sketch-style-parser.service';
import { getSketchColorMock, sketchColorMockToHex,
  sketchColorMockToString, sketchColorMockToRGBA, getSketchShadowMock, sketchShadowToString } from './sketch-style-parser.service.mock';

describe('SketchStyleParserService', () => {
  let sketchStyleParserService: SketchStyleParserService;
  let mockColor: SketchMSColor;
  let mockShadow: SketchMSShadow;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [SketchStyleParserService]
    });
  }));

  beforeEach(() => {
    sketchStyleParserService = TestBed.get(SketchStyleParserService);
    mockColor = getSketchColorMock();
    mockShadow = getSketchShadowMock(mockColor);
  });

  it('should create', () => {
    expect(sketchStyleParserService).toBeTruthy();
  });

  it('should parse colors', () => {
    const sketchRGBAColorMock = sketchColorMockToRGBA(mockColor);
    const result = sketchStyleParserService['parseColors'](mockColor);
    expect(result.hex).toBe(sketchColorMockToHex(sketchRGBAColorMock));
    expect(result.rgba).toBe(sketchColorMockToString(sketchRGBAColorMock));
    expect(result.raw).toEqual(sketchRGBAColorMock);
  });

  it('should set style', () => {
    const obj = {css: {}};
    const root = {css: {}};
    sketchStyleParserService['setStyle'](obj, root, {'background-color': mockColor.toString()});
    expect(obj).toEqual({css: {'background-color': mockColor.toString()}});
    expect(root).toEqual({css: {'background-color': mockColor.toString()}});
  });

  it('should set shadow', () => {
    const obj = {shadows: [mockShadow]};
    const root = {};
    sketchStyleParserService['parseShadows'](obj, root);
    expect(root).toEqual({css: {'box-shadow': sketchShadowToString(mockShadow)}});
  });
});
