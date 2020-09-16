import { TestBed } from '@angular/core/testing';
import { WebAggregatorService } from './web-aggregator.service';
import {
  TextService,
  SymbolService,
  ImageService,
  LayerService,
  FormatService,
} from '@xlayers/sketch-lib';
import { CssCodeGenService } from '@xlayers/css-codegen';
import { WebContextService } from './web-context.service';
import { SvgCodeGenService } from '@xlayers/svg-codegen';
import { WebCodeGenContext } from './web-codegen';
describe('WebAggregatorService', () => {
  let webAggregatorService: WebAggregatorService;
  const webContext: WebCodeGenContext = {
    attributes: [],
    components: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebAggregatorService,

        // @TODO find a better way to mock this service
        TextService,
        // {
        //   provide: TextService,
        //   useValue: { identify: () => false, lookup: () => '' }
        // },

        { provide: SymbolService, useValue: { identify: () => false } },
        { provide: ImageService, useValue: { identify: () => false } },
        { provide: LayerService, useValue: { identify: () => true } },
        { provide: SvgCodeGenService, useValue: { identify: () => false } },
        {
          provide: CssCodeGenService,
          useValue: {
            aggregate: () => [
              {
                kind: 'web',
                value: '.aclass {width: 20px;}',
                language: 'css',
                uri: 'components/abc.css',
              },
            ],
          },
        },
        {
          provide: FormatService,
          useValue: {
            normalizeName: (name: string) => 'abc',
            indent: (n: number, content: string) => content,
          },
        },
        {
          provide: WebContextService,
          useValue: { of: () => webContext, identify: () => true },
        },
      ],
    });

    webAggregatorService = TestBed.inject(WebAggregatorService);
  });

  it('should create', () => {
    expect(webAggregatorService).toBeTruthy();
  });

  it('should have three files for a basic component', () => {
    const currentLayer = {
      _class: 'rectangle',
      name: 'abc',
      web: webContext,

      layers: [
        {
          _class: 'text',
          css: {
            className: 'aclass',
            rules: {
              width: '20px',
            },
          },
          web: webContext,
          attributedString: { string: 'attr' },
        },
      ],
    } as any;

    const aggregated = webAggregatorService.aggregate(currentLayer, {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
    });

    expect(aggregated.length).toEqual(2);

    const [html, css] = aggregated;
    expect(html.kind).toEqual('web');
    expect(html.language).toEqual('html');
    expect(html.value.includes('<span>attr</span>')).toBeTruthy();
    expect(html.uri).toEqual('components/abc.html');
    expect(css.kind).toEqual('web');
    expect(css.uri).toEqual('components/abc.css');
    expect(css.language).toEqual('css');
    expect(css.value.indexOf(`.aclass`) >= 0).toEqual(true);
  });
});
