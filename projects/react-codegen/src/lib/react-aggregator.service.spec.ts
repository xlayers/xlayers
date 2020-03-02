import { TestBed } from '@angular/core/testing';
import { ReactAggregatorService } from './react-aggregator.service';
import { FormatService } from '@xlayers/sketch-lib/public_api';
import { WebCodeGenService } from '@xlayers/web-codegen/public_api';

describe('ReactCodeGenService', () => {
  let service: ReactAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReactAggregatorService,
        {
          provide: FormatService,
          useValue: {
            normalizeName: () => 'abc',
            className: (name: string) => name,
            indentFile: (n: number, contents: string) => [contents]
          }
        },
        {
          provide: WebCodeGenService,
          useValue: {
            context: (current: SketchMSLayer) => current,
            aggregate: () => [
              {
                kind: 'web',
                value: '.aclass {width: 20px;}',
                language: 'css',
                uri: 'components/abc.css'
              },
              {
                kind: 'web',
                value: '<span>attr</span>',
                language: 'html',
                uri: 'components/abc.html'
              }
            ]
          }
        }
      ]
    });
    service = TestBed.inject(ReactAggregatorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic react component', () => {
    const data = {
      _class: 'rectangle',
      name: 'abc',
      web: {},

      layers: [
        {
          _class: 'text',
          css: {
            className: 'aclass',
            rules: {
              width: '20px'
            }
          },
          web: {},
          attributedString: { string: 'attr' }
        }
      ]
    } as any;

    const aggregated = service.aggregate(data, data, {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets'
    });

    expect(aggregated.length).toEqual(3);

    const [component, test, css] = aggregated;
    expect(component.kind).toEqual('react');
    expect(component.language).toEqual('javascript');
    expect(component.value.includes('<span>attr</span>')).toBeTruthy();
    expect(component.uri).toEqual('components/abc.jsx');
    expect(test.kind).toEqual('react');
    expect(test.uri).toEqual('components/abc.spec.js');
    expect(test.language).toEqual('javascript');
    expect(css.kind).toEqual('react');
    expect(css.language).toEqual('css');
    expect(css.uri).toEqual('components/abc.css');
    expect(css.value.indexOf('.aclass') >= 0).toEqual(true);
  });
});
