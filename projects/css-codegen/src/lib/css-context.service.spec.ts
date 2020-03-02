import { TestBed } from '@angular/core/testing';
import { CssContextService } from './css-context.service';

describe('CssContextService', () => {
    let service: CssContextService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CssContextService]
        });

        service = TestBed.inject(CssContextService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should idenitfy a variaty of classes', () => {
        [
            'rect',
            'page',
            'rectangle',
            'group',
            'oval',
            'slice',
            'MSImmutableHotspotLayer',
            'text',
            'triangle',
            'shapePath',
            'shapeGroup'
        ].forEach(item => {
            const data = {
                _class: item
            } as any;
            expect(service.identify(data)).toBeTruthy();
        });
    });


    it('should provide css classes', () => {
        const data = {
            _class: 'name',
            css: {
                attr: 'random'
            }
        } as any;
        expect(service.of(data)).toEqual({ attr: 'random' });
    });

    it('should add css classes', () => {
        const data = {
            _class: 'name',
            css: {
                attr: 'random'
            }
        } as any;
        service.put(data, { className: 'extra', rules: { width: '1' } });

        expect(service.of(data)).toEqual({
            attr: 'random', 'className': 'extra',
            'rules': {
                'width': '1',
            },
        });
    });
    it('should clear css classes', () => {
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
