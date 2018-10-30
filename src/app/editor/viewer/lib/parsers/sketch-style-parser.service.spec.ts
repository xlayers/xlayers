import { async, TestBed } from '@angular/core/testing';
import { SketchStyleParserService, BorderType } from './sketch-style-parser.service';
import {
  getSketchColorMock,
  sketchColorMockToHex,
  sketchColorMockToString,
  sketchColorMockToRGBA,
  getSketchShadowMock,
  sketchShadowToString,
  getSketchBlurMock,
  getSketchBorderMock,
  sketchBorderToString,
  getSketchFillMock,
  sketchFillToString
} from './sketch-style-parser.service.mock';

describe('SketchStyleParserService', () => {
  let sketchStyleParserService: SketchStyleParserService;
  let mockColor: SketchMSColor;
  let mockShadows: Array<SketchMSShadow>;
  let mockBlur: SketchMSStyleBlur;
  let mockBorderType: BorderType;
  let mockBorders: Array<SketchMSStyleBorder>;
  let mockFills: Array<SketchMSStyleFill>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [SketchStyleParserService]
    });
  }));

  beforeEach(() => {
    sketchStyleParserService = TestBed.get(SketchStyleParserService);
    mockColor = getSketchColorMock();
    mockShadows = getSketchShadowMock(mockColor);
    mockBlur = getSketchBlurMock();
    mockBorderType = BorderType.CENTER;
    mockBorders = getSketchBorderMock(mockBorderType);
    mockFills = getSketchFillMock();
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
    const root = {};
    sketchStyleParserService['setStyle'](obj, root, {'background-color': mockColor.toString()});
    expect(obj).toEqual({css: {'background-color': mockColor.toString()}});
    expect(root).toEqual({css: {'background-color': mockColor.toString()}});
  });

  it('should parse shadow', () => {
    const obj = {shadows: mockShadows};
    const root = {};
    sketchStyleParserService['parseShadows'](obj, root);
    expect(root).toEqual({css: {'box-shadow': mockShadows.map(sketchShadowToString).join(',')}});
  });

  it('should parse blur', () => {
    const obj = {blur: mockBlur};
    const root = {};
    sketchStyleParserService['parseBlur'](obj, root);
    expect(root).toEqual({css: {filter: `blur(${obj.blur.radius}px);`}});
  });

  it('should parse border', () => {
    const obj = {borders: mockBorders};
    const root = {};
    sketchStyleParserService['parseBorders'](obj, root);
    expect(root).toEqual({css: {'box-shadow': mockBorders.map(sketchBorderToString).join(',')}});
  });

  it('should parse fill', () => {
    const obj = {fills: mockFills, color: mockColor};
    const root = {};
    sketchStyleParserService['parseFills'](obj, root);
    expect(root).toEqual({css: sketchFillToString(mockFills[0])});
  });
});
