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

  describe('when transform text', () => {
    it('should output font', () => {
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
      } as SketchMSLayer;
      expect(sketchStyleParserService.transformTextFont(obj)).toEqual({
        'font-family': '\'Roboto-Medium\', \'Roboto\', \'sans-serif\'',
        'font-size': '14px',
      });
    });

    it('should not output font when empty attribute', () => {
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

    it('should output color', () => {
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

  describe('when transform color', () => {
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

  it('should transform shadow', () => {
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

  describe('when transform blur', () => {
    it('should output positive radius blur', () => {
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

  describe('when transform border', () => {
    it('should output box shadow', () => {
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

  describe('when transform fill', () => {
    it('should output background', () => {
      const obj = {
        fills: [{
          color: getSketchColorMock(),
          isEnabled: 1, // TODO: migrate @type isEnable to boolean
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
          isEnabled: 1, // TODO: migrate @type isEnable to boolean
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
          isEnabled: 1, // TODO: migrate @type isEnable to boolean
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

  describe('when parse solid', () => {
    it('should transform triangle solid', () => {
      const obj = {
        style: {},
        frame: {
          width: 1,
          height: 2
        },
        points: [{
          point: '{0, 0}'
        }, {
          point: '{0, 1}'
        }, {
          point: '{1, 1}'
        }, {
          point: '{1, 0}'
        }]
      } as SketchMSPath;
      expect(sketchStyleParserService.transformTriangleSolid(obj, {})).toEqual({
        shape: `<svg width="${obj.frame.width}" height="${obj.frame.height}"><polygon fill="none" points="0, 0 0, 2 1, 2 1, 0" /></svg>`,
        style: {
          left: '0px',
          position: 'absolute',
          top: '0px'
        }
      });
    });

    it('should transform triangle solid with solid solid transformer', () => {
      const obj = {
        style: {},
        frame: {
          width: 1,
          height: 2
        },
        points: [{
          curveFrom: '{0, 0}',
          curveMode: 1,
          curveTo: '{0, 0}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{0, 0}'
        }, {
          curveFrom: '{0, 1}',
          curveMode: 1,
          curveTo: '{0, 1}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{0, 1}'
        }, {
          curveFrom: '{1, 1}',
          curveMode: 1,
          curveTo: '{1, 1}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{1, 1}'
        }, {
          curveFrom: '{1, 0}',
          curveMode: 1,
          curveTo: '{1, 0}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{1, 0}'
        }],
      } as SketchMSPath;
      expect(sketchStyleParserService.transformShapeSolid(obj, {})).toEqual({
        shape: `<svg width="${obj.frame.width}" height="${obj.frame.height}"><path fill="none" d="M0 0,L 0 2,L 1 2,L 1 0" /></svg>`,
        style: {
          left: '0px',
          position: 'absolute',
          top: '0px'
        }
      });
    });

    it('should transform triangle solid with solid solid transformer', () => {
      const obj = {
        style: {},
        frame: {
          width: 432,
          height: 123
        },
        points: [{
          curveFrom: '{0.9932432432432432, 0}',
          curveTo: '{0.9932432432432432, 0}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{0.9932432432432432, 0}'
        }, {
          curveFrom: '{0.0030405405405404635, 0}',
          curveTo: '{0.0067567567567567571, 0}',
          hasCurveFrom: true,
          hasCurveTo: false,
          point: '{0.0067567567567567571, 0}'
        }, {
          curveFrom: '{0, 0.027777777777777776}',
          curveTo: '{0, 0.012499999999999685}',
          hasCurveFrom: false,
          hasCurveTo: true,
          point: '{0, 0.027777777777777776}'
        }, {
          curveFrom: '{0, 1}',
          curveTo: '{0, 1}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{0, 1}'
        }, {
          curveFrom: '{1, 1}',
          curveTo: '{1, 1}',
          hasCurveFrom: false,
          hasCurveTo: false,
          point: '{1, 1}'
        }, {
          curveFrom: '{1, 0.012499999999999685}',
          curveTo: '{1, 0.027777777777777776}',
          hasCurveFrom: true,
          hasCurveTo: false,
          point: '{1, 0.027777777777777776}'
        }, {
          curveFrom: '{0.9932432432432432, 0}',
          curveTo: '{0.99695945945945952, 0}',
          hasCurveFrom: false,
          hasCurveTo: true,
          point: '{0.9932432432432432, 0}'
        }]
      } as SketchMSPath;
      expect(sketchStyleParserService.transformShapeSolid(obj, {})).toEqual({
        shape: `<svg width="${obj.frame.width}" height="${obj.frame.height}"><path fill="none" d="` +
        `M429.081 0,S 2.919 0, 2.919 0,S 0 1.537, 0 3.417,` +
        `L 0 123,L 432 123,S 432 3.417, 432 3.417,S 430.686 0, 429.081 0` +
        `" /></svg>`,
        style: {
          left: '0px',
          position: 'absolute',
          top: '0px'
        }
      });
    });

    it('should transform oval solid', () => {
      expect(sketchStyleParserService.transformOvalSolid()).toEqual({
        'border-radius': '50%'
      });
    });
  });

  it('should parse point', () => {
    const node = {
      frame: {
        width: 10,
        height: 10
      }
    } as SketchMSPath;
    expect(sketchStyleParserService.parsePoint('{1, 0}', 2, node)).toEqual({
      x: 12,
      y: 2
    });
  });

  it('should parse 0 height point', () => {
    const node = {
      frame: {
        width: 18,
        height: 0
      }
    } as SketchMSPath;
    expect(sketchStyleParserService.parsePoint('{1, 0}', 4, node)).toEqual({
      x: 22,
      y: 4
    });
  });

  it('should parse point with negative offset', () => {
    const node = {
      frame: {
        width: 18,
        height: 0
      }
    } as SketchMSPath;
    expect(sketchStyleParserService.parsePoint('{1, 0}', -4, node)).toEqual({
      x: 14,
      y: -4
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

  it('should set text', () => {
    const text = 'hello there';
    const obj = {};
    const root = {};
    sketchStyleParserService.setText(obj, root, text);
    expect(obj).toEqual({ text });
    expect(root).toEqual({ text });
  });

  it('should set solid', () => {
    const def = {
      style: {},
      frame: {
        width: 1,
        height: 2
      },
      points: [{
        curveFrom: '{0, 0}',
        curveMode: 1,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}'
      }, {
        curveFrom: '{0, 1}',
        curveMode: 1,
        curveTo: '{0, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 1}'
      }, {
        curveFrom: '{1, 1}',
        curveMode: 1,
        curveTo: '{1, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 1}'
      }, {
        curveFrom: '{1, 0}',
        curveMode: 1,
        curveTo: '{1, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 0}'
      }],
    } as SketchMSPath;
    const shape = sketchStyleParserService.transformShapeSolid(def, {}).shape;
    const obj = {};
    const root = {};
    sketchStyleParserService.setSolid(obj, root, shape);
    expect(obj).toEqual({ shape });
    expect(root).toEqual({ shape });
  });

});
