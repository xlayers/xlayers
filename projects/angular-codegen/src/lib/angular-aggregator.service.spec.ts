import { TestBed } from '@angular/core/testing';
import { AngularAggregatorService } from './angular-aggregator.service';

describe('AngularAggregatorService', () => {
    let service: AngularAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AngularAggregatorService]
        });

        service = TestBed.get(AngularAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic angular component', () => {
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

        expect(aggregated.length).toEqual(4);

        const [html, css, component, test] = aggregated;
        expect(html.kind).toEqual('angular');
        expect(html.language).toEqual('html');
        expect(html.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
        expect(html.uri).toEqual('components/abc.component.html');
        expect(html.value.indexOf('span >attr</span>') >= 0).toEqual(true);
        expect(css.kind).toEqual('angular');
        expect(css.uri).toEqual('components/abc.component.css');
        expect(css.language).toEqual('css');
        expect(component.kind).toEqual('angular');
        expect(component.language).toEqual('typescript');
        expect(component.uri).toEqual('components/abc.component.ts');
        expect(component.value.indexOf(`selector: 'xly-abc',`) >= 0).toEqual(true);
        expect(test.kind).toEqual('angular');
        expect(test.language).toEqual('typescript');
        expect(test.uri).toEqual('components/abc.spec.ts');
        expect(test.value.indexOf(`it('should create',`) >= 0).toEqual(true);
    });
});
