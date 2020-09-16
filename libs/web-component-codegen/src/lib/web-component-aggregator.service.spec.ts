import { TestBed } from '@angular/core/testing';
import { WebComponentAggregatorService } from './web-component-aggregator.service';
import { FormatService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';

describe('WebComponentAggregatorService', () => {
  let service: WebComponentAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebComponentAggregatorService,
        {
          provide: FormatService,
          useValue: {
            normalizeName: () => 'abc',
            className: (name: string) => name,
            indentFile: (n: number, contents: string) => [contents],
          },
        },
        {
          provide: WebCodeGenService,
          useValue: {
            aggregate: () => [
              {
                kind: 'web',
                value: '.aclass {width: 20px;}',
                language: 'css',
                uri: 'components/abc.css',
              },
              {
                kind: 'web',
                value: '<span>attr</span>',
                language: 'html',
                uri: 'components/abc.html',
              },
            ],
          },
        },
      ],
    });

    service = TestBed.inject(WebComponentAggregatorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic web components component', () => {
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
              width: '20px',
            },
          },
          web: {},
          attributedString: { string: 'attr' },
        },
      ],
    } as any;
    const aggregated = service.aggregate(data, data, {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
    });

    expect(aggregated.length).toEqual(1);

    const [component] = aggregated;
    expect(component.kind).toEqual('wc');
    expect(component.language).toEqual('javascript');
    expect(component.value.includes('<span>attr</span>')).toBeTruthy();
    expect(
      component.value.includes('customElements.define(abc.is , abc);')
    ).toBeTruthy();
    expect(component.uri).toEqual('components/abc.js');
  });
});
