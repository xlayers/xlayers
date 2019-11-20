import { TestBed } from '@angular/core/testing';
import { LitElementCodeGenService } from './lit-element-codegen.service';

describe('LitElementCodeGenService', () => {
    let service: LitElementCodeGenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LitElementCodeGenService]
        });

        service = TestBed.get(LitElementCodeGenService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should identify a valid class', () => {
        const data = {
            '_class': 'bitmap'
        } as any;
        const actual = service.identify(data);
        expect(actual).toBe(true);
    });

    it('should not identify a invalid class', () => {
        const data = {
            '_class': 'random'
        } as any;
        const actual = service.identify(data);
        expect(actual).toBe(false);
    });

    it('should provide a context', () => {
        const data = {
            'web': 'a_context',
            '_class': 'random'
        } as any;
        const actual = service.context(data);
        expect(actual).toBe('a_context');
    });

    xit('should provide a visti', () => {
        const data = {
            'web': 'a_context',
            '_class': 'random'
        } as any;
        const actual = service.compute(data, data);
        expect(actual).toBe('a_context');
    });

});
