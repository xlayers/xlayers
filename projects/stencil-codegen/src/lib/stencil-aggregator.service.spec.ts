import { TestBed } from '@angular/core/testing';
import { StencilAggregatorService } from './stencil-aggregator.service';

describe('StencilAggregatorService', () => {
    let service: StencilAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StencilAggregatorService]
        });

        service = TestBed.inject(StencilAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic stencil component', () => {
        const data = {
            '_class': 'rectangle',
            'name': 'abc',
            'web': {
            },

            layers: [
                {
                    '_class': 'text',
                    'css': {
                        'className': 'aclass',
                        rules: {
                            'width': '20px'
                        }
                    },
                    'web': {

                    },
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
            assetDir: 'assets',
        });

        expect(aggregated.length).toEqual(3);

        const [component, test, css] = aggregated;
        expect(component.kind).toEqual('stencil');
        expect(component.language).toEqual('typescript');
        expect(component.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
        expect(component.uri).toEqual('components/abc.tsx');
        expect(test.kind).toEqual('stencil');
        expect(test.uri).toEqual('components/abc.e2e.ts');
        expect(test.language).toEqual('typescript');
        expect(css.kind).toEqual('stencil');
        expect(css.language).toEqual('css');
        expect(css.uri).toEqual('components/abc.css');
        expect(css.value.indexOf(`.aclass`) >= 0).toEqual(true);
    });
});
