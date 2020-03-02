import { TestBed } from '@angular/core/testing';
import { VERSION_LIST, SKETCH_PATH, loadSketch } from '../../../../tests/test-utils';
import { readdirSync } from 'fs';
import { StencilCodeGenService } from './stencil-codegen.service';

describe('StencilCodeGenService', () => {
    let service: StencilCodeGenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StencilCodeGenService]
        });

        service = TestBed.inject(StencilCodeGenService);
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

    VERSION_LIST.forEach(version => {
        const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

        fileNames.forEach(fileName => {
            it(`should match ${fileName} snapshot for ${version} on stencil`, done => {
                loadSketch(version, fileName)
                    .then(data => {
                        data.pages.forEach(page => {
                            service.compute(page, data, {
                                generateClassName: false
                            });
                        });

                        return data;
                    })
                    .then(sketch => {
                        expect(sketch).toMatchSnapshot();
                        done();
                    })
                    .catch(done);
            });
        });
    });
});
