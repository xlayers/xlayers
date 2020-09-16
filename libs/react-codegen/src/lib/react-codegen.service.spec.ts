import { TestBed } from '@angular/core/testing';
import { ReactCodeGenService } from './react-codegen.service';
import { loadSketch, SKETCH_PATH, VERSION_LIST } from '@xlayers/test-helpers';
import { readdirSync } from 'fs';

describe('ReactCodeGenService', () => {
  let service: ReactCodeGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactCodeGenService],
    });

    service = TestBed.inject(ReactCodeGenService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify a valid class', () => {
    const data = {
      _class: 'bitmap',
    } as any;
    const actual = service.identify(data);
    expect(actual).toBe(true);
  });

  it('should not identify a invalid class', () => {
    const data = {
      _class: 'random',
    } as any;
    const actual = service.identify(data);
    expect(actual).toBe(false);
  });

  it('should provide a context', () => {
    const data = {
      web: 'a_context',
      _class: 'random',
    } as any;
    const actual = service.context(data);
    expect(actual).toBe('a_context');
  });

  VERSION_LIST.forEach((version) => {
    const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

    fileNames.forEach((fileName) => {
      it(`should match ${fileName} snapshot for ${version} on react`, (done) => {
        loadSketch(version, fileName)
          .then((data) => {
            data.pages.forEach((page) => {
              service.compute(page, data, {
                generateClassName: false,
              });
            });

            return data;
          })
          .then((sketch) => {
            expect(sketch).toMatchSnapshot();
            done();
          })
          .catch(done);
      });
    });
  });
});
