import { TestBed } from '@angular/core/testing';
import { CssAggregatorService } from './css-aggregator.service';

describe('ReactCodeGenService', () => {
    let service: CssAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CssAggregatorService]
        });

        service = TestBed.get(CssAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic react component', () => {
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
                        name: 'aclass',
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
            generateClassName: true,
            componentDir: 'folder'
        });

        expect(aggregated.length).toEqual(1);

        const [component] = aggregated;
        expect(component.kind).toEqual('css');
        expect(component.language).toEqual('css');
        expect(component.value.indexOf('.aclass') >= 0).toBeTruthy();
        expect(component.uri).toEqual('folder/abc.css');
    });
});
