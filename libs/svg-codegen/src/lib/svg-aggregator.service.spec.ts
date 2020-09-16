import { TestBed } from '@angular/core/testing';
import { SvgAggregatorService } from './svg-aggregator.service';

describe('SvgAggregatorService', () => {
  let service: SvgAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgAggregatorService],
    });

    service = TestBed.inject(SvgAggregatorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have three files for a basic svg component', () => {
    const data = {
      _class: 'rectangle',
      name: 'abc',
      svg: {
        offset: 0,
        paths: [
          {
            type: 'path',
            attributes: [
              'fill="none"',
              'd="M54 34,S 53.566 36, 53.036 36,S 0.964 36, 0.964 36,S 0 35.1, 0 34,S 0 2, 0 2,S 0.434 0, 0.964 0,S 53.036 0, 53.036 0,S 54 0.9, 54 2,L 54 34,z"',
            ],
          },
        ],
      },
      frame: {
        width: 20,
      },

      layers: [
        {
          _class: 'text',
          css: {
            className: 'aclass',
            rules: {
              width: '20px',
            },
          },

          attributedString: { string: 'attr' },
        },
      ],
    } as any;
    const aggregated = service.aggregate(data, {
      xmlNamespace: true,
    });

    expect(aggregated.length).toEqual(1);

    const [svg] = aggregated;
    expect(svg.kind).toEqual('svg');
    expect(svg.language).toEqual('svg');
    expect(svg.uri).toEqual('abc.svg');
    // tslint:disable-next-line: max-line-length
    expect(
      svg.value.indexOf(
        '<path fill="none" d="M54 34,S 53.566 36, 53.036 36,S 0.964 36, 0.964 36,S 0 35.1, 0 34,S 0 2, 0 2,S 0.434 0, 0.964 0,S 53.036 0, 53.036 0,S 54 0.9, 54 2,L 54 34,z"/>'
      ) >= 0
    ).toEqual(true);
  });
});
