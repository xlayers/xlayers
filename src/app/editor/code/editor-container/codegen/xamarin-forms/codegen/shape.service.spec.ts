import { TestBed } from '@angular/core/testing';
import { Shape } from './shape.service';


describe('ShapeService', () => {
    const rectangle = new Shape([
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{1, 0.97500000000000064}',
            'curveMode': 4,
            'curveTo': '{1, 0.94444444444444442}',
            'hasCurveFrom': true,
            'hasCurveTo': false,
            'point': '{1, 0.94444444444444442}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.97058823529411764, 1}',
            'curveMode': 4,
            'curveTo': '{0.98676470588235288, 1}',
            'hasCurveFrom': false,
            'hasCurveTo': true,
            'point': '{0.97058823529411764, 1}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.013235294117647142, 1}',
            'curveMode': 4,
            'curveTo': '{0.029411764705882353, 1}',
            'hasCurveFrom': true,
            'hasCurveTo': false,
            'point': '{0.029411764705882353, 1}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0, 0.94444444444444442}',
            'curveMode': 4,
            'curveTo': '{0, 0.97500000000000064}',
            'hasCurveFrom': false,
            'hasCurveTo': true,
            'point': '{0, 0.94444444444444442}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0, 0.02499999999999937}',
            'curveMode': 4,
            'curveTo': '{0, 0.055555555555555552}',
            'hasCurveFrom': true,
            'hasCurveTo': false,
            'point': '{0, 0.055555555555555552}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.029411764705882353, 0}',
            'curveMode': 4,
            'curveTo': '{0.013235294117647142, 0}',
            'hasCurveFrom': false,
            'hasCurveTo': true,
            'point': '{0.029411764705882353, 0}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.98676470588235288, 0}',
            'curveMode': 4,
            'curveTo': '{0.97058823529411764, 0}',
            'hasCurveFrom': true,
            'hasCurveTo': false,
            'point': '{0.97058823529411764, 0}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{1, 0.055555555555555552}',
            'curveMode': 4,
            'curveTo': '{1, 0.02499999999999937}',
            'hasCurveFrom': false,
            'hasCurveTo': true,
            'point': '{1, 0.055555555555555552}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{1, 0.94444444444444442}',
            'curveMode': 1,
            'curveTo': '{1, 0.94444444444444442}',
            'hasCurveFrom': false,
            'hasCurveTo': false,
            'point': '{1, 0.94444444444444442}'
        }
    ] as SketchMSCurvePoint[]);

    const circle = new Shape([
        {
          '_class': 'curvePoint',
          'cornerRadius': 0,
          'curveFrom': '{0.22500000000000009, 1}',
          'curveMode': 4,
          'curveTo': '{0.5, 1}',
          'hasCurveFrom': true,
          'hasCurveTo': false,
          'point': '{0.5, 1}'
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': 0,
          'curveFrom': '{0, 0.22499999999999964}',
          'curveMode': 2,
          'curveTo': '{0, 0.77500000000000036}',
          'hasCurveFrom': true,
          'hasCurveTo': true,
          'point': '{0, 0.5}',
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': 0,
          'curveFrom': '{0.77499999999999991, 0}',
          'curveMode': 2,
          'curveTo': '{0.22500000000000009, 0}',
          'hasCurveFrom': true,
          'hasCurveTo': true,
          'point': '{0.5, 0}',
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': 0,
          'curveFrom': '{1, 0.77500000000000036}',
          'curveMode': 2,
          'curveTo': '{1, 0.22499999999999964}',
          'hasCurveFrom': true,
          'hasCurveTo': true,
          'point': '{1, 0.5}',
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': 0,
          'curveFrom': '{0.5, 1}',
          'curveMode': 4,
          'curveTo': '{0.77499999999999991, 1}',
          'hasCurveFrom': false,
          'hasCurveTo': true,
          'point': '{0.5, 1}',
        }
      ] as SketchMSCurvePoint[]);

    const line = new Shape([
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.001953125, 0.51388888888888884}',
            'curveMode': 1,
            'curveTo': '{0.001953125, 0.51388888888888884}',
            'hasCurveFrom': false,
            'hasCurveTo': false,
            'point': '{0, 0.5}'
        },
        {
            '_class': 'curvePoint',
            'cornerRadius': 0,
            'curveFrom': '{0.0058593749999999445, 0.54166666666666663}',
            'curveMode': 1,
            'curveTo': '{0.0058593749999999445, 0.54166666666666663}',
            'hasCurveFrom': false,
            'hasCurveTo': false,
            'point': '{1, 0.5}'
        }
    ] as SketchMSCurvePoint[]);

    it('should create', () => {
        expect(Shape).toBeTruthy();
    });

    it('should recognise rectangle', () => {
        expect(rectangle.isRectangle()).toBe(true);
        expect(rectangle.isRound()).toBe(false);
        expect(rectangle.isLine()).toBe(false);
    });

    it('should recognise line', () => {
        expect(line.isLine()).toBe(true);
        expect(line.isRectangle()).toBe(false);
        expect(line.isRound()).toBe(false);
    });

    it('should recognise circle', () => {
        expect(circle.isLine()).toBe(false);
        expect(circle.isRectangle()).toBe(false);
        expect(circle.isRound()).toBe(true);
    });

});
