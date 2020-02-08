import { TestBed } from '@angular/core/testing';
import { WebContextService } from './web-context.service';

describe('WebContextService', () => {
    let service: WebContextService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebContextService]
        });

        service = TestBed.inject(WebContextService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should idenitfy a variaty of classes', () => {
        [
            'triangle',
            'shapePath',
        ].forEach(item => {
            const data = {
                _class: item
            } as any;

            const identify = service.identify(data);
            expect(identify).toBeTruthy();
        });
    });


    it('should provide context', () => {
        const data = {
            _class: 'name',
            web: {
                attr: 'random'
            }
        } as any;
        expect(service.of(data)).toEqual({ attr: 'random' });
    });

    it('should add add new options', () => {
        const data = {
            _class: 'name',
            web: {
                attr: 'random'
            }
        } as any;
        service.put(data, { attributes: [] });

        expect(service.of(data)).toEqual({
            'attr': 'random',
            'attributes': [],
        });
    });
    it('should clear the web attributes', () => {
        const data = {
            _class: 'name',
            web: {
                attr: 'random'
            }
        } as any;
        const expected_data = {
            _class: 'name',
        } as any;

        service.clear(data);

        expect(expected_data).toEqual(data);
    });
});
