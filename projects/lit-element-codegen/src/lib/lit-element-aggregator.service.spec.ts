import { TestBed } from '@angular/core/testing';
import { LitElementAggregatorService } from './lit-element-aggregator.service';
import { WebCodeGenService } from '@xlayers/web-codegen/public_api';
import { FormatService } from '@xlayers/sketch-lib/public_api';

describe('ReactCodeGenService', () => {
  let service: LitElementAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LitElementAggregatorService,
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

    service = TestBed.inject(LitElementAggregatorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have one file for a basic lit element component', () => {
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

    expect(aggregated.length).toEqual(1);

    const [component] = aggregated;
    expect(component.kind).toEqual('litElement');
    expect(component.language).toEqual('javascript');
    expect(component.value.includes('<span>attr</span>')).toBeTruthy();
    expect(component.uri).toBe('components/abc.js');
  });
});
