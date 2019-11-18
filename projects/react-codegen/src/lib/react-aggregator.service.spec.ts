import { TestBed } from '@angular/core/testing';
import { ReactAggregatorService } from './react-aggregator.service';

describe.only('ReactCodeGenService', () => {
    let service: ReactAggregatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReactAggregatorService]
        });

        service = TestBed.get(ReactAggregatorService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have three files for a basic react component', () => {
        const data = {
            '_class': 'rectangle',
            'name': 'abc',
            'web': {

            }
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
        const component = aggregated[0];
        const test = aggregated[1];
        const css = aggregated[2];
        expect(aggregated.length).toEqual(3);
        expect(component.kind).toEqual('react');
        expect(component.language).toEqual('javascript');
        expect(test.kind).toEqual('react');
        expect(test.language).toEqual('javascript');
        expect(css.kind).toEqual('react');
        expect(css.language).toEqual('css');
    });
});
