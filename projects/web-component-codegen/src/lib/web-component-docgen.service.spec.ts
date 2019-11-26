import { TestBed } from '@angular/core/testing';
import { WebComponentDocGenService } from './web-component-docgen.service';

describe('WebComponentDocGenService', () => {
    let service: WebComponentDocGenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebComponentDocGenService]
        });

        service = TestBed.get(WebComponentDocGenService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should have all the correct propertys', () => {
        const data = {
            meta: { app: 'THE_APP' }
        } as any;
        const actual = service.aggregate(data);

        expect(actual[0].kind).toEqual('text');
        expect(actual[0].language).toEqual('markdown');
        expect(actual[0].uri).toEqual('README.md');
        // WE GET THE FIRST LINE OF THE README
        expect(actual[0].value.split('\n')[0]).toEqual('## How to use the THE_APP Web Components');
    });
});
