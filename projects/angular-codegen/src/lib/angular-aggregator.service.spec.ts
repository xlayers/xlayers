import { TestBed } from '@angular/core/testing';
import { AngularAggregatorService } from './angular-aggregator.service';
import { WebCodeGenService } from '@xlayers/web-codegen/public_api';
import { FormatService } from '@xlayers/sketch-lib/public_api';

describe('AngularAggregatorService', () => {
  let service: AngularAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AngularAggregatorService,
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
                kind: 'angular',
                value: '<span>attr</span>',
                language: 'html'
              },
              {
                kind: 'angular',
                value: '.aclass {width: 20px;}',
                language: 'css'
              }
            ]
          }
        }
      ]
    });
  });

  it('should create', () => {
    service = TestBed.inject(AngularAggregatorService);
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic angular component', () => {
    service = TestBed.inject(AngularAggregatorService);
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

    expect(aggregated.length).toEqual(4);

    // Note: content is returned in the following order:
    // html, css, component, test
    const [html, css, component, test] = aggregated;
    expect(html.kind).toEqual('angular');
    expect(html.language).toEqual('html');
    expect(html.value.includes('<span>attr</span>')).toBeTruthy();
    expect(html.uri).toEqual('components/abc.component.html');
    expect(html.value.includes('<span>attr</span>')).toEqual(true);
    expect(css.kind).toEqual('angular');
    expect(css.uri).toEqual('components/abc.component.css');
    expect(css.language).toEqual('css');
    expect(component.kind).toEqual('angular');
    expect(component.language).toEqual('typescript');
    expect(component.uri).toEqual('components/abc.component.ts');
    expect(component.value.includes(`selector: 'xly-abc',`)).toEqual(true);
    expect(test.kind).toEqual('angular');
    expect(test.language).toEqual('typescript');
    expect(test.uri).toEqual('components/abc.spec.ts');
    expect(test.value.includes(`it('should create',`)).toEqual(true);
  });
});
