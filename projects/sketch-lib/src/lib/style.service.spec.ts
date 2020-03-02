import { TestBed } from '@angular/core/testing';
import { StyleService } from './style.service';
describe('StyleService', () => {
    let service: StyleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StyleService]
        });

        service = TestBed.inject(StyleService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should return parse colors', () => {
        const color = { alpha: 1, red: 1, green: 2, blue: 3 } as SketchMSColor;
        const actual = service.parseColor(color);
        expect(actual).toEqual({ 'alpha': 1, 'blue': 765, 'green': 510, 'red': 255 });
    });

    it('should parse color as rgb', () => {
        const color = { alpha: 0, red: 0, green: 0, blue: 0} as SketchMSColor;
        const actual = service.parseColorAsRgba(color);
        expect(actual).toEqual('rgba(0,0,0,0.00)');
    });

    it('should parse color as hex', () => {
        const color = { alpha: 0, red: 0, green: 0, blue: 0} as SketchMSColor;
        const actual = service.parseColorAsHex(color);
        expect(actual).toEqual('#00000000');
    });
});
