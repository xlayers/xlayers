import { TestBed } from '@angular/core/testing';
import { LitElementAggregatorService } from './lit-element-aggregator.service';

describe('ReactCodeGenService', () => {
    let service: LitElementAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LitElementAggregatorService]
        });

        service = TestBed.get(LitElementAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have one file for a basic lit element component', () => {
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
        expect(component.kind).toEqual('litElement');
        expect(component.language).toEqual('javascript');
        expect(component.value.indexOf('<span >attr</span>') >= 0).toBeTruthy();
        expect(component.uri).toBe('components/abc.js');
    });
});
