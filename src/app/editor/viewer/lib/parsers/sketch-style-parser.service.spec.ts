import { async, TestBed } from '@angular/core/testing';
import { SketchStyleParserService, BorderType } from './sketch-style-parser.service';
import { getSketchColorMock } from './sketch-style-parser.service.mock';

describe('SketchStyleParserService', () => {
  let sketchStyleParserService: SketchStyleParserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [SketchStyleParserService]
    });
  }));

  beforeEach(() => {
    sketchStyleParserService = TestBed.get(SketchStyleParserService);
  });

  it('should create', () => {
    expect(sketchStyleParserService).toBeTruthy();
  });

  describe('when parse text', () => {
    it('should parse text font', () => {
      const obj = {
        style: {
          textStyle: {
            encodedAttributes: {
              MSAttributedStringFontAttribute: {
                _class: 'fontDescriptor',
                attributes: {
                  name: 'Roboto-Medium',
                  size: 14
                }
              }
            }
          }
        }
      } as any;
      expect(sketchStyleParserService.transformTextFont(obj)).toEqual({
        'font-family': '\'Roboto-Medium\', \'Roboto\', \'sans-serif\'',
        'font-size': '14px',
      });
    });

    it('should not parse not configured font', () => {
      const obj = {
        style: {
          textStyle: {
            encodedAttributes: {
              MSAttributedStringFontAttribute: {
              }
            }
          }
        }
      } as SketchMSLayer;
      expect(sketchStyleParserService.transformTextFont(obj)).toEqual({});
    });

    it('should parse color', () => {
      const obj = {
        style: {
          textStyle: {
            encodedAttributes: {
              MSAttributedStringColorAttribute: {
                alpha: 0.4,
                blue: 0.65,
                green: 0.321,
                red: 1
              }
            }
          }
        }
      } as SketchMSLayer;
      expect(sketchStyleParserService.transformTextColor(obj)).toEqual({
        color: 'rgba(255,82,166,0.4)'
      });
    });

    it('should fallback to black for unknow color', () => {
      const obj = {
        style: {
          textStyle: {
            encodedAttributes: {}
          }
        }
      } as SketchMSLayer;
      expect(sketchStyleParserService.transformTextColor(obj)).toEqual({
        color: 'black'
      });
    });
  });

  describe('when parse color', () => {
    it('should parse', () => {
      const color = {
        red: 0.53,
        green: 0.32,
        blue: 0.13,
        alpha: 1,
      } as SketchMSColor;
      const result = sketchStyleParserService.parseColors(color);
      expect(result.hex).toBe('#875221ff');
      expect(result.rgba).toBe('rgba(135,82,33,1)');
      expect(result.raw).toEqual({
        red: 135,
        green: 82,
        blue: 33,
        alpha: 1
      });
    });

    it('should fallback for unvalid color', () => {
      const color = {
        red: 0.94,
        green: -0.12,
        blue: 0.233,
        alpha: 0.3,
      } as SketchMSColor;
      const result = sketchStyleParserService.parseColors(color);
      expect(result.hex).toBe('#f0003b4d');
      expect(result.rgba).toBe('rgba(240,0,59,0.3)');
      expect(result.raw).toEqual({
        red: 240,
        green: 0,
        blue: 59,
        alpha: 0.3
      });
    });
  });

  it('should set style', () => {
    const color = getSketchColorMock();
    const obj = { css: {} };
    const root = {};
    sketchStyleParserService.setStyle(obj, root, { 'background-color': color.toString() });
    expect(obj).toEqual({ css: { 'background-color': color.toString() } });
    expect(root).toEqual({ css: { 'background-color': color.toString() } });
  });

  it('should parse shadow', () => {
    const obj = {
      shadows: [{
        offsetX: 123,
        offsetY: 53,
        blurRadius: 12,
        spread: 23,
        color: getSketchColorMock()
      }]
    } as SketchMSStyle;
    const color = sketchStyleParserService['parseColors'](obj.shadows[0].color);
    expect(sketchStyleParserService.transformShadows(obj)).toEqual({ 'box-shadow': `123px 53px 12px 23px ${color.rgba}`});
  });

  describe('when parse blur', () => {
    it('should parse positive radius blur', () => {
      const obj = {blur: {radius: 96}} as SketchMSStyle;
      expect(sketchStyleParserService.transformBlur(obj)).toEqual({filter: `blur(${obj.blur.radius}px);`});
    });

    it('should skip for negative blur radius', () => {
      const obj = {blur: {radius: -123}} as SketchMSStyle;
      expect(sketchStyleParserService.transformBlur(obj)).toEqual({});
    });

    it('should skip for 0 blur radius', () => {
      const obj = {blur: {radius: 0}} as SketchMSStyle;
      expect(sketchStyleParserService.transformBlur(obj)).toEqual({});
    });

    it('should skip on undefined blur', () => {
      const obj = {} as SketchMSStyle;
      expect(sketchStyleParserService.transformBlur(obj)).toEqual({});
    });
  });

  describe('when parse border', () => {
    it('should parse border', () => {
      const obj = {
        borders: [{
          thickness: 129,
          position: BorderType.CENTER,
          color: getSketchColorMock()
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.borders[0].color);
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({'box-shadow': `0 0 0 129px ${color.rgba}`});
    });

    it('should skip for negative thickness border', () => {
      const obj = {
        borders: [{
          thickness: -38,
          position: BorderType.CENTER,
          color: getSketchColorMock()
        }]
      } as SketchMSStyle;
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({});
    });

    it('should set inet for boder type inside', () => {
      const obj = {
        borders: [{
          thickness: 129,
          position: BorderType.INSIDE,
          color: getSketchColorMock()
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.borders[0].color);
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({'box-shadow': `0 0 0 129px ${color.rgba} inset`});
    });

    it('should skip fallback to default on center position', () => {
      const obj = {
        borders: [{
          thickness: 129,
          position: BorderType.CENTER,
          color: getSketchColorMock()
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.borders[0].color);
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({'box-shadow': `0 0 0 129px ${color.rgba}`});
    });

    it('should skip fallback to default on outside position', () => {
      const obj = {
        borders: [{
          thickness: 129,
          position: BorderType.OUTSIDE,
          color: getSketchColorMock()
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.borders[0].color);
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({'box-shadow': `0 0 0 129px ${color.rgba}`});
    });

    it('should skip on empty border', () => {
      const obj = {borders: []} as SketchMSStyle;
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({});
    });

    it('should skip on undefined border', () => {
      const obj = {} as SketchMSStyle;
      expect(sketchStyleParserService.transformBorders(obj)).toEqual({});
    });
  });

  describe('when parse fill', () => {
    it('should parse fill', () => {
      const obj = {
        fills: [{
          color: getSketchColorMock(),
          gradient: {
            stops: [{
              color: getSketchColorMock(),
              position: 0.835923120242395
            }]
          }
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.fills[0].color);
      const colorStop = sketchStyleParserService['parseColors'](obj.fills[0].gradient.stops[0].color);
      expect(sketchStyleParserService.transformFills(obj)).toEqual({
        'background-color': color.rgba,
        'background': `linear-gradient(90deg, ${colorStop.rgba} 83.5923120242395%)`
      });
    });

    it('should fallback for unvalid position fill', () => {
      const obj = {
        fills: [{
          color: getSketchColorMock(),
          gradient: {
            stops: [{
              color: getSketchColorMock(),
              position: 154
            }]
          }
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.fills[0].color);
      const colorStop = sketchStyleParserService['parseColors'](obj.fills[0].gradient.stops[0].color);
      expect(sketchStyleParserService.transformFills(obj)).toEqual({
        'background-color': color.rgba,
        'background': `linear-gradient(90deg, ${colorStop.rgba})`
      });
    });

    it('should fallback for negative position fill', () => {
      const obj = {
        fills: [{
          color: getSketchColorMock(),
          gradient: {
            stops: [{
              color: getSketchColorMock(),
              position: -0.123125345387423
            }]
          }
        }]
      } as SketchMSStyle;
      const color = sketchStyleParserService['parseColors'](obj.fills[0].color);
      const colorStop = sketchStyleParserService['parseColors'](obj.fills[0].gradient.stops[0].color);
      expect(sketchStyleParserService.transformFills(obj)).toEqual({
        'background-color': color.rgba,
        'background': `linear-gradient(90deg, ${colorStop.rgba})`
      });
    });
  });
});
