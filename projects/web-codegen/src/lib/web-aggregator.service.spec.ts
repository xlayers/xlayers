import { TestBed } from '@angular/core/testing';
import { WebAggregatorService } from './web-aggregator.service';
describe('WebAggregatorService', () => {
    let service: WebAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebAggregatorService]
        });

        service = TestBed.get(WebAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic component', () => {
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

        expect(aggregated.length).toEqual(2);

        const [html, css] = aggregated;
        expect(html.kind).toEqual('web');
        expect(html.language).toEqual('html');
        expect(html.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
        expect(html.uri).toEqual('components/abc.html');
        expect(css.kind).toEqual('web');
        expect(css.uri).toEqual('components/abc.css');
        expect(css.language).toEqual('css');
        expect(css.value.indexOf(`.aclass`) >= 0).toEqual(true);
    });
});
