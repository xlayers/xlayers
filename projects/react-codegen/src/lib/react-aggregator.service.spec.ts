import { TestBed } from '@angular/core/testing';
import { ReactAggregatorService } from './react-aggregator.service';

describe('ReactCodeGenService', () => {
  let service: ReactAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactAggregatorService]
    });
  });

  it('should create', () => {
    service = TestBed.inject(ReactAggregatorService);
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic react component', () => {
    service = TestBed.inject(ReactAggregatorService);
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
    expect(component.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
    expect(component.uri).toEqual('components/abc.jsx');
    expect(component.value.indexOf('span >attr</span>') >= 0).toEqual(true);
    expect(test.kind).toEqual('react');
    expect(test.uri).toEqual('components/abc.spec.js');
    expect(test.language).toEqual('javascript');
    expect(css.kind).toEqual('react');
    expect(css.language).toEqual('css');
    expect(css.uri).toEqual('components/abc.css');
    expect(css.value.indexOf('.aclass') >= 0).toEqual(true);
  });
});
