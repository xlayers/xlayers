import { TestBed } from '@angular/core/testing';
import { loadSketch, SKETCH_PATH, VERSION_LIST } from '@xlayers/test-helpers';
import { readdirSync } from 'fs';
import { SvgCodeGenService } from './svg-codegen.service';

describe('SvgCodeGenService', () => {
  let service: SvgCodeGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgCodeGenService],
    });

    service = TestBed.inject(SvgCodeGenService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify a valid class', () => {
    const data = {
      _class: 'triangle',
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
      svg: 'a_context',
      _class: 'random',
    } as any;
    const actual = service.context(data);
    expect(actual).toBe('a_context');
  });

  VERSION_LIST.forEach((version) => {
    const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

    fileNames.forEach((fileName) => {
      it(`should match ${fileName} snapshot for ${version} on svg`, (done) => {
        loadSketch(version, fileName)
          .then((data) => {
            data.pages.forEach((page) => {
              service.compute(page, data, {
                xmlNamespace: true,
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
