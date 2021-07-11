import { TestBed } from '@angular/core/testing';
import { FormatService } from '@xlayers/sketch-lib';
import { SketchMSLayer } from '@xlayers/sketchtypes';
import { WebCodeGenService } from '@xlayers/web-codegen';

import { SvelteAggregatorService } from './svelte-aggregator.service';

describe('SvelteAggregatorService', () => {
  let service: SvelteAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SvelteAggregatorService,
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
            context: (current: SketchMSLayer) => current,
            aggregate: () => [
              {
                kind: 'svelte',
                value: '.aclass {width: 20px;}',
                language: 'css',
              },
              {
                kind: 'svelte',
                value: '<span>attr</span>',
                language: 'html',
                uri: 'components/abc.svelte',
              },
            ],
          },
        },
      ],
    });
    service = TestBed.inject(SvelteAggregatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic svelte component', () => {
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
    expect(component.kind).toEqual('svelte');
    expect(component.language).toEqual('html');
    console.log({ value: component.value });
    expect(component.value.includes('<span>attr</span>')).toBeTruthy();
    expect(component.value.includes('.aclass {width: 20px;}')).toBeTruthy();
    expect(component.uri).toEqual('components/abc.svelte');
  });
});
