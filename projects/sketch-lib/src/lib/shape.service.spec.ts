import { TestBed } from '@angular/core/testing';
import { ShapeService } from './shape.service';

describe('ShapeService', () => {
    let service: ShapeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShapeService]
        });

        service = TestBed.get(ShapeService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should handle points to x y numbers', () => {
        const data = {
            frame: {
                width: '0',
                height: '0'
            }
        } as any;

        const actual = service.parsePoint('0.0043562068495639136, 0.52083333333333326', 1, data);
        expect(actual).toEqual({ 'x': 1, 'y': 1 });
    });
});
