import { TestBed } from '@angular/core/testing';
import { WebComponentAggregatorService } from './web-component-aggregator.service';

describe('WebComponentAggregatorService', () => {
    let service: WebComponentAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebComponentAggregatorService]
        });

        service = TestBed.get(WebComponentAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic web components component', () => {
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
        const aggregated = service.aggregate(data, {
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
        expect(component.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
        expect(component.uri).toEqual('components/abc.js');
    });
});
