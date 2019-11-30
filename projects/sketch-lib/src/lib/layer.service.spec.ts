import { TestBed } from '@angular/core/testing';
import { LayerService } from './layer.service';

describe('LayerService', () => {
    let service: LayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LayerService]
        });

        service = TestBed.get(LayerService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should identify sketch layers', () => {
        const data = {
            'layers': []
        } as any;
        const actual = service.identify(data);
        expect(actual).toBeTruthy();
    });

    it('should return the current layer', () => {
        const data = {
            'layers': [{
                name: 'random first layer'
            }]
        } as any;
        const actual = service.lookup(data);
        expect(actual).toEqual([{ name: 'random first layer' }]);
    });
});
