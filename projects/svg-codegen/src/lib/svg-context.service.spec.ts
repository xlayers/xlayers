import { TestBed } from '@angular/core/testing';
import { SvgContextService } from './svg-context.service';
import { SvgCodeGenService } from '@xlayers/svg-codegen/public_api';

describe('SvgContextService', () => {
    let service: SvgContextService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SvgContextService]
        });

        service = TestBed.get(SvgContextService);
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
            svg: {
                attr: 'random'
            }
        } as any;
        expect(service.of(data)).toEqual({ attr: 'random' });
    });

    it('should add add new options', () => {
        const data = {
            _class: 'name',
            svg: {
                attr: 'random'
            }
        } as any;
        service.put(data, { attributes: [] });

        expect(service.of(data)).toEqual({
            'attr': 'random',
            'attributes': [],
        });
    });
    it('should clear the svg attributes', () => {
        const data = {
            _class: 'name',
            svg: {
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
